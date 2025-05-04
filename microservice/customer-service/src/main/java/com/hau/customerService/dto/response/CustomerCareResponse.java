package com.hau.customerService.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerCareResponse {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String content;
    private String createdAt;
}
