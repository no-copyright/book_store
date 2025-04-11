package com.hau.profile_service.mapper;

import com.hau.profile_service.dto.ProfileCreateRequest;
import com.hau.profile_service.dto.ProfileResponse;
import com.hau.profile_service.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProfileMapper {
    Profile toUserProfile(ProfileCreateRequest profileCreateRequest);

    ProfileResponse toUserProfileResponse(Profile profile);
}
