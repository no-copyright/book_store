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

    private Integer userId;
    private Integer totalPrice;
    //(0: COD, 1: VNPAY, 2: MOMO)
    private Integer paymentMethod;
    //(0: đã thanh toán, 1: chưa thanh toán, 2: đã hoàn tiền, 3: không thành công, 5: đã huỷ)
    private Integer paymentStatus;
}
