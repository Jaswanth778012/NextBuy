package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckOutResponseDto {
	
	private Long OrderId;
	private String OrderNumber;
	private String razorpayOrderId;
	private Double amount;
	private String key;
	private String currency;
}
