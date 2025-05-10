package com.hau.product_service.repository;

import com.hau.product_service.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    void deleteByParentId(Long id);

    List<Category> findByParentId(Long parentId);


}
