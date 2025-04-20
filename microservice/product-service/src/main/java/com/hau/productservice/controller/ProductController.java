package com.hau.productservice.controller;

import com.hau.productservice.entity.Product;
import com.hau.productservice.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProduct(@RequestParam(required = false) Integer pageIndex,
                                       @RequestParam(required = false) Integer pageSize) {
        return productService.getAllProduct(pageIndex, pageSize);
    }
}
