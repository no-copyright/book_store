package com.hau.customerService.controller;

import com.hau.customerService.dto.request.CustomerCareRequest;
import com.hau.customerService.dto.response.CustomerCareResponse;
import com.hau.customerService.dto.response.PageResult;
import com.hau.customerService.service.CustomerCareService;
import com.hau.customerService.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Builder
public class CustomerCareController {
    private final CustomerCareService customerCareService;

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResult<CustomerCareResponse>>> findAll(@RequestParam(required = false, defaultValue = "1") Integer pageIndex,
                                                                                 @RequestParam(required = false, defaultValue = "10") Integer pageSize,
                                                                                 @RequestParam(required = false) String sortDir) {
        ApiResponse<PageResult<CustomerCareResponse>> result = customerCareService.findAll(pageIndex, pageSize, sortDir);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerCareResponse>> findById(@PathVariable Long id) {
        ApiResponse<CustomerCareResponse> result = customerCareService.findById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerCareResponse>> createContact(@RequestBody @Valid CustomerCareRequest request) {
        ApiResponse<CustomerCareResponse> result = customerCareService.createContact(request);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @PostMapping("/seeding/{numberOfRecords}")
    public ResponseEntity<ApiResponse<String>> seeding(@PathVariable Integer numberOfRecords) {
        ApiResponse<String> response = customerCareService.seeding(numberOfRecords);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable Long id) {
        ApiResponse<Void> result = customerCareService.deleteContact(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
