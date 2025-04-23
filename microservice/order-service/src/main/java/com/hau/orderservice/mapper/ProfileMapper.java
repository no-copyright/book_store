package com.hau.orderservice.mapper;

import com.hau.event.dto.ProfileCreateEvent;
import com.hau.orderservice.entity.Profile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(ProfileCreateEvent profileCreateEvent);
}
