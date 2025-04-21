package com.hau.cartservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartProductResponse {
    private Integer id;
    private Integer cartId;
    private Integer productId;
    private Integer quantity;
    private boolean isSelected;
}
