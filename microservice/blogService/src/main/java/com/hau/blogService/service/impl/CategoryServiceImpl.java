package com.hau.blogService.service.impl;

import com.hau.blogService.dto.request.CategoryRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.CategoryResponse;
import com.hau.blogService.entity.Category;
import com.hau.blogService.exception.AppException;
import com.hau.blogService.mapper.CategoryMapper;
import com.hau.blogService.repository.CategoryRepository;
import com.hau.blogService.service.CategoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    @Override
    public void handleCategoryCreated(CategoryRequest request) {
        Category category = categoryMapper.toCategory(request);
        Category savedCategory = categoryRepository.save(category);
        CategoryResponse response = categoryMapper.toCategoryResponse(savedCategory);

        ApiResponse.<CategoryResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo danh mục thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    @Override
    public void handleCategoryUpdated(Long id, CategoryRequest request) {
        Category existCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục", null));

        Category updatedCategory = categoryMapper.toCategoryUpdateFromRequest(request, existCategory);
        Category savedCategory = categoryRepository.save(updatedCategory);
        CategoryResponse response = categoryMapper.toCategoryResponse(savedCategory);

        ApiResponse.<CategoryResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật danh mục thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    @Override
    public void handleCategoryDeleted(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục", null));

        categoryRepository.deleteByParentId(id);
        categoryRepository.delete(category);

        ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa danh mục thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
