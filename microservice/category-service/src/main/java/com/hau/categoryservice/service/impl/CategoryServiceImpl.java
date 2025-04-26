package com.hau.categoryservice.service.impl;

import com.hau.categoryservice.dto.request.CategoryRequest;
import com.hau.categoryservice.dto.response.ApiResponse;
import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.categoryservice.repository.CategoryRepository;
import com.hau.categoryservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    @Override
    public ApiResponse<List<CategoryResponse>> getAll() {
        return null;
    }

    @Override
    public ApiResponse<CategoryResponse> getById(Long id) {
        return null;
    }

    @Override
    public ApiResponse<CategoryResponse> create(CategoryRequest request) {
        return null;
    }

    @Override
    public ApiResponse<CategoryResponse> update(Long id, CategoryRequest request) {
        return null;
    }

    @Override
    public ApiResponse<Void> delete(Long id) {
        return null;
    }
}
