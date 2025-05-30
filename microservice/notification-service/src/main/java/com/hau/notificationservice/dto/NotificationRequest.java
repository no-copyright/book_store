package com.hau.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class NotificationRequest {
    private String title;
    private String body;
    private String topic;
    // Hỗ trợ cả token đơn lẻ và danh sách token
    private String token;
    private List<String> tokens;
    // Dữ liệu bổ sung
    private Map<String, String> data;
}