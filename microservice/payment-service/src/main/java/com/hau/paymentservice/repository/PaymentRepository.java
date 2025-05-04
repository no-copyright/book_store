package com.hau.paymentservice.repository;

import com.hau.paymentservice.entity.Order;
import com.hau.paymentservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, String> {
}
