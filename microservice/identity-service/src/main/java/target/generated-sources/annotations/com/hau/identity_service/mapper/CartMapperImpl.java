package com.hau.identity_service.mapper;

import com.hau.identity_service.dto.request.CartCreateRequest;
import com.hau.identity_service.dto.request.UserCreateRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-04-22T22:05:43+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class CartMapperImpl implements CartMapper {

    @Override
    public CartCreateRequest toCartCreateRequest(UserCreateRequest userCreateRequest) {
        if ( userCreateRequest == null ) {
            return null;
        }

        CartCreateRequest.CartCreateRequestBuilder cartCreateRequest = CartCreateRequest.builder();

        cartCreateRequest.userId( userCreateRequest.getUserId() );

        return cartCreateRequest.build();
    }
}
