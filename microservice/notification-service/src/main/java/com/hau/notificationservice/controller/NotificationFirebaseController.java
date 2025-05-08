package com.hau.notificationservice.controller;

import com.hau.notificationservice.dto.NotificationRequest;
import com.hau.notificationservice.dto.NotificationResponse;
import com.hau.notificationservice.service.FCMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NotificationFirebaseController {
    private final FCMService fcmService;

    @PostMapping("/firebase")
    public ResponseEntity sendNotification(@RequestBody NotificationRequest request) {
        if (request.getToken() != null && (request.getTokens() == null || request.getTokens().isEmpty())) {
            List<String> tokens = new ArrayList<>();
            tokens.add(request.getToken());
            request.setTokens(tokens);
        }

        fcmService.sendMessageToTokens(request);
        return new ResponseEntity<>(new NotificationResponse(HttpStatus.OK.value(), "Thông báo đã được gửi."), HttpStatus.OK);
    }
}