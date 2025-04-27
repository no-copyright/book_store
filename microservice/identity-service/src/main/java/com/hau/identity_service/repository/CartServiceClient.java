package com.hau.identity_service.repository;

import com.hau.identity_service.config.AuthenticationRequestInterceptor;
import com.hau.identity_service.dto.request.CartCreateRequest;
import com.hau.identity_service.dto.response.CartResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "cart-service", url = "${app.cart-service.url}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface CartServiceClient {
    @PostMapping(value = "/cart/internal/users", produces = MediaType.APPLICATION_JSON_VALUE)
    CartResponse createCart(@RequestBody CartCreateRequest cartCreateRequest);
}
