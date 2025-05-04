package com.hau.product_service.service.event;

import com.hau.event.dto.UserCreateEvent;
import com.hau.product_service.entity.User;
import com.hau.product_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventConsumer {
    private final UserRepository userRepository;

    @KafkaListener(topics = "user-created-topic")
    public void handleUserCreateEvent(UserCreateEvent userCreateEvent) {
        log.info("Received user create event: {}", userCreateEvent);

        Optional<User> existingUser = userRepository.findById(userCreateEvent.getId());

        if (existingUser.isPresent()) {
            log.warn("User with id {} already exists. Skipping creation for this event.", userCreateEvent.getId());
        } else {
            User newUser = User.builder()
                    .id(userCreateEvent.getId())
                    .username(userCreateEvent.getUsername())
                    .build();
            try {
                userRepository.save(newUser); // Let JPA manage the ID and version
                log.info("Successfully created user with id {}", newUser.getId()); // Log the newly generated ID
            } catch (Exception e) {
                log.error("Failed to save user with id {}. Error: {}", userCreateEvent.getId(), e.getMessage(), e);
                throw new RuntimeException("Failed to save user", e);
            }
        }
    }
}