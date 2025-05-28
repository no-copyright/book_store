package com.hau.product_service.repository;

import com.hau.product_service.dto.request.ProductFilter;
import com.hau.product_service.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
    SELECT DISTINCT p FROM Product p
    JOIN p.categories c
    WHERE (:#{#filter.title} IS NULL OR p.title ILIKE CONCAT('%', :#{#filter.title}, '%'))
      AND (:#{#filter.author} IS NULL OR p.author ILIKE CONCAT('%', :#{#filter.author}, '%'))
      AND (:#{#filter.priceFrom} IS NULL OR p.discount >= :#{#filter.priceFrom})
      AND (:#{#filter.priceTo} IS NULL OR p.discount <= :#{#filter.priceTo})
      AND (:categoryIds IS NULL OR c.id IN (:categoryIds))
      AND (:#{#filter.averageRateFrom} IS NULL OR p.averageRate >= :#{#filter.averageRateFrom})
""")
    Page<Product> findAllByFilter(@Param("filter") ProductFilter filter,
                                  @Param("categoryIds") List<Long> categoryIds,
                                  Pageable pageable);

    @Query("""
    SELECT DISTINCT p FROM Product p
    JOIN p.categories c
    WHERE (:#{#filter.title} IS NULL OR p.title ILIKE CONCAT('%', :#{#filter.title}, '%'))
      AND (:#{#filter.author} IS NULL OR p.author ILIKE CONCAT('%', :#{#filter.author}, '%'))
      AND (:#{#filter.priceFrom} IS NULL OR p.price >= :#{#filter.priceFrom})
      AND (:#{#filter.priceTo} IS NULL OR p.price <= :#{#filter.priceTo})
      AND (:categoryIds IS NULL OR c.id IN (:categoryIds))
      AND (:#{#filter.averageRateFrom} IS NULL OR p.averageRate >= :#{#filter.averageRateFrom})
      AND (p.active = :active OR :active IS NULL)
""")
    Page<Product> findAllByActiveStatus(@Param("filter") ProductFilter filter,
                                      @Param("categoryIds") List<Long> categoryIds,
                                      Pageable pageable, @Param("active") Boolean active);


    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.discountPercent DESC LIMIT 10 ")
    List<Product> getTopTenBestDiscountProduct();


    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.averageRate DESC LIMIT 10")
    List<Product> getTopTenBestAverageRateProduct();
}
