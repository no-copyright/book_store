package com.hau.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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