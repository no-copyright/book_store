package com.hau.identity_service.controller;

import com.hau.identity_service.dto.response.PageResponse;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hau.identity_service.dto.request.ChangePasswordRequest;
import com.hau.identity_service.dto.request.UserCreateRequest;
import com.hau.identity_service.dto.request.UserUpdateInfoRequest;
import com.hau.identity_service.dto.request.UserUpdateRequest;
import com.hau.identity_service.dto.response.ApiResponse;
import com.hau.identity_service.dto.response.UserResponse;
import com.hau.identity_service.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserCreateRequest userCreateRequest) {
        ApiResponse<UserResponse> userResponse = userService.createUser(userCreateRequest);
        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @PutMapping("/profile-image")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserProfileImage(
            @RequestParam("profileImage") MultipartFile profileImage) {
        ApiResponse<UserResponse> userResponse = userService.updateUserProfileImage(profileImage);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @userService.isOwnerOfUser(#userId, authentication)")
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        ApiResponse<UserResponse> userResponse = userService.getUserById(userId);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/info")
    public ResponseEntity<ApiResponse<UserResponse>> myInfo() {
        ApiResponse<UserResponse> userResponse = userService.myInfo();
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long userId, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        ApiResponse<UserResponse> userResponse = userService.updateUser(userId, userUpdateRequest);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PutMapping("/info")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserInfo(@Valid @RequestBody UserUpdateInfoRequest userUpdateInfoRequest) {
        ApiResponse<UserResponse> userResponse = userService.updateUserInfo(userUpdateInfoRequest);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @userService.isOwnerOfUser(#userId, authentication)")
    @PatchMapping("/{userId}/password")
    public ResponseEntity<ApiResponse<UserResponse>> updatePassword(
            @PathVariable Long userId, @RequestBody @Valid ChangePasswordRequest changePasswordRequest) {
        ApiResponse<UserResponse> userResponse = userService.changePassword(userId, changePasswordRequest);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @RequestParam(required = false, defaultValue = "1") int pageIndex,
            @RequestParam(required = false, defaultValue = "10") int pageSize
    ) {
        ApiResponse<PageResponse<UserResponse>> userPage = userService.getAllUsers(pageIndex, pageSize);
        return new ResponseEntity<>(userPage, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> deleteUser(@PathVariable Long userId) {
        ApiResponse<UserResponse> userResponse = userService.deleteUser(userId);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }
}
