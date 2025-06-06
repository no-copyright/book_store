package com.hau.product_service.service.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hau.product_service.dto.request.CategoryRequest;
import com.hau.product_service.dto.response.CategoryResponse;
import com.hau.event.dto.CategoryEvent;
import com.hau.product_service.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryEventConsumer {

    private static final String TOPIC_CATEGORY_PRODUCT_EVENT = "category-product-event";
    private final CategoryService categoryService;
    private final ObjectMapper objectMapper; // Inject ObjectMapper

    @KafkaListener(topics = TOPIC_CATEGORY_PRODUCT_EVENT)
    public void listen(CategoryEvent event) {
        log.info("Received Category Event: {}", event);

        try {
            switch (event.getType()) {
                case "CATEGORY_CREATED":
                    log.info("Handling Category Created event for ID: {}", event.getCategoryId());
                    if (event.getData() != null) {
                        CategoryResponse createdCategory = objectMapper.convertValue(event.getData(), CategoryResponse.class); // Sử dụng convertValue
                        CategoryRequest categoryRequest = convertToCategoryRequest(createdCategory);
                        categoryService.handleCategoryCreated(categoryRequest);
                    } else {
                        log.warn("Category Created event received with no data for ID: {}", event.getCategoryId());
                    }
                    break;

                case "CATEGORY_UPDATED":
                    log.info("Handling Category Updated event for ID: {}", event.getCategoryId());
                    if (event.getData() != null) {
                        CategoryResponse updatedCategory = objectMapper.convertValue(event.getData(), CategoryResponse.class); // Sử dụng convertValue
                        CategoryRequest updatedCategoryRequest = convertToCategoryRequest(updatedCategory);
                        categoryService.handleCategoryUpdated(updatedCategory.getId() ,updatedCategoryRequest);
                    } else {
                        log.warn("Category Updated event received with no data for ID: {}", event.getCategoryId());
                    }
                    break;
                case "CATEGORY_DELETED":
                    log.info("Handling Category Deleted event for ID: {}", event.getCategoryId());
                    categoryService.handleCategoryDeleted(event.getCategoryId());
                    break;

                default:
                    log.warn("Received unknown Category Event type: {}", event.getType());
            }

            if (event.getCategoryId() != null) { // Kiểm tra null cho categoryId trước khi log
                log.info("Successfully processed Category Event for ID: {}", event.getCategoryId());
            } else {
                log.info("Successfully processed Category Event (ID not provided in event)");
            }


        } catch (Exception e) {
            String eventIdLog = (event != null && event.getCategoryId() != null) ? event.getCategoryId().toString() : "N/A";
            log.error("Error processing Category Event for ID {}: {}", eventIdLog, e.getMessage(), e);
        }
    }


    private CategoryRequest convertToCategoryRequest(CategoryResponse category) {
        if (category == null) {
            return null;
        }
        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setId(category.getId());
        categoryRequest.setName(category.getName());
        categoryRequest.setSlug(category.getSlug());
        categoryRequest.setParentId(category.getParentId());
        return categoryRequest;
    }
}