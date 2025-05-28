package com.hau.customerService.service;

import com.github.javafaker.Faker;
import com.hau.customerService.dto.request.CustomerCareRequest;
import com.hau.customerService.dto.response.CustomerCareResponse;
import com.hau.customerService.dto.response.PageResponse;

import com.hau.customerService.entity.CustomerCare;
import com.hau.customerService.exception.AppException;
import com.hau.customerService.mapper.CustomerCareMapper;
import com.hau.customerService.repository.CustomerCareRepository;
import com.hau.customerService.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CustomerCareService {
    private final CustomerCareRepository customerCareRepository;
    private final CustomerCareMapper customerCareMapper;

    public ApiResponse<PageResponse<CustomerCareResponse>> findAll(Integer pageIndex, Integer pageSize, String sortDir) {
        int page = (pageIndex == null || pageIndex <= 1) ? 0 : pageIndex - 1;

        Sort sort;
        if (sortDir != null && !sortDir.isEmpty()) {
            Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(direction, "createdAt");
        } else {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<CustomerCare> customerCarePage = customerCareRepository.findAll(pageable);
        List<CustomerCareResponse> responses = customerCarePage.getContent().stream()
                .map(customerCareMapper::toCustomerCareResponse)
                .toList();

        PageResponse<CustomerCareResponse> result = PageResponse.<CustomerCareResponse>builder()
                .data(responses)
                .currentPage(customerCarePage.getNumber() + 1)
                .pageSize(customerCarePage.getSize())
                .totalPages(customerCarePage.getTotalPages())
                .totalElements(customerCarePage.getTotalElements())
                .build();

        return ApiResponse.<PageResponse<CustomerCareResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách liên hệ thành công")
                .result(result)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<CustomerCareResponse> findById(Long id) {
        CustomerCare customerCare = customerCareRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy liên hệ", "id = " + id));
        CustomerCareResponse response = customerCareMapper.toCustomerCareResponse(customerCare);
        return ApiResponse.<CustomerCareResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin liên hệ thành công")
                .result(response)
                .build();
    }

    public ApiResponse<CustomerCareResponse> createContact(CustomerCareRequest request) {
        CustomerCare customerCare = customerCareMapper.toCustomerCare(request);
        customerCareRepository.save(customerCare);
        CustomerCareResponse response = customerCareMapper.toCustomerCareResponse(customerCare);
        return ApiResponse.<CustomerCareResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo liên hệ thành công")
                .result(response)
                .build();
    }

    public ApiResponse<Void> deleteContact(Long id) {
        customerCareRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy liên hệ", "id = " + id));
        customerCareRepository.deleteById(id);
        return ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa liên hệ thành công")
                .build();
    }

    public ApiResponse<String> seeding(Integer numberOfRecords) {
        Faker faker = new com.github.javafaker.Faker();
        for (int i = 0; i < numberOfRecords; i++) {
            CustomerCare customerCare = new CustomerCare();
            customerCare.setName(faker.name().fullName());
            customerCare.setPhone(faker.phoneNumber().cellPhone());
            customerCare.setEmail(faker.internet().emailAddress());
            customerCare.setAddress(faker.address().fullAddress());
            customerCare.setContent(faker.lorem().sentence());
            customerCareRepository.save(customerCare);
        }
        return ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Seeding thành công " + numberOfRecords + " bản ghi!")
                .result("OK")
                .build();
    }
}
