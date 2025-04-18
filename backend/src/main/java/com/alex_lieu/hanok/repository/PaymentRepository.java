package com.alex_lieu.hanok.repository;
import com.alex_lieu.hanok.entity.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Page<Payment> findByOrderId(Long id, Pageable pageable);
    Page<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod, Pageable pageable);
    Page<Payment> findByPaymentStatus(Payment.PaymentStatus paymentStatus, Pageable pageable);
    Payment findByTransactionReference(String transactionReference);
    Page<Payment> findByAmountBetween(BigDecimal min, BigDecimal max, Pageable pageable);
    Page<Payment> findByAmountGreaterThanEqual(BigDecimal min, Pageable pageable);
    Page<Payment> findByAmountLessThanEqual(BigDecimal max, Pageable pageable);
}