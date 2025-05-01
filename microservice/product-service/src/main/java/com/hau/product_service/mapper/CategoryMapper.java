package com.hau.product_service.mapper;

import com.hau.product_service.dto.request.CategoryRequest;
import com.hau.product_service.dto.response.CategoryResponse;
import com.hau.product_service.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);

    Category toCategory(CategoryRequest categoryRequest);

    Category toCategoryUpdateFromRequest(CategoryRequest categoryRequest, @MappingTarget Category category);
}

