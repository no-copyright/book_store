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

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "1", required = false) int pageIndex,
            @RequestParam(defaultValue = "10", required = false) int pageSize,
            @RequestParam(required = false) String createdAt,
            @RequestParam(required = false) Integer paymentStatus,
            @RequestParam(required = false) Integer paymentMethod
    ) {
        ApiResponse<PageResponse<OrderResponse>> apiResponse = orderService.getAllOrders(pageIndex, pageSize, createdAt, paymentStatus, paymentMethod);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByIdForAdmin(@PathVariable Long orderId) {
        ApiResponse<OrderResponse> apiResponse = orderService.getOrderById(orderId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
            @RequestParam(defaultValue = "1", required = false) int pageIndex,
            @RequestParam(defaultValue = "10", required = false) int pageSize
    ) {
        ApiResponse<PageResponse<OrderResponse>> apiResponse = orderService.getOrdersByUserId(pageIndex, pageSize);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/my-orders/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> getMyOrderById(@PathVariable Long orderId) {
        ApiResponse<OrderResponse> apiResponse = orderService.getOrderByIdForUser(orderId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("{orderId}/cancer")
    public ResponseEntity<ApiResponse<String>> cancerOrder(@PathVariable Long orderId, @RequestBody CancerOrderRequest cancerOrderRequest) {
        ApiResponse<String> apiResponse = orderService.cancerOrder(orderId, cancerOrderRequest);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PatchMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@Valid @PathVariable Long orderId, @RequestBody OrderUpdateStatus orderUpdateStatus) {
        ApiResponse<OrderResponse> apiResponse = orderService.updateOrderStatus(orderUpdateStatus, orderId);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }
}
