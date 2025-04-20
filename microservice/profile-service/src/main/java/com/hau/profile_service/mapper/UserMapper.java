package com.hau.profile_service.mapper;

import com.hau.event.dto.UserCreateEvent;
import com.hau.profile_service.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUserCreateEvent(UserCreateEvent userCreateEvent);
}
