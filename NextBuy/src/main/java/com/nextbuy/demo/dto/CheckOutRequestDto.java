package com.nextbuy.demo.dto;

import com.nextbuy.demo.enums.PaymentMethod;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckOutRequestDto {
	private Long addressId;
	private PaymentMethod paymentMethod;
}
