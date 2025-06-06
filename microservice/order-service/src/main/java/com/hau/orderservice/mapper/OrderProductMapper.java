package com.hau.orderservice.mapper;

import com.hau.orderservice.dto.OrderProductResponse;
import com.hau.orderservice.entity.OrderProduct;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderProductMapper {
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "thumbnail", expression = "java(orderProduct.getProduct() != null && orderProduct.getProduct().getThumbnail() != null" +
            " ? \"http://172.20.64.1:8888/api/v1/file/media/download/\" + orderProduct.getProduct().getThumbnail()" +
            " : \"http://172.20.64.1:8888/api/v1/file/media/download/default.img\")")
    OrderProductResponse toOrderProductResponse(OrderProduct orderProduct);
}
