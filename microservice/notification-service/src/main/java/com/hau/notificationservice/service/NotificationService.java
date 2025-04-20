package com.hau.notificationservice.service;

import com.hau.event.dto.NotificationEvent;
import com.hau.notificationservice.dto.Recipient;
import com.hau.notificationservice.dto.SendEmailRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final EmailService emailService;
    private final SpringTemplateEngine templateEngine;

    public void handleForgotPasswordNotification(NotificationEvent notificationEvent) {
        String subject = "Mã OTP Xác Thực - Đặt Lại Mật Khẩu";
        String htmlContent = processTemplate(notificationEvent);

        emailService.sendEmail(SendEmailRequest.builder()
                .to(Recipient.builder()
                        .email(notificationEvent.getRecipient())
                        .build())
                .subject(subject)
                .htmlContent(htmlContent)
                .build());
    }

    private String processTemplate(NotificationEvent notificationEvent) {
        Context context = new Context();
        Map<String, Object> params = notificationEvent.getParams();
        context.setVariable("username", params.get("username"));
        context.setVariable("otp", params.get("otp"));
        context.setVariable("expiryMinutes", params.get("expiryMinutes"));

        return templateEngine.process("otp-email-template", context);
    }
}