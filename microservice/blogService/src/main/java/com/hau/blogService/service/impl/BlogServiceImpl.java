package com.hau.blogService.service.impl;

import com.hau.blogService.converter.StringConverter;
import com.hau.blogService.dto.request.BlogRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.BlogResponse;
import com.hau.blogService.dto.response.PageResult;
import com.hau.blogService.entity.Blog;
import com.hau.blogService.exception.AppException;
import com.hau.blogService.mapper.BlogMapper;
import com.hau.blogService.repository.BlogRepository;
import com.hau.blogService.repository.FileServiceClientRepository;
import com.hau.blogService.service.BlogService;
import com.hau.blogService.service.FileUploadService;
import com.hau.blogService.service.SlugService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final FileUploadService fileUploadService;
    private final BlogMapper blogMapper;
    private final SlugService slugService;
    private final FileServiceClientRepository fileServiceClientRepository;


    @Transactional
    @Override
    public ApiResponse<BlogResponse> createBlog(BlogRequest request, MultipartFile thumbnail) {
        if(thumbnail == null || thumbnail.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Thumbnail không được để trống", null);
        }
        Blog blog = blogMapper.toBlog(request);

        String thumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "blog/thumbnails");
        blog.setThumbnail(thumbnailUrl);
        blog.setSlug(StringConverter.toSlug(blog.getTitle()));
        Blog savedBlog = blogRepository.save(blog);
        blog.setSlug(slugService.generateUniqueSlug(savedBlog.getTitle(), savedBlog.getId()));
        savedBlog = blogRepository.save(savedBlog);
        BlogResponse response = blogMapper.toBlogResponse(savedBlog);



        return ApiResponse.<BlogResponse>builder()
                .status(200)
                .message("Tạo blog thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public ApiResponse<BlogResponse> updateBlog(Long id, BlogRequest request, MultipartFile thumbnail) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy blog với id: " + id, null));

        if(thumbnail != null && !thumbnail.isEmpty()) {
            String thumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "blog/thumbnails");
            blog.setThumbnail(thumbnailUrl);
        }
        Blog updatedBlog = blogMapper.toBlogUpdateFromRequest(request, blog);
        blog.setSlug(slugService.generateUniqueSlug(updatedBlog.getTitle(), id));
        blogRepository.save(updatedBlog);
        BlogResponse response = blogMapper.toBlogResponse(updatedBlog);

        return ApiResponse.<BlogResponse>builder()
                .status(200)
                .message("Cập nhật blog thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public ApiResponse<Void> deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy blog với id: " + id, null));

        if (blog.getThumbnail() != null) {
            fileServiceClientRepository.deleteFile(blog.getThumbnail());
        } else
            throw new AppException(HttpStatus.NOT_FOUND, "Thumbnail của blog đang là null ", null);
        blogRepository.delete(blog);
        return ApiResponse.<Void>builder()
                .status(200)
                .message("Xóa blog thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public ApiResponse<BlogResponse> findById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy blog với id: " + id, null));
        BlogResponse response = blogMapper.toBlogResponse(blog);
        return ApiResponse.<BlogResponse>builder()
                .status(200)
                .message("Lấy thông tin blog thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public ApiResponse<PageResult<BlogResponse>> getAllBlogs(Integer pageIndex, Integer pageSize, String categoryId) {
        return null;
    }
}
