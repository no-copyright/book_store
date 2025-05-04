package com.hau.cartservice.repository;

import com.hau.cartservice.entity.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartProductRepository extends JpaRepository<CartProduct, Integer> {
    Optional<CartProduct> findByCartIdAndProductId(Integer cartId, Integer productId);
}
