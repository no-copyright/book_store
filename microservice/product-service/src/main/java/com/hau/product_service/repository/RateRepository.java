package com.hau.product_service.repository;


import com.hau.product_service.entity.Rate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RateRepository extends JpaRepository<Rate, Long> {
    Page<Rate> findAllByProductId(Long productId, Pageable pageable);
    List<Rate> findAllByProductId(Long productId);
}
