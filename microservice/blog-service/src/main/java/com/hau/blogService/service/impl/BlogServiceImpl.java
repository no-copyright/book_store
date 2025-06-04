package com.hau.blogService.service.impl;

import com.hau.blogService.converter.StringConverter;
import com.hau.blogService.dto.request.BlogRequest;
import com.hau.blogService.dto.request.BlogfilterRequest;
import com.hau.blogService.dto.response.ApiResponse;
import com.hau.blogService.dto.response.BlogResponse;
import com.hau.blogService.dto.response.PageResponse;
import com.hau.blogService.entity.Blog;
import com.hau.blogService.entity.Category;
import com.hau.blogService.exception.AppException;
import com.hau.blogService.mapper.BlogMapper;
import com.hau.blogService.repository.BlogRepository;
import com.hau.blogService.repository.CategoryRepository;
import com.hau.blogService.repository.FileServiceClientRepository;
import com.hau.blogService.service.BlogService;
import com.hau.blogService.service.FileUploadService;
import com.hau.blogService.service.SlugService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;

import java.util.List;


@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final FileUploadService fileUploadService;
    private final BlogMapper blogMapper;
    private final SlugService slugService;
    private final FileServiceClientRepository fileServiceClientRepository;
    private final CategoryRepository categoryRepository;

    @Value("${app.file.download-prefix}")
    private String fileServiceUrl;

    @Transactional
    @Override
    public ApiResponse<BlogResponse> createBlog(BlogRequest request, MultipartFile thumbnail) {
        if(thumbnail == null || thumbnail.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Thumbnail không được để trống", null);
        }
        Blog blog = blogMapper.toBlog(request);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với id: " + request.getCategoryId(), null));

        blog.setCategory(category);
        String thumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "blog/thumbnails");
        blog.setThumbnail(thumbnailUrl);
        blog.setSlug(StringConverter.toSlug(blog.getTitle()));
        Blog savedBlog = blogRepository.save(blog);
        blog.setSlug(slugService.generateUniqueSlug(savedBlog.getTitle(), savedBlog.getId()));
        savedBlog = blogRepository.save(savedBlog);
        BlogResponse response = blogMapper.toBlogResponse(savedBlog);



        return ApiResponse.<BlogResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo blog thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

//    @Transactional
//    @Override
//    public ApiResponse<BlogResponse> createBlog(BlogRequest request) throws IOException {
//        MultipartFile thumbnail = FileUtils.convertPathToMultipartFile(request.getThumbnail());
//
//        if(thumbnail.isEmpty()) {
//            throw new AppException(HttpStatus.BAD_REQUEST, "Thumbnail không được để trống", null);
//        }
//
//        Blog blog = blogMapper.toBlog(request);
//
//        Category category = categoryRepository.findById(request.getCategoryId())
//                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục với id: " + request.getCategoryId(), null));
//
//        blog.setCategory(category);
//        String thumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "blog/thumbnails");
//        blog.setThumbnail(thumbnailUrl);
//        blog.setSlug(StringConverter.toSlug(blog.getTitle()));
//        Blog savedBlog = blogRepository.save(blog);
//        blog.setSlug(slugService.generateUniqueSlug(savedBlog.getTitle(), savedBlog.getId()));
//        savedBlog = blogRepository.save(savedBlog);
//        BlogResponse response = blogMapper.toBlogResponse(savedBlog);
//
//
//
//        return ApiResponse.<BlogResponse>builder()
//                .status(HttpStatus.CREATED.value())
//                .message("Tạo blog thành công")
//                .result(response)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }

    @Transactional
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
                .status(HttpStatus.OK.value())
                .message("Cập nhật blog thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

//    @Transactional
//    @Override
//    public ApiResponse<BlogResponse> updateBlog(Long id, BlogRequest request) throws IOException {
//        Blog blog = blogRepository.findById(id)
//                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy blog với id: " + id, null));
//
//        MultipartFile thumbnail = FileUtils.convertPathToMultipartFile(request.getThumbnail());
//
//        if(!thumbnail.isEmpty()) {
//            String thumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "blog/thumbnails");
//            blog.setThumbnail(thumbnailUrl);
//        }
//        Blog updatedBlog = blogMapper.toBlogUpdateFromRequest(request, blog);
//        blog.setSlug(slugService.generateUniqueSlug(updatedBlog.getTitle(), id));
//        blogRepository.save(updatedBlog);
//        BlogResponse response = blogMapper.toBlogResponse(updatedBlog);
//
//        return ApiResponse.<BlogResponse>builder()
//                .status(HttpStatus.OK.value())
//                .message("Cập nhật blog thành công")
//                .result(response)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }

    @Transactional
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
                .status(HttpStatus.OK.value())
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
        response.setThumbnail(fileServiceUrl + blog.getThumbnail());
        response.setCategoryId(blog.getCategory().getId());
        return ApiResponse.<BlogResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin blog thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public ApiResponse<PageResponse<BlogResponse>> getAllBlogs(BlogfilterRequest filterRequest ,Integer pageIndex, Integer pageSize) {
        if(pageIndex <= 0) {
            pageIndex = 0;
        } else {
            pageIndex = pageIndex - 1;
        }
        Sort sort = Sort.by("createdAt");
        if ("desc".equalsIgnoreCase(filterRequest.getSortDirection())) {
            sort = sort.descending();
        } else if ("asc".equalsIgnoreCase(filterRequest.getSortDirection())) {
            sort = sort.ascending();
        }

        Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);

        Long categoryId = null;
        try {
            if (filterRequest.getCategoryId() != null) {
                categoryId = Long.parseLong(filterRequest.getCategoryId());
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid categoryId");
        }

        Page<Blog> blogPage = blogRepository.findByFilters(filterRequest.getTitle(), categoryId, pageable);

        List<BlogResponse> responses = blogPage.getContent().stream()
                .map(blog -> {
                    BlogResponse res = blogMapper.toBlogResponse(blog);
                    res.setThumbnail(fileServiceUrl + res.getThumbnail());
                    return res;
                }).toList();



        PageResponse<BlogResponse> pageResponse = PageResponse.<BlogResponse>builder()
                .data(responses)
                .currentPage(blogPage.getNumber() + 1)
                .pageSize(blogPage.getSize())
                .totalPages(blogPage.getTotalPages())
                .totalElements(blogPage.getTotalElements())
                .build();

        return ApiResponse.<PageResponse<BlogResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách blog thành công")
                .result(pageResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
