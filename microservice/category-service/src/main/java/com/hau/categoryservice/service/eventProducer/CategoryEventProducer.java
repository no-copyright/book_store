package com.hau.categoryservice.service.eventProducer;


import com.hau.categoryservice.dto.response.CategoryResponse;
import com.hau.event.dto.CategoryEvent; // Import DTO sự kiện

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryEventProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryEventProducer.class);
//    private static final String TOPIC_CATEGORY_EVENTS = "category-event"; // Tên Topic Kafka
    private static final String TOPIC_CATEGORY_BLOG_EVENT = "category-blog-event";
    private static final String TOPIC_CATEGORY_PRODUCT_EVENT = "category-product-event";
    private final KafkaTemplate<String, CategoryEvent> kafkaTemplate;

    public void sendCategoryEvent(CategoryEvent event) {
        CategoryResponse response = (CategoryResponse) event.getData();
        if(response.getType().equals("PRODUCT")){
            kafkaTemplate.send(TOPIC_CATEGORY_PRODUCT_EVENT, event);
        } else {
            kafkaTemplate.send(TOPIC_CATEGORY_BLOG_EVENT, event);
        }
    }

    public void sendCategoryCreatedEvent(CategoryEvent event) {
        LOGGER.info("Sending Category Created Event for ID: {} with data:{}", event.getCategoryId(), event.getData());
        sendCategoryEvent(event);
    }

    public void sendCategoryUpdatedEvent(CategoryEvent event) {
        LOGGER.info("Sending Category Updated Event for ID: {} with data:{}", event.getCategoryId(), event.getData());
        sendCategoryEvent(event);
    }

    public void sendCategoryDeletedEvent(CategoryEvent event) {
        LOGGER.info("Sending Category Deleted Event for ID: {}", event.getCategoryId());
        sendCategoryEvent(event);
    }
}
