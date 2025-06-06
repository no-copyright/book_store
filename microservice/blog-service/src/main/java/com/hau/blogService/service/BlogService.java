package com.hau.blogService.service;

import com.hau.blogService.dto.request.BlogRequest;
import com.hau.blogService.dto.request.BlogfilterRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.BlogResponse;
import com.hau.blogService.dto.response.PageResponse;
import org.springframework.web.multipart.MultipartFile;


public interface BlogService {
//    ApiResponse<BlogResponse> createBlog(BlogRequest request) throws IOException;
//    ApiResponse<BlogResponse> updateBlog(Long id, BlogRequest request) throws IOException;
    ApiResponse<BlogResponse> createBlog(BlogRequest request, MultipartFile thumbnail);
    ApiResponse<BlogResponse> updateBlog(Long id, BlogRequest request, MultipartFile thumbnail);
    ApiResponse<Void> deleteBlog(Long id);
    ApiResponse<BlogResponse> findById(Long id);
    ApiResponse<PageResponse<BlogResponse>> getAllBlogs(BlogfilterRequest filter, Integer pageIndex, Integer pageSize);
    ApiResponse<BlogResponse> upThumbnail(Long id, MultipartFile thumbnail);
    ApiResponse<BlogResponse> createBlogWithoutThumbnail(BlogRequest request);
}
