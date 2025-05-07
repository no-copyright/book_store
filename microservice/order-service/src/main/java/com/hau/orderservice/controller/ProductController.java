package com.hau.orderservice.controller;

import com.hau.event.dto.ProductEvent;
import com.hau.orderservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProductController {
    private final ProductService productService;

    @KafkaListener(topics = "product-create-topic")
    public void consumeProductCreateEvent(ProductEvent message) {
        log.info("Received message from product-create-topic: {}", message);
        productService.saveProduct(message);
    }

    @KafkaListener(topics = "product-update-topic")
    public void consumeProductUpdateEvent(ProductEvent message) {
        log.info("Received message from product-update-topic: {}", message);
        productService.updateProduct(message);
    }
}
