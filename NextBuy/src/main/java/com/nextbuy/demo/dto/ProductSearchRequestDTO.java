package com.nextbuy.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor


public class ProductSearchRequestDTO {
	 private List<String> categories;
	    private List<String> subCategories;
	    
}
