package com.hau.categoryservice.controller;

import com.hau.event.dto.CategoryEvent;
import com.hau.categoryservice.dto.request.CategoryRequest;
import com.hau.categoryservice.dto.response.ApiResponse;
import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.categoryservice.dto.response.CategoryTreeResponse;
import com.hau.categoryservice.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CategoryController {
    private final CategoryService categoryService;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(@RequestParam(required = false) String name,
                                                                                @RequestParam(required = false) Boolean isAsc) {
        // Mock implementation
        ApiResponse<List<CategoryResponse>> response = categoryService.getAll(name, isAsc);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryTreeResponse>> getCategoryById(@PathVariable Long id) {
        // Mock implementation
        ApiResponse<CategoryTreeResponse> response = categoryService.getById(id);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody @Valid CategoryRequest request) {
        // Mock implementation
        ApiResponse<CategoryResponse> response = categoryService.create(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryRequest request) {
        // Mock implementation
        ApiResponse<CategoryResponse> response = categoryService.update(id, request);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        // Mock implementation
        ApiResponse<Void> response = categoryService.delete(id);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/send/")
    public void sendCategoryEvent() {
        String str = "Hello, this is a test message!";
        kafkaTemplate.send("xam-lon-event", str);
        log.info("Sent message to Kafka topic: xam-lon-event {}", str);
    }
}
