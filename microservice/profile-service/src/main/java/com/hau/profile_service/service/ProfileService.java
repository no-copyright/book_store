package com.hau.profile_service.service;

import com.hau.profile_service.dto.*;
import com.hau.profile_service.entity.Profile;
import com.hau.profile_service.exception.AppException;
import com.hau.profile_service.mapper.ProfileMapper;
import com.hau.profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public ApiResponse<ProfileResponse> createProfile(ProfileCreateRequest profileCreateRequest) {
        Profile profile = profileMapper.toUserProfile(profileCreateRequest);

        profileRepository.save(profile);

        return ApiResponse.<ProfileResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm thông tin người nhận hàng thành công")
                .result(profileMapper.toUserProfileResponse(profile))
                .timestamp(LocalDateTime.now())
                .build();
    }


    public ApiResponse<ProfileResponse> getProfileById(Long profileId) {
        Profile profile = findProfileById(profileId);
        return ApiResponse.<ProfileResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin thành công")
                .result(profileMapper.toUserProfileResponse(profile))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<ProfileResponse> updateProfile(Long userId, ProfileUpdateRequest profileUpdateRequest) {
        Profile profile = findProfileById(userId);
        profileMapper.updateUserProfile(profile, profileUpdateRequest);
        profileRepository.save(profile);

        return ApiResponse.<ProfileResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật thông tin thành công")
                .result(profileMapper.toUserProfileResponse(profile))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<String> deleteProfile(Long profileId) {
        Profile profile = findProfileById(profileId);
        profileRepository.delete(profile);

        return ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa thông tin thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public boolean isOwnerOfProfile(Long profileId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String authenticatedUserId = authentication.getName();

        try {
            Profile profile = findProfileById(profileId);
            return profile.getUserId().toString().equals(authenticatedUserId);
        } catch (AppException e) {
            log.warn("Không tìm thấy người dùng với ID: {}", authenticatedUserId);
            return false;
        }

    }

    public Profile findProfileById(Long profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new AppException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy thông tin người nhận hàng có id: " + profileId, null)
                );
    }
}
