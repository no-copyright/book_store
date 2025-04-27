package com.hau.orderservice.service;

import com.hau.orderservice.dto.ApiResponse;
import com.hau.orderservice.dto.OrderCreateRequest;
import com.hau.orderservice.dto.OrderProductCreateRequest;
import com.hau.orderservice.dto.OrderResponse;
import com.hau.orderservice.entity.Order;
import com.hau.orderservice.entity.OrderProduct;
import com.hau.orderservice.entity.Product;
import com.hau.orderservice.entity.Profile;
import com.hau.orderservice.exception.AppException;
import com.hau.orderservice.mapper.OrderMapper;
import com.hau.orderservice.repository.OrderRepository;
import com.hau.orderservice.repository.ProductRepository;
import com.hau.orderservice.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ProfileRepository profileRepository;
    private final ProductRepository productRepository;

    public ApiResponse<OrderResponse> createOrder(OrderCreateRequest orderCreateRequest) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());
        Profile profile = profileRepository.findById(orderCreateRequest.getProfileId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Địa chỉ nhận hàng không tồn tại", null));

        if (!Objects.equals(userId, profile.getUserId())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Địa chỉ nhận hàng không thuộc về bạn", null);
        }

        // Map OrderCreateRequest to base Order entity and populate profile details
        Order order = orderMapper.toOrder(orderCreateRequest);
        order.setUserId(userId);
        order.setAddress(profile.getAddress());
        order.setFullName(profile.getFullName());
        order.setPhone(profile.getPhone());

        Set<OrderProduct> orderProductsEntitySet = new HashSet<>();

        if (orderCreateRequest.getOrderProducts() == null || orderCreateRequest.getOrderProducts().isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng phải có ít nhất một sản phẩm", null);
        }

        for (OrderProductCreateRequest itemRequest : orderCreateRequest.getOrderProducts()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new AppException(
                            HttpStatus.NOT_FOUND, "Sản phẩm với ID " + itemRequest.getProductId() + " không tồn tại", null));

            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Sản phẩm " + product.getTitle() + " chỉ còn " + product.getQuantity() + " sản phẩm trong kho", null);
            }

            // Create OrderProduct entity
            OrderProduct orderProduct = OrderProduct.builder()
                    .productId(itemRequest.getProductId())
                    .quantity(itemRequest.getQuantity())
                    .productName(product.getTitle())
                    .price(product.getPrice())
                    .order(order)
                    .build();
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            orderProductsEntitySet.add(orderProduct);
        }

        order.setOrderProducts(orderProductsEntitySet);
        Order savedOrder = orderRepository.save(order);
        OrderResponse orderResponse = orderMapper.toOrderResponse(savedOrder);
        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo đơn hàng thành công")
                .result(orderResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }




    public ApiResponse<OrderResponse> getOrderById(Long id) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));

        if (!Objects.equals(userId, order.getUserId())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng không thuộc về bạn", null);
        }

        OrderResponse orderResponse = orderMapper.toOrderResponse(order);
        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin đơn hàng thành công")
                .result(orderResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }
}

