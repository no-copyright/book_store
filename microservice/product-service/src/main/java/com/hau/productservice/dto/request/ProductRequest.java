package com.hau.productservice.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @NotNull
    private String title;

    @NotBlank(message = "Tác giả không được để trống")
    @NotNull
    private String author;

    @NotBlank(message = "Nhà xuất bản không được để trống")
    private String publisher;

    @NotNull(message = "Năm xuất bản không được để trống")
    private Integer publicationYear;

    @NotNull(message = "Kích thước đóng gói không được để trống")
    @Min(value = 1, message = "Kích thước đóng gói phải lớn hơn 0")
    private Integer packageSize;

    @NotNull(message = "Số trang không được để trống")
    @Min(value = 1, message = "Số trang phải lớn hơn 0")
    private Integer pageSize;

    @NotBlank(message = "Hình thức không được để trống") // ví dụ: Bìa mềm, Bìa cứng
    private String form;

    @NotBlank(message = "Ảnh bìa không được để trống")
    private String thumbnail;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng phải >= 0")
    private Integer quantity;

    @NotNull(message = "giá hiện tại không được để trống")
    @Min(value = 1, message = "Giá hiện tại phải > 0")
    private Integer discount;

    @NotNull(message = "Giá cũ không được để trống")
    @Min(value = 1000, message = "Giá cũ phải > 0")
    private Integer price;

    @NotNull(message = "Độ ưu tiên không được để trống")
    @Min(value = 0, message = "Độ ưu tiên phải >= 0")
    private Integer priority;

    @NotBlank(message = "Mô tả không được để trống")
    private String description;
}
