package com.hau.product_service.repository;

import com.hau.product_service.dto.request.ProductFilter;
import com.hau.product_service.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
    SELECT p FROM Product p 
    WHERE (:#{#filter.title} IS NULL OR p.title ILIKE CONCAT('%', :#{#filter.title}, '%'))
      AND (:#{#filter.author} IS NULL OR p.author ILIKE CONCAT('%', :#{#filter.author}, '%'))
      AND (:#{#filter.priceFrom} IS NULL OR p.price >= :#{#filter.priceFrom})
      AND (:#{#filter.priceTo} IS NULL OR p.price <= :#{#filter.priceTo})
""")
    Page<Product> findAllByFilter(@Param("filter") ProductFilter filter, Pageable pageable);
}
