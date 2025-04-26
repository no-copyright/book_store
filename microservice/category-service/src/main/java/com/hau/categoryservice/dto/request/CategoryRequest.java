package com.hau.categoryservice.dto.request;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private int priority;
    private Long parentId;
}
