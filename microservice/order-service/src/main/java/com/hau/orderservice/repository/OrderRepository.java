package com.hau.orderservice.repository;

import com.hau.orderservice.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findAllByUserId(Integer userId, Pageable pageable);
    Optional<Order> findByIdAndUserId(Long id, Integer userId);
}
