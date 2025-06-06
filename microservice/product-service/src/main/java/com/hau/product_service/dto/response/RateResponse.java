package com.hau.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RateResponse {
    private Long id;
    private Long productId;
    private String username;
    private Integer vote;
    private String comment;
    private String createdAt;
}
