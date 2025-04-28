package com.hau.blogService.service.event;

import com.hau.blogService.dto.event.CategoryEvent;

import com.hau.blogService.dto.request.CategoryRequest;
import com.hau.blogService.dto.response.CategoryResponse;

import com.hau.blogService.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryEventConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryEventConsumer.class);
    private static final String TOPIC_CATEGORY_EVENTS = "category-events"; // Tên Topic Kafka (phải giống Producer)
    private static final String GROUP_ID = "blog-service"; // Group ID (phải giống trong application.properties)

    private final CategoryService categoryService; // Inject BlogService để gọi xử lý logic nghiệp vụ
    /**
     * Listener nhận các loại thông điệp CategoryEvent từ topic category-events
     * @param event Đối tượng CategoryEvent nhận được
     */
    @KafkaListener(topics = TOPIC_CATEGORY_EVENTS, groupId = GROUP_ID)
    public void listen(CategoryEvent event) {
        LOGGER.info("Received Category Event: {}", event);

        try {
            switch (event.getType()) {
                case CategoryEvent.TYPE_CREATED:
                    LOGGER.info("Handling Category Created event for ID: {}", event.getCategoryId());
                    CategoryResponse createdCategory = (CategoryResponse) event.getData();
                    CategoryRequest categoryRequest = convertToCategoryRequest(createdCategory);

                     categoryService.handleCategoryCreated(categoryRequest);
                    break;

                case CategoryEvent.TYPE_UPDATED:
                    LOGGER.info("Handling Category Updated event for ID: {}", event.getCategoryId());
                    CategoryResponse updatedCategory = (CategoryResponse) event.getData();
                    CategoryRequest updatedCategoryRequest = convertToCategoryRequest(updatedCategory);
                    categoryService.handleCategoryUpdated(updatedCategory.getId() ,updatedCategoryRequest);
                    break;

                case CategoryEvent.TYPE_DELETED:
                    LOGGER.info("Handling Category Deleted event for ID: {}", event.getCategoryId());
                    categoryService.handleCategoryDeleted(event.getCategoryId());
                    break;

                default:
                    LOGGER.warn("Received unknown Category Event type: {}", event.getType());
                    // Có thể xử lý các loại sự kiện không mong muốn khác
            }

            LOGGER.info("Successfully processed Category Event for ID: {}", event.getCategoryId());

        } catch (Exception e) {
            LOGGER.error("Error processing Category Event for ID {}: {}", event.getCategoryId(), e.getMessage(), e);
            // Tùy thuộc vào yêu cầu, có thể cần xử lý lỗi nâng cao hơn:
            // - Retry lại thông điệp (Kafka tự hỗ trợ cấu hình retry)
            // - Gửi thông điệp lỗi đến Dead Letter Queue (DLQ)
            // - Cảnh báo (alerting)
        }
    }


    private CategoryRequest convertToCategoryRequest(CategoryResponse category) {
        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setId(category.getId());
        categoryRequest.setName(category.getName());
        categoryRequest.setSlug(category.getSlug());
        categoryRequest.setParentId(category.getParentId());
        return categoryRequest;
    }
}
