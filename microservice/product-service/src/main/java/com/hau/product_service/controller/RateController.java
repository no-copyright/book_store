package com.hau.product_service.controller;

import com.hau.product_service.dto.request.RateRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResult;
import com.hau.product_service.dto.response.RateResponse;
import com.hau.product_service.service.RateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class RateController {
    private final RateService rateService;

    @GetMapping("/rate")
    public ResponseEntity<ApiResponse<PageResult<RateResponse>>> getAllRate(@RequestParam(required = false, defaultValue = "1")  Integer pageIndex,
                                                                            @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        ApiResponse<PageResult<RateResponse>> response = rateService.getAllRate(pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/rate/{id}")
    public ResponseEntity<ApiResponse<RateResponse>> getRateById(@PathVariable Long id) {
        ApiResponse<RateResponse> response = rateService.getRateById(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/rate/product/{productId}")
    public ResponseEntity<ApiResponse<PageResult<RateResponse>>> getRateByProductId(@PathVariable Long productId,
                                                                                     @RequestParam(required = false, defaultValue = "1") Integer pageIndex,
                                                                                     @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        ApiResponse<PageResult<RateResponse>> response = rateService.getRateByProductId(productId, pageIndex, pageSize);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/rate")
    public ResponseEntity<ApiResponse<RateResponse>> createRate(@RequestBody @Valid RateRequest request) {
        ApiResponse<RateResponse> response = rateService.createRate(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/rate/{id}")
    public ResponseEntity<ApiResponse<RateResponse>> deleteRate(@PathVariable Long id) {
        ApiResponse<RateResponse> response = rateService.removeRate(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}
