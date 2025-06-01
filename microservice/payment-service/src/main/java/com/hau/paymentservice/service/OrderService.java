package com.hau.paymentservice.service;

import com.hau.event.dto.OrderCreateEvent;
import com.hau.paymentservice.entity.Order;
import com.hau.paymentservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;

    public void createOrder(OrderCreateEvent orderCreateEvent) {
        Order order = Order.builder()
                .id(orderCreateEvent.getOrderId())
                .userId(orderCreateEvent.getUserId())
                .totalPrice(orderCreateEvent.getTotalPrice())
                .paymentMethod(orderCreateEvent.getPaymentMethod())
                .paymentStatus(orderCreateEvent.getPaymentStatus())
                .build();
        orderRepository.save(order);
    }
}
