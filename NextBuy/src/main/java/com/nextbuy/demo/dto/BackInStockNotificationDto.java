package com.nextbuy.demo.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackInStockNotificationDto {

    private Long userId;

    private String userEmail;
    private String userName;

    private Long productId;
    private String productName;
    private String productUrl;

    private BigDecimal currentPrice;

    private Integer stockQuantity;
}