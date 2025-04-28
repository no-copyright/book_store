package com.hau.categoryservice.service.eventProducer;


import com.hau.categoryservice.dto.event.CategoryEvent; // Import DTO sự kiện

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.kafka.support.SendResult;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class CategoryEventProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryEventProducer.class);
    private static final String TOPIC_CATEGORY_EVENTS = "category-events"; // Tên Topic Kafka

    private final KafkaTemplate<String, CategoryEvent> kafkaTemplate;

    /**
     * Gửi một sự kiện Category chung đến Kafka
     * @param event Đối tượng CategoryEvent
     */
    public void sendCategoryEvent(CategoryEvent event) {
        String key = event.getCategoryId().toString(); // Key có thể null nếu categoryId chưa có (ví dụ ngay sau khi save lần đầu)

        CompletableFuture<SendResult<String, CategoryEvent>> future = kafkaTemplate.send(TOPIC_CATEGORY_EVENTS, key, event);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                LOGGER.info("Sent event=[{}] with key={} and offset={}", event, key, result.getRecordMetadata().offset());
            } else {
                LOGGER.error("Unable to send event=[{}] with key={} due to: {}", event, key, ex.getMessage());
            }
        });

        // LOGGER.info("Attempting to send Category Event: {}", event); // Có thể bỏ dòng này nếu callback đủ thông tin
    }

    // Các phương thức gửi cụ thể hơn (optional, có thể gọi sendCategoryEvent trực tiếp)
    public void sendCategoryCreatedEvent(CategoryEvent event) {
        LOGGER.info("Sending Category Created Event for ID: {}", event.getCategoryId());
        sendCategoryEvent(event);
    }

    public void sendCategoryUpdatedEvent(CategoryEvent event) {
        LOGGER.info("Sending Category Updated Event for ID: {}", event.getCategoryId());
        sendCategoryEvent(event);
    }

    public void sendCategoryDeletedEvent(CategoryEvent event) {
        LOGGER.info("Sending Category Deleted Event for ID: {}", event.getCategoryId());
        sendCategoryEvent(event);
    }
}
