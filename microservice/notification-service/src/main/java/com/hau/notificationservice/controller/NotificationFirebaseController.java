package com.hau.notificationservice.controller;

import com.hau.notificationservice.dto.*;
import com.hau.notificationservice.service.FCMService;
import com.hau.notificationservice.service.NotificationProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NotificationFirebaseController {
    private final FCMService fcmService;
    private final NotificationProcessingService notificationProcessingService;

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

    @GetMapping("my-notification")
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponseToUser>>> getMyNotifications(
            @RequestParam(required = false, defaultValue = "1") int pageIndex,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        ApiResponse<PageResponse<NotificationResponseToUser>> response = notificationProcessingService.notificationResponseToUser(pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
}