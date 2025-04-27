package com.hau.blogService.service;

import com.hau.blogService.dto.request.CategoryRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.CategoryResponse;

public interface CategoryService {
    ApiResponse<CategoryResponse> create(CategoryRequest request);
    ApiResponse<CategoryResponse> update(Long id, CategoryRequest request);
    ApiResponse<Void> delete(Long id);
}
