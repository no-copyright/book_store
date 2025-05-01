package com.hau.orderservice.service;

import com.hau.orderservice.dto.*;
import com.hau.orderservice.entity.*;
import com.hau.orderservice.exception.AppException;
import com.hau.orderservice.mapper.OrderMapper;
import com.hau.orderservice.repository.OrderRepository;
import com.hau.orderservice.repository.ProductRepository;
import com.hau.orderservice.repository.ProfileRepository;
import com.hau.orderservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ProfileRepository profileRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

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
        int totalPrice = 0;
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
            totalPrice += product.getPrice() * itemRequest.getQuantity();
        }
        order.setPaymentStatus(1);
        order.setStatus(1);
        order.setOrderProducts(orderProductsEntitySet);
        order.setTotalPrice(totalPrice);
        orderRepository.save(order);
        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo đơn hàng thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<String> cancerOrder(Long id, CancerOrderRequest cancerOrderRequest) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        if (!Objects.equals(userId, order.getUserId())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Không có quyền truy cập tài nguyên này", null);
        }
        if (order.getStatus() == 5) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng đã bị huỷ", null);
        }
        if (order.getStatus() == 3) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng đang được vận chuyển", null);
        }
        if (order.getStatus() == 0) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng đã được giao thành công", null);
        }
        order.setStatus(5);
        order.setNote(cancerOrderRequest.getNote());
        orderRepository.save(order);
        return ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Hủy đơn hàng thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<OrderResponse> updateOrderStatus(OrderUpdateStatus orderUpdateStatus, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        order.setStatus(orderUpdateStatus.getStatus());
        orderRepository.save(order);
        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật trạng thái đơn hàng thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<OrderResponse> getOrderById(Long id, Integer userId) {
        boolean userExists = userRepository.existsById(userId);
        if (!userExists) {
            throw new AppException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại", null);
        }
        Order order = orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại cho người dùng này", null));
        OrderResponse orderResponse = orderMapper.toOrderResponse(order);
        orderResponse.setTotalPrice(order.getTotalPrice());
        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin đơn hàng thành công")
                .result(orderResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(int page, int size, int userId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Order> orderPage = orderRepository.findAllByUserId(userId, pageable);

        List<OrderResponse> orderResponseList = orderPage.map(orderMapper::toOrderResponse).toList();
        return ApiResponse.<PageResponse<OrderResponse>>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy danh sách đơn hàng thành công")
                .result(PageResponse.<OrderResponse>builder()
                        .currentPage(page)
                        .totalPages(orderPage.getTotalPages())
                        .totalElements(orderPage.getTotalElements())
                        .pageSize(orderPage.getSize())
                        .data(orderResponseList)
                        .build())
                .timestamp(LocalDateTime.now())
                .build();
    }

    public boolean isOwnerOfUser(Integer requestedUserId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String authenticatedUserId = authentication.getName();
        try {
            User requestedUser = findUserById(requestedUserId);
            return requestedUser.getId().toString().equals(authenticatedUserId);
        } catch (AppException e) {
            log.warn("Không tìm thấy người dùng với ID: {}", requestedUserId);
            return false;
        }
    }

    public User findUserById(Integer id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy user có id: " + id, null));
    }
}

