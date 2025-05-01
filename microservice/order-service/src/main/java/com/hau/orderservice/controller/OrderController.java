package com.hau.orderservice.controller;

import com.hau.orderservice.dto.*;
import com.hau.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderCreateRequest orderCreateRequest) {
        ApiResponse<OrderResponse> apiResponse = orderService.createOrder(orderCreateRequest);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or @orderService.isOwnerOfUser(#userId, authentication)")
    @GetMapping("/{orderId}/user/{userId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId, @PathVariable Integer userId) {
        ApiResponse<OrderResponse> apiResponse = orderService.getOrderById(orderId, userId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or @orderService.isOwnerOfUser(#userId, authentication)")
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrdersByUserId(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "1") int pageIndex,
            @RequestParam(defaultValue = "10") int pageSize) {
        ApiResponse<PageResponse<OrderResponse>> apiResponse = orderService.getAllOrders(pageIndex, pageSize, userId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("{orderId}/cancer")
    public ResponseEntity<ApiResponse<String>> cancerOrder(@PathVariable Long orderId, @RequestBody CancerOrderRequest cancerOrderRequest) {
        ApiResponse<String> apiResponse = orderService.cancerOrder(orderId, cancerOrderRequest);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@Valid @PathVariable Long orderId, @RequestBody OrderUpdateStatus orderUpdateStatus) {
        ApiResponse<OrderResponse> apiResponse = orderService.updateOrderStatus(orderUpdateStatus, orderId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
