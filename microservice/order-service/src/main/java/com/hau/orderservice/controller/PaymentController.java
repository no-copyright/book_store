package com.hau.orderservice.controller;

import com.hau.event.dto.PaymentCreateEvent;
import com.hau.orderservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class PaymentController {
    private final OrderService orderService;

    @KafkaListener(topics = "payment-create-topic")
    public void handlePaymentCreateEvent(PaymentCreateEvent paymentCreateEvent) {
        log.info("Received PaymentCreateEvent: {}", paymentCreateEvent);
        orderService.updatePaymentStatus(paymentCreateEvent);
    }
}
