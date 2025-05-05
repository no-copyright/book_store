package com.hau.product_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilter {
    private String title;
    private String author;
    private Integer priceFrom;
    private Integer priceTo;
    private String sortBy;
    private String sortDir;
    private Long categoryId;
    private Float averageRateFrom;

    public boolean isEmpty() {
        return (title == null || title.isEmpty()) &&
                (author == null || author.isEmpty()) &&
                (priceFrom == null || priceFrom <= 0) &&
                (priceTo == null || priceTo <= 0) &&
                (sortBy == null || sortBy.isEmpty()) &&
                (sortDir == null || sortDir.isEmpty()) &&
                (categoryId == null || categoryId <= 0);
    }
}
