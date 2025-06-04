package com.hau.notificationservice.mapper;

import com.hau.notificationservice.dto.NotificationRequest;
import com.hau.notificationservice.dto.NotificationResponseToUser;
import com.hau.notificationservice.entity.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toNotification(NotificationRequest notificationRequest);

    NotificationResponseToUser toNotificationResponseToUser(Notification notification);
}
