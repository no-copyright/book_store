package com.hau.notificationservice.repository;

import com.hau.notificationservice.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    Page<Notification> findNotificationByUserId(Integer userId, Pageable pageable);
    Optional<Notification> findByIdAndUserId(String id, Integer userId);
    List<Notification> findNotificationByUserId(Integer userId);
}
