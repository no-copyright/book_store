package com.hau.product_service.controller;

import com.hau.product_service.dto.request.ProductFilter;
import com.hau.product_service.dto.request.ProductRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResult;
import com.hau.product_service.dto.response.ProductImageResponse;
import com.hau.product_service.dto.response.ProductResponse;
import com.hau.product_service.entity.ProductImage;
import com.hau.product_service.repository.ProductImageRepository;
import com.hau.product_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final ProductImageRepository productImageRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<ProductResponse>>> getAllProduct(@ModelAttribute ProductFilter filter,@PageableDefault(size = 10, page = 0) Pageable pageable) {
        ApiResponse<PageResult<ProductResponse>> response = productService.getAllProduct(filter, pageable);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart("thumbnail") MultipartFile thumbnail,
            @RequestPart(value = "images", required = false) List<MultipartFile> images // Added: accept multiple images, make it optional
    ) {
        ApiResponse<ProductResponse> response = productService.createProduct(request, thumbnail, images);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Modified for image/thumbnail update
    @PutMapping(value = "/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long productId,
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        ApiResponse<ProductResponse> response = productService.updateProduct(request, productId, thumbnail, images);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> deleteProduct(@PathVariable Long productId) {
        ApiResponse<ProductResponse> response = productService.deleteProduct(productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long productId) {
        ApiResponse<ProductResponse> response = productService.getProductById(productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
