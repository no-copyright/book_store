package com.hau.cartservice.dto;

import jakarta.validation.constraints.NotNull;

public class CartUpdateRequest {
    @NotNull(message = "User Id không được để trống")
    private Integer userId;
}
