package com.hau.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
@Builder
public class Payment {
    @Id
    private String id;

    private Long orderId;
    private String paymentMethod;
    private Integer amount;
    private String orderInfo;
    private String paymentStatus;
    private String paymentDate;
}
