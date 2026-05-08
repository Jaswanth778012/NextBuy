package com.nextbuy.demo.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CuponRequestDto {
	
		private String code;

	    private Double discountPercentage;

	    private Double minimumAmount;

	    private LocalDateTime expiryDate;

	    private boolean active;
}
