package com.hau.cartservice.controller;

import com.hau.cartservice.dto.ApiResponse;
import com.hau.cartservice.dto.CartProductRequest;
import com.hau.cartservice.dto.CartProductResponse;
import com.hau.cartservice.service.CartProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart-products")
@RequiredArgsConstructor
public class CartProductController {
    private final CartProductService cartProductService;

    @PostMapping
    public ResponseEntity<ApiResponse<CartProductResponse>> addProductToCart(@RequestBody CartProductRequest cartProductRequest) {
        ApiResponse<CartProductResponse> apiResponse = cartProductService.addProductToCart(cartProductRequest);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @DeleteMapping("/{cartProductId}")
    public ResponseEntity<ApiResponse<String>> removeProductFromCart(@PathVariable Integer cartProductId) {
        ApiResponse<String> apiResponse = cartProductService.removeProductFromCart(cartProductId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
