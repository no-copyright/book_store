package com.hau.profile_service.service;

import com.hau.profile_service.dto.ApiResponse;
import com.hau.profile_service.dto.ProfileCreateRequest;
import com.hau.profile_service.dto.ProfileResponse;
import com.hau.profile_service.dto.ProfileUpdateRequest;
import com.hau.profile_service.entity.Profile;
import com.hau.profile_service.exception.AppException;
import com.hau.profile_service.mapper.ProfileMapper;
import com.hau.profile_service.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Không tìm thấy thông tin", null));
        return ApiResponse.<ProfileResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin thành công")
                .result(profileMapper.toUserProfileResponse(profile))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<ProfileResponse> updateProfile(Long userId, ProfileUpdateRequest profileUpdateRequest) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Không tìm thấy thông tin", null));
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
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Không tìm thấy thông tin", null));
        profileRepository.delete(profile);

        return ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa thông tin thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
