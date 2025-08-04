package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.order.OrderItemRequestDto;
import com.alex_lieu.hanok.dto.order.OrderRequestDto;
import com.alex_lieu.hanok.dto.order.OrderSuccessDto;
import com.alex_lieu.hanok.entity.*;
import com.alex_lieu.hanok.exceptions.order.OrderPlacementFailedException;
import com.alex_lieu.hanok.exceptions.order.PaymentFailedException;
import com.alex_lieu.hanok.repository.CustomerOrderRepository;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderProcessingService {
    private final ProductService productService;
    private final PersonService personService;
    private final CustomerOrderRepository customerOrderRepository;
    private final PaymentService paymentService;

    public OrderProcessingService(ProductService productService, PersonService personService, CustomerOrderRepository customerOrderRepository, PaymentService paymentService) {
        this.productService = productService;
        this.personService = personService;
        this.customerOrderRepository = customerOrderRepository;
        this.paymentService = paymentService;
    }

    public OrderItem convertToOrderItem(OrderItemRequestDto dto) {
        ProductVariant product = productService.getActiveProductVariantById(dto.produceVariantId());
        return OrderItem.builder()
                .variant(product)
                .unitPrice(product.getPrice())
                .quantity(dto.quantity())
                .notes(Optional.ofNullable(dto.notes())
                        .map(n -> n.trim().replaceAll("//s+", " "))
                        .orElse(null))
                .build();
    }

    @Transactional
    public OrderSuccessDto processOrder(OrderRequestDto dto) throws PaymentFailedException, OrderPlacementFailedException {
        Person customer = null;
        if (dto.customerId() != null) {
            customer = personService.findById(Long.parseLong(dto.customerId()));
        }
        String canonicalPhoneNumber = null;
        if (dto.phoneNumber() != null) {
            try {
                PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
                Phonenumber.PhoneNumber parsedNumber = phoneUtil.parse(dto.phoneNumber(), "ZZ");
                canonicalPhoneNumber = phoneUtil.format(parsedNumber, PhoneNumberUtil.PhoneNumberFormat.E164);
            } catch (NumberParseException e) {
                throw new OrderPlacementFailedException(
                        0, dto.customerName(), "The provided phone number is invalid", "INVALID_PHONE_NUMBER_FORMAT", dto.payment()
                        .total(), "GBP", e
                );
            }
        }
        CustomerOrder order = CustomerOrder.builder()
                .customerName(dto.customerName())
                .customer(customer)
                .phoneNumber(canonicalPhoneNumber)
                .email(dto.email())
                .orderItems(dto.orderItems().stream().map(this::convertToOrderItem).collect(Collectors.toList()))
                .pickupDate(dto.pickupDate())
                .build();
        BigDecimal total = order.getTotal();
        Payment payment = paymentService.processPaymentForOrder(dto.payment(), total);
        payment.setOrder(order);
        order.setPayment(payment);
        try {
            CustomerOrder savedOrder = customerOrderRepository.save(order);
            return OrderSuccessDto.fromEntity(savedOrder);
        } catch (DataIntegrityViolationException e) {
            throw new OrderPlacementFailedException(
                    0, dto.customerId(), "Order could not be placed due to a data integrity issue (e.g., duplicate entry)",
                    "DATABASE_CONSTRAINT_VIOLATION", total, "GBP", e);
        } catch (RuntimeException e) {
            throw new OrderPlacementFailedException(
                    0, dto.customerId(), "An unexpected occured while saving order to the database", "PERSISTENCE_GENERIC_ERROR", total, "GBP", e
            );
        }
    }
}
