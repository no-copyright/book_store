package com.hau.blogService.repository;

import com.hau.blogService.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository  extends JpaRepository<Blog, Long> {
}
