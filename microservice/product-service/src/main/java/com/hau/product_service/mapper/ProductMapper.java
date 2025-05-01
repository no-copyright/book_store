package com.hau.product_service.mapper;


import com.hau.product_service.dto.request.ProductRequest;
import com.hau.product_service.dto.response.ProductResponse;
import com.hau.product_service.entity.Category;
import com.hau.product_service.entity.Product;
import com.hau.product_service.entity.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {
    // Define mapping methods here
    @Mapping(target = "productImage", ignore = true)
    Product toProduct(ProductRequest productRequest);

    ProductResponse toProductResponse(Product product);

    @Mapping(source = "productImage", target = "imageUrls")
    @Mapping(source = "categories", target = "categories")
    ProductResponse toProductWithImageResponse(Product product);

    @Mapping(target = "productImage", ignore = true)
    Product updateProductFromRequest(ProductRequest productUpdateRequest, @MappingTarget Product product);


    default List<String> mapProductImagesToUrls(List<ProductImage> images) {
        if (CollectionUtils.isEmpty(images)) { // Sử dụng CollectionUtils cho kiểm tra null và empty
            return Collections.emptyList();
        }
        return images.stream()
                .map(ProductImage::getUrl) // Lấy URL từ mỗi ProductImage
                .collect(Collectors.toList());
    }

    default List<Long> mapCategoriesToIds(List<Category> categories) {
        if (CollectionUtils.isEmpty(categories)) {
            return Collections.emptyList();
        }
        return categories.stream()
                .map(Category::getId)
                .collect(Collectors.toList());
    }

}
