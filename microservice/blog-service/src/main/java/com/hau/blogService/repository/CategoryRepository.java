package com.hau.blogService.repository;

import com.hau.blogService.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    void deleteByParentId(Long id);
}
