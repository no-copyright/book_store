package com.hau.cartservice.controller;

import com.hau.cartservice.dto.ApiResponse;
import com.hau.cartservice.dto.CartResponse;
import com.hau.cartservice.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getMyCart() {
        CartResponse cartResponse = cartService.getMyCart();
        return ApiResponse.<CartResponse>builder()
                .status(200)
                .message("Lấy thông tin giỏ hàng thành công")
                .result(cartResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
