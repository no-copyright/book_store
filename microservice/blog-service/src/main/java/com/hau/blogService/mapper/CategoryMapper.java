package com.hau.blogService.mapper;

import com.hau.blogService.dto.request.CategoryRequest;
import com.hau.blogService.dto.response.CategoryResponse;
import com.hau.blogService.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);

    Category toCategory(CategoryRequest categoryRequest);

    Category toCategoryUpdateFromRequest(CategoryRequest categoryRequest, @MappingTarget Category category);
}

