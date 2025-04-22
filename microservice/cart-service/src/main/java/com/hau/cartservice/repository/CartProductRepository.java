package com.hau.cartservice.repository;

import com.hau.cartservice.entity.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {
}
