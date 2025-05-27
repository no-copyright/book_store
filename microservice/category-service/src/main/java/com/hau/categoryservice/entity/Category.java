package com.hau.categoryservice.entity;

import com.hau.categoryservice.enums.CategoryType;
import jakarta.persistence.*;
import lombok.Data;



@Table(name = "categories")
@Entity
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String slug;
    private int priority;
    private Long parentId;
    @Enumerated(EnumType.STRING)
    private CategoryType type;
}
