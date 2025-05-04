package com.hau.product_service.mapper;

import com.hau.product_service.dto.request.RateRequest;
import com.hau.product_service.dto.response.RateResponse;
import com.hau.product_service.entity.Rate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface RateMapper {

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "userId", source = "user.id")
    RateResponse toRateResponse(Rate rate);

    @Mapping(target = "product", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    Rate toRate(RateRequest request);

}
