package com.nextbuy.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
    private Long id;
    private Double totalPrice = 0.0;
    private Double discount = 0.0;
    private Double finalPrice = 0.0;
    private Double shippingCharges = 0.0;
    private Double cuponDiscount = 0.0;
    private String appliedCouponCode;
    private Double couponDiscountPercent;
    private int itemCount;
    private List<CartItemResponseDTO> items;
}