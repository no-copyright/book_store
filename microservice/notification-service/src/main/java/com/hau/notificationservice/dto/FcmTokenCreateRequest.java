package com.hau.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class FcmTokenCreateRequest {
    @NotBlank(message = "Token cannot be blank")
    private String token;
}
