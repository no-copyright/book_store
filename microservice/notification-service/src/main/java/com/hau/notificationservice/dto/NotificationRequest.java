package com.hau.notificationservice.dto;

import java.time.LocalDateTime;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NotificationRequest {
    private Integer userId;
    private Boolean isRead;
    private String title;
    private String body;
    private String topic;
    private Map<String, String> data;
    private LocalDateTime createdAt;
}
