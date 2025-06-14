package com.hau.notificationservice.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hau.notificationservice.dto.ApiResponse;
import com.hau.notificationservice.dto.EmailResponse;
import com.hau.notificationservice.dto.SendEmailRequest;
import com.hau.notificationservice.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/email")
    ApiResponse<EmailResponse> sendEmail(@RequestBody SendEmailRequest sendEmailRequest) {
        return ApiResponse.<EmailResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Gửi email thành công")
                .result(emailService.sendEmail(sendEmailRequest))
                .timestamp(LocalDateTime.now())
                .build();
    }
}
