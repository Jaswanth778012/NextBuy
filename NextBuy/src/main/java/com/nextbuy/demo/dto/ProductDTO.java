package com.nextbuy.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.ProductCondition;
import com.nextbuy.demo.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor


public class ProductDTO {
	
private Long id;
	
	private String name;
	
	private String description;
	
	private String category;
	
	private Double mrp_price;
	
	private String imageUrl;
	
	private Integer stockQuantity;
	
	private Double discountPercentage=0.0; 
	
	private ProductCondition productCondition;
	
	private Brand brand;
	
	
	private AvailabilityStockStatus stockStatus;

	private Double totalRating;
	
	private Double averageRating;
	
	
	private ProductStatus productStatus;
	
	
	private LocalDate createdAt;
	
	private LocalDateTime updatedAt;
	
	
	private Map<String, String> attributes;
	
	private int deliveryTimeInDays;
	
	
	

}
