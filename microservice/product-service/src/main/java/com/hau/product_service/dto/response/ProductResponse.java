package com.hau.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

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
    private Float averageRate;
    private boolean active;

    private List<String> imageUrls;
    private List<Long> categories;
}
