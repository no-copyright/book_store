package com.hau.notificationservice.controller;

import com.hau.notificationservice.dto.ApiResponse;
import com.hau.notificationservice.dto.FcmTokenCreateRequest;
import com.hau.notificationservice.dto.FcmTokenResponse;
import com.hau.notificationservice.service.FcmTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/fcm-token")
public class FcmTokenController {
    private final FcmTokenService fcmTokenService;

    @PostMapping
    public ResponseEntity<ApiResponse<FcmTokenResponse>> fcmTokenResponse(@RequestBody FcmTokenCreateRequest fcmTokenCreateRequest) {
        ApiResponse<FcmTokenResponse> fcmTokenResponse = fcmTokenService.fcmTokenResponseApiResponse(fcmTokenCreateRequest);
        return new ResponseEntity<>(fcmTokenResponse, HttpStatus.CREATED);
    }
}
