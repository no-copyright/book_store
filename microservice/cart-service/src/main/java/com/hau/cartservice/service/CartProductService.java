package com.hau.cartservice.service;

import com.hau.cartservice.dto.ApiResponse;
import com.hau.cartservice.dto.CartProductRequest;
import com.hau.cartservice.dto.CartProductResponse;
import com.hau.cartservice.entity.CartProduct;
import com.hau.cartservice.mapper.CartProductMapper;
import com.hau.cartservice.repository.CartProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class CartProductService {
    private final CartProductRepository cartProductRepository;
    private final CartProductMapper cartProductMapper;

    public ApiResponse<CartProductResponse> addProductToCart(CartProductRequest cartProductRequest){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        CartProduct cartProduct = cartProductMapper.toCartProduct(cartProductRequest);
        cartProduct.setSelected(false);
        cartProduct.setCartId(Integer.valueOf(authentication.getName()));
        cartProductRepository.save(cartProduct);
        return ApiResponse.<CartProductResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm sản phẩm vào giỏ hàng thành công")
                .result(cartProductMapper.toCartProductResponse(cartProduct))
                .build();
    }
}
