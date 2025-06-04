package com.hau.blogService.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BlogRequest {
    @NotNull
    @NotBlank(message = "Title không được để trống")
    private String title;
    @NotBlank(message = "Content không được để trống")
    private String content;
    @Min(value = 1, message = "Priority phải lớn hơn hoặc bằng 1")
    private Integer priority;
    @NotNull(message = "Category ID không được để trống")
    private Long categoryId;
//    @NotNull(message = "Thumbnail không được để trống")
//    private String thumbnail;
}
