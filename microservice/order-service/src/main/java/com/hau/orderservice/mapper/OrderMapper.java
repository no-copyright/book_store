package com.hau.orderservice.mapper;

import com.hau.orderservice.dto.OrderCreateRequest;
import com.hau.orderservice.dto.OrderResponse;
import com.hau.orderservice.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "orderProducts", ignore = true)
    Order toOrder(OrderCreateRequest orderCreateRequest);

    OrderResponse toOrderResponse(Order order);
}
