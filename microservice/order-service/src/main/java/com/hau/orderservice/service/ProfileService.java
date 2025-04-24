package com.hau.orderservice.service;

import com.hau.event.dto.ProfileCreateEvent;
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
}
