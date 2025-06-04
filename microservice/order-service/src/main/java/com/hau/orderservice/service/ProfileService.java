package com.hau.orderservice.service;

import com.hau.event.dto.ProfileCreateEvent;
import com.hau.event.dto.ProfileDeleteEvent;
import com.hau.event.dto.ProfileUpdateEvent;
import com.hau.orderservice.entity.Profile;
import com.hau.orderservice.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public void saveProfile(ProfileCreateEvent profileCreateEvent) {
        Profile profile = Profile.builder()
                .id(profileCreateEvent.getId())
                .userId(profileCreateEvent.getUserId())
                .fullName(profileCreateEvent.getFullName())
                .phone(profileCreateEvent.getPhone())
                .address(profileCreateEvent.getAddress())
                .build();
        profileRepository.save(profile);

    }

    public void updateProfile(ProfileUpdateEvent profileUpdateEvent) {
        Profile profile = profileRepository.findById(profileUpdateEvent.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setFullName(profileUpdateEvent.getFullName());
        profile.setPhone(profileUpdateEvent.getPhone());
        profile.setAddress(profileUpdateEvent.getAddress());
        profileRepository.save(profile);
    }

    public void deleteProfile(ProfileDeleteEvent profileDeleteEvent) {
        profileRepository.deleteById(profileDeleteEvent.getId());
    }
}
