package com.nextbuy.demo.service;



import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.PaymentVerificationDto;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.Payment;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.enums.PaymentStatus;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.PaymentRepository;
import com.razorpay.Utils;

@Service
@Transactional
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    public String verifyPayment(PaymentVerificationDto dto) {

        // 1. Fetch order
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 2. Fetch payment
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

            boolean isValid =
                    Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (!isValid) {
                payment.setPaymentStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
                throw new RuntimeException("Invalid payment signature");
            }

        } catch (Exception e) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new RuntimeException(
                    "Payment verification failed: " + e.getMessage());
        }

        // 5. Ensure Razorpay order ID matches what was created during checkout
        if (payment.getRazorpayOrderId() != null &&
            !payment.getRazorpayOrderId().equals(dto.getRazorpayOrderId())) {
            payment.setPaymentStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new RuntimeException("Razorpay order ID mismatch");
        }

       
        payment.setTransactionId(dto.getRazorpayPaymentId());
        payment.setRazorpayOrderId(dto.getRazorpayOrderId());
        payment.setRazorpayPaymentId(dto.getRazorpayPaymentId());
        payment.setRazorpaySignature(dto.getRazorpaySignature());
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());

        
        order.setStatus(OrderStatus.CONFIRMED);

        // 8. Save changes
        paymentRepository.save(payment);
        orderRepository.save(order);

        return "Payment verified successfully";
    }
}

