package com.hau.orderservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateRequest {
    @NotNull(message = "Mã địa chỉ nhận hàng không được để trống")
    private Long profileId;
    private Integer status;
    private Integer paymentMethod;
    private Integer paymentStatus;
    private String note;

    private Set<OrderProductCreateRequest> orderProducts;
}
