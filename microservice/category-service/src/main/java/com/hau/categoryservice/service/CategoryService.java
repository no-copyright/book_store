package com.hau.categoryservice.service;

import com.hau.categoryservice.dto.request.CategoryRequest;
import com.hau.categoryservice.dto.response.ApiResponse;
import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.categoryservice.dto.response.CategoryTreeResponse;

import java.util.List;

public interface CategoryService {
    ApiResponse<List<CategoryResponse>> getAll(String name, Boolean isAsc);
    ApiResponse<CategoryTreeResponse> getById(Long id);
    ApiResponse<CategoryResponse> create(CategoryRequest request);
    ApiResponse<CategoryResponse> update(Long id, CategoryRequest request);
    ApiResponse<Void> delete(Long id);
    ApiResponse<String> seeding(Integer numberOfRecords);
}
