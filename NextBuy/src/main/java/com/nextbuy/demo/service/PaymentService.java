package com.nextbuy.demo.service;

import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.PaymentVerificationDto;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.OrderItem;
import com.nextbuy.demo.entity.Payment;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.enums.PaymentStatus;
import com.nextbuy.demo.enums.ProductStatus;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

@Service
@Transactional
public class PaymentService {

	private final OrderRepository orderRepository;
	private final PaymentRepository paymentRepository;

	@Value("${razorpay.key.id}")
	private String razorpayKeyId;

	@Value("${razorpay.key.secret}")
	private String razorpayKeySecret;

	public PaymentService(OrderRepository orderRepository, PaymentRepository paymentRepository) {
		this.orderRepository = orderRepository;
		this.paymentRepository = paymentRepository;
	}

	public String refundPayment(Long orderId) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		Payment payment = order.getPayment();

		if (payment == null) {
			throw new RuntimeException("Payment not found");
		}

		if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
			throw new RuntimeException("Payment not completed");
		}

		try {

			RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

			JSONObject refundRequest = new JSONObject();

			refundRequest.put("amount", (int) (payment.getAmount() * 100));

			razorpayClient.payments.refund(payment.getRazorpayPaymentId(), refundRequest);

			payment.setPaymentStatus(PaymentStatus.REFUNDED);

			paymentRepository.save(payment);

			return "Refund processed successfully";

		} catch (Exception e) {

			throw new RuntimeException("Refund failed: " + e.getMessage());
		}
	}

	public String refundPartialPayment(Long orderId, Double refundAmount) {
		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		Payment payment = order.getPayment();

		if (payment == null) {
			throw new RuntimeException("Payment not found");
		}

		if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
			throw new RuntimeException("Payment not completed");
		}

		try {

			RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

			JSONObject refundRequest = new JSONObject();

			refundRequest.put("amount", (int) (refundAmount * 100));

			razorpayClient.payments.refund(payment.getRazorpayPaymentId(), refundRequest);

			return "Partial refund processed";

		} catch (Exception e) {

			throw new RuntimeException("Refund failed: " + e.getMessage());
		}
	}
	public String verifyPayment(PaymentVerificationDto dto) {
		Order order = orderRepository.findById(dto.getOrderId())
				.orElseThrow(() -> new RuntimeException("Order not found"));

		Payment payment = order.getPayment();

		if (payment == null) {
			throw new RuntimeException("Payment record not found");
		}

		if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {
			return "Payment already verified";
		}

		try {

			JSONObject options = new JSONObject();

			options.put("razorpay_order_id", dto.getRazorpayOrderId());

			options.put("razorpay_payment_id", dto.getRazorpayPaymentId());

			options.put("razorpay_signature", dto.getRazorpaySignature());

			boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

			if (!isValid) {
				payment.setPaymentStatus(PaymentStatus.FAILED);

				paymentRepository.save(payment);

				throw new RuntimeException("Invalid payment signature");
			}

		} catch (Exception e) {

			payment.setPaymentStatus(PaymentStatus.FAILED);

			paymentRepository.save(payment);

			throw new RuntimeException("Payment verification failed: " + e.getMessage());
		}

		if (payment.getRazorpayOrderId() != null && !payment.getRazorpayOrderId().equals(dto.getRazorpayOrderId())) {
			payment.setPaymentStatus(PaymentStatus.FAILED);

			paymentRepository.save(payment);

			throw new RuntimeException("Razorpay order ID mismatch");
		}

		// reduce stock AFTER successful payment
		for (OrderItem item : order.getOrderItems()) {
			Product product = item.getProduct();

			if (product.getStockQuantity() < item.getQuantity()) {
				throw new RuntimeException(product.getName() + " is out of stock");
			}

			product.setStockQuantity(product.getStockQuantity() - item.getQuantity());

			updateStockStatus(product);
		}

		payment.setTransactionId(dto.getRazorpayPaymentId());

		payment.setRazorpayOrderId(dto.getRazorpayOrderId());

		payment.setRazorpayPaymentId(dto.getRazorpayPaymentId());

		payment.setRazorpaySignature(dto.getRazorpaySignature());

		payment.setPaymentStatus(PaymentStatus.SUCCESS);

		payment.setPaidAt(LocalDateTime.now());

		order.setStatus(OrderStatus.CONFIRMED);

		paymentRepository.save(payment);
		orderRepository.save(order);

		return "Payment verified successfully";
	}

	private void updateStockStatus(Product product) {
		if (product.getStockQuantity() <= 0) {
			product.setStockStatus(AvailabilityStockStatus.OutOff_Stock);

			
		} else if (product.getStockQuantity() >= 100) {
			product.setStockStatus(AvailabilityStockStatus.AVAILABLE);

			
		} else {
			product.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);

			
		}
	}
}