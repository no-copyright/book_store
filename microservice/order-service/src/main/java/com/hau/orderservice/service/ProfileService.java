package com.hau.orderservice.service;

import com.hau.event.dto.ProfileCreateEvent;
import com.hau.orderservice.entity.Profile;
import com.hau.orderservice.mapper.ProfileMapper;
import com.hau.orderservice.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public void createProfile(ProfileCreateEvent profileCreateEvent){
        Profile profile = profileMapper.toProfile(profileCreateEvent);
        profileRepository.save(profile);
    }
}
