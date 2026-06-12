package com.nextbuy.demo.dto;

import java.time.LocalDateTime;

import com.nextbuy.demo.enums.CuponStatus;

import lombok.Data;

@Data
public class CuponRequestDto {
	
		private String code;
		
		private String description;

	    private Double discountPercentage;

	    private Double minimumAmount;

	    private LocalDateTime expiryDate;

	    private CuponStatus cuponStatus;
}
