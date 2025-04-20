package com.hau.notificationservice.controller;

import com.hau.event.dto.NotificationEvent;
import com.hau.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Slf4j
@Component
public class NotificationController {

    private final NotificationService notificationService;

    @KafkaListener(topics = "forgot-password-topic")
    public void listenOtpTopic(NotificationEvent notificationEvent) {
        log.info("Message received from topic: {}", notificationEvent);
        try {
            notificationService.handleForgotPasswordNotification(notificationEvent);
        } catch (Exception e) {
            log.error("Error handling notification: {}", e.getMessage());
        }
    }
}