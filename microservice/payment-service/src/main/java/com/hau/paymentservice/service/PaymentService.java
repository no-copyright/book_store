package com.hau.paymentservice.service;

import com.hau.event.dto.PaymentCreateEvent;
import com.hau.paymentservice.dto.ApiResponse;
import com.hau.paymentservice.dto.CreateMomoRequest;
import com.hau.paymentservice.dto.MomoResponse;
import com.hau.paymentservice.entity.Order;
import com.hau.paymentservice.entity.Payment;
import com.hau.paymentservice.exception.AppException;
import com.hau.paymentservice.repository.MomoClientApi;
import com.hau.paymentservice.repository.OrderRepository;
import com.hau.paymentservice.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final MomoClientApi momoClientApi;

    @Value("${vnpay.payUrl}")
    private String payUrl;

    @Value("${vnpay.returnUrl}")
    private String returnUrl;

    @Value("${vnpay.tmnCode}")
    private String tmnCode;

    @Value("${vnpay.secretKey}")
    private String secretKey;

    @Value("${momo.partnerCode}")
    private String partnerCode;

    @Value("${momo.accessKey}")
    private String accessKey;

    @Value("${momo.secretKey}")
    private String momoSecretKey;

    @Value("${momo.returnUrl}")
    private String momoReturnUrl;

    @Value("${momo.ipn-url}")
    private String ipnUrl;

    @Value("${momo.requestType}")
    private String requestType;

    public MomoResponse createMomoQR(Long orderId) {
        Integer userId = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        if (!order.getUserId().equals(userId))
            throw new AppException(HttpStatus.FORBIDDEN, "Đơn hàng không thuộc về bạn", null);
        if (order.getPaymentStatus() == 0)
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng đã được thanh toán", null);
        if (!(order.getPaymentMethod() == 2))
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng không hỗ trợ phương thức thanh toán này", null);

        String requestId = UUID.randomUUID().toString();
        String amount = order.getTotalPrice().toString();
        String orderInfo = "Thanh toan don hang: " + orderId;
        String orderIdCustom = orderId + "_" + UUID.randomUUID();
        String extraData = "";
        String lang = "vi";
        try {
            String rawSignature = "accessKey=" + accessKey
                    + "&amount=" + amount
                    + "&extraData=" + extraData
                    + "&ipnUrl=" + ipnUrl
                    + "&orderId=" + orderIdCustom
                    + "&orderInfo=" + orderInfo
                    + "&partnerCode=" + partnerCode
                    + "&redirectUrl=" + momoReturnUrl
                    + "&requestId=" + requestId
                    + "&requestType=" + requestType;

            String signature = hmacSHA256(rawSignature, momoSecretKey);

            CreateMomoRequest createMomoRequest = CreateMomoRequest.builder()
                    .partnerCode(partnerCode)
                    .requestType(requestType)
                    .ipnUrl(ipnUrl)
                    .redirectUrl(momoReturnUrl)
                    .orderId(orderIdCustom)
                    .amount(amount)
                    .orderInfo(orderInfo)
                    .requestId(requestId)
                    .extraData(extraData)
                    .signature(signature)
                    .lang(lang)
                    .build();
            return momoClientApi.createMomoQR(createMomoRequest);
        } catch (Exception e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Lỗi tạo chữ ký MoMo", e.getMessage());
        }
    }

    @Transactional
    public void processMomoReturn(HttpServletRequest request) {
        String orderIdRequest = request.getParameter("orderId").split("_")[0];
        Order order = orderRepository.findById(Long.valueOf(orderIdRequest))
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        if (request.getParameter("resultCode").equals("0")) {
            // Giao dịch thành công
            order.setPaymentStatus(0);
            orderRepository.save(order);

            Payment payment = Payment.builder()
                    .id("MMP" + request.getParameter("transId"))
                    .amount(Integer.parseInt(request.getParameter("amount")))
                    .orderInfo(request.getParameter("orderInfo"))
                    .paymentDate(request.getParameter("responseTime"))
                    .paymentStatus("0" + request.getParameter("resultCode"))
                    .orderId(order.getId())
                    .paymentMethod(request.getParameter("payType"))
                    .build();

            paymentRepository.save(payment);
            PaymentCreateEvent paymentCreateEvent = PaymentCreateEvent.builder()
                    .orderId(order.getId())
                    .paymentStatus(0)
                    .build();
            kafkaTemplate.send("payment-create-topic", paymentCreateEvent);
        } else {
            // Giao dịch thất bại
            order.setPaymentStatus(3);
            orderRepository.save(order);
            PaymentCreateEvent paymentCreateEvent = PaymentCreateEvent.builder()
                    .orderId(order.getId())
                    .paymentStatus(3)
                    .build();
            kafkaTemplate.send("payment-create-topic", paymentCreateEvent);
        }
    }



    private static String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKey);
        byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public String createPaymentUrl(Long orderId, HttpServletRequest request, String bankCode) {
        Integer userId = Integer.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));
        if (!Objects.equals(order.getUserId(), userId)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Đơn hàng không thuộc về bạn", null);
        }
        if (order.getPaymentStatus() == 0)
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng đã được thanh toán", null);
        if (!(order.getPaymentMethod() == 1))
            throw new AppException(HttpStatus.BAD_REQUEST, "Đơn hàng không hỗ trợ phương thức thanh toán này", null);

        String vnp_TxnRef = String.valueOf(order.getId());
        String vnp_IpAddr = getIpAddress(request);
        long amount = order.getTotalPrice() * 100L;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", tmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        LocalDateTime localDateTime = LocalDateTime.now(ZoneId.of("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(Date.from(localDateTime.atZone(ZoneId.of("Etc/GMT+7")).toInstant()));
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                //Build a query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = hmacSHA512(secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return payUrl + "?" + queryUrl;
    }

    @Transactional
    public void processVnPayReturn(HttpServletRequest request) {
        try {
            // 1. Kiểm tra chữ ký
            Map<String, String> fields = new HashMap<>();
            for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    fields.put(fieldName, fieldValue);
                }
            }

            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");
            fields.remove("vnp_SecureHash");
            String signValue = hashAllFields(fields);

            if (!signValue.equals(vnp_SecureHash)) {
                ApiResponse.<String>builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("Invalid signature")
                        .result(null)
                        .timestamp(LocalDateTime.now())
                        .build();
                return;
            }

            // 2. Lấy các tham số
            String vnpResponseCode = request.getParameter("vnp_ResponseCode");
            String vnpTransactionStatus = request.getParameter("vnp_TransactionStatus");
            String vnpTxnRef = request.getParameter("vnp_TxnRef");
            Long orderId = Long.valueOf(vnpTxnRef);

            // 3. Tìm Order
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Đơn hàng không tồn tại", null));

            // 4. Xử lý kết quả giao dịch
            if ("00".equals(vnpResponseCode) && "00".equals(vnpTransactionStatus)) {
                // Giao dịch thành công
                order.setPaymentStatus(0);
                orderRepository.save(order);

                // Tạo và lưu Payment
                Payment payment = Payment.builder()
                        .id(request.getParameter("vnp_BankTranNo"))
                        .amount(Integer.parseInt(request.getParameter("vnp_Amount")) / 100)
                        .orderInfo(request.getParameter("vnp_OrderInfo"))
                        .paymentDate(request.getParameter("vnp_PayDate"))
                        .paymentStatus(request.getParameter("vnp_TransactionStatus"))
                        .orderId(orderId)
                        .paymentMethod(request.getParameter("vnp_BankCode"))
                        .build();


                paymentRepository.save(payment);
                PaymentCreateEvent paymentCreateEvent = PaymentCreateEvent.builder()
                        .orderId(orderId)
                        .paymentStatus(0)
                        .build();
                kafkaTemplate.send("payment-create-topic", paymentCreateEvent);
                ApiResponse.<String>builder()
                        .status(HttpStatus.OK.value())
                        .message("Thanh toán thành công")
                        .timestamp(LocalDateTime.now())
                        .build();
            } else {
                // Giao dịch thất bại
                order.setPaymentStatus(3);
                orderRepository.save(order);
                PaymentCreateEvent paymentCreateEvent = PaymentCreateEvent.builder()
                        .orderId(orderId)
                        .paymentStatus(3)
                        .build();
                kafkaTemplate.send("payment-create-topic", paymentCreateEvent);
                ApiResponse.<String>builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message("Thanh toán thất bại")
                        .timestamp(LocalDateTime.now())
                        .build();
            }
        } catch (DataIntegrityViolationException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Giao dịch thanh toán này đã được ghi nhận trước đó.", e);
        }
    }

    public String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                // *Sửa ở đây*: Encode *tất cả* các trường bằng US-ASCII
                sb.append(fieldName);
                sb.append("=");
                sb.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII)); // Dùng US-ASCII
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512(secretKey, sb.toString());
    }

    public String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            return "";
        }
    }

    public String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }
}
