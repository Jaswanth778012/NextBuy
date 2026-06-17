package com.nextbuy.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.nextbuy.demo.enums.AlertStatus;
import com.nextbuy.demo.enums.AlertType;

import lombok.Data;

@Data
public class WishlistAlertResponseDto {

    private Long id;

    private Long productId;
    private String productName;
    private String productImageUrl;

    private BigDecimal currentPrice;
    private BigDecimal originalPrice;

    private AlertType alertType;
    private AlertStatus status;

    private BigDecimal targetPrice;

    private BigDecimal lastNotifiedPrice;
    private LocalDateTime lastNotifiedAt;

    private Integer notificationCount;

    private Boolean emailEnabled;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}