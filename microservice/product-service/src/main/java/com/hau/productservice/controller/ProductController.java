package com.hau.productservice.controller;

import com.hau.productservice.dto.request.ProductFilter;
import com.hau.productservice.dto.request.ProductRequest;
import com.hau.productservice.dto.response.ApiResponse;
import com.hau.productservice.dto.response.PageResult;
import com.hau.productservice.dto.response.ProductResponse;
import com.hau.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<ProductResponse>>> getAllProduct(@ModelAttribute ProductFilter filter,@PageableDefault(size = 10, page = 0) Pageable pageable) {
        ApiResponse<PageResult<ProductResponse>> response = productService.getAllProduct(filter, pageable);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(@RequestBody @Valid ProductRequest request) {
        ApiResponse<ProductResponse> response = productService.createProduct(request);
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
