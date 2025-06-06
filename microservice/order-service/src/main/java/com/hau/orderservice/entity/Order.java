package com.hau.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
@Getter
@Setter
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer userId;
    private Long profileId;
    private String fullName;
    private String phone;
    private String address;
    //(0: giao hàng thành công, 1: chờ xác nhận, 2: chờ đơn vị vận chuyển,
    // 3: đang vận chuyển, 4: đã giao, 5: đã huỷ)
    private Integer status;
    private Integer paymentMethod;
    private Integer paymentStatus;
    private Integer totalPrice;
    private String note;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderProduct> orderProducts = new HashSet<>();
}
