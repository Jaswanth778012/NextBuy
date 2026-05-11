package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentVerificationDto {
	private Long orderId;
	private String razorpayOrderId;
	private String razorpayPaymentId;
	private String razorpaySignature;
}
