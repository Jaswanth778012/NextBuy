package com.nextbuy.demo.dto;


import java.util.Map;

import com.nextbuy.demo.entity.Brand;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponceDTO {
  

	
	private String name;
	
	private String description;
	
	private String category;
	
	private Double price;
	
	private String imageUrl;
	
	private Double dis_count; 
	
	private Brand brand;
	
	private Double averageRating;
	
	private Map<String, String> attributes;
	
	private int deliveryTimeInDays;
	
	
}
