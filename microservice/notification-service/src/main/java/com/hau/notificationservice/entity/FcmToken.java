package com.hau.notificationservice.entity;

import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "fcm_token")
public class FcmToken {
    @MongoId
    private String id;

    private Integer userId;
    @Indexed(unique = true)
    private String token;
}
