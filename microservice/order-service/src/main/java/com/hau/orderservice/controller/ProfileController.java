package com.hau.orderservice.controller;

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
    public void createProfile(ProfileCreateEvent profileCreateEvent) {
        log.info("Received event: {}", profileCreateEvent);
        profileService.createProfile(profileCreateEvent);
    }
}
