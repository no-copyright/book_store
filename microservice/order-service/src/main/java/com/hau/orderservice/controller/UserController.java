package com.hau.orderservice.controller;

import com.hau.event.dto.UserCreateEvent;
import com.hau.orderservice.entity.User;
import com.hau.orderservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @KafkaListener(topics = "user-created-topic")
    public void handleUserCreateEvent(UserCreateEvent userCreateEvent) {
        log.info("Received UserCreateEvent: {}", userCreateEvent);
        User user = User.builder()
                .id(userCreateEvent.getId())
                .build();
        userRepository.save(user);
    }
}
