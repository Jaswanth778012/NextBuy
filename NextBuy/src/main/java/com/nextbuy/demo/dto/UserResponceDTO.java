package com.nextbuy.demo.dto;


import java.util.Map;

import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.entity.Category;
import com.nextbuy.demo.entity.SubCategory;
import com.nextbuy.demo.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponceDTO {
  
	private Long id;
	
	private String name;
	
	private String description;
	
	private Category category;
	
	private SubCategory subCategory;
	
	private Double price;
	
	private String imageUrl;
	
	private Double discountPercentage; 
	
	private Brand brand;
	
	private Double averageRating;
	private Double finalPrice;
	
	private Map<String, String> attributes;
	
	private ProductStatus productStatus;
	
	private int deliveryTimeInDays;
	
	
	
	
}
