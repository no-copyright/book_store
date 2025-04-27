package com.hau.product_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<T> {
    private List<T> data;
    private int pageIndex;
    private int pageSize;
    private int totalPages;
    private long totalItems;
    private boolean hasNext;
    private boolean hasPrevious;
}

