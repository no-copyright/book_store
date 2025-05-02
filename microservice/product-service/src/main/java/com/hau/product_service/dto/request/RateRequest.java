package com.hau.product_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RateRequest {
    @NotNull(message = "Mã sản phẩm không được để trống")
    private Long productId;
    @NotNull(message = "Điểm đánh giá không được để trống")
    private int vote;
    private String comment;
}
