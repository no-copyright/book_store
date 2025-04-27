package com.hau.fileservice.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "file_management")
public class FileManagement {
    @MongoId
    private String id;
    private String ownerId;
    private String contentType;
    private long size;
    private String md5Checksum;
    private String filePath;

    private LocalDateTime createdAt;
}
