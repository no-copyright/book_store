package com.hau.productservice.controller;

import com.hau.productservice.dto.request.ProductRequest;
import com.hau.productservice.dto.response.ApiResponse;
import com.hau.productservice.dto.response.ProductResponse;
import com.hau.productservice.entity.Product;
import com.hau.productservice.service.ProductService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProduct(@RequestParam(required = false) Integer pageIndex, @RequestParam(required = false) Integer pageSize) {
        ApiResponse<List<ProductResponse>> response = productService.getAllProduct(pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> addProduct(@RequestBody @Valid ProductRequest request) {
        ApiResponse<ProductResponse> response = productService.createProduct(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


}
