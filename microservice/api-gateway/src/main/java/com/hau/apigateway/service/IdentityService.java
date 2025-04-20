package com.hau.apigateway.service;

import com.hau.apigateway.dto.ApiResponse;
import com.hau.apigateway.dto.IntrospectRequest;
import com.hau.apigateway.dto.IntrospectResponse;
import com.hau.apigateway.repository.IdentityClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class IdentityService {

    private final IdentityClient identityClient;

    public Mono<ApiResponse<IntrospectResponse>> introspect(String token){
        return identityClient.introspect(IntrospectRequest.builder()
                .token(token)
                .build());
    }
}