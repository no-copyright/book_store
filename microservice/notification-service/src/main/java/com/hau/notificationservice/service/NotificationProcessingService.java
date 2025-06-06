package com.hau.notificationservice.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.hau.event.dto.NotificationEvent;
import com.hau.notificationservice.dto.ApiResponse;
import com.hau.notificationservice.dto.NotificationRequest;
import com.hau.notificationservice.dto.NotificationResponseToUser;
import com.hau.notificationservice.dto.PageResponse;
import com.hau.notificationservice.entity.FcmToken;
import com.hau.notificationservice.entity.Notification;
import com.hau.notificationservice.exception.AppException;
import com.hau.notificationservice.mapper.NotificationMapper;
import com.hau.notificationservice.repository.FcmTokenRepository;
import com.hau.notificationservice.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

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

        List<String> tokensToSend = fcmTokens.stream().map(FcmToken::getToken).toList();
        Map<String, String> data = new HashMap<>();
        data.put("orderId", notificationEvent.getParams().get("orderId").toString());
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .userId(userId)
                .isRead(false)
                .topic("Order created")
                .title("Chúc mừng bạn đã đặt hàng thành công")
                .body("Đơn hàng của bạn đã được đặt thành công với mã đơn hàng: "
                        + notificationEvent.getParams().get("orderId"))
                .tokens(tokensToSend)
                .data(data)
                .createdAt(LocalDateTime.now())
                .build();
        Notification notification = notificationMapper.toNotification(notificationRequest);
        notificationRepository.save(notification);
        fcmService.sendMessageToTokens(notificationRequest);
    }

    public void processOrderUpdatedStatusNotification(NotificationEvent notificationEvent) {
        Integer userId = (Integer) notificationEvent.getParams().get("userId");
        Integer oderStatus = (Integer) notificationEvent.getParams().get("orderStatus");

        List<FcmToken> fcmTokens = fcmTokenRepository.findFcmTokenByUserId(userId);

        List<String> tokensToSend = fcmTokens.stream().map(FcmToken::getToken).toList();
        Map<String, String> data = new HashMap<>();
        data.put("orderId", notificationEvent.getParams().get("orderId").toString());

        String notificationBody = getNotificationBody(oderStatus);

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .userId(userId)
                .isRead(false)
                .topic("Order updated")
                .title("Cập nhật trạng thái đơn hàng")
                .body(notificationBody)
                .tokens(tokensToSend)
                .data(data)
                .createdAt(LocalDateTime.now())
                .build();
        Notification notification = notificationMapper.toNotification(notificationRequest);
        notificationRepository.save(notification);
        fcmService.sendMessageToTokens(notificationRequest);
    }

    public ApiResponse<NotificationResponseToUser> markAsRead(String id) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());

        Notification notification = notificationRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Thông báo không tồn tại", null));

        notification.setIsRead(true);
        notificationRepository.save(notification);

        NotificationResponseToUser response = notificationMapper.toNotificationResponseToUser(notification);
        return ApiResponse.<NotificationResponseToUser>builder()
                .status(200)
                .message("Đã đọc")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<String> markAllAsRead() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());

        List<Notification> notifications = notificationRepository.findNotificationByUserId(userId);

        notifications.forEach(notification -> notification.setIsRead(true));
        notificationRepository.saveAll(notifications);

        return ApiResponse.<String>builder()
                .status(200)
                .message("Đã đọc tất cả")
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<PageResponse<NotificationResponseToUser>> notificationResponseToUser(
            int pageIndex, int pageSize) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());

        Sort sort = Sort.by("createdAt").descending();
        Pageable pageable = PageRequest.of(pageIndex - 1, pageSize, sort);
        Page<Notification> notifications = notificationRepository.findNotificationByUserId(userId, pageable);

        List<NotificationResponseToUser> notificationResponses = notifications.stream()
                .map(notificationMapper::toNotificationResponseToUser)
                .toList();
        return ApiResponse.<PageResponse<NotificationResponseToUser>>builder()
                .status(200)
                .message("Lấy thông báo thành công")
                .result(PageResponse.<NotificationResponseToUser>builder()
                        .data(notificationResponses)
                        .currentPage(pageIndex)
                        .pageSize(pageSize)
                        .totalElements(notifications.getTotalElements())
                        .totalPages(notifications.getTotalPages())
                        .build())
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<String> deleteNotification(String notificationId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());

        Notification notification = notificationRepository
                .findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Thông báo không tồn tại", null));

        notificationRepository.delete(notification);
        return ApiResponse.<String>builder()
                .status(200)
                .message("Xoá thông báo thành công")
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<String> deleteAllNotification() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());

        List<Notification> notification = notificationRepository.findNotificationByUserId(userId);

        notificationRepository.deleteAll(notification);
        return ApiResponse.<String>builder()
                .status(200)
                .message("Xoá tất cả thông báo thành công")
                .timestamp(LocalDateTime.now())
                .build();
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
