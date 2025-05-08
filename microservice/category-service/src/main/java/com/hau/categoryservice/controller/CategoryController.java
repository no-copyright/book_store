package com.hau.categoryservice.controller;

import com.hau.categoryservice.dto.request.CategoryRequest;
import com.hau.categoryservice.dto.response.ApiResponse;
import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.categoryservice.dto.response.CategoryTreeResponse;
import com.hau.categoryservice.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(@RequestParam(required = false) String name,
                                                                                @RequestParam(required = false) Boolean isAsc) {
        // Mock implementation
        ApiResponse<List<CategoryResponse>> response = categoryService.getAll(name, isAsc);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryTreeResponse>> getCategoryById(@PathVariable Long id) {
        // Mock implementation
        ApiResponse<CategoryTreeResponse> response = categoryService.getById(id);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody @Valid CategoryRequest request) {
        // Mock implementation
        ApiResponse<CategoryResponse> response = categoryService.create(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryRequest request) {
        // Mock implementation
        ApiResponse<CategoryResponse> response = categoryService.update(id, request);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        // Mock implementation
        ApiResponse<Void> response = categoryService.delete(id);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
