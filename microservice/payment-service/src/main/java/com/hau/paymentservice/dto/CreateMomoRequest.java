package com.hau.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMomoRequest {
    private String partnerCode;
    private String requestType;
    private String ipnUrl;
    private String redirectUrl;
    private String orderId;
    private String amount;
    private String orderInfo;
    private String requestId;
    private String extraData;
    private String signature;
    private String lang;
}
