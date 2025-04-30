package com.hau.orderservice.controller;

import com.hau.event.dto.OrderCreateEvent;
import com.hau.event.dto.ProfileCreateEvent;
import com.hau.orderservice.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProfileController {
    private final ProfileService profileService;
    @KafkaListener(topics = "profile-create-event")
    public void handleProfileCreateEvent(ProfileCreateEvent profileCreateEvent) {
        log.info("Received ProfileCreateEvent: {}", profileCreateEvent);
        profileService.saveProfile(profileCreateEvent);
    }

//    @KafkaListener(topics = "simple-order-processing-topic")
//    public void handleOrderCreateEvent(OrderCreateEvent event) {
//        log.info("### Đã nhận sự kiện OrderCreateEvent từ Kafka: {}", event);
//    }
}
