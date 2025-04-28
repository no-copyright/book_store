package com.hau.event.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateEvent {
    private Integer cartProductId;
    private Integer productId;
    private Integer quantity;
}
