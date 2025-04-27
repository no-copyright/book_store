package com.hau.categoryservice.repository;


import com.hau.categoryservice.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
    List<Category> findByParentId(Long parentId);

    void deleteByParentId(Long id);
}
