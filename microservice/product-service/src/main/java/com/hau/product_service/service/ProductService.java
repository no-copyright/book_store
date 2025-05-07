package com.hau.product_service.service;

import com.hau.event.dto.NotificationEvent;
import com.hau.event.dto.ProductEvent;
import com.hau.product_service.entity.Category;
import com.hau.product_service.repository.FileServiceClientRepository;
import com.hau.product_service.converter.StringConverter;
import com.hau.product_service.dto.request.ProductFilter;
import com.hau.product_service.dto.request.ProductRequest;
import com.hau.product_service.dto.response.ApiResponse;
import com.hau.product_service.dto.response.PageResult;
import com.hau.product_service.dto.response.ProductResponse;
import com.hau.product_service.entity.Product;
import com.hau.product_service.exception.AppException;
import com.hau.product_service.mapper.ProductMapper;
import com.hau.product_service.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final FileServiceClientRepository fileServiceClientRepository;
    private final ProductImageService productImageService;
    private final FileUploadService fileUploadService;
    private final SlugService slugService;
    private final CategoryService categoryService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.file.download-prefix}")
    private String fileServiceUrl;

    public ApiResponse<PageResult<ProductResponse>> getAllProduct(ProductFilter filter, Integer pageIndex, Integer pageSize) {
        int page = (pageIndex == null || pageIndex <= 1) ? 0 : pageIndex - 1;

        Sort sort;
        if (filter.getSortDir() != null && !filter.getSortDir().isEmpty()) {
            Sort.Direction direction = "asc".equalsIgnoreCase(filter.getSortDir()) ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(direction, "price");
        } else {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        List<Long> categoryIds = null;
        if (filter.getCategoryId() != null) {
            Set<Long> allCategoryIds = new HashSet<>();
            allCategoryIds.add(filter.getCategoryId());
            allCategoryIds.addAll(categoryService.findAllSubCategoryIds(filter.getCategoryId()));
            categoryIds = allCategoryIds.stream().toList();
        }

        Page<Product> productPage = productRepository.findAllByFilter(filter, categoryIds, pageable);

        List<ProductResponse> responses = productPage.getContent().stream()
                .map(product -> {
                    ProductResponse res = productMapper.toProductWithImageResponse(product);
                    res.setThumbnail(fileServiceUrl + product.getThumbnail());

                    if (res.getImageUrls() != null) {
                        res.setImageUrls(
                                res.getImageUrls().stream()
                                        .map(url -> fileServiceUrl + url)
                                        .collect(Collectors.toList())
                        );
                    }

                    return res;
                }).toList();

        PageResult<ProductResponse> result = new PageResult<>(
                responses,
                productPage.getNumber() + 1,
                productPage.getSize(),
                productPage.getTotalPages(),
                productPage.getTotalElements(),
                productPage.hasNext(),
                productPage.hasPrevious()
        );

        return ApiResponse.<PageResult<ProductResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách sản phẩm thành công")
                .result(result)
                .timestamp(LocalDateTime.now())
                .build();
    }



    @Transactional // Ensure atomicity
    public ApiResponse<ProductResponse> createProduct(ProductRequest request, MultipartFile thumbnail, List<MultipartFile> images) {
        if (thumbnail == null || thumbnail.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Ảnh thumbnail không được để trống", null);
        }

        if (images == null || images.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Danh sách ảnh sản phẩm không được để trống", null);
        }

        List<Category> categories = categoryService.handleCategoryFromProduct(request.getCategoryIds());

        Product product = productMapper.toProduct(request);
        product.setActive(true);
        product.setCategories(categories);


        String thumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "thumbnail");
        product.setThumbnail(thumbnailUrl);

        product.setSlug(StringConverter.toSlug(product.getTitle()));

        Product savedProduct = productRepository.save(product);
        Long productId = savedProduct.getId();

        String uniqueSlug = slugService.generateUniqueSlug(savedProduct.getTitle(), productId);
        savedProduct.setSlug(uniqueSlug);

        productImageService.createImageByProduct(savedProduct, images);

        savedProduct.setProductImage(null);
        savedProduct = productRepository.save(savedProduct);

        ProductEvent productEvent = ProductEvent.builder()
                .id(savedProduct.getId())
                .discount(savedProduct.getDiscount())
                .price(savedProduct.getPrice())
                .quantity(savedProduct.getQuantity())
                .title(savedProduct.getTitle())
                .build();
        kafkaTemplate.send("product-create-topic", productEvent);
        ProductResponse productResponse = productMapper.toProductResponse(savedProduct);
        productResponse.setThumbnail(fileServiceUrl + savedProduct.getThumbnail());

        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm sản phẩm thành công")
                .result(productResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }


    // Modified to handle thumbnail and image updates
    @Transactional
    public ApiResponse<ProductResponse> updateProduct(ProductRequest request, Long id, MultipartFile thumbnail, List<MultipartFile> images) {
        Product existProduct = productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));

        Product product = productMapper.updateProductFromRequest(request, existProduct);

        List<Category> categories = categoryService.handleCategoryFromProduct(request.getCategoryIds());

        if (request.getActive() != null) {
            existProduct.setActive(request.getActive());
        }

        if (thumbnail != null && !thumbnail.isEmpty()) {
            fileServiceClientRepository.deleteFile(existProduct.getThumbnail());
            String newThumbnailUrl = fileUploadService.uploadFileAndGetUrl(thumbnail, "new thumbnail");
            existProduct.setThumbnail(newThumbnailUrl);
        }

        if (!CollectionUtils.isEmpty(images)) {
            productImageService.deleteAllByProductId(id);
            productImageService.createImageByProduct(product, images);
        }

        existProduct.setSlug(slugService.generateUniqueSlug(product.getTitle(), id));
        existProduct.setCategories(categories);
        Product savedProduct = productRepository.save(existProduct);

        ProductEvent productEvent = ProductEvent.builder()
                .id(savedProduct.getId())
                .discount(savedProduct.getDiscount())
                .price(savedProduct.getPrice())
                .quantity(savedProduct.getQuantity())
                .title(savedProduct.getTitle())
                .build();
        kafkaTemplate.send("product-update-topic", productEvent);

        ProductResponse response = productMapper.toProductResponse(savedProduct);
        response.setThumbnail(savedProduct.getThumbnail());


        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật sản phẩm thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }



    public ApiResponse<ProductResponse> deleteProduct(Long id) {
        Product product =  productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));

        productImageService.deleteImage(product.getId());
        fileServiceClientRepository.deleteFile(product.getThumbnail());
        productRepository.deleteById(id);
        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa sản phẩm thành công")
                .timestamp(LocalDateTime.now())
                .build();
    }



    public ApiResponse<ProductResponse> getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));
        ProductResponse response = productMapper.toProductWithImageResponse(product);
        response.setThumbnail(fileServiceUrl + product.getThumbnail());
        List<String> imageUrls = response.getImageUrls();
        for(String item : imageUrls) {
            imageUrls.set(imageUrls.indexOf(item), fileServiceUrl + item);
        }
        return ApiResponse.<ProductResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy sản phẩm thành công")
                .result(response)
                .timestamp(LocalDateTime.now())
                .build();
    }


    public void updateProductQuantity(NotificationEvent notificationEvent) {
        Map<String, Object> params = notificationEvent.getParams();
        Object orderProducts = params.get("orderProducts");

        if (orderProducts instanceof List<?> orderProductList) {
            for (Object item : orderProductList) {
                if (item instanceof Map<?, ?> productMap) {
                    log.info("Product map: {}", productMap);

                    Object productIdObj = productMap.get("productId");
                    if (!(productIdObj instanceof Integer)) {
                        log.error("productId không phải là Integer.  Value: {}", productIdObj);
                        continue;
                    }
                    Long productId = ((Integer) productIdObj).longValue();


                    Object quantityObj = productMap.get("quantity");
                    if (!(quantityObj instanceof Integer)) {
                        log.error("quantity không phải là Integer. Value: {}", quantityObj);
                        continue;
                    }
                    int quantity = (Integer) quantityObj;


                    try {
                        Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại", null));
                        product.setQuantity(product.getQuantity() - quantity);
                        productRepository.save(product);
                    } catch (AppException e) {
                        log.error("Lỗi khi xử lý sản phẩm với productId {}: {}", productId, e.getMessage());
                    }
                }
            }
        } else {
            log.warn("orderProducts không phải là List hoặc null");
        }
    }
}
