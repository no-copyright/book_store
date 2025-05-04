package com.hau.customerService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "home_page")
@NoArgsConstructor
@AllArgsConstructor
public class HomePage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
}
