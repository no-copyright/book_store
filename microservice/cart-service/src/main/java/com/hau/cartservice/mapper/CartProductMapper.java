package com.hau.cartservice.mapper;

import com.hau.cartservice.dto.CartProductRequest;
import com.hau.cartservice.dto.CartProductResponse;
import com.hau.cartservice.entity.CartProduct;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartProductMapper {
    CartProduct toCartProduct(CartProductRequest cartProductRequest);

    CartProductResponse toCartProductResponse(CartProduct cartProduct);
}
