package com.hau.paymentservice.controller;

import com.hau.event.dto.OrderCreateEvent;
import com.hau.paymentservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j

public class OrderController {
    private final OrderService orderService;

    @KafkaListener(topics = "order-create-topic")
    public void listenOrderTopic(OrderCreateEvent orderCreateEvent) {
        log.info("Received message: {}", orderCreateEvent);
        orderService.createOrder(orderCreateEvent);
    }
}
