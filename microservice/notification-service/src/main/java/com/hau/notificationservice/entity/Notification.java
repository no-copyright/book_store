package com.hau.notificationservice.entity;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "notification")
public class Notification {
    @MongoId
    private String id;

    private Integer userId;
    private Boolean isRead;
    private String title;
    private String body;
    private String topic;
    private Map<String, String> data;

    private LocalDateTime createdAt;
}
