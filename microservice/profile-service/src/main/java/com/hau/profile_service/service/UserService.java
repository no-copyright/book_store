package com.hau.profile_service.service;

import com.hau.event.dto.UserCreateEvent;
import com.hau.profile_service.entity.User;
import com.hau.profile_service.mapper.UserMapper;
import com.hau.profile_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public void createUser(UserCreateEvent userCreateEvent) {
        User user = userMapper.toUserCreateEvent(userCreateEvent);
        userRepository.save(user);
    }
}
