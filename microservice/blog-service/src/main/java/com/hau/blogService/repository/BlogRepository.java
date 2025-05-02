package com.hau.blogService.repository;

import com.hau.blogService.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository  extends JpaRepository<Blog, Long> {
    @Query("""
    SELECT b FROM Blog b
    WHERE (:title IS NULL OR b.title ILIKE %:title%)
      AND (:categoryId IS NULL OR b.category.id = :categoryId)
    """)
    Page<Blog> findByFilters(@Param("title") String title,
                             @Param("categoryId") Long categoryId,
                             Pageable pageable);

}
