package com.hau.identity_service.mapper;

import com.hau.identity_service.dto.request.CartCreateRequest;
import com.hau.identity_service.dto.request.UserCreateRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {
    CartCreateRequest toCartCreateRequest(UserCreateRequest userCreateRequest);
}
