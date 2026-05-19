package com.nextbuy.demo.dto;

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
	    private String category;
	    private String img;
	    private Integer stockQuantity;
}
