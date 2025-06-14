package com.hau.notificationservice.dto;

import java.util.Collections;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;

    @Builder.Default
    private List<T> data = Collections.emptyList();
}
