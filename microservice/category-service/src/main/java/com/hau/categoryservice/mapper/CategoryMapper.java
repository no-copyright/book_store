package com.hau.categoryservice.mapper;

import com.hau.categoryservice.dto.request.CategoryRequest;
import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.categoryservice.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);

    Category toCategory(CategoryRequest categoryRequest);

    Category toCategoryUpdateFromRequest(CategoryRequest categoryRequest, @MappingTarget Category category);
}
