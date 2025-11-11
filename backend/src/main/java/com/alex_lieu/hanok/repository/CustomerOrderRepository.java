package com.alex_lieu.hanok.repository;

import com.alex_lieu.hanok.entity.CustomerOrder;
import com.alex_lieu.hanok.enums.PickupSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findOrderItemsByCustomerId(long id);

    @Query("SELECT o FROM CustomerOrder o " +
            "WHERE (:customerId IS NULL OR o.customer.id = :customerId) " +
            "AND (:orderStatus IS NULL OR o.orderStatus = :orderStatus) " +
            "AND (:orderDateTimeStart IS NULL OR o.orderDateTime >= :orderDateTimeStart) " +
            "AND (:orderDateTimeEnd IS NULL OR o.orderDateTime <= :orderDateTimeEnd) " +
            "AND (:pickupDateTimeStart IS NULL OR o.pickupDate >= :pickupDateTimeStart) " +
            "AND (:pickupDateTimeEnd IS NULL OR o.pickupDate <= :pickupDateTimeEnd)" +
            "AND (:pickupSlot IS NULL OR o.pickupSlot = :pickupSlot)")
    List<CustomerOrder> filterAll(
            @Param("customerId") Long customerId,
            @Param("orderStatus") CustomerOrder.OrderStatus orderStatus,
            @Param("orderDateTimeStart") ZonedDateTime orderDateTimeStart,
            @Param("orderDateTimeEnd") ZonedDateTime orderDateTimeEnd,
            @Param("pickupDateStart") LocalDate pickupDateStart,
            @Param("pickupDateEnd") LocalDate pickupDateEnd,
            @Param("pickupSlot") PickupSlot pickupSlot
    );
}