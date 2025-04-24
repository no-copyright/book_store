package com.hau.product_service.service;

import com.hau.product_service.entity.ProductImage;
import com.hau.product_service.repository.FileServiceClientRepository;
import com.hau.product_service.converter.StringConverter;
import com.hau.product_service.dto.request.ProductFilter;
import com.hau.product_service.dto.request.ProductRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResult;
import com.hau.product_service.dto.response.ProductResponse;
import com.hau.product_service.entity.Product;
import com.hau.product_service.exception.AppException;
import com.hau.product_service.mapper.ProductMapper;
import com.hau.product_service.repository.ProductImageRepository;
import com.hau.product_service.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductImageRepository productImageRepository;
    private final FileServiceClientRepository fileServiceClientRepository;

    @Value("${app.file.download-prefix}")
    private String fileServiceUrl;

    public ApiResponse<PageResult<ProductResponse>> getAllProduct(ProductFilter filter, Pageable pageable) {
        PageResult<ProductResponse> result;
        if (filter.isEmpty()) {
            Page<Product> productPage = productRepository.findAll(pageable);
            result = new PageResult<>(
                    productPage.getContent().stream().map(productMapper::toProductResponse).toList(),
                    productPage.getNumber() + 1, // Vì Spring bắt đầu từ 0
                    productPage.getSize(),
                    productPage.getTotalPages(),
                    productPage.getTotalElements(),
                    productPage.hasNext(),
                    productPage.hasPrevious()
            );
        } else {
            result = null; // ⚠️ Bỏ trống không xử lý gì nếu filter khác null
        }

        return ApiResponse.<PageResult<ProductResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách sản phẩm thành công")
                .result(result)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional // Ensure atomicity
    public ApiResponse<ProductResponse> createProduct(ProductRequest request, MultipartFile thumbnail, List<MultipartFile> images) {
        Product product = productMapper.toProduct(request);
        product.setActive(true); // Set default active status

        String thumbnailUrl = uploadFileAndGetUrl(thumbnail, "thumbnail");
        product.setThumbnail(thumbnailUrl);

        product.setSlug(StringConverter.toSlug(product.getTitle()));

        Product savedProduct = productRepository.save(product);
        Long productId = savedProduct.getId();

        String uniqueSlug = generateUniqueSlug(savedProduct.getTitle(), productId);
        savedProduct.setSlug(uniqueSlug);

        List<ProductImage> productImages = new ArrayList<>();
        if (!CollectionUtils.isEmpty(images)) {
            for (MultipartFile imageFile : images) {
                if (imageFile != null && !imageFile.isEmpty()) {
                    try {
                        String imageUrl = uploadFileAndGetUrl(imageFile, "product image");

                        ProductImage productImage = new ProductImage();
                        productImage.setProduct(savedProduct); // Associate with the saved product
                        productImage.setUrl(imageUrl);

                        // Save the ProductImage entity
                        productImages.add(productImageRepository.save(productImage));

                    } catch (Exception e) {
                        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tải lên hình ảnh sản phẩm: " + imageFile.getOriginalFilename(), e);
                    }
                }
            }
        }
        savedProduct.setProductImage(null);
        savedProduct = productRepository.save(savedProduct);

        ProductResponse productResponse = productMapper.toProductResponse(savedProduct);
        productResponse.setThumbnail(fileServiceUrl + savedProduct.getThumbnail());

        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm sản phẩm thành công")
                .result(productResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }

    private String uploadFileAndGetUrl(MultipartFile file, String fileTypeDescription) {
        if (file == null || file.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "File " + fileTypeDescription + " không được để trống", null);
        }
        try {
            var fileResponse = fileServiceClientRepository.uploadFile(file);
            if (fileResponse != null && fileResponse.getResult() != null && fileResponse.getResult().getUrl() != null) {
                return fileResponse.getResult().getUrl(); // Return only the relative URL path
            } else {
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không nhận được thông tin hợp lệ từ file-service cho " + fileTypeDescription, null);
            }
        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tải lên file " + fileTypeDescription, e);
        }
    }


    @Transactional
    public ApiResponse<ProductResponse> updateProduct(ProductRequest request, Long id) {
        Product existProduct = productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));

        Product product = productMapper.updateProductFromRequest(request, existProduct);
        product.setActive(true);
        product.setId(id);
        product.setSlug(StringConverter.toSlug(product.getTitle()));

        Product savedProduct = productRepository.save(product);

        savedProduct.setSlug(generateUniqueSlug(product.getTitle(), savedProduct.getId()));

        savedProduct = productRepository.save(savedProduct);

        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật sản phẩm thành công")
                .result(productMapper.toProductResponse(savedProduct))
                .timestamp(LocalDateTime.now())
                .build();
    }


    public ApiResponse<ProductResponse> deleteProduct(Long id) {
        productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));

        productRepository.deleteById(id);
        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa sản phẩm thành công")
                .timestamp(LocalDateTime.now())
                .build();
    }


    private String generateUniqueSlug(String title, Long productId) {
        String baseSlug = StringConverter.toSlug(title);
        return baseSlug + "-" + productId;
    }

    public ApiResponse<ProductResponse> getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));
        ProductResponse productResponse = productMapper.toProductResponse(product);
        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy sản phẩm thành công")
                .result(productResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
