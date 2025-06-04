package com.hau.orderservice.controller;

import com.hau.event.dto.ProfileCreateEvent;
import com.hau.event.dto.ProfileDeleteEvent;
import com.hau.event.dto.ProfileUpdateEvent;
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
        profileService.saveProfile(profileCreateEvent);
    }

    @KafkaListener(topics = "profile-update-event")
    public void handleProfileUpdateEvent(ProfileUpdateEvent profileUpdateEvent) {
        profileService.updateProfile(profileUpdateEvent);
    }

    @KafkaListener(topics = "profile-delete-event")
    public void handleProfileDeleteEvent(ProfileDeleteEvent id) {
        profileService.deleteProfile(id);
    }
}
