package com.nextbuy.demo.controller;


import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.PaymentVerificationDto;
import com.nextbuy.demo.service.PaymentService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/Payments")
public class PaymentController {
	
	private PaymentService paymentService;
	
	PaymentController(PaymentService paymentService){
		this.paymentService = paymentService;
	}
	
	
	@PostMapping("/verifyPayment")
	public String verifyPayment(@RequestBody PaymentVerificationDto request) {
		return paymentService.verifyPayment(request);
	}
	
	 @PostMapping("/refund/{orderId}")
	 public String refundPayment(@PathVariable Long orderId)
	 {
	    return paymentService.refundPayment(orderId);
	 }
	 
	 @PostMapping("/orders/{orderId}/retry-payment")
	 public JSONObject retryPayment(@PathVariable Long orderId) {
	     return paymentService.createRazorpayOrder(orderId);
	 }
}
