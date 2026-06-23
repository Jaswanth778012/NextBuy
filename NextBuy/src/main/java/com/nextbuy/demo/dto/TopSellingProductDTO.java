package com.nextbuy.demo.dto;

import java.util.List;

import com.nextbuy.demo.entity.Category;
import com.nextbuy.demo.entity.SubCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopSellingProductDTO {
	
	 private Long productId;
	    private String productName;
	    private Long totalSold;
	    private Category category;
	    private SubCategory subCategory;
	    private List<String> img;
	    private Integer stockQuantity;
}
