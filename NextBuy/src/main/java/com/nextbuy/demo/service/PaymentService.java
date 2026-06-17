	package com.nextbuy.demo.service;
	
	import java.io.File;
import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.PaymentVerificationDto;
import com.nextbuy.demo.entity.Cupon;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.OrderItem;
import com.nextbuy.demo.entity.Payment;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.UserCupon;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.enums.PaymentStatus;
import com.nextbuy.demo.repository.CuponRepository;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.PaymentRepository;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserCuponRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
	
	@Service
	@Transactional
	public class PaymentService {
	
		private  OrderRepository orderRepository;
		private  PaymentRepository paymentRepository;
		private ProductRepository productRepository;
		private CuponRepository cuponRepository;
		private UserCuponRepository userCuponRepository;
		
		private EmailService emailService;
		private InvoiceService invoiceService;
		@Value("${razorpay.key.id}")
		private String razorpayKeyId;
	
		@Value("${razorpay.key.secret}")
		private String razorpayKeySecret;
	
		public PaymentService(OrderRepository orderRepository, PaymentRepository paymentRepository, ProductRepository productRepository, EmailService emailService, InvoiceService invoiceService, CuponRepository cuponRepository, UserCuponRepository userCuponRepository) {
			this.orderRepository = orderRepository;
			this.paymentRepository = paymentRepository;
			this.productRepository = productRepository;
			this.emailService = emailService;
			this.invoiceService = invoiceService;
			this.cuponRepository = cuponRepository;
			this.userCuponRepository = userCuponRepository;
		}
		
		public JSONObject createRazorpayOrder(Long orderId) {
		    Order order = orderRepository.findById(orderId)
		            .orElseThrow(() -> new RuntimeException("Order not found"));
	
		    Payment payment = order.getPayment();
	
		    if (payment == null) {
		        throw new RuntimeException("Payment record not found");
		    }
	
		    try {
		        RazorpayClient razorpayClient =
		                new RazorpayClient(razorpayKeyId, razorpayKeySecret);
	
		        long amountInPaise = Math.round(payment.getAmount() * 100);
	
		        JSONObject options = new JSONObject();
		        options.put("amount", amountInPaise);
		        options.put("currency", "INR");
		        options.put("receipt", "order_" + order.getOrderNumber());
	
		        com.razorpay.Order razorpayOrder =
		                razorpayClient.orders.create(options);
	
		        payment.setRazorpayOrderId(razorpayOrder.get("id").toString());
		        payment.setPaymentStatus(PaymentStatus.PENDING);
	
		        paymentRepository.save(payment);
	
		        return razorpayOrder.toJson();
	
		    } catch (Exception e) {
		        throw new RuntimeException(
		                "Failed to create Razorpay order: " + e.getMessage()
		        );
		    }
		}
	
		public String refundPayment(Long orderId) {
		    Order order = orderRepository.findById(orderId)
		            .orElseThrow(() -> new RuntimeException("Order not found"));

		    Payment payment = order.getPayment();

		    if (payment == null) {
		        throw new RuntimeException("Payment not found");
		    }

		    if (payment.getPaymentStatus() != PaymentStatus.SUCCESS) {
		        throw new RuntimeException("Payment not completed");
		    }

		    if (payment.getRazorpayPaymentId() == null ||
		        !payment.getRazorpayPaymentId().startsWith("pay_")) {
		        throw new RuntimeException(
		                "Invalid Razorpay payment ID: " + payment.getRazorpayPaymentId());
		    }

		    try {
		        RazorpayClient razorpayClient =
		                new RazorpayClient(razorpayKeyId, razorpayKeySecret);

		       
		        int amountInPaise = (int) Math.round(payment.getAmount()*100);

		        JSONObject refundRequest = new JSONObject();
		        refundRequest.put("amount", amountInPaise);
		        refundRequest.put("speed", "normal"); // optional

		        System.out.println("Refund Payment ID: " + payment.getRazorpayPaymentId());
		        System.out.println("Refund Amount (paise): " + amountInPaise);

		        razorpayClient.payments.refund(
		                payment.getRazorpayPaymentId(),
		                refundRequest
		        );

		        payment.setPaymentStatus(PaymentStatus.REFUNDED);
		        paymentRepository.save(payment);

		        return "Refund processed successfully";

		    } catch (Exception e) {
		        e.printStackTrace();
		        throw new RuntimeException("Refund failed: " + e.getMessage(), e);
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
	
				product.setStockQuantity(
				        product.getStockQuantity() - item.getQuantity()
				);

				updateStockStatus(product);

				productRepository.save(product);
			}
	
			payment.setTransactionId(dto.getRazorpayPaymentId());
	
			payment.setRazorpayOrderId(dto.getRazorpayOrderId());
	
			payment.setRazorpayPaymentId(dto.getRazorpayPaymentId());
	
			payment.setRazorpaySignature(dto.getRazorpaySignature());
	
			payment.setPaymentStatus(PaymentStatus.SUCCESS);
	
			payment.setPaidAt(LocalDateTime.now());
	
			order.setStatus(OrderStatus.CONFIRMED);
			
			if (order.getAppliedCupon() != null) 
			{ 
				Cupon cupon = order.getAppliedCupon();  
				cupon.setUsageCount( cupon.getUsageCount() + 1 ); 
				cuponRepository.save(cupon); 
				
				UserCupon userCupon = new UserCupon(); 
				userCupon.setUser(order.getUser()); 
				userCupon.setCupon(cupon); 
				userCupon.setOrder(order); 
				userCupon.setUsedAt(LocalDateTime.now()); 
				userCuponRepository.save(userCupon); 
			}
			paymentRepository.save(payment);
			orderRepository.save(order);
			
			// generate invoice
			File invoicePdf =
			        invoiceService.generateInvoice(order);

			String subject =
			        "Payment Successful & Invoice - NextBuy";

			String body =
			        "Hello " + order.getUser().getUsername() + ",\n\n" +
			        "Your payment was successful.\n\n" +
			        "Order Number : " + order.getOrderNumber() + "\n" +
			        "Amount Paid : ₹" + order.getFinalPrice() + "\n\n" +
			        "Invoice PDF is attached.\n\n" +
			        "Thank you for shopping with NextBuy.";

			emailService.sendInvoiceEmail(
			        order.getUser().getEmail(),
			        subject,
			        body,
			        invoicePdf
			);

	
			return "Payment verified successfully";
		}
	
		private void updateStockStatus(Product product) {
			if (product.getStockQuantity() <= 0) {
				product.setStockStatus(AvailabilityStockStatus.OUT_OFF_STOCK);
	
				
			} else if (product.getStockQuantity() >= 100) {
				product.setStockStatus(AvailabilityStockStatus.AVAILABLE);
	
				
			} else {
				product.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
	
				
			}
		}
	}