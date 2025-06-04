package com.hau.orderservice.mapper;

import com.hau.orderservice.dto.OrderProductResponse;
import com.hau.orderservice.entity.OrderProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderProductMapper {
    @Mapping(source = "product.id", target = "productId")
    OrderProductResponse toOrderProductResponse(OrderProduct orderProduct);
}
