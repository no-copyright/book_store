package com.hau.profile_service.controller;

import com.hau.profile_service.dto.*;
import com.hau.profile_service.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/contacts")
public class ProfileController {
    private final ProfileService profileService;


    @PostMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> createProfile(@Valid @RequestBody ProfileCreateRequest profileCreateRequest) {
        ApiResponse<ProfileResponse> response = profileService.createProfile(profileCreateRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-profile")
    public ResponseEntity<ApiResponse<PageResponse<ProfileResponse>>> getMyProfile
            (@RequestParam(required = false, defaultValue = "1") int pageIndex,
             @RequestParam(required = false, defaultValue = "10") int pageSize) {
        ApiResponse<PageResponse<ProfileResponse>> response = profileService.getMyProfile(pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("@profileService.isOwnerOfProfile(#profileId, authentication)")
    @PutMapping("/{profileId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@PathVariable Long profileId, @Valid @RequestBody ProfileUpdateRequest profileUpdateRequest) {
        ApiResponse<ProfileResponse> response = profileService.updateProfile(profileId, profileUpdateRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("@profileService.isOwnerOfProfile(#profileId, authentication)")
    @GetMapping("/{profileId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfileById(@PathVariable Long profileId) {
        ApiResponse<ProfileResponse> response = profileService.getProfileById(profileId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("@profileService.isOwnerOfProfile(#profileId, authentication)")
    @DeleteMapping("/{profileId}")
    public ResponseEntity<ApiResponse<String>> deleteProfile(@PathVariable Long profileId) {
        ApiResponse<String> response = profileService.deleteProfile(profileId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
