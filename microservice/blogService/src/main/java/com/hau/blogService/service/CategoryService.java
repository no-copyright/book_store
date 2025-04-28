package com.hau.blogService.service;

import com.hau.blogService.dto.request.CategoryRequest;

public interface CategoryService {
    void handleCategoryCreated(CategoryRequest request);
    void handleCategoryUpdated(Long id, CategoryRequest request);
    void handleCategoryDeleted(Long id);
}
