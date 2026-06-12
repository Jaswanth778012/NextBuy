package com.nextbuy.demo.dto;

import java.math.BigDecimal;

import com.nextbuy.demo.enums.AlertType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateWishlistAlertRequestDto {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Alert type is required")
    private AlertType alertType;

    @DecimalMin(
            value = "0.01",
            inclusive = true,
            message = "Target price must be greater than 0"
    )
    private BigDecimal targetPrice;

    private Boolean emailEnabled = true;
}