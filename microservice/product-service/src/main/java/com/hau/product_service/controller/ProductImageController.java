package com.hau.product_service.controller;

import com.hau.product_service.dto.request.ProductImageRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResponse;
import com.hau.product_service.dto.response.ProductImageResponse;
import com.hau.product_service.dto.response.ProductResponse;
import com.hau.product_service.entity.ProductImage;
import com.hau.product_service.service.ProductImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
public class ProductImageController {
    private final ProductImageService productImageService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping(value = "/productImage/{productId}")
    public ApiResponse<List<ProductImage>> getAllProductImageByProductId(@PathVariable Long productId) {
        return productImageService.getAllProductImageByProductId(productId);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping(value = "/productImage/{productId}")
    public ApiResponse<ProductImage> createProductImage(@PathVariable Long productId,@RequestPart("productImage") MultipartFile productImage) {
        return productImageService.createProductImage(productId, productImage);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @DeleteMapping(value = "/productImage/{id}")
    public ApiResponse<Void> deleteProductImage(@PathVariable Long id) {
        return productImageService.deleteOneImage(id);
    }
}
