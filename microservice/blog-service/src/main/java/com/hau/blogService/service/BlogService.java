package com.hau.blogService.service;

import com.hau.blogService.dto.request.BlogRequest;
import com.hau.blogService.dto.request.BlogfilterRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.BlogResponse;
import com.hau.blogService.dto.response.PageResult;
import org.springframework.web.multipart.MultipartFile;

public interface BlogService {
    ApiResponse<BlogResponse> createBlog(BlogRequest request, MultipartFile thumbnail);
    ApiResponse<BlogResponse> updateBlog(Long id, BlogRequest request, MultipartFile thumbnail);
    ApiResponse<Void> deleteBlog(Long id);
    ApiResponse<BlogResponse> findById(Long id);
    ApiResponse<PageResult<BlogResponse>> getAllBlogs(BlogfilterRequest filter, Integer pageIndex, Integer pageSize);
}
