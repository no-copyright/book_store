package com.hau.customerService.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorsResponse {
    private int status;
    private String message;
    private Object error;
    private LocalDateTime timestamp;
}
