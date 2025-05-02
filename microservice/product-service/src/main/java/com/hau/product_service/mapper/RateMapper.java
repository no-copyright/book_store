package com.hau.product_service.mapper;

import com.hau.product_service.dto.request.RateRequest;
import com.hau.product_service.dto.response.RateResponse;
import com.hau.product_service.entity.Rate;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface RateMapper {

    RateResponse toRateResponse(Rate rate);

    Rate toRate(RateRequest request);

}
