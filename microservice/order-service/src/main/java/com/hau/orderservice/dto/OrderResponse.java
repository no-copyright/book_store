package com.hau.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Integer userId;
    private Long profileId;
    private String fullName;
    private String phone;
    private String address;
    private Integer status;
    private Integer paymentMethod;
    private Integer paymentStatus;
    private String note;

    private Set<OrderProductResponse> orderProducts;
}
