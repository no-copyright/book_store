package com.hau.cartservice.service;

import com.hau.cartservice.dto.ApiResponse;
import com.hau.cartservice.dto.CartCreateRequest;
import com.hau.cartservice.dto.CartResponse;
import com.hau.cartservice.entity.Cart;
import com.hau.cartservice.exception.AppException;
import com.hau.cartservice.mapper.CartMapper;
import com.hau.cartservice.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;

    public ApiResponse<CartResponse> createCart(CartCreateRequest cartCreateRequest) {
        Cart cart = cartMapper.toCart(cartCreateRequest);
        cartRepository.save(cart);
        return ApiResponse.<CartResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm giỏ hàng thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public CartResponse getMyCart() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Giỏ hàng không tồn tại", null));
        return cartMapper.toCartResponse(cart);
    }
}
