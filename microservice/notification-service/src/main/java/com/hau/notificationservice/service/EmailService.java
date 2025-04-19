package com.hau.notificationservice.service;

import com.hau.notificationservice.dto.EmailRequest;
import com.hau.notificationservice.dto.EmailResponse;
import com.hau.notificationservice.dto.SendEmailRequest;
import com.hau.notificationservice.dto.Sender;
import com.hau.notificationservice.exception.AppException;
import com.hau.notificationservice.repository.EmailClient;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final EmailClient emailClient;

    @Value("${app.email-service.api-key}")
    private String apiKey;

    public EmailResponse sendEmail(SendEmailRequest sendEmailRequest) {
        EmailRequest emailRequest = EmailRequest.builder()
                .sender(Sender.builder()
                        .name("Duy Dat")
                        .email("datdnk3@gmail.com")
                        .build())
                .to(List.of(sendEmailRequest.getTo()))
                .subject(sendEmailRequest.getSubject())
                .htmlContent(sendEmailRequest.getHtmlContent())
                .build();
        try {
            return emailClient.sendEmail(apiKey, emailRequest);
        } catch (FeignException e) {
            throw new AppException(HttpStatus.BAD_REQUEST,
                    "Gửi email thất bại",
                    e.getMessage());
        }
    }
}
