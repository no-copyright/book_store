package com.hau.blogService.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogResponse {
    private Long id;
    private String title;
    private String thumbnail;
    private String content;
    private Integer priority;
    private Long categoryId;
    private String slug;
    private String createdAt;
}
