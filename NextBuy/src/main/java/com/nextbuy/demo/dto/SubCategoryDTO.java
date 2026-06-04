package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubCategoryDTO {
	
	private Long id;
	
	private String name;
	
	private String description;
	
	private Long categoryId;
	
	private String categoryName;
}
