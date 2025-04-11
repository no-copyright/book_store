package com.hau.profile_service.service;

import com.hau.profile_service.dto.ApiResponse;
import com.hau.profile_service.dto.ProfileCreateRequest;
import com.hau.profile_service.dto.ProfileResponse;
import com.hau.profile_service.entity.Profile;
import com.hau.profile_service.exception.AppException;
import com.hau.profile_service.mapper.ProfileMapper;
import com.hau.profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public ApiResponse<ProfileResponse> createUserProfile(ProfileCreateRequest profileCreateRequest) {
        Profile profile = profileMapper.toUserProfile(profileCreateRequest);

        profileRepository.save(profile);

        return ApiResponse.<ProfileResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo mới thông tin user thành công")
                .result(profileMapper.toUserProfileResponse(profile))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<ProfileResponse> getUserProfileById(Long userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Không tìm thấy thông tin user", null));
        return ApiResponse.<ProfileResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin user thành công")
                .result(profileMapper.toUserProfileResponse(profile))
                .timestamp(LocalDateTime.now())
                .build();
    }
}
