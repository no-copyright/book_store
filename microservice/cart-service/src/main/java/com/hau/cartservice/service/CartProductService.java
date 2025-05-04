package com.hau.cartservice.service;

import com.hau.cartservice.dto.ApiResponse;
import com.hau.cartservice.dto.CartProductRequest;
import com.hau.cartservice.dto.CartProductResponse;
import com.hau.cartservice.entity.CartProduct;
import com.hau.cartservice.exception.AppException;
import com.hau.cartservice.mapper.CartProductMapper;
import com.hau.cartservice.repository.CartProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Slf4j
public class CartProductService {
    private final CartProductRepository cartProductRepository;
    private final CartProductMapper cartProductMapper;

    public ApiResponse<CartProductResponse> addProductToCart(CartProductRequest cartProductRequest) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());

        Optional<CartProduct> existingCartProduct = cartProductRepository.findByCartIdAndProductId(userId, cartProductRequest.getProductId());
        if (existingCartProduct.isPresent()) {
            CartProduct cartProduct = existingCartProduct.get();
            cartProduct.setQuantity(cartProduct.getQuantity() + cartProductRequest.getQuantity());
            cartProductRepository.save(cartProduct);
            return ApiResponse.<CartProductResponse>builder()
                    .status(HttpStatus.CREATED.value())
                    .message("Thêm sản phẩm vào giỏ hàng thành công")
                    .result(cartProductMapper.toCartProductResponse(cartProduct))
                    .timestamp(LocalDateTime.now())
                    .build();
        }
        CartProduct cartProduct = cartProductMapper.toCartProduct(cartProductRequest);
        cartProduct.setCartId(userId);
        cartProductRepository.save(cartProduct);
        return ApiResponse.<CartProductResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message("Thêm sản phẩm vào giỏ hàng thành công")
                .result(cartProductMapper.toCartProductResponse(cartProduct))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public ApiResponse<String> removeProductsFromCart(List<Integer> cartProductIds) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = Integer.valueOf(authentication.getName());
        List<CartProduct> cartProductsToDelete = cartProductRepository.findAllById(cartProductIds);

        if (cartProductsToDelete.size() != cartProductIds.size()) {
            throw new AppException(HttpStatus.NOT_FOUND, "Một hoặc nhiều sản phẩm trong giỏ hàng không tồn tại", null);
        }
        boolean allOwnedByUser = cartProductsToDelete.stream()
                .allMatch(cartProduct -> cartProduct.getCartId().equals(userId));

        if (!allOwnedByUser) {
            throw new AppException(HttpStatus.FORBIDDEN, "Bạn không có quyền xóa một hoặc nhiều sản phẩm này", null);
        }
        cartProductRepository.deleteAll(cartProductsToDelete);

        return ApiResponse.<String>builder()
                .status(HttpStatus.OK.value())
                .message("Xóa các sản phẩm khỏi giỏ hàng thành công")
                .build();
    }

}
