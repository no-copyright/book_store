package com.hau.product_service.service;


import com.hau.product_service.dto.request.CategoryRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.CategoryResponse;
import com.hau.product_service.entity.Category;
import com.hau.product_service.exception.AppException;
import com.hau.product_service.mapper.CategoryMapper;
import com.hau.product_service.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
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

    public List<Category> handleCategoryFromProduct(List<Long> categoryIds) {
        Set<Long> uniqueCategoryIds = new HashSet<>(categoryIds);
        List<Category> categories = categoryRepository.findAllById(uniqueCategoryIds);
        if (categories.size() != uniqueCategoryIds.size()) {
            throw new AppException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy một số danh mục trong danh sách",
                    uniqueCategoryIds
            );
        }
        return categories;
    }

    public Set<Long> findAllSubCategoryIds(Long parentId) {
        Set<Long> result = new HashSet<>();
        List<Category> children = categoryRepository.findByParentId(parentId);
        for (Category child : children) {
            result.add(child.getId());
            result.addAll(findAllSubCategoryIds(child.getId()));
        }
        return result;
    }

}
