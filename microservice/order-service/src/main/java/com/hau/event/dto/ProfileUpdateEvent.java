package com.hau.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateEvent {
    private Long id;
    private Integer userId;
    private String fullName;
    private String phone;
    private String address;
}
