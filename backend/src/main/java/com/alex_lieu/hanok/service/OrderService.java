package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.*;
import com.alex_lieu.hanok.entity.*;
import com.alex_lieu.hanok.repository.CustomerOrderRepository;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final static Logger log = LoggerFactory.getLogger(OrderService.class);

    private final CustomerOrderRepository customerOrderRepository;
    private final String defaultCountryCode;
    private final PersonService personService;
    private final ProductService productService;

    @Autowired
    public OrderService(
            CustomerOrderRepository customerOrderRepository,
            String defaultCountryCode,
            PersonService personService,
            ProductService productService
    ) {
        this.customerOrderRepository = customerOrderRepository;
        this.defaultCountryCode = defaultCountryCode;
        this.personService = personService;
        this.productService = productService;
    }

    /**
     * What functionality do we want here?
     * - To view all order belonging to a customer.
     * - Params: customerDTO
     * - To view an order with all the order items listed.
     * - Params: orderDTO (which should have an orderItemListDTO as a parameter)
     * - To create an order.
     * - Params: orderItemListDTO, customerDto, specialInstructions, paymentDTO?
     * - Unit price should default to the price of the product item.
     * - To update an order (functionality for staff members only)
     * - Params: orderDTO & updateOrderDTO (this should include only pickupDateTime, orderStatus)
     */

    public CustomerOrder getOrderById(long id) {
        return customerOrderRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));
    }

    public List<OrderViewDto> getOrders() {
        return customerOrderRepository.findAll().stream().map(
                order -> createOrderDto(order, order.getCustomer())
        ).toList();
    }

    public OrderViewDto createOrderDto(CustomerOrder customerOrder, Person person) {
        return new OrderViewDto(
                customerOrder.getId(),
                customerOrder.getOrderDateTime(),
                customerOrder.getPickupDateTime(),
                customerOrder.getOrderStatus(),
                customerOrder.getTotal(),
                customerOrder.getSpecialInstructions(),
                customerOrder.getOrderItems().stream().map(this::createOrderItemDto).toList(),
                PersonMapper.toPersonDto(person)
        );
    }

    public OrderItemViewDto createOrderItemDto(OrderItem orderItem) {
        ProductVariant variant = orderItem.getVariant();
        return new OrderItemViewDto(
                variant.getProduct()
                        .getName(),
                variant.getFlavour(),
                variant.getSize(),
                orderItem.getQuantity(),
                orderItem.getSubtotal(),
                orderItem.getNotes()
        );
    }

    public List<OrderViewDto> filterAll(
            Long customerId,
            CustomerOrder.OrderStatus orderStatus,
            LocalDateTime orderDateTimeStart,
            LocalDateTime orderDateTimeEnd,
            LocalDateTime pickupDateTimeStart,
            LocalDateTime pickupDateTimeEnd
    ) {
        return customerOrderRepository.filterAll(
                        customerId, orderStatus, orderDateTimeStart, orderDateTimeEnd, pickupDateTimeStart, pickupDateTimeEnd)
                .stream().map(order -> createOrderDto(order, order.getCustomer())).toList();
    }

    public List<CustomerOrder> getOrderItemsForOrder(long id) {
        CustomerOrder customerOrder = getOrderById(id);
        return customerOrderRepository.findOrderItemsByCustomerId(id);
    }

    public String standardizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return null;
        }
        PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
        try {
            Phonenumber.PhoneNumber parsedNumber = phoneUtil.parse(phoneNumber, defaultCountryCode);
            if (phoneUtil.isValidNumber(parsedNumber)) {
                return phoneUtil.format(parsedNumber, PhoneNumberUtil.PhoneNumberFormat.E164);
            } else {
                throw new OrderExceptions.InvalidOrderDataException(MessageFormat.format("Invalid {0} phone number", defaultCountryCode));
            }
        } catch (com.google.i18n.phonenumbers.NumberParseException e) {
            throw new OrderExceptions.InvalidOrderDataException("Invalid phone number format", e);
        }
    }

    @Transactional
    public OrderConfirmationDto placeOrder(OrderCreateDto orderCreateDto) {
        Person customerUser = null;
        if (orderCreateDto.customerId() != null) {
            customerUser = personService.findById(orderCreateDto.customerId());
        }
        String standardizedPhoneNumber = standardizePhoneNumber(orderCreateDto.phoneNumber());
        CustomerOrder order = CustomerOrder.builder()
                .customer(customerUser)
                .orderStatus(CustomerOrder.OrderStatus.PENDING)
                .email(orderCreateDto.email())
                .customerName(orderCreateDto.customerName())
                .phoneNumber(standardizedPhoneNumber)
                .specialInstructions(orderCreateDto.specialInstructions())
                .build();
        order.setOrderItems(orderCreateDto.createOrderItemDtoList()
                .stream()
                .map(i -> {
                    ProductVariant variant = productService.getActiveProductVariantById(i.productVariantId());
                    return OrderItem.builder()
                            .order(order)
                            .variant(variant)
                            .quantity(i.quantity() == null ? 1 : i.quantity())
                            .unitPrice(variant.getPrice())
                            .notes(i.notes())
                            .build();
        }).toList());
        order.setPayment(Payment.builder()
                .amount(order.getOrderItems().stream().map(OrderItem::getSubtotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                .paymentStatus(orderCreateDto.paymentCreateDto().paymentStatus())
                .paymentMethod(orderCreateDto.paymentCreateDto().paymentMethod())
                .order(order)
                .build());
        try {
            CustomerOrder savedOrder = customerOrderRepository.save(order);
            return OrderConfirmationDto.fromOrder(savedOrder);
        } catch (PaymentExceptions.OrderPlacementFailedException e) {
            throw new PaymentExceptions.OrderPlacementFailedException(e.getMessage(), e);
        }
    }

    @Transactional
    public OrderViewDto updateOrder(long id, OrderUpdateDto updateDto) {
        CustomerOrder order = getOrderById(id);

        Optional<LocalDateTime> updatedPickupDateTime = Optional.ofNullable(updateDto.pickupDateTime());
        updatedPickupDateTime.ifPresent(p -> {
            if (! p.isAfter(order.getOrderDateTime()))
                throw new IllegalArgumentException("Pickup date: " + p + " cannot be before the Order date: " + order.getOrderDateTime());
            order.setPickupDateTime(p);
        });
        if (updateDto.orderStatus() != null) order.setOrderStatus(updateDto.orderStatus());
        if (updateDto.specialInstructions() != null) order.setSpecialInstructions(updateDto.specialInstructions());
        if (updateDto.items() != null) updateItems(order, updateDto.items());
        try {
            CustomerOrder savedOrder = customerOrderRepository.save(order);
            return createOrderDto(savedOrder, savedOrder.getCustomer());
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalStateException("Database integrity violation: " + ex.getMessage(), ex);
        } catch (ConstraintViolationException ex) {
            throw new IllegalStateException("Constraint violation occured: " + ex.getMessage(), ex);
        } catch (PersistenceException ex) {
            Throwable cause = ex.getCause();
            if (cause != null && cause.getMessage()
                    .contains("unique")) {
                throw new IllegalStateException("Duplicate entry detected", ex);
            }
            throw new IllegalStateException("An unexpected persistence error occurred", ex);
        }
    }

    private void updateItems(CustomerOrder order, List<OrderItemUpdateDto> updateDtos) {
        Map<Long, OrderItem> existingItems = order.getOrderItems().stream()
                .collect(Collectors.toMap(o -> o.getVariant().getId(), Function.identity()));

        for (OrderItemUpdateDto updateDto : updateDtos) {
            ProductVariant variant = productService.getActiveProductVariantById(updateDto.variantId());
            Optional<OrderItem> existingItem = Optional.ofNullable(existingItems.get(variant.getId()));
            existingItem.ifPresentOrElse(
                    i -> updateOrderItemFromDto(i, updateDto),
                    () -> order.getOrderItems().add(createOrderItemFromDto(order, variant, updateDto))
            );
        }
    }

    private OrderItem createOrderItemFromDto(CustomerOrder order, ProductVariant variant, OrderItemUpdateDto dto) {
        return OrderItem.builder()
                .order(order)
                .variant(variant)
                .unitPrice(variant.getPrice())
                .quantity((dto.quantity() == null) ? 1 : dto.quantity())
                .notes(nullIfEmptyOrBlankSpace(dto.notes()))
                .build();
    }

    private void updateOrderItemFromDto(OrderItem item, OrderItemUpdateDto dto) {
        if (dto.quantity() != null) item.setQuantity(dto.quantity());
        if (dto.notes() != null) item.setNotes(dto.notes()
                .trim());
        item.setNotes(nullIfEmptyOrBlankSpace(dto.notes()));
    }

    public String nullIfEmptyOrBlankSpace(String str) {
        return (str == null || str.isBlank()) ? null : str.trim();
    }

}
