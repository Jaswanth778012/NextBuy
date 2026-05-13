package com.nextbuy.demo.service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.CheckOutRequestDto;
import com.nextbuy.demo.dto.CheckOutResponseDto;
import com.nextbuy.demo.entity.Address;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.CartItem;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.OrderItem;
import com.nextbuy.demo.entity.Payment;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.enums.PaymentMethod;
import com.nextbuy.demo.enums.PaymentStatus;
import com.nextbuy.demo.repository.AddressRepository;
import com.nextbuy.demo.repository.CartRepository;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.UserRepository;
import com.razorpay.RazorpayClient;


@Service
public class OrderService {
	private UserRepository userRepo;
	private CartRepository cartRepo;
	private AddressRepository addressRepo;
	private OrderRepository orderRepo;
	
	public OrderService(UserRepository userRepo, CartRepository cartRepo, AddressRepository addressRepo, OrderRepository orderRepo)
	{
		this.userRepo = userRepo;
		this.cartRepo = cartRepo;
		this.addressRepo = addressRepo;
		this.orderRepo = orderRepo;
	}
	
	@Value("${razorpay.key.id}")
	private String razorpayKeyId;
	
	@Value("${razorpay.key.secret}")
	private String razorpayKeySecret;
	
	public CheckOutResponseDto checkout(String username, CheckOutRequestDto dto)
	{
		User user = userRepo.findByUsername(username).orElseThrow(()-> new RuntimeException("User Not Found"));
		
		 Cart cart = cartRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Cart Not Found"));
		 
		 if(cart.getCartItems() == null || cart.getCartItems().isEmpty())
		 {
			 throw new RuntimeException("Cart is Empty");
		 }
		 
		 Address address = addressRepo.findByIdAndUser(dto.getAddressId(), user).orElseThrow(() -> new RuntimeException("Address Not Found"));
		 
		 Order order = new Order();
		 order.setUser(user);
		 order.setShippingAddress(address);
		 order.setAppliedCupon(cart.getAppliedCupon());
		 
		 order.setTotalPrice(cart.getTotalPrice());
		 order.setDiscount(cart.getDiscount());
		 order.setCouponDiscount(cart.getCuponDiscount());
		 order.setShippingCharges(cart.getShipingCharges());
		 order.setFinalPrice(cart.getFinalPrice());
		 
		 if(dto.getPaymentMethod() == PaymentMethod.COD) {
			 order.setStatus(OrderStatus.CONFIRMED);
		 }
		 else
		 {
			 order.setStatus(OrderStatus.PENDING);
		 }
		 
		 List<OrderItem> orderItems = new ArrayList<>();
		 
		 for(CartItem cartItem: cart.getCartItems()) {
			 OrderItem item = new OrderItem();
			 item.setOrder(order);
			 item.setProduct(cartItem.getProduct());
			 item.setQuantity(cartItem.getQuantity());
			 item.setPrice(cartItem.getProduct().getFinalPrice());
			 item.setSubtotal(cartItem.getSubtotal());
			 orderItems.add(item);
		 }
		 
		 order.setOrderItems(orderItems);
		 
		 Payment payment = new Payment();
		 payment.setOrder(order);
		 payment.setPaymentMethod(dto.getPaymentMethod());
		 payment.setAmount(order.getFinalPrice());
		 payment.setPaymentStatus(PaymentStatus.PENDING);
		 
		 if (dto.getPaymentMethod() == PaymentMethod.RAZORPAY) {
			    try {
			        RazorpayClient razorpayClient =
			                new RazorpayClient(razorpayKeyId, razorpayKeySecret);

			        JSONObject options = new JSONObject();
			        options.put("amount", (int) (order.getFinalPrice() * 100)); // paise
			        options.put("currency", "INR");
			        options.put("receipt", "order_" + System.currentTimeMillis());

			        com.razorpay.Order razorpayOrder =
			                razorpayClient.orders.create(options);

			        payment.setRazorpayOrderId(razorpayOrder.get("id"));
			    } catch (Exception e) {
			        throw new RuntimeException(
			                "Failed to create Razorpay order: " + e.getMessage());
			    }
			}
		 
		 
		 order.setPayment(payment);
		 
		 Order savedOrder = orderRepo.save(order);
		 
		 cart.getCartItems().clear();
		 cart.setTotalPrice(0.0);
		 cart.setDiscount(0.0);
		 cart.setFinalPrice(0.0);
		 cart.setShipingCharges(0.0);
		 cart.setCuponDiscount(0.0);
		 cart.setAppliedCupon(null);
		 cart.setUpdatedAt(LocalDateTime.now());
		 
		 cartRepo.save(cart);
		 
		 return new CheckOutResponseDto(savedOrder.getId(), savedOrder.getOrderNumber(), savedOrder.getPayment() != null ? savedOrder.getPayment().getRazorpayOrderId(): null, savedOrder.getFinalPrice(), null, "INR");
	}
	
	public List<Order> getMyOrders(String username)
	{
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		return orderRepo.findByUserOrderByOrderedAtDesc(user);
	}
	
	public Order getOrderById(String username, Long orderId)
	{
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		return orderRepo.findByIdAndUser(orderId, user).orElseThrow(()-> new RuntimeException("Order Not Found"));
	}
	
	public String cancelOrder(String username, Long orderId)
	{
		Order order = getOrderById(username, orderId);
		
		if(order.getStatus() == OrderStatus.DELIVERED) {
			throw new RuntimeException("Delivered Order cannot be Cancelled");
		}
		
		order.setStatus(OrderStatus.CANCELLED);
		order.setCancelledAt(LocalDateTime.now());
		
		if(order.getPayment() != null && order.getPayment().getPaymentStatus() == PaymentStatus.SUCCESS)
		{
			order.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
		}
		
		orderRepo.save(order);
		
		return "Order Cancelled Successfully";
	}
}
