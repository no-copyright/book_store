package com.hau.cartservice.mapper;

import com.hau.cartservice.dto.CartCreateRequest;
import com.hau.cartservice.dto.CartResponse;
import com.hau.cartservice.dto.CartUpdateRequest;
import com.hau.cartservice.entity.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CartMapper {
    Cart toCart(CartCreateRequest cartCreateRequest);

    void updateCart(@MappingTarget CartUpdateRequest cartUpdateRequest, Cart cart);

    CartResponse toCartResponse(Cart cart);
}
