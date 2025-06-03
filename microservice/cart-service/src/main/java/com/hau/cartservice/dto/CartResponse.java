package com.hau.cartservice.dto;

import com.hau.cartservice.entity.CartProduct;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private Integer id;
    private Integer userId;
    private List<CartProduct> cartProducts;
}
