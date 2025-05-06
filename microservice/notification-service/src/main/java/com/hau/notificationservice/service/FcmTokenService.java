package com.hau.notificationservice.service;

import com.hau.notificationservice.dto.ApiResponse;
import com.hau.notificationservice.dto.FcmTokenCreateRequest;
import com.hau.notificationservice.dto.FcmTokenResponse;
import com.hau.notificationservice.entity.FcmToken;
import com.hau.notificationservice.exception.AppException;
import com.hau.notificationservice.repository.FcmTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FcmTokenService {
    private final FcmTokenRepository fcmTokenRepository;

    public ApiResponse<FcmTokenResponse> fcmTokenResponseApiResponse(FcmTokenCreateRequest fcmTokenCreateRequest) {
        Integer userId = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        FcmToken fcmToken = FcmToken.builder()
                .token(fcmTokenCreateRequest.getToken())
                .userId(userId)
                .build();
        try {
            fcmToken = fcmTokenRepository.save(fcmToken);
            return ApiResponse.<FcmTokenResponse>builder()
                    .status(201)
                    .message("Success")
                    .result(FcmTokenResponse.builder()
                            .id(fcmToken.getId())
                            .token(fcmToken.getToken())
                            .userId(userId)
                            .build())
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Token already exists", null);
        }
    }
}
