package com.hau.profile_service.controller;

import com.hau.event.dto.UserCreateEvent;
import com.hau.profile_service.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Slf4j
@Component
public class UserController {

    private final UserService userService;

    @KafkaListener(topics = "user-created-topic")
    public void listenUserCreatedTopic(UserCreateEvent userCreateEvent) {
        log.info("Message received from topic: {}", userCreateEvent);
        try {
            userService.createUser(userCreateEvent);
        } catch (Exception e) {
            log.error("Error handling user created event: {}", e.getMessage());
        }
    }
}
