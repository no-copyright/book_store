package com.hau.paymentservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
@Builder
public class Order {
    @Id
    private Long id;

    private Integer totalPrice;
    private Integer paymentMethod;
    private Integer paymentStatus;
}
