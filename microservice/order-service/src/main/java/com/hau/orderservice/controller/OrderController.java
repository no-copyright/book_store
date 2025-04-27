package com.hau.orderservice.controller;

import com.hau.orderservice.dto.ApiResponse;
import com.hau.orderservice.dto.OrderCreateRequest;
import com.hau.orderservice.dto.OrderResponse;
import com.hau.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderCreateRequest orderCreateRequest){
        ApiResponse<OrderResponse> apiResponse = orderService.createOrder(orderCreateRequest);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        ApiResponse<OrderResponse> apiResponse = orderService.getOrderById(orderId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }


}
