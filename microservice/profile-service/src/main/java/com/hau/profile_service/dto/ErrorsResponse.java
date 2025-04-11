package com.hau.profile_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorsResponse {
    int status;
    String message;
    Object error;
    LocalDateTime timestamp;
}
