package com.hau.notificationservice.entity;

import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "fcm_token")
@CompoundIndex(name = "userId_token_unique_idx", def = "{'userId': 1, 'token': 1}", unique = true)
public class FcmToken {
    @MongoId
    private String id;

    private Integer userId;
    private String token;
}
