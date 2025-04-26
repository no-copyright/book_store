package com.hau.categoryservice.service.helper;

import com.hau.categoryservice.dto.response.CategoryResponse;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class CategoryHelper {
    public static List<CategoryResponse> buildCategoryTree(List<CategoryResponse> categories, Boolean isAsc) {
        categories.sort(Comparator.comparing(CategoryResponse::getId));

        Map<Long, CategoryResponse> categoryMap = categories.stream()
                .collect(Collectors.toMap(CategoryResponse::getId, category -> category));

        List<CategoryResponse> roots = new ArrayList<>();

        for (CategoryResponse category : categories) {
            if (category.getParentId() == null) {
                roots.add(category);
            } else {
                CategoryResponse parent = categoryMap.get(category.getParentId());
                if (parent != null) {
                    if (parent.getChildren() == null) {
                        parent.setChildren(new ArrayList<>());
                    }
                    parent.getChildren().add(category);

                    parent.getChildren().sort(Comparator.comparing(CategoryResponse::getId));
                } else
                    throw new RuntimeException("Parent category not found for id: " + category.getParentId());
            }
        }

        // Sau cùng, sắp xếp luôn root theo id
        if(isAsc == null)
        roots.sort(Comparator.comparing(CategoryResponse::getId));
        else {
            if(isAsc) {
                roots.sort(Comparator.comparing(CategoryResponse::getPriority));
            } else {
                roots.sort(Comparator.comparing(CategoryResponse::getPriority).reversed());
            }
        }
        return roots;
    }

}