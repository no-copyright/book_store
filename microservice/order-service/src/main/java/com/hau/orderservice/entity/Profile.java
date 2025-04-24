package com.hau.orderservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "profiles")
@Getter
@Setter
public class Profile {
    @Id
    private Long id;
    private Integer userId;
    private String fullName;
    private String phone;
    private String address;
}
