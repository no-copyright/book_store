package com.hau.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateEvent {
    private Long orderId;
    private Integer userId;
    private Integer totalPrice;
    private Integer paymentMethod;
    private Integer paymentStatus;
}
