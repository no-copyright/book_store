package com.hau.notificationservice.service;

import com.hau.event.dto.NotificationEvent;
import com.hau.notificationservice.dto.NotificationRequest;
import com.hau.notificationservice.entity.FcmToken;
import com.hau.notificationservice.entity.Notification;
import com.hau.notificationservice.mapper.NotificationMapper;
import com.hau.notificationservice.repository.FcmTokenRepository;
import com.hau.notificationservice.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationProcessingService {
    private final FcmTokenRepository fcmTokenRepository;
    private final FCMService fcmService;
    private final NotificationMapper notificationMapper;
    private final NotificationRepository notificationRepository;

    public void processOrderCreateNotification(NotificationEvent notificationEvent) {
        Integer userId = (Integer) notificationEvent.getParams().get("userId");

        List<FcmToken> fcmTokens = fcmTokenRepository.findFcmTokenByUserId(userId);

        List<String> tokensToSend = fcmTokens.stream()
                .map(FcmToken::getToken)
                .toList();
        Map<String, String> data = new HashMap<>();
        data.put("orderId", notificationEvent.getParams().get("orderId").toString());
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .topic("order created")
                .title("Đặt hàng thành công")
                .body("Đơn hàng của bạn đã được đặt thành công với mã đơn hàng: " + notificationEvent.getParams().get("orderId"))
                .tokens(tokensToSend)
                .data(data)
                .build();
        Notification notification = notificationMapper.toNotification(notificationRequest);
        notificationRepository.save(notification);
        fcmService.sendMessageToTokens(notificationRequest);
    }

    public void processOrderUpdatedStatusNotification(NotificationEvent notificationEvent) {
        Integer userId = (Integer) notificationEvent.getParams().get("userId");
        Integer oderStatus = (Integer) notificationEvent.getParams().get("orderStatus");

        List<FcmToken> fcmTokens = fcmTokenRepository.findFcmTokenByUserId(userId);

        List<String> tokensToSend = fcmTokens.stream()
                .map(FcmToken::getToken)
                .toList();
        Map<String, String> data = new HashMap<>();
        data.put("orderId", notificationEvent.getParams().get("orderId").toString());

        String notificationBody = getNotificationBody(oderStatus);

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .topic("order updated")
                .title("Cập nhật trạng thái đơn hàng")
                .body(notificationBody)
                .tokens(tokensToSend)
                .data(data)
                .build();
        Notification notification = notificationMapper.toNotification(notificationRequest);
        notificationRepository.save(notification);
        fcmService.sendMessageToTokens(notificationRequest);
    }

    private static String getNotificationBody(Integer oderStatus) {
        String notificationBody;
        switch (oderStatus) {
            case 0 -> notificationBody = "Đơn hàng của bạn đã được giao thành công";
            case 1 -> notificationBody = "Đơn hàng của bạn đã được xác nhận";
            case 2 -> notificationBody = "Đơn hàng của bạn đang chờ đơn vị vận chuyển đến lấy hàng";
            case 3 -> notificationBody = "Đơn hàng của bạn đã được giao cho đơn vị vận chuyển";
            case 4 -> notificationBody = "Đơn hàng của bạn đã được hủy";
            default -> notificationBody = "Lỗi không xác định trạng thái đơn hàng";
        }
        return notificationBody;
    }
}
