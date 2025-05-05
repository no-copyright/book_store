package com.hau.notificationservice.service;

import com.google.firebase.messaging.*;
import com.hau.notificationservice.dto.NotificationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
public class FCMService {
    public void sendMessageToTokens(NotificationRequest request) {
        if (request.getTokens() == null || request.getTokens().isEmpty()) {
            log.error("No tokens provided for sending notifications");
            return;
        }

        List<String> successfulTokens = new ArrayList<>();
        List<String> failedTokens = new ArrayList<>();

        for (String token : request.getTokens()) {
            try {
                Message message = getPreconfiguredMessageToToken(request, token);
                String response = sendAndGetResponse(message);
                successfulTokens.add(token);
                log.info("Sent message to token: {}, response: {}", token, response);
            } catch (Exception e) {
                failedTokens.add(token);
                log.error("Failed to send message to token: {}, error: {}", token, e.getMessage());
            }
        }

        log.info("Notification sending summary: Success: {}, Failed: {}",
                successfulTokens.size(), failedTokens.size());

        if (!failedTokens.isEmpty()) {
            log.error("Failed tokens: {}", failedTokens);
        }
    }

    private String sendAndGetResponse(Message message) throws InterruptedException, ExecutionException {
        return FirebaseMessaging.getInstance().sendAsync(message).get();
    }

    private AndroidConfig getAndroidConfig(String topic) {
        return AndroidConfig.builder()
                .setTtl(Duration.ofMinutes(2).toMillis()).setCollapseKey(topic)
                .setPriority(AndroidConfig.Priority.HIGH)
                .setNotification(AndroidNotification.builder()
                        .setTag(topic).build()).build();
    }

    private ApnsConfig getApnsConfig(String topic) {
        return ApnsConfig.builder()
                .setAps(Aps.builder().setCategory(topic).setThreadId(topic).build()).build();
    }

    private Message getPreconfiguredMessageToToken(NotificationRequest request, String token) {
        return getPreconfiguredMessageBuilder(request)
                .setToken(token)
                .build();
    }

    private Message.Builder getPreconfiguredMessageBuilder(NotificationRequest request) {
        AndroidConfig androidConfig = getAndroidConfig(request.getTopic());
        ApnsConfig apnsConfig = getApnsConfig(request.getTopic());
        Notification notification = Notification.builder()
                .setTitle(request.getTitle())
                .setBody(request.getBody())
                .build();

        Message.Builder builder = Message.builder()
                .setApnsConfig(apnsConfig)
                .setAndroidConfig(androidConfig)
                .setNotification(notification);

        if (request.getData() != null && !request.getData().isEmpty()) {
            builder.putAllData(request.getData());
        }

        return builder;
    }
}