package com.hau.blogService.service.impl;

import com.hau.blogService.converter.StringConverter;
import com.hau.blogService.service.SlugService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SlugServiceImpl implements SlugService {
    @Override
    public String generateUniqueSlug(String title, Long productId) {
        String baseSlug = StringConverter.toSlug(title);
        return baseSlug + "-" + productId;
    }

}
