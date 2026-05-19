package com.nextbuy.demo.entity;

import java.time.LocalDateTime;

import com.nextbuy.demo.enums.PaymentMethod;
import com.nextbuy.demo.enums.PaymentStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
	
	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @OneToOne
	    @JoinColumn(name = "order_id")
	    private Order order;

	    private String transactionId;


	    private String razorpayOrderId;
	    private String razorpayPaymentId;
	    private String razorpaySignature;

	    @Enumerated(EnumType.STRING)
	    private PaymentMethod paymentMethod;

	    @Enumerated(EnumType.STRING)
	    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

	    private Double amount;

	    private LocalDateTime paidAt;
}
