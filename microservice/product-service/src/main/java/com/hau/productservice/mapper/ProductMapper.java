package com.hau.productservice.mapper;


import com.hau.productservice.dto.request.ProductRequest;
import com.hau.productservice.dto.response.ProductResponse;
import com.hau.productservice.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    // Define mapping methods here
    Product toProduct(ProductRequest productRequest);

    ProductResponse toProductResponse(Product product);

    void updateProductFromRequest(ProductRequest productUpdateRequest, @MappingTarget Product product);
}
