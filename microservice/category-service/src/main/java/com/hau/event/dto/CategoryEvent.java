package com.hau.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryEvent {
    private String type;
    private Long categoryId;
    private Object data;

    public static String TYPE_CREATED = "CATEGORY_CREATED";
    public static String TYPE_UPDATED = "CATEGORY_UPDATED";
    public static String TYPE_DELETED = "CATEGORY_DELETED";
}
