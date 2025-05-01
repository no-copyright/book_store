package com.hau.cartservice.service;

import com.hau.cartservice.dto.ApiResponse;
import com.hau.cartservice.dto.CartProductRequest;
import com.hau.cartservice.dto.CartProductResponse;
import com.hau.cartservice.entity.CartProduct;
import com.hau.cartservice.mapper.CartProductMapper;
import com.hau.cartservice.repository.CartProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
@Slf4j
public class CartProductService {
    private final CartProductRepository cartProductRepository;
    private final CartProductMapper cartProductMapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public ApiResponse<CartProductResponse> addProductToCart(CartProductRequest cartProductRequest) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        CartProduct cartProduct = cartProductMapper.toCartProduct(cartProductRequest);
        cartProduct.setCartId(Integer.valueOf(authentication.getName()));
        cartProductRepository.save(cartProduct);
        return ApiResponse.<CartProductResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm sản phẩm vào giỏ hàng thành công")
                .result(cartProductMapper.toCartProductResponse(cartProduct))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<String> removeProductFromCart(Integer cartProductId) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        CartProduct cartProduct = cartProductRepository.findById(cartProductId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng"));
        if (!cartProduct.getCartId().equals(Integer.valueOf(authentication.getName()))) {
            return ApiResponse.<String>builder()
                    .status(HttpStatus.FORBIDDEN.value())
                    .message("Bạn không có quyền xóa sản phẩm này")
                    .build();
        }
        cartProductRepository.delete(cartProduct);
        return ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa sản phẩm khỏi giỏ hàng thành công")
                .build();
    }

//    @Transactional
//    public ApiResponse<String> processAndSendSimpleCartProducts(List<Integer> cartProductIds) {
//
//        if (cartProductIds == null || cartProductIds.isEmpty()) {
//            log.info("Yêu cầu xử lý giỏ hàng với danh sách ID trống.");
//            return ApiResponse.<String>builder()
//                    .status(HttpStatus.OK.value())
//                    .message("Danh sách sản phẩm cần xử lý trống, không có gì để gửi.")
//                    .timestamp(LocalDateTime.now())
//                    .build();
//        }
//
//        List<CartProduct> fetchedProducts = cartProductRepository.findAllById(cartProductIds);
//
//        if (fetchedProducts.isEmpty()) {
//            log.warn("Yêu cầu xử lý giỏ hàng với các ID {} nhưng không tìm thấy sản phẩm nào trong DB.", cartProductIds);
//            return ApiResponse.<String>builder()
//                    .status(HttpStatus.NOT_FOUND.value())
//                    .message("Không tìm thấy bất kỳ sản phẩm nào trong giỏ hàng với các ID đã cung cấp.")
//                    .timestamp(LocalDateTime.now())
//                    .build();
//        }
//
//        // Tạo các sự kiện Kafka cho từng sản phẩm
//        List<OrderCreateEvent> orderEvents = fetchedProducts.stream()
//                .map(this::toSimpleKafkaOrderCreateEvent)
//                .toList();
//
//        int sentCount = 0;
//        List<Integer> successfullySentIds = new ArrayList<>(); // Lưu trữ ID của các sản phẩm đã gửi thành công
//
//        for (OrderCreateEvent event : orderEvents) {
//            try {
//                kafkaTemplate.send("simple-order-processing-topic", event);
//                log.info("Đã gửi thành công sản phẩm CartProduct ID {} đến topic {}",
//                        event.getCartProductId(), "simple-order-processing-topic");
//                sentCount++;
//                successfullySentIds.add(event.getCartProductId());
//            } catch (Exception e) {
//                log.error("Lỗi khi gửi sản phẩm CartProduct ID {} đến Kafka: {}", event.getCartProductId(), e.getMessage(), e);
//            }
//        }
//
//        if (sentCount == 0) {
//            return ApiResponse.<String>builder()
//                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
//                    .message("Không có sản phẩm nào trong danh sách đã chọn được gửi thành công tới hệ thống xử lý đơn hàng do lỗi.")
//                    .timestamp(LocalDateTime.now())
//                    .build();
//        }
//
//        // Chỉ xóa các sản phẩm đã gửi thành công
//        List<CartProduct> productsToDelete = fetchedProducts.stream()
//                .filter(p -> successfullySentIds.contains(p.getId()))
//                .collect(Collectors.toList());
//
//        if (!productsToDelete.isEmpty()) {
//            try {
//                cartProductRepository.deleteAll(productsToDelete);
//                log.info("Đã xóa thành công {} sản phẩm khỏi giỏ hàng. CartProduct IDs đã xóa: {}",
//                        productsToDelete.size(), successfullySentIds);
//            } catch (Exception e) {
//                log.error("Lỗi khi xóa các sản phẩm đã xử lý khỏi giỏ hàng với các ID {}: {}", successfullySentIds, e.getMessage(), e);
//                return ApiResponse.<String>builder()
//                        .status(HttpStatus.OK.value())
//                        .message(String.format("Đã gửi thành công %d sản phẩm đến hệ thống xử lý đơn hàng, nhưng có lỗi xảy ra khi xóa %d sản phẩm khỏi giỏ hàng. Các ID đã gửi: %s",
//                                sentCount, productsToDelete.size(), successfullySentIds))
//                        .timestamp(LocalDateTime.now())
//                        .build();
//            }
//        } else {
//            log.warn("Không có sản phẩm nào cần xóa khỏi giỏ hàng sau khi gửi.");
//        }
//
//        return ApiResponse.<String>builder()
//                .status(HttpStatus.OK.value())
//                .message(String.format("Đã xử lý thành công %d sản phẩm, gửi dữ liệu đến hệ thống xử lý đơn hàng và xóa khỏi giỏ hàng.", sentCount))
//                .timestamp(LocalDateTime.now())
//                .build();
//    }
//
//    private OrderCreateEvent toSimpleKafkaOrderCreateEvent(CartProduct cartProduct) {
//        return OrderCreateEvent.builder()
//                .cartProductId(cartProduct.getId())
//                .productId(cartProduct.getProductId())
//                .quantity(cartProduct.getQuantity())
//                .build();
//    }

}
