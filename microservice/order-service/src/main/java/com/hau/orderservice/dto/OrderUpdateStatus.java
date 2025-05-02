package com.hau.orderservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateStatus {
    @NotNull(message = "Trang thái đơn hàng không được để trống")
    private Integer status;
}
