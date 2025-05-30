package com.hau.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendEmailRequest {
    private Recipient to;
    private String subject;
    private String htmlContent;
}
