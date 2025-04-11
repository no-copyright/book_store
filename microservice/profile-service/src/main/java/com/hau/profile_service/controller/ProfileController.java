package com.hau.profile_service.controller;

import com.hau.profile_service.dto.ApiResponse;
import com.hau.profile_service.dto.ProfileCreateRequest;
import com.hau.profile_service.dto.ProfileResponse;
import com.hau.profile_service.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user/profiles")
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> createUserProfile(@Valid @RequestBody ProfileCreateRequest profileCreateRequest) {
        ApiResponse<ProfileResponse> response = profileService.createUserProfile(profileCreateRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{userprofileId}")
    public ResponseEntity<ApiResponse<ProfileResponse>> getUserProfileById(@PathVariable Long userprofileId) {
        ApiResponse<ProfileResponse> response = profileService.getUserProfileById(userprofileId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
