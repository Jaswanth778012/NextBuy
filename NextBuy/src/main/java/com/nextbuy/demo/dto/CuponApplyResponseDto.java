package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CuponApplyResponseDto {

    private Boolean valid;

    private String couponCode;

    private Double discountPercentage;

    private Double discountAmount;

    private Double cartTotal;

    private Double shippingCharges;

    private Double finalPrice;

    private String message;
}