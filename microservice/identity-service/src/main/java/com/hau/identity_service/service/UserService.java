package com.hau.identity_service.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.hau.event.dto.UserCreateEvent;
import com.hau.identity_service.dto.request.*;
import com.hau.identity_service.dto.response.PageResponse;
import com.hau.identity_service.repository.CartServiceClient;
import com.hau.identity_service.repository.FileServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hau.identity_service.dto.response.ApiResponse;
import com.hau.identity_service.dto.response.UserResponse;
import com.hau.identity_service.entity.User;
import com.hau.identity_service.exception.AppException;
import com.hau.identity_service.mapper.UserMapper;
import com.hau.identity_service.repository.RoleRepository;
import com.hau.identity_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CartServiceClient cartServiceClient;
    private final FileServiceClient fileServiceClient;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.file.download-prefix}")
    private String fileDownloadPrefix;

    @Value("${app.file.default-image}")
    private String defaultImage;

    public ApiResponse<UserResponse> createUser(UserCreateRequest userCreateRequest) {
        User user = userMapper.toUser(userCreateRequest);
        var roles = roleRepository.findAllById(Set.of("USER"));
        user.setRoles(new HashSet<>(roles));
        user.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));
        user.setProfileImage(defaultImage);
        try {
            userRepository.save(user);
            UserCreateEvent userCreateEvent = UserCreateEvent.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .build();
            kafkaTemplate.send("user-created-topic", userCreateEvent);
            CartCreateRequest cartRequest = CartCreateRequest.builder()
                    .userId(user.getId())
                    .id(user.getId())
                    .build();
            cartServiceClient.createCart(cartRequest);
            return ApiResponse.<UserResponse>builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Tạo mới user thành công")
                    .result(userMapper.toUserResponse(user))
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(HttpStatus.BAD_REQUEST, "username đã tồn tại", null);
        } catch (Exception feignException) {
            log.error("Lỗi khi tạo giỏ hàng cho user {}: {}", user.getUsername(), feignException.getMessage(), feignException);
        }
        return null;
    }

    public ApiResponse<UserResponse> createUserforAdmin(UserCreateRequest userCreateRequest) {
        User user = userMapper.toUser(userCreateRequest);
        var roles = roleRepository.findAllById(Set.of("STAFF"));
        user.setRoles(new HashSet<>(roles));
        user.setPassword(passwordEncoder.encode(userCreateRequest.getPassword()));
        user.setProfileImage(defaultImage);
        try {
            userRepository.save(user);
            return ApiResponse.<UserResponse>builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Tạo mới user thành công")
                    .result(userMapper.toUserResponse(user))
                    .timestamp(LocalDateTime.now())
                    .build();
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(HttpStatus.BAD_REQUEST, "username đã tồn tại", null);
        }
    }

    public ApiResponse<UserResponse> updateUserProfileImage(MultipartFile profileImage) {
        if (profileImage == null || profileImage.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Vui lòng chọn ảnh để tải lên", null);
        }
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = findUserById(Long.valueOf(authentication.getName()));
        try {
            var fileResponse = fileServiceClient.uploadFile(profileImage);
            if (fileResponse != null && fileResponse.getResult() != null) {
                user.setProfileImage(fileResponse.getResult().getUrl());
            } else {
                throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Không nhận được thông tin từ file-service", null);
            }

            userRepository.save(user);
            UserResponse userResponse = userMapper.toUserResponse(user);
            userResponse.setProfileImage(fileDownloadPrefix + user.getProfileImage());
            return ApiResponse.<UserResponse>builder()
                    .status(HttpStatus.OK.value())
                    .message("Cập nhật ảnh đại diện thành công")
                    .result(userResponse)
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tải ảnh profile lên dịch vụ file", e);
        }
    }


    public ApiResponse<PageResponse<UserResponse>> getAllUsers(int page, int size) {
        Sort sort = Sort.by("createdAt").descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<User> userPage = userRepository.findAll(pageable);

        List<UserResponse> userResponseList = userPage.map(userMapper::toUserResponse).toList();
        userResponseList.forEach(userResponse -> userResponse.setProfileImage(fileDownloadPrefix + userResponse.getProfileImage()));
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách user thành công")
                .result(PageResponse.<UserResponse>builder()
                        .currentPage(page)
                        .totalPages(userPage.getTotalPages())
                        .totalElements(userPage.getTotalElements())
                        .pageSize(userPage.getSize())
                        .data(userResponseList)
                        .build())
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<UserResponse> myInfo() {
        var context = SecurityContextHolder.getContext();
        String id = context.getAuthentication().getName();

        User user = findUserById(Long.valueOf(id));
        UserResponse userResponse = userMapper.toUserResponse(user);
        userResponse.setProfileImage(fileDownloadPrefix + user.getProfileImage());
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin user thành công")
                .result(userResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<UserResponse> getUserById(Long id) {
        User user = findUserById(id);
        UserResponse userResponse = userMapper.toUserResponse(user);
        userResponse.setProfileImage(fileDownloadPrefix + user.getProfileImage());
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin user thành công")
                .result(userResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }

//    public ApiResponse<UserResponse> updateUser(Long id, UserUpdateRequest userUpdateRequest) {
//        User user = findUserById(id);
//        userMapper.toUserUpdateRequest(user, userUpdateRequest);
//        var roles = roleRepository.findAllById(userUpdateRequest.getRoles());
//        user.setRoles(new HashSet<>(roles));
//
//        userRepository.save(user);
//        return ApiResponse.<UserResponse>builder()
//                .status(HttpStatus.OK.value())
//                .message("Cập nhật thông tin user thành công")
//                .result(null)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }

    public ApiResponse<UserResponse> updateUser(Long userId, UserUpdateRequest userUpdateRequest) {
        User user = findUserById(userId);

        if (userUpdateRequest.getEmail() != null) {
            user.setEmail(userUpdateRequest.getEmail());
        }
        if (userUpdateRequest.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
        }
        if (userUpdateRequest.getRoles() != null && !userUpdateRequest.getRoles().isEmpty()) {
            var roles = roleRepository.findAllById(userUpdateRequest.getRoles());
            user.setRoles(new HashSet<>(roles));
        }
//        if (userUpdateRequest.getProfileImage() != null) {
//            user.setProfileImage(userUpdateRequest.getProfileImage());
//        }

        userRepository.save(user);
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật thông tin thành công")
                .result(userMapper.toUserResponse(user))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<UserResponse> updateUserInfo(UserUpdateInfoRequest userUpdateInfoRequest) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = findUserById(Long.valueOf(authentication.getName()));
        user.setEmail(userUpdateInfoRequest.getEmail());
        userRepository.save(user);
        UserResponse userResponse = userMapper.toUserResponse(user);
        userResponse.setProfileImage(fileDownloadPrefix + user.getProfileImage());
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật thông tin user thành công")
                .result(userResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<UserResponse> changePassword(Long id, ChangePasswordRequest changePasswordRequest) {
        User user = findUserById(id);
        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng", null);
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Đổi mật khẩu thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<UserResponse> deleteUser(Long id) {
        User user = findUserById(id);
        userRepository.delete(user);
        return ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa user thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public User findUserById(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy user có id: " + id, null));
    }

    public boolean isOwnerOfUser(Long requestedUserId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String authenticatedUserId = authentication.getName();
        try {
            User requestedUser = findUserById(requestedUserId);
            return requestedUser.getId().toString().equals(authenticatedUserId);
        } catch (AppException e) {
            log.warn("Không tìm thấy người dùng với ID: {}", requestedUserId);
            return false;
        }
    }

    public ApiResponse<String> seeding(int numberOfRecords) {
        com.github.javafaker.Faker faker = new com.github.javafaker.Faker();
        var userRole = roleRepository.findById("USER").orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Role USER not found", "USER"));
        var staffRole = roleRepository.findById("STAFF").orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Role STAFF not found", "STAFF"));

        int usersCreated = 0;
        int staffUsersCreated = 0;

        // Create users with only USER role (first half)
        for (int i = 0; i < numberOfRecords / 2; i++) {
            String username = faker.name().username() + "_user_" + i;
            String email = username + "@example.com";
            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode("12345"))
                    .profileImage(defaultImage)
                    .createdAt(LocalDateTime.now())
                    .roles(Set.of(userRole))
                    .build();
            try {
                userRepository.save(user);
                usersCreated++;
            } catch (Exception e) {
                log.warn("Could not save user {}: {}", username, e.getMessage());
            }
        }

        // Create users with both USER and STAFF roles (second half)
        for (int i = 0; i < numberOfRecords / 2; i++) {
            String username = faker.name().username() + "_staff_" + i;
            String email = username + "@example.com";
            Set<com.hau.identity_service.entity.Role> roles = new HashSet<>();
            roles.add(userRole);
            roles.add(staffRole);

            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode("12345"))
                    .profileImage(defaultImage)
                    .createdAt(LocalDateTime.now())
                    .roles(roles)
                    .build();
            try {
                userRepository.save(user);
                staffUsersCreated++;
            } catch (Exception e) {
                log.warn("Could not save user with staff role {}: {}", username, e.getMessage());
            }
        }

        return ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Seeding thành công " + usersCreated + " user và " + staffUsersCreated + " user có quyền staff!")
                .result("OK")
                .build();
    }
}
