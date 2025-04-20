package com.hau.cartservice.controller;

import com.hau.cartservice.dto.ApiResponse;
import com.hau.cartservice.dto.CartCreateRequest;
import com.hau.cartservice.dto.CartResponse;
import com.hau.cartservice.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class InternalCartController {
    private final CartService cartService;

    @PostMapping("/internal/users")
    public ResponseEntity<ApiResponse<CartResponse>> createCart(@RequestBody @Valid CartCreateRequest createCartRequest) {
        ApiResponse<CartResponse> apiResponse = cartService.createCart(createCartRequest);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
