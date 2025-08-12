package com.alex_lieu.hanok.service;

import com.alex_lieu.hanok.dto.basket.GetBasketItemResponseDto;
import com.alex_lieu.hanok.dto.basket.GetBasketResponseDto;
import com.alex_lieu.hanok.entity.CustomerOrder;
import com.alex_lieu.hanok.entity.OrderItem;
import com.alex_lieu.hanok.entity.ProductVariant;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class BasketService {
    private final ProductService productService;

    public BasketService(ProductService productService) {
        this.productService = productService;
    }

    public GetBasketResponseDto getBasket(List<Long> itemIds, List<Integer> quantities) {
        if (itemIds.size() != quantities.size()) {
            throw new IllegalArgumentException("The number of provided items (" + itemIds.size() + ") does not match the number of provided quantities (" + quantities.size() + ").");
        }
        List<OrderItem> orderItems = new ArrayList<>();
        List<GetBasketItemResponseDto> basketItemsResponse = IntStream.range(0, itemIds.size()).mapToObj(i -> {
            long variantId = itemIds.get(i);
            int quantity = quantities.get(i);
            ProductVariant variant = productService.getActiveProductVariantById(variantId);
            OrderItem orderItem = OrderItem.builder()
                    .variant(variant)
                    .quantity(quantity)
                    .unitPrice(variant.getPrice())
                    .build();
            orderItems.add(orderItem);
            return new GetBasketItemResponseDto(
                    variant.getProduct().getName(),
                    variant.getFlavour(),
                    variant.getSize(),
                    orderItem.getUnitPrice(),
                    orderItem.getSubtotal(),
                    variantId,
                    quantity
            );
        }).toList();
        CustomerOrder orderForTotal = CustomerOrder.builder().orderItems(orderItems).build();
        return new GetBasketResponseDto(
                basketItemsResponse,
                orderForTotal.getTotal()
        );
    }
}
