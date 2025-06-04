package com.hau.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderProductResponse {
    private Long id;
    private Integer productId;
    private String productName;
    private Integer price;
    private Integer quantity;
    private String thumbnail;
}
