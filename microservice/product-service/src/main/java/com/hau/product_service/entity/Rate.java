package com.hau.product_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rates")
public class Rate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private int vote;
    private String comment;
    @ManyToOne
    @JoinColumn(name = "productId", referencedColumnName = "id")
    private Product product;
    @CreationTimestamp
    LocalDateTime createdAt;
}
