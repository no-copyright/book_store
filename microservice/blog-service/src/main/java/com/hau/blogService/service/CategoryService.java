package com.hau.blogService.service;

import com.hau.blogService.dto.request.CategoryRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    void handleCategoryCreated(CategoryRequest request);
    void handleCategoryUpdated(Long id, CategoryRequest request);
    void handleCategoryDeleted(Long id);

    ApiResponse<List<CategoryResponse>> getAllCategories();
}
