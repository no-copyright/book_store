package com.hau.paymentservice.controller;

import com.hau.paymentservice.dto.ApiResponse;
import com.hau.paymentservice.dto.MomoResponse;
import com.hau.paymentservice.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/momo/{orderId}")
    public ResponseEntity<ApiResponse<MomoResponse>> payWithMomo(@PathVariable Long orderId) {
        MomoResponse momoResponse = paymentService.createMomoQR(orderId);
        return ResponseEntity.ok(ApiResponse.<MomoResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Tạo QR thanh toán Momo thành công")
                .result(momoResponse)
                .timestamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/momo_return")
    public ResponseEntity<?> momoReturn(HttpServletRequest request) {
        paymentService.processMomoReturn(request);
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create("http://localhost:3000"));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/vnpay/{orderId}")
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
        headers.setLocation(URI.create("http://localhost:3000"));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
