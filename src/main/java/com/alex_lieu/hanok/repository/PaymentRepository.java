package com.alex_lieu.hanok.repository;

import com.alex_lieu.hanok.model.CustomerOrder;
import com.alex_lieu.hanok.model.Payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrder(CustomerOrder customerOrder, Pageable pageable);
    List<Payment> findByPaymentMethod(Payment.PaymentMethod paymentMethod, Pageable pageable);
    List<Payment> findByPaymentStatus(Payment.PaymentStatus paymentStatus, Pageable pageable);
    Payment findByTransactionReference(String transactionReference, Pageable pageable);
    List<Payment> findByAmountBetween(BigDecimal min, BigDecimal max, Pageable pageable);
    List<Payment> findByAmountGreaterThanEqual(BigDecimal min, Pageable pageable);
    List<Payment> findByAmountLessThanEqual(BigDecimal max, Pageable pageable);
}