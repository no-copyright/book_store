package com.hau.product_service.controller;

import com.hau.product_service.dto.request.ProductFilter;
import com.hau.product_service.dto.request.ProductRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResult;
import com.hau.product_service.dto.response.ProductResponse;
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

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<ProductResponse>>> getAllProduct(@ModelAttribute ProductFilter filter,@PageableDefault(size = 10, page = 0) Pageable pageable) {
        ApiResponse<PageResult<ProductResponse>> response = productService.getAllProduct(filter, pageable);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // Specify consumes
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart("thumbnail") MultipartFile thumbnail,
            @RequestPart(value = "images", required = false) List<MultipartFile> images // Added: accept multiple images, make it optional
    ) {
        ApiResponse<ProductResponse> response = productService.createProduct(request, thumbnail, images);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@RequestBody @Valid ProductRequest request, @PathVariable Long productId) {
        ApiResponse<ProductResponse> response = productService.updateProduct(request, productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> deleteProduct(@PathVariable Long productId) {
        ApiResponse<ProductResponse> response = productService.deleteProduct(productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long productId) {
        ApiResponse<ProductResponse> response = productService.getProductById(productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
