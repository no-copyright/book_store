package com.hau.customerService.repository;

import com.hau.customerService.entity.CustomerCare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerCareRepository extends JpaRepository<CustomerCare, Long> {
}
