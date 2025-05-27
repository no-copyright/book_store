package com.hau.product_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;


@Table(name = "categories")
@Entity
@Data
public class Category {
    @Id
    private Long id;
    private String name;
    private String slug;
    private Long parentId;


    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Product> products = new ArrayList<>();

}
