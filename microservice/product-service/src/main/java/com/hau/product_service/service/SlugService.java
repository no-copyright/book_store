package com.hau.product_service.service;

import com.hau.product_service.converter.StringConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SlugService {
    String generateUniqueSlug(String title, Long productId) {
        String baseSlug = StringConverter.toSlug(title);
        return baseSlug + "-" + productId;
    }

}
