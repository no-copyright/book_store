package com.hau.notificationservice.mapper;

import org.mapstruct.Mapper;

import com.hau.notificationservice.dto.NotificationRequest;
import com.hau.notificationservice.dto.NotificationResponseToUser;
import com.hau.notificationservice.entity.Notification;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toNotification(NotificationRequest notificationRequest);

    NotificationResponseToUser toNotificationResponseToUser(Notification notification);
}
