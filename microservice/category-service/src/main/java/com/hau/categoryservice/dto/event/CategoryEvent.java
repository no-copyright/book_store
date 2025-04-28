package com.hau.categoryservice.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// Annotation Lombok giúp tạo constructor, getter/setter, builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryEvent {
    private String type; // Ví dụ: "CATEGORY_CREATED", "CATEGORY_UPDATED", "CATEGORY_DELETED"
    private Long categoryId;
    private Object data; // Có thể chứa CategoryResponse cho CREATED/UPDATED, null cho DELETED
    private LocalDateTime timestamp;

    // Enum hoặc Constant cho các loại sự kiện
    public static final String TYPE_CREATED = "CATEGORY_CREATED";
    public static final String TYPE_UPDATED = "CATEGORY_UPDATED";
    public static final String TYPE_DELETED = "CATEGORY_DELETED";
}
