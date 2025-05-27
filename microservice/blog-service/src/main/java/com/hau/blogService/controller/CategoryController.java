package com.hau.blogService.controller;

import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.CategoryResponse;
import com.hau.blogService.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        ApiResponse<List<CategoryResponse>> response = categoryService.getAllCategories();
        return ResponseEntity.ok(response);
    }
}
