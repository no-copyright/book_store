package com.hau.notificationservice.service;

import com.hau.notificationservice.dto.ApiResponse;
import com.hau.notificationservice.dto.FcmTokenCreateRequest;
import com.hau.notificationservice.dto.FcmTokenResponse;
import com.hau.notificationservice.entity.FcmToken;
import com.hau.notificationservice.exception.AppException;
import com.hau.notificationservice.repository.FcmTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FcmTokenService {
    private final FcmTokenRepository fcmTokenRepository;

    public ApiResponse<FcmTokenResponse> fcmTokenResponseApiResponse(FcmTokenCreateRequest fcmTokenCreateRequest) {
        Integer userId = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        String token = fcmTokenCreateRequest.getToken(); // Lấy token từ request

        Optional<FcmToken> existingToken = fcmTokenRepository.findByUserIdAndToken(userId, token);

        if (existingToken.isEmpty()) {
            FcmToken newFcmToken = FcmToken.builder()
                    .token(token)
                    .userId(userId)
                    .build();

            newFcmToken = fcmTokenRepository.save(newFcmToken);

            return ApiResponse.<FcmTokenResponse>builder()
                    .status(201) // Created - Tài nguyên mới đã được tạo thành công
                    .message("FCM Token đã được thêm mới.")
                    .result(FcmTokenResponse.builder()
                            .id(newFcmToken.getId())
                            .token(newFcmToken.getToken())
                            .userId(newFcmToken.getUserId())
                            .build())
                    .timestamp(LocalDateTime.now())
                    .build();
        } else {
            throw new AppException(HttpStatus.BAD_REQUEST, "FCM Token đã tồn tại cho người dùng này.", null);
        }
    }
}
