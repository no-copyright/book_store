package com.hau.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer userId;
    private Integer profileId;
    private String fullName;
    private String phone;
    private String address;
    private Integer status;
    private Integer paymentMethod;
    private Integer paymentStatus;
    private String note;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
