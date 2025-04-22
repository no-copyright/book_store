package com.hau.cartservice.mapper;

import com.hau.cartservice.dto.CartCreateRequest;
import com.hau.cartservice.dto.CartResponse;
import com.hau.cartservice.entity.Cart;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {
    Cart toCart(CartCreateRequest cartCreateRequest);

    CartResponse toCartResponse(Cart cart);
}
