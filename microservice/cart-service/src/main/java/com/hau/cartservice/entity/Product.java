package com.hau.cartservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "products")
public class Product {
    @Id
    private Integer id;

    private String title;
    private String author;
    private Integer quantity;
    private Integer discount;
    private Integer price;
    private boolean active;

    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CartProduct> cartProducts;
}
