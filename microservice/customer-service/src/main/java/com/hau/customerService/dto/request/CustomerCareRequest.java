package com.hau.customerService.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerCareRequest {
    @NotNull(message = "Tên không được để trống")
    @NotBlank(message = "Tên không được để trống")
    private String name;
    @NotNull(message = "Số điện thoại không được để trống")
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotNull(message = "Email không được để trống")
    @NotBlank(message = "Email không được để trống")
    private String email;

    @NotNull(message = "Địa chỉ không được để trống")
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotNull(message = "Nội dung không được để trống")
    @NotBlank(message = "Nội dung không được để trống")
    private String content;
}
