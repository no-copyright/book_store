package com.hau.product_service.service;

import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResponse;
import com.hau.product_service.dto.response.ProductImageResponse;
import com.hau.product_service.entity.Product;
import com.hau.product_service.entity.ProductImage;
import com.hau.product_service.exception.AppException;
import com.hau.product_service.repository.FileServiceClientRepository;
import com.hau.product_service.repository.ProductImageRepository;
import com.hau.product_service.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final FileUploadService fileUploadService;
    private final FileServiceClientRepository fileServiceClient;
    private final ProductRepository productRepository;

    @Value("${app.file.download-prefix}")
    private String fileServiceUrl;

    @Transactional
    public void deleteAllByProductId(Long productId) {
        deleteImage(productId);
        productImageRepository.deleteByProductId(productId);
    }

    @Transactional
    public void createImageByProduct(Product product, List<MultipartFile> images) {
            if(images != null && !images.isEmpty()) {
                for (MultipartFile imageFile : images) {
                    if (imageFile != null && !imageFile.isEmpty()) {
                        try {
                            String imageUrl = fileUploadService.uploadFileAndGetUrl(imageFile, "product image");

                            ProductImage productImage = new ProductImage();
                            productImage.setProduct(product);
                            productImage.setUrl(imageUrl);

                            productImageRepository.save(productImage);
                        } catch (Exception e) {
                            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tải lên hình ảnh sản phẩm: " + imageFile.getOriginalFilename(), e);
                        }
                    }
                }
            }
    }

    @Transactional
    public void deleteImage(Long productId) {
        List<ProductImage> productImage = productImageRepository.findByProductId(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh sản phẩm", null));

        try {
            for (ProductImage item : productImage) {
                fileServiceClient.deleteFile(item.getUrl());
            };
        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi xóa ảnh sản phẩm", e);
        }
    }

    @Transactional
    public ApiResponse<Void> deleteOneImage(Long id) {
        ProductImage productImage = productImageRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh sản phẩm", null));

        try {
            fileServiceClient.deleteFile(productImage.getUrl());
            productImageRepository.delete(productImage);
        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi xóa ảnh sản phẩm", e);
        }
        return ApiResponse.<Void>builder()
                .message("Xoá ảnh sản phẩm thành công")
                .status(HttpStatus.OK.value())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    public ApiResponse<ProductImage> createProductImage(Long productId, MultipartFile productImage) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm", null));

        if(productImage == null || productImage.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Ảnh sản phẩm không được để trống", null);
        }

        try {
            String imageUrl = fileUploadService.uploadFileAndGetUrl(productImage, "product image");

            ProductImage newProductImage = new ProductImage();
            newProductImage.setProduct(product);
            newProductImage.setUrl(imageUrl);

            productImageRepository.save(newProductImage);

            return ApiResponse.<ProductImage>builder()
                    .message("Tạo ảnh sản phẩm thành công")
                    .status(HttpStatus.CREATED.value())
                    .result(newProductImage)
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tải lên hình ảnh sản phẩm: " + productImage.getOriginalFilename(), e);
        }
    }

    public ApiResponse<List<ProductImage>> getAllProductImageByProductId(Long productId) {
        List<ProductImage> productImages = productImageRepository.findByProductId(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy ảnh sản phẩm", null));
        productImages.forEach(image -> {
            image.setUrl(fileServiceUrl + image.getUrl());
        });
        return ApiResponse.<List<ProductImage>>builder()
                .message("Lấy danh sách ảnh sản phẩm thành công")
                .status(HttpStatus.OK.value())
                .result(productImages)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
