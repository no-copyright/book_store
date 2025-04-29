package com.hau.blogService.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
