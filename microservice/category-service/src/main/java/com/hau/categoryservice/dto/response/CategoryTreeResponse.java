package com.hau.categoryservice.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class CategoryTreeResponse {
    private CategoryResponse parent;             // danh mục cha
    private List<CategoryResponse> children;     // danh sách con
}

