package com.hau.paymentservice.repository;

import com.hau.paymentservice.dto.CreateMomoRequest;
import com.hau.paymentservice.dto.MomoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momo", url = "${momo.endpoint}")
public interface MomoClientApi {
    @PostMapping("/create")
    MomoResponse createMomoQR(@RequestBody CreateMomoRequest createMomoRequest);
}
