package com.hau.customerService.mapper;

import com.hau.customerService.dto.request.CustomerCareRequest;
import com.hau.customerService.dto.response.CustomerCareResponse;
import com.hau.customerService.entity.CustomerCare;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerCareMapper {
    CustomerCareResponse toCustomerCareResponse(CustomerCare customerCare);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    CustomerCare toCustomerCare(CustomerCareRequest request);
}
