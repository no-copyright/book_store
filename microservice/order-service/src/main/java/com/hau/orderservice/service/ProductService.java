package com.hau.orderservice.service;

import com.hau.event.dto.ProductEvent;
import com.hau.orderservice.entity.Product;
import com.hau.orderservice.exception.AppException;
import com.hau.orderservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public void saveProduct(ProductEvent productEvent) {
        Product product = Product.builder()
                .id(productEvent.getId())
                .discount(productEvent.getDiscount())
                .price(productEvent.getPrice())
                .quantity(productEvent.getQuantity())
                .title(productEvent.getTitle())
                .build();
        productRepository.save(product);
    }

    public void updateProduct(ProductEvent productEvent) {
        Product product = productRepository.findById(productEvent.getId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));
        product.setQuantity(productEvent.getQuantity());
        product.setDiscount(productEvent.getDiscount());
        product.setPrice(productEvent.getPrice());
        product.setTitle(productEvent.getTitle());
        productRepository.save(product);

    }
}
