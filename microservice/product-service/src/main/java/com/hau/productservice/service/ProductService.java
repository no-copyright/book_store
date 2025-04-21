package com.hau.productservice.service;

import com.hau.productservice.converter.StringConverter;
import com.hau.productservice.dto.request.ProductRequest;
import com.hau.productservice.dto.response.ApiResponse;
import com.hau.productservice.dto.response.ProductResponse;
import com.hau.productservice.entity.Product;
import com.hau.productservice.exception.AppException;
import com.hau.productservice.mapper.ProductMapper;
import com.hau.productservice.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ApiResponse<List<ProductResponse>> getAllProduct(Integer pageIndex, Integer pageSize) {
        List<Product> products = productRepository.findAll();
        List<ProductResponse> productResponses = products.stream()
                .map(productMapper::toProductResponse)
                .toList();

        return ApiResponse.<List<ProductResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách sản phẩm thành công")
                .result(productResponses)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Transactional
    public ApiResponse<ProductResponse> createProduct(ProductRequest request) {
        Product product = productMapper.toProduct(request);
        product.setActive(true);
        product.setSlug(StringConverter.toSlug(product.getTitle()));

        Product savedProduct = productRepository.save(product);

        boolean isDuplicate = productRepository.existsByTitle(product.getTitle());
        savedProduct.setSlug(generateUniqueSlug(product.getTitle(), savedProduct.getId(), isDuplicate));

        savedProduct = productRepository.save(savedProduct);

        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm sản phẩm thành công")
                .result(productMapper.toProductResponse(savedProduct))
                .timestamp(LocalDateTime.now())
                .build();
    }


    @Transactional
    public ApiResponse<ProductResponse> updateProduct(ProductRequest request, Long id) {
        productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));

        Product product = productMapper.toProduct(request);
        product.setId(id); // rất quan trọng khi update
        product.setSlug(StringConverter.toSlug(product.getTitle()));

        Product savedProduct = productRepository.save(product);

        boolean isDuplicate = productRepository.existsByTitle(product.getTitle());
        savedProduct.setSlug(generateUniqueSlug(product.getTitle(), savedProduct.getId(), isDuplicate));

        savedProduct = productRepository.save(savedProduct);

        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật sản phẩm thành công")
                .result(productMapper.toProductResponse(savedProduct))
                .timestamp(LocalDateTime.now())
                .build();
    }


    public ApiResponse<ProductResponse> deleteProduct(ProductRequest request) {
        Product product = productMapper.toProduct(request);
        product.setActive(false);
        Product savedProduct = productRepository.save(product);
        ProductResponse productResponse = productMapper.toProductResponse(savedProduct);
        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa sản phẩm thành công")
                .result(productResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }


    private String generateUniqueSlug(String title, Long productId, boolean isDuplicate) {
        String baseSlug = StringConverter.toSlug(title);
        return isDuplicate ? baseSlug + "-" + productId : baseSlug;
    }

}
