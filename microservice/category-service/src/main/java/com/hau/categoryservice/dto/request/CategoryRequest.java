package com.hau.categoryservice.dto.request;

import com.hau.categoryservice.enums.CategoryType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryRequest {
    @NotNull(message = "Tên danh mục không được để trống")
    private String name;
    @NotNull(message = "Độ ưu tiên không được để trống")
    @Min(value = 1, message = "Mức độ ưu tiên phải lớn hơn 0")
    private Integer priority;
    private Long parentId;
    private CategoryType type;
}
