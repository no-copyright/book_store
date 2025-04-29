package com.hau.blogService.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogfilterRequest {
    private String categoryId;
    private String title;
    private String sortDirection;
}
