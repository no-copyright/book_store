package com.hau.categoryservice.service.impl;

import com.hau.event.dto.CategoryEvent;
import com.hau.categoryservice.dto.request.CategoryRequest;
import com.hau.categoryservice.dto.response.ApiResponse;
import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.categoryservice.dto.response.CategoryTreeResponse;

import com.hau.categoryservice.entity.Category;
import com.hau.categoryservice.exception.AppException;
import com.hau.categoryservice.mapper.CategoryMapper;
import com.hau.categoryservice.repository.CategoryRepository;
import com.hau.categoryservice.service.CategoryService;
import com.hau.categoryservice.service.SlugService;
import com.hau.categoryservice.service.eventProducer.CategoryEventProducer;
import com.hau.categoryservice.service.helper.CategoryHelper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final SlugService slugService;
    private final CategoryEventProducer categoryEventProducer;
//    private final KafkaTemplate<String, CategoryEvent> kafkaTemplate;


    public ApiResponse<List<CategoryResponse>> getAll(String name, Boolean isAsc) {
        List<Category> categories;

        if(name != null && !name.trim().isEmpty()) {
            categories = categoryRepository.findByNameContainingIgnoreCase(name);

            if (categories.isEmpty()) {
                throw new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục nào với tên: " + name, null);
            }

        } else {
            categories = categoryRepository.findAll();
        }

        List<CategoryResponse> flatList = categories.stream() // Stream directly from the List
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList());

        List<CategoryResponse> categoryTree = CategoryHelper.buildCategoryTree(flatList, isAsc);


        return ApiResponse.<List<CategoryResponse>>builder()
                .status(200)
                .message("Lấy danh sách danh mục thành công")
                .result(categoryTree)
                .timestamp(LocalDateTime.now())
                .build();
    }


    @Override
    public ApiResponse<CategoryTreeResponse> getById(Long parentId) {
        Category parent = categoryRepository.findById(parentId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục cha", null));

        List<Category> categories = categoryRepository.findByParentId(parentId);
        List<CategoryResponse> children = categories.stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();

        CategoryTreeResponse data = new CategoryTreeResponse();
        data.setParent(categoryMapper.toCategoryResponse(parent));
        data.setChildren(children);

        return ApiResponse.<CategoryTreeResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách danh mục con thành công")
                .result(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    @Override
    public ApiResponse<CategoryResponse> create(CategoryRequest request) {
        Category category = categoryMapper.toCategory(request);
        if(request.getParentId() != null) {
            categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục cha", null));
        }
        Category savedCategory = categoryRepository.save(category);
        String slug = slugService.generateUniqueSlug(savedCategory.getName(), savedCategory.getId());
        savedCategory.setSlug(slug);
        savedCategory = categoryRepository.save(savedCategory);
        CategoryResponse response = categoryMapper.toCategoryResponse(savedCategory);

        CategoryEvent createdEvent = CategoryEvent.builder()
                .type(CategoryEvent.TYPE_CREATED)
                .categoryId(savedCategory.getId())
                .data(response)
                .build();
        categoryEventProducer.sendCategoryCreatedEvent(createdEvent);
//        kafkaTemplate.send("category-event", createdEvent);
//        log.info("Sent message to Kafka {}", createdEvent);

        return ApiResponse.<CategoryResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo danh mục thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    @Override
    public ApiResponse<CategoryResponse> update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục", null));

        Category updatedCategory = categoryMapper.toCategoryUpdateFromRequest(request, category);
        if(request.getPriority() == null) {
            updatedCategory.setPriority(category.getPriority());
        }
        Category savedCategory = categoryRepository.save(updatedCategory);
        CategoryResponse response = categoryMapper.toCategoryResponse(savedCategory);

        CategoryEvent updatedEvent = CategoryEvent.builder()
                .type(CategoryEvent.TYPE_UPDATED)
                .categoryId(savedCategory.getId())
                .data(response)
                .build();
        categoryEventProducer.sendCategoryUpdatedEvent(updatedEvent);

        return ApiResponse.<CategoryResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật danh mục thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    @Override
    public ApiResponse<Void> delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy danh mục", null));

        CategoryEvent deletedEvent = CategoryEvent.builder()
                .type(CategoryEvent.TYPE_DELETED)
                .categoryId(id)
                .data(null)
                .build();
        categoryEventProducer.sendCategoryDeletedEvent(deletedEvent);

        categoryRepository.deleteByParentId(id);
        categoryRepository.delete(category);

        return ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa danh mục thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
