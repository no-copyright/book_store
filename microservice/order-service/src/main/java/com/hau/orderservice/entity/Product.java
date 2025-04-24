package com.hau.orderservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@Getter
@Setter
public class Product {
    @Id
    private Integer id;
    private String title;
    private Integer quantity;
    private Integer discount;
    private Integer price;
    private boolean active;
}
