package com.hau.customerService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Table(name = "customer_care")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerCare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String content;
    @CreationTimestamp
    LocalDateTime createdAt;

}
