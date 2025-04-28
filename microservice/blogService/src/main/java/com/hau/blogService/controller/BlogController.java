package com.hau.blogService.controller;

import com.hau.blogService.dto.request.BlogRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.BlogResponse;
import com.hau.blogService.dto.response.PageResult;
import com.hau.blogService.service.BlogService;
import com.hau.blogService.service.event.SimpleProducer;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class BlogController {
    private final BlogService blogService;
    private final SimpleProducer producer;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<BlogResponse>>> getAllBlogs(Integer pageIndex, Integer pageSize, String categoryId) {
        ApiResponse<PageResult<BlogResponse>> response = blogService.getAllBlogs(pageIndex, pageSize, categoryId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogResponse>> getBlogById(@PathVariable Long id) {
        ApiResponse<BlogResponse> response = blogService.findById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BlogResponse>> createBlog(@RequestPart(value = "blog") @Valid BlogRequest request, @RequestPart("thumbnail") MultipartFile thumbnail) {
        ApiResponse<BlogResponse> response = blogService.createBlog(request, thumbnail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<BlogResponse>> updateBlog(@PathVariable Long id, @RequestPart("blog") @Valid BlogRequest request,
                                                                @RequestPart(value = "thumbnail") MultipartFile thumbnail) {
        ApiResponse<BlogResponse> response = blogService.updateBlog(id, request, thumbnail);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteBlog(@PathVariable Long id) {
        ApiResponse<Void> response = blogService.deleteBlog(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/send")
    public String sendMessage(@RequestParam String topic, @RequestParam String message) {
        producer.sendMessage(topic, message);
        return "Message sent successfully!";
    }
}
