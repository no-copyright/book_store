package com.hau.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductEvent {
    private Long id;
    private Integer discount;
    private Integer price;
    private Integer quantity;
    private String title;
}
