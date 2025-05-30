package com.hau.cartservice.dto;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartCreateRequest {
    @NotNull(message = "Id không được để trống")
    private Integer id;
    @NotNull(message = "User Id không được để trống")
    private Integer userId;
}
