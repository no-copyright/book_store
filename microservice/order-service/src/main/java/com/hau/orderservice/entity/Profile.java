package com.hau.orderservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "profiles")
@Entity
public class Profile {
    @Id
    private Long id;
    private Integer userId;
    private String fullName;
    private String phone;
    private String address;
}
