package com.hau.notificationservice.controller;

import com.hau.notificationservice.dto.*;
import com.hau.notificationservice.service.NotificationProcessingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class NotificationProcessingController {
    private final NotificationProcessingService notificationProcessingService;

    @GetMapping("my-notification")
    public ResponseEntity<ApiResponse<PageResponse<NotificationResponseToUser>>> getMyNotifications(
            @RequestParam(required = false, defaultValue = "1") int pageIndex,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        ApiResponse<PageResponse<NotificationResponseToUser>> response = notificationProcessingService.notificationResponseToUser(pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PatchMapping("/my-notification/mark-as-read/{id}")
    public ResponseEntity<ApiResponse<NotificationResponseToUser>> markNotificationAsRead(@PathVariable String id) {
        ApiResponse<NotificationResponseToUser> response = notificationProcessingService.markAsRead(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/my-notification/mark-all-as-read")
    public ResponseEntity<ApiResponse<String>> markAllNotificationsAsRead() {
        ApiResponse<String> response = notificationProcessingService.markAllAsRead();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/my-notification/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable String id) {
        ApiResponse<String> response = notificationProcessingService.deleteNotification(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/my-notification")
    public ResponseEntity<ApiResponse<String>> deleteAllNotifications() {
        ApiResponse<String> response = notificationProcessingService.deleteAllNotification();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}