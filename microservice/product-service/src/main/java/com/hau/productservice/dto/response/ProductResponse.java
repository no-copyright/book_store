package com.hau.productservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String title;
    private String author;
    private String publisher;
    private Integer publicationYear;
    private Integer packageSize;
    private Integer pageSize;
    private String form;
    private String thumbnail;
    private Integer quantity;
    private Integer discount;
    private Integer price;
    private Integer priority;
    private String description;
    private boolean active;
}
