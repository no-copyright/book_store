package com.hau.profile_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;
    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại không hợp lệ")
    private String phone;
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;
    @Pattern(regexp = "(?i)^(MALE|FEMALE)$", message = "Giá trị gender phải là 'MALE' hoặc 'FEMALE' (không phân biệt chữ hoa chữ thường)")
    private String gender;
}
