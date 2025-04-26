package com.hau.categoryservice.service;

public interface SlugService {
    String generateUniqueSlug(String title, Long productId);
}
