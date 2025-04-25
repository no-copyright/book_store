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

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductImageRepository productImageRepository;
    private final FileServiceClientRepository fileServiceClientRepository;
    private final ProductImageService productImageService;
    private final FileUploadService fileUploadService;
    private final SlugService slugService;

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
            result = null;
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
        if (thumbnail == null || thumbnail.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Ảnh thumbnail không được để trống", null);
        }

        if (images == null || images.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Danh sách ảnh sản phẩm không được để trống", null);
        }

        Product product = productMapper.toProduct(request);
        product.setActive(true); // Set default active status



        String thumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "thumbnail");
        product.setThumbnail(thumbnailUrl);

        product.setSlug(StringConverter.toSlug(product.getTitle()));

        Product savedProduct = productRepository.save(product);
        Long productId = savedProduct.getId();

        String uniqueSlug = slugService.generateUniqueSlug(savedProduct.getTitle(), productId);
        savedProduct.setSlug(uniqueSlug);

        productImageService.createImageByProduct(savedProduct, images);

        savedProduct.setProductImage(null);
        savedProduct = productRepository.save(savedProduct);

        ProductResponse productResponse = productMapper.toProductWithImageResponse(savedProduct);
        productResponse.setThumbnail(fileServiceUrl + savedProduct.getThumbnail());

        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm sản phẩm thành công")
                .result(productResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }


    // Modified to handle thumbnail and image updates
    @Transactional
    public ApiResponse<ProductResponse> updateProduct(ProductRequest request, Long id, MultipartFile thumbnail, List<MultipartFile> images) {
        Product existProduct = productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));

        Product product = productMapper.updateProductFromRequest(request, existProduct);

        if (request.getActive() != null) {
            existProduct.setActive(request.getActive());
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            fileServiceClientRepository.deleteFile(existProduct.getThumbnail());
            String newThumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "new thumbnail");
            existProduct.setThumbnail(newThumbnailUrl);
        }

        if (!CollectionUtils.isEmpty(images)) {
            productImageService.deleteAllByProductId(id);
            productImageService.createImageByProduct(product, images);
        }

        existProduct.setSlug(slugService.generateUniqueSlug(product.getTitle(), id));

        Product savedProduct = productRepository.save(existProduct);

        ProductResponse response = productMapper.toProductWithImageResponse(savedProduct);
        response.setThumbnail(savedProduct.getThumbnail());


        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật sản phẩm thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }



    public ApiResponse<ProductResponse> deleteProduct(Long id) {
        Product product =  productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));

        productImageService.deleteImage(product.getId());
        fileServiceClientRepository.deleteFile(product.getThumbnail());
        productRepository.deleteById(id);
        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa sản phẩm thành công")
                .timestamp(LocalDateTime.now())
                .build();
    }



    public ApiResponse<ProductResponse> getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));
        ProductResponse response = productMapper.toProductWithImageResponse(product);
        response.setThumbnail(fileServiceUrl + product.getThumbnail());
        List<String> imageUrls = response.getImageUrls();
        for(String item : imageUrls) {
            imageUrls.set(imageUrls.indexOf(item), fileServiceUrl + item);
        }
        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy sản phẩm thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }


}
