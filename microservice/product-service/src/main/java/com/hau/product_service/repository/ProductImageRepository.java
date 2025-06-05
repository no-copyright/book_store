package com.hau.product_service.repository;

import com.hau.product_service.dto.response.PageResponse;
import com.hau.product_service.entity.Product;
import com.hau.product_service.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    void deleteByProductId(Long id);
    Optional<List<ProductImage>> findByProductId(Long productId);

}
