package com.hau.notificationservice.controller;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.hau.event.dto.NotificationEvent;
import com.hau.notificationservice.service.NotificationProcessingService;
import com.hau.notificationservice.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationProcessingService notificationProcessingService;

    @KafkaListener(topics = "forgot-password-topic")
    public void listenOtpTopic(NotificationEvent notificationEvent) {
        notificationService.handleNotification(notificationEvent);
    }

    @KafkaListener(topics = "order-create-notification-topic")
    public void listenOrderCreateTopic(NotificationEvent notificationEvent) {
        notificationService.handleNotification(notificationEvent);
        notificationProcessingService.processOrderCreateNotification(notificationEvent);
    }

    @KafkaListener(topics = "order-updated-status-topic")
    public void listenOrderUpdatedStatusTopic(NotificationEvent notificationEvent) {
        notificationProcessingService.processOrderUpdatedStatusNotification(notificationEvent);
    }
}
