package com.hau.notificationservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorsResponse {
    private int status;
    private String message;
    private Object error;
    private LocalDateTime timestamp;
}
