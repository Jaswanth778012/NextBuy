package com.nextbuy.demo.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CuponRequestDto {
	
		private String code;

	    private Double discountPercentage;

	    private Double minimumAmount;

	    private LocalDate expiryDate;

	    private boolean active;
}
