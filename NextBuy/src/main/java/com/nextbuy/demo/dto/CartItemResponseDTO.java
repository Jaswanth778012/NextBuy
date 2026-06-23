package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponseDTO {
    private Long id;
    private Integer quantity;
    private Double actualProdPrice;
    private Long productId;
    private String productName;
    private String productSlug;
    private String productImage;
    private Double productFinalPrice;
    private Double productMrpPrice;
    private Integer availableStock;
}