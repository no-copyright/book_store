package com.hau.blogService.mapper;

import com.hau.blogService.dto.request.BlogRequest;
import com.hau.blogService.dto.response.BlogResponse;
import com.hau.blogService.entity.Blog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    @Mapping(source = "category.id", target = "categoryId")
    BlogResponse toBlogResponse(Blog blog);
    Blog toBlog(BlogRequest request);

    Blog toBlogUpdateFromRequest(BlogRequest request, @MappingTarget Blog blog);



}
