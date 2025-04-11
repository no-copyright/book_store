package com.hau.profile_service.dto;

import com.hau.profile_service.entity.Profile;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private Long id;

    private String fullName;
    private String phone;
    private String address;
    private String gender;
    private Integer userId;
}
