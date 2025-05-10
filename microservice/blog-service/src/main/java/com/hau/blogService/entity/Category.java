package com.hau.blogService.entity;

import jakarta.persistence.*;
import lombok.Data;
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
    @OneToMany(mappedBy = "category")
    private List<Blog> blogs;
}
