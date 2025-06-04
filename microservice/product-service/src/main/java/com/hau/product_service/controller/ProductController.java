package com.hau.product_service.controller;

import com.hau.event.dto.NotificationEvent;
import com.hau.product_service.dto.request.ProductFilter;
import com.hau.product_service.dto.request.ProductRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResponse;
import com.hau.product_service.dto.response.ProductResponse;
import com.hau.product_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>> >getAllProduct(@ModelAttribute ProductFilter filter,
                                                                  @RequestParam(defaultValue = "1", required = false) Integer pageIndex,
                                                                  @RequestParam(defaultValue = "10", required = false) Integer pageSize) {
        ApiResponse<PageResponse<ProductResponse>> response = productService.getAllProduct(filter, pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProductByActive(@ModelAttribute ProductFilter filter,
                                                                                          @RequestParam(defaultValue = "1", required = false) Integer pageIndex,
                                                                                          @RequestParam(defaultValue = "10", required = false) Integer pageSize) {
        ApiResponse<PageResponse<ProductResponse>> response = productService.getAllProductByActive(filter, pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/top-discount")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTopTenBestDiscountProduct() {
        ApiResponse<List<ProductResponse>> response = productService.getTopTenProductByBestDiscountPercent();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/top-rating")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTopTenBestAverageRateProduct() {
        ApiResponse<List<ProductResponse>> response = productService.getTopTenProductByAverageRate();
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

//    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
//    @PostMapping
//    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@RequestBody @Valid ProductRequest request) throws IOException {
//        ApiResponse<ProductResponse> response = productService.createProduct(request);
//        return new ResponseEntity<>(response, HttpStatus.CREATED);
//    }

    // Modified for image/thumbnail update
    @PutMapping(value = "/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long productId,
            @RequestPart("product") @Valid ProductRequest request,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        ApiResponse<ProductResponse> response = productService.updateProduct(request, productId, thumbnail, images);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
//    @PutMapping(value = "/{productId}")
//    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long productId, @RequestBody @Valid ProductRequest request) throws IOException {
//        ApiResponse<ProductResponse> response = productService.updateProduct(productId, request);
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
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

    @KafkaListener(topics = "order-create-notification-topic")
    public void updateProductQuantity(NotificationEvent notificationEvent) {
        productService.updateProductQuantity(notificationEvent);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PutMapping(value = "/active/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductStatus(@PathVariable Long id, @RequestBody Boolean active) {
        ApiResponse<ProductResponse> response = productService.updateProductStatus(id, active);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
