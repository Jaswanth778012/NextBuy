package com.nextbuy.demo.dto;


import java.util.Map;

import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.entity.Category;
import com.nextbuy.demo.entity.SubCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponceDTO {
  

	
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
	
	private int deliveryTimeInDays;
	
	
}
