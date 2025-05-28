package com.hau.blogService.controller;

import com.hau.blogService.dto.request.BlogRequest;
import com.hau.blogService.dto.request.BlogfilterRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.BlogResponse;
import com.hau.blogService.dto.response.PageResponse;
import com.hau.blogService.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BlogResponse>>> getAllBlogs(
            @ModelAttribute BlogfilterRequest filter,
            @RequestParam(defaultValue = "0", required = false) Integer pageIndex,
            @RequestParam(defaultValue = "10", required = false) Integer pageSize
    ) {
        // Pass pagination and filter object to the service
        ApiResponse<PageResponse<BlogResponse>> response = blogService.getAllBlogs(filter, pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogResponse>> getBlogById(@PathVariable Long id) {
        ApiResponse<BlogResponse> response = blogService.findById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping
    public ResponseEntity<ApiResponse<BlogResponse>> createBlog(@RequestPart(value = "blog") @Valid BlogRequest request, @RequestPart("thumbnail") MultipartFile thumbnail) {
        ApiResponse<BlogResponse> response = blogService.createBlog(request, thumbnail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogResponse>> updateBlog(@PathVariable Long id, @RequestPart("blog") @Valid BlogRequest request,
                                                                @RequestPart(value = "thumbnail") MultipartFile thumbnail) {
        ApiResponse<BlogResponse> response = blogService.updateBlog(id, request, thumbnail);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable Long id) {
        ApiResponse<Void> response = blogService.deleteBlog(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
