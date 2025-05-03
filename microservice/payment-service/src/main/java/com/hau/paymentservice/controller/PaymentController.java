package com.hau.paymentservice.controller;

import com.hau.paymentservice.dto.ApiResponse;
import com.hau.paymentservice.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<String>> payWithVNPay(
            @PathVariable Long orderId, HttpServletRequest request,
            @RequestParam(value = "bankCode", required = false) String bankCode) {
        String paymentURL = paymentService.createPaymentUrl(orderId, request, bankCode);
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Tạo URL thanh toán thành công")
                .result(paymentURL)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/vnpay_return")
    public ResponseEntity<?> vnPayReturn(HttpServletRequest request) {
        paymentService.processVnPayReturn(request);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("http://localhost:3000/account?paymentStatus=success")); // Set URL chuyển hướng

        return new ResponseEntity<>(headers, HttpStatus.FOUND); // 302 FOUND
    }
}
