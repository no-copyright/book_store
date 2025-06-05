package com.hau.orderservice.service;

import com.hau.event.dto.NotificationEvent;
import com.hau.event.dto.OrderCreateEvent;
import com.hau.event.dto.PaymentCreateEvent;
import com.hau.orderservice.dto.*;
import com.hau.orderservice.entity.*;
import com.hau.orderservice.exception.AppException;
import com.hau.orderservice.mapper.OrderMapper;
import com.hau.orderservice.repository.OrderRepository;
import com.hau.orderservice.repository.ProductRepository;
import com.hau.orderservice.repository.ProfileRepository;
import com.hau.orderservice.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final ProfileRepository profileRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

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
                    .quantity(itemRequest.getQuantity())
                    .productName(product.getTitle())
                    .price(product.getPrice())
                    .order(order)
                    .product(product)
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

        if (order.getPaymentMethod() == 0) {
            sendNotification(userId, order);
        } else {
            OrderCreateEvent orderCreateEvent = OrderCreateEvent.builder()
                    .orderId(order.getId())
                    .userId(order.getUserId())
                    .totalPrice(order.getTotalPrice())
                    .paymentMethod(order.getPaymentMethod())
                    .paymentStatus(order.getPaymentStatus())
                    .build();
            kafkaTemplate.send("order-create-topic", orderCreateEvent);
        }

        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Tạo đơn hàng thành công")
                .result(orderMapper.toOrderResponse(order))
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

    @Transactional
    public void updatePaymentStatus(PaymentCreateEvent paymentCreateEvent) {
        Order order = orderRepository.findById(paymentCreateEvent.getOrderId())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        order.setPaymentStatus(paymentCreateEvent.getPaymentStatus());
        orderRepository.save(order);
        Integer userId = order.getUserId();
        sendNotification(userId, order);
    }

    public ApiResponse<OrderResponse> updateOrderStatus(OrderUpdateStatus orderUpdateStatus, Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        order.setStatus(orderUpdateStatus.getStatus());
        if (order.getStatus() == 0) {
            order.setPaymentStatus(0);
        }
        orderRepository.save(order);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .params(
                        Map.ofEntries(
                                Map.entry("userId", order.getUserId()),
                                Map.entry("orderId", order.getId()),
                                Map.entry("orderStatus", order.getStatus())
                        )
                )
                .build();
        kafkaTemplate.send("order-updated-status-topic", notificationEvent);
        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Cập nhật trạng thái đơn hàng thành công")
                .result(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<OrderResponse> getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        OrderResponse orderResponse = orderMapper.toOrderResponse(order);

        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin đơn hàng thành công")
                .result(orderResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<OrderResponse> getOrderByIdForUser(Long orderId) {
        Integer userId = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng này không thuộc về bạn", null));
        OrderResponse orderResponse = orderMapper.toOrderResponse(order);
        return ApiResponse.<OrderResponse>builder()
                .status(HttpStatus.OK.value())
                .message("Lấy thông tin đơn hàng thành công")
                .result(orderResponse)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public void sendNotification(Integer userId, Order order) {
        NotificationEvent notificationEvent = new NotificationEvent();
        notificationEvent.setChannel("EMAIL");
        notificationEvent.setRecipient(
                userRepository.findById(userId).orElseThrow().getEmail()
        );
        notificationEvent.setTemplateCode("order-created-email-template");
        notificationEvent.setParams(Map.ofEntries(
                Map.entry("userId", userId),
                Map.entry("fullName", order.getFullName()),
                Map.entry("orderId", order.getId()),
                Map.entry("totalPrice", order.getTotalPrice()),
                Map.entry("address", order.getAddress()),
                Map.entry("phone", order.getPhone()),
                Map.entry("paymentMethod", order.getPaymentMethod() == 0 ? "COD" : order.getPaymentMethod() == 1 ? "VNPAY" : "MOMO"),
                Map.entry("paymentStatus", order.getPaymentStatus() == 0 ? "Đã thanh toán" : "Chưa thanh toán"),
                Map.entry("status", order.getStatus() == 1 ? "Chờ xác nhận" : "Chờ vận chuyển"),
                Map.entry("note", order.getNote() == null ? "" : order.getNote()),
                Map.entry("createdAt", order.getCreatedAt()),
                Map.entry("orderProducts", order.getOrderProducts().stream()
                        .map(orderProduct -> Map.of(
                                "productId", orderProduct.getProduct().getId(),
                                "productName", orderProduct.getProductName(),
                                "quantity", orderProduct.getQuantity(),
                                "price", orderProduct.getPrice()))
                        .toList()
                )));
        kafkaTemplate.send("order-create-notification-topic", notificationEvent);
    }

    public ApiResponse<PageResponse<OrderResponse>> getAllOrders(int page, int size, String createdAt, Integer paymentStatus, Integer paymentMethod) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Specification<Order> spec = getSpecification(createdAt, paymentStatus, paymentMethod);

        Page<Order> orderPage = orderRepository.findAll(spec, pageable);
        return getPageResponseApiResponse(page, orderPage);
    }

    public ApiResponse<PageResponse<OrderResponse>> getOrdersByUserId(int page, int size) {
        Integer userId = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        Page<Order> orderPage = orderRepository.findAllByUserId(userId, pageable);
        return getPageResponseApiResponse(page, orderPage);
    }

    private ApiResponse<PageResponse<OrderResponse>> getPageResponseApiResponse(int page, Page<Order> orderPage) {
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


    private Specification<Order> getSpecification(String createdAt, Integer paymentStatus, Integer paymentMethod) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (createdAt != null && !createdAt.trim().isEmpty()) {
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                    LocalDate createdDate = LocalDate.parse(createdAt, formatter);

                    LocalDateTime startOfDay = createdDate.atStartOfDay();
                    LocalDateTime endOfDay = createdDate.plusDays(1).atStartOfDay();

                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), startOfDay));
                    predicates.add(criteriaBuilder.lessThan(root.get("createdAt"), endOfDay));

                } catch (DateTimeParseException e) {
                    throw new AppException(HttpStatus.BAD_REQUEST, "Định dạng ngày phải là dd-MM-yyyy", null);
                }
            }

            Optional.ofNullable(paymentStatus)
                    .ifPresent(s -> predicates.add(criteriaBuilder.equal(root.get("paymentStatus"), s)));

            Optional.ofNullable(paymentMethod)
                    .ifPresent(s -> predicates.add(criteriaBuilder.equal(root.get("paymentMethod"), s)));

            if (predicates.isEmpty()) {
                return null;
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

