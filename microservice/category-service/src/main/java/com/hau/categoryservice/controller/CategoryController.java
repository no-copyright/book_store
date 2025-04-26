package com.hau.categoryservice.controller;

import com.hau.categoryservice.dto.request.CategoryRequest;
import com.hau.categoryservice.dto.response.ApiResponse;
import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.categoryservice.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        // Mock implementation
        ApiResponse<List<CategoryResponse>> response = categoryService.getAll();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        // Mock implementation
        ApiResponse<CategoryResponse> response = categoryService.getById(id);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(CategoryRequest request) {
        // Mock implementation
        ApiResponse<CategoryResponse> response = categoryService.create(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id, CategoryRequest request) {
        // Mock implementation
        ApiResponse<CategoryResponse> response = categoryService.update(id, request);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        // Mock implementation
        ApiResponse<Void> response = categoryService.delete(id);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
