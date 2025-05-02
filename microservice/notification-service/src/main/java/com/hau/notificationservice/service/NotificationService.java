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

    public void handleNotification(NotificationEvent notificationEvent) {
        String templateCode = notificationEvent.getTemplateCode();
        String subject;
        String htmlContent = switch (templateCode) {
            case "otp-email-template" -> {
                subject = "Mã OTP Xác Thực - Đặt Lại Mật Khẩu";
                yield processOtpTemplate(notificationEvent);
            }
            case "order-created-email-template" -> {
                subject = "Xác Nhận Đơn Hàng";
                yield processOrderTemplate(notificationEvent);
            }
            default -> throw new IllegalArgumentException("Template code không hợp lệ: " + templateCode);
        };

        emailService.sendEmail(SendEmailRequest.builder()
                .to(Recipient.builder()
                        .email(notificationEvent.getRecipient())
                        .build())
                .subject(subject)
                .htmlContent(htmlContent)
                .build());
    }

    private String processOtpTemplate(NotificationEvent notificationEvent) {
        Context context = new Context();
        Map<String, Object> params = notificationEvent.getParams();
        context.setVariable("username", params.get("username"));
        context.setVariable("otp", params.get("otp"));
        context.setVariable("expiryMinutes", params.get("expiryMinutes"));

        return templateEngine.process("otp-email-template", context);
    }

    private String processOrderTemplate(NotificationEvent notificationEvent) {
        Context context = new Context();
        Map<String, Object> params = notificationEvent.getParams();

        context.setVariable("username", params.get("username"));
        context.setVariable("fullName", params.get("fullName"));
        context.setVariable("orderId", params.get("orderId"));
        context.setVariable("totalPrice", params.get("totalPrice"));
        context.setVariable("address", params.get("address"));
        context.setVariable("phone", params.get("phone"));
        context.setVariable("paymentMethod", params.get("paymentMethod"));
        context.setVariable("paymentStatus", params.get("paymentStatus"));
        context.setVariable("status", params.get("status"));
        context.setVariable("note", params.get("note"));
        context.setVariable("createdAt", params.get("createdAt"));
        context.setVariable("orderProducts", params.get("orderProducts"));


        return templateEngine.process("order-created-email-template", context);
    }
}