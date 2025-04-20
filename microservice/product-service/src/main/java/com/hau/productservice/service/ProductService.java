package com.hau.productservice.service;

import com.hau.productservice.dto.response.ApiResponse;
import com.hau.productservice.dto.response.ProductResponse;
import com.hau.productservice.entity.Product;
import com.hau.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProduct(Integer pageIndex, Integer pageSize) {
        List<Product> products = productRepository.findAll();
        return products;
    }
}
