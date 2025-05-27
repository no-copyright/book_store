package com.hau.product_service.service;

import com.hau.product_service.dto.request.RateRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResponse;
import com.hau.product_service.dto.response.RateResponse;
import com.hau.product_service.entity.Product;
import com.hau.product_service.entity.Rate;
import com.hau.product_service.entity.User;
import com.hau.product_service.exception.AppException;
import com.hau.product_service.mapper.RateMapper;
import com.hau.product_service.repository.ProductRepository;
import com.hau.product_service.repository.RateRepository;
import com.hau.product_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RateService {
    private final RateRepository rateRepository;
    private final RateMapper rateMapper;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ApiResponse<PageResponse<RateResponse>> getAllRate(Integer pageIndex, Integer pageSize) {
        int page = (pageIndex == null || pageIndex <= 1) ? 0 : pageIndex - 1;
        Pageable pageable = PageRequest.of(page, pageSize);

        Page<Rate> rates = rateRepository.findAll(pageable);

        List<RateResponse> rateResponses = rates.getContent().stream()
                .map(rateMapper::toRateResponse)
                .toList();

        PageResponse<RateResponse> result = PageResponse.<RateResponse>builder()
                .data(rateResponses)
                .currentPage(rates.getNumber() + 1)
                .pageSize(rates.getSize())
                .totalPages(rates.getTotalPages())
                .totalElements(rates.getTotalElements())
                .build();


        return ApiResponse.<PageResponse<RateResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Get all rates successfully")
                .result(result)
                .build();
    }

    public ApiResponse<RateResponse> getRateById(Long id) {
        Rate rate = rateRepository.findById(id).orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đánh giá ", "id = " + id));
        RateResponse rateResponse = rateMapper.toRateResponse(rate);
        return ApiResponse.<RateResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy đánh giá thành công")
                .result(rateResponse)
                .build();
    }

    public ApiResponse<PageResponse<RateResponse>> getRateByProductId(Long productId, Integer pageIndex, Integer pageSize) {
        int page = (pageIndex == null || pageIndex <= 1) ? 0 : pageIndex - 1;
        Pageable pageable = PageRequest.of(page, pageSize);

        Page<Rate> rates = rateRepository.findAllByProductId(productId, pageable);

        List<RateResponse> rateResponses = rates.getContent().stream()
                .map(rateMapper::toRateResponse)
                .toList();

        PageResponse<RateResponse> result = PageResponse.<RateResponse>builder()
                .data(rateResponses)
                .currentPage(rates.getNumber() + 1)
                .pageSize(rates.getSize())
                .totalPages(rates.getTotalPages())
                .totalElements(rates.getTotalElements())
                .build();

        return ApiResponse.<PageResponse<RateResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy đánh giá thành công")
                .result(result)
                .build();
    }

    @Transactional
    public ApiResponse<RateResponse> createRate(RateRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm", "id = " + request.getProductId()));
        Integer userId = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        User user =  userRepository.findById(userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng", "id = " + userId));
        Rate newRate = rateMapper.toRate(request);

        newRate.setProduct(product);
        newRate.setUser(user);
        Rate savedRate = rateRepository.save(newRate);
        Float averageRate = calculateAverageRate(newRate.getProduct().getId());
        product.setAverageRate(averageRate);
        productRepository.save(product);

        RateResponse rateResponse = rateMapper.toRateResponse(savedRate);

        return ApiResponse.<RateResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo đánh giá thành công")
                .result(rateResponse)
                .build();
    }

    @Transactional
    public ApiResponse<RateResponse> removeRate(Long id) {
        Rate rate = rateRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đánh giá", "id = " + id));
        rateRepository.delete(rate);
        Product product = rate.getProduct();
        Float averageRate = calculateAverageRate(product.getId());
        product.setAverageRate(averageRate);
        productRepository.save(product);
        return ApiResponse.<RateResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa đánh giá thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public Float calculateAverageRate(Long productId) {
        List<Rate> rates = rateRepository.findAllByProductId(productId);

        float totalRate = 0f;
        for (Rate rate : rates) {
            totalRate += rate.getVote();
        }
        return Float.valueOf(String.format("%.1f", totalRate / rates.size())) ;
    }

}
