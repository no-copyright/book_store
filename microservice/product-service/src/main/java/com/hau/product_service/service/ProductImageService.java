package com.hau.product_service.service;

import com.hau.product_service.entity.Product;
import com.hau.product_service.entity.ProductImage;
import com.hau.product_service.exception.AppException;
import com.hau.product_service.repository.FileServiceClientRepository;
import com.hau.product_service.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageService {
    private final ProductImageRepository productImageRepository;
    private final FileUploadService fileUploadService;
    private final FileServiceClientRepository fileServiceClient;

    @Transactional
    public void deleteAllByProductId(Long productId) {
        deleteImage(productId);
        productImageRepository.deleteByProductId(productId);
    }
    
    @Transactional
    public void createImageByProduct(Product product, List<MultipartFile> images) {
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

}
