package com.hau.profile_service.dto;

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
}
