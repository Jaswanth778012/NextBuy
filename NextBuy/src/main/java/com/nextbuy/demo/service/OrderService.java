package com.nextbuy.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.CheckOutRequestDto;
import com.nextbuy.demo.dto.CheckOutResponseDto;
import com.nextbuy.demo.entity.Address;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.CartItem;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.OrderItem;
import com.nextbuy.demo.entity.Payment;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.OrderItemStatus;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.enums.PaymentMethod;
import com.nextbuy.demo.enums.PaymentStatus;
import com.nextbuy.demo.repository.AddressRepository;
import com.nextbuy.demo.repository.CartRepository;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
@Transactional
public class OrderService {

	private UserRepository userRepo;
	private CartRepository cartRepo;
	private AddressRepository addressRepo;
	private OrderRepository orderRepo;
	private PaymentService paymentService;

	public OrderService(UserRepository userRepo, CartRepository cartRepo, AddressRepository addressRepo,
			OrderRepository orderRepo, PaymentService paymentService) {
		this.userRepo = userRepo;
		this.cartRepo = cartRepo;
		this.addressRepo = addressRepo;
		this.orderRepo = orderRepo;
		this.paymentService = paymentService;
	}

	@Value("${razorpay.key.id}")
	private String razorpayKeyId;

	@Value("${razorpay.key.secret}")
	private String razorpayKeySecret;

	public CheckOutResponseDto checkout(String username, CheckOutRequestDto dto) {
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));

		Cart cart = cartRepo.findByUser(user).orElseThrow(() -> new RuntimeException("Cart Not Found"));

		if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
			throw new RuntimeException("Cart is Empty");
		}

		Address address = addressRepo.findByIdAndUser(dto.getAddressId(), user)
				.orElseThrow(() -> new RuntimeException("Address Not Found"));

		
		Order order = new Order();
		order.setUser(user);
		order.setShippingAddress(address);
		order.setAppliedCupon(cart.getAppliedCupon());

		order.setTotalPrice(cart.getTotalPrice());
		order.setDiscount(cart.getDiscount());
		order.setCouponDiscount(cart.getCuponDiscount());
		order.setShippingCharges(cart.getShipingCharges());
		order.setFinalPrice(cart.getFinalPrice());

		if (dto.getPaymentMethod() == PaymentMethod.COD) {
			order.setStatus(OrderStatus.CONFIRMED);
		} else {
			order.setStatus(OrderStatus.PENDING);
		}

		List<OrderItem> orderItems = new ArrayList<>();

		for (CartItem cartItem : cart.getCartItems()) {
			Product product = cartItem.getProduct();

			// check stock
			if (product.getStockQuantity() < cartItem.getQuantity()) {
				throw new RuntimeException(product.getName() + " has insufficient stock");
			}

			// reduce stock only for COD
			if (dto.getPaymentMethod() == PaymentMethod.COD) {
				reduceStock(product, cartItem.getQuantity());
			}

			OrderItem item = new OrderItem();

			item.setOrder(order);
			item.setProduct(product);
			item.setQuantity(cartItem.getQuantity());
			item.setFinalPrice(product.getFinalPrice());
			item.setActualProdPrice(cartItem.getActualProdPrice());
			item.setStatus(OrderItemStatus.ACTIVE);

			orderItems.add(item);
		}

		order.setOrderItems(orderItems);

		Payment payment = new Payment();

		payment.setOrder(order);
		payment.setPaymentMethod(dto.getPaymentMethod());
		payment.setAmount(order.getFinalPrice());
		payment.setPaymentStatus(PaymentStatus.PENDING);
		
		order.setPayment(payment);
		
		Order savedOrder = orderRepo.save(order);

		if (dto.getPaymentMethod() == PaymentMethod.RAZORPAY) {
			 paymentService.createRazorpayOrder(savedOrder.getId());

			    savedOrder = orderRepo.findById(savedOrder.getId())
			            .orElseThrow(() -> new RuntimeException("Order not found"));   
		}
		
		// clear cart
		cart.getCartItems().clear();
		cart.setTotalPrice(0.0);
		cart.setDiscount(0.0);
		cart.setFinalPrice(0.0);
		cart.setShipingCharges(0.0);
		cart.setCuponDiscount(0.0);
		cart.setAppliedCupon(null);
		cart.setUpdatedAt(LocalDateTime.now());

		cartRepo.save(cart);

		return new CheckOutResponseDto(savedOrder.getId(), savedOrder.getOrderNumber(),
				savedOrder.getPayment() != null ? savedOrder.getPayment().getRazorpayOrderId() : null,
				savedOrder.getFinalPrice(), razorpayKeyId, "INR");
	}

	public List<Order> getMyOrders(String username) {
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));

		return orderRepo.findByUserOrderByOrderedAtDesc(user);
	}

	public Order getOrderById(String username, Long orderId) {
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));

		return orderRepo.findByIdAndUser(orderId, user).orElseThrow(() -> new RuntimeException("Order Not Found"));
	}

	public List<Order> getReturnedOrders(String username) {
		User user = userRepo.findByUsername(username).orElseThrow(() -> new RuntimeException("User Not Found"));

		return orderRepo.findByUserAndStatusOrderByOrderedAtDesc(user, OrderStatus.RETURNED);
	}

	public String returnOrder(String username, Long orderId) {
		Order order = getOrderById(username, orderId);

		if (order.getStatus() != OrderStatus.DELIVERED) {
			throw new RuntimeException("Only delivered orders can be returned");
		}
		
		validateReturnWindow(order);
		// restore stock
		restoreStock(order);

		// refund online payment
		if (order.getPayment() != null
		        && order.getPayment().getPaymentStatus() == PaymentStatus.SUCCESS
		        && order.getPayment().getPaymentMethod() == PaymentMethod.RAZORPAY) {
		    paymentService.refundPayment(order.getId());
		}

		order.setStatus(OrderStatus.RETURNED);

		orderRepo.save(order);

		return "Order returned successfully";
	}
	
	public String returnOrderItem(String username, Long orderId, Long orderItemId) {
		Order order = getOrderById(username, orderId);

		if (order.getStatus() != OrderStatus.DELIVERED) {
			throw new RuntimeException("Only delivered orders can be returned");
		}
		
		validateReturnWindow(order);
		
		OrderItem orderItem = order.getOrderItems().stream().filter(item -> item.getId().equals(orderItemId))
				.findFirst().orElseThrow(() -> new RuntimeException("Order item not found"));

		if (orderItem.getStatus() == OrderItemStatus.RETURNED) {
			throw new RuntimeException("Item already returned");
		}

	
		Product product = orderItem.getProduct();

		product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());

		updateStockStatus(product);

		// calculate refund amount
		double refundAmount = orderItem.getActualProdPrice();

		// refund payment
		if (order.getPayment() != null
		        && order.getPayment().getPaymentStatus() == PaymentStatus.SUCCESS
		        && order.getPayment().getPaymentMethod() == PaymentMethod.RAZORPAY) {
		    paymentService.refundPartialPayment(order.getId(), refundAmount);
		}

		// mark item returned
		orderItem.setStatus(OrderItemStatus.RETURNED);

		// update order final price
		order.setFinalPrice(order.getFinalPrice() - refundAmount);

		// if all items returned
		boolean allReturned = order.getOrderItems().stream()
				.allMatch(item -> item.getStatus() == OrderItemStatus.RETURNED);

		if (allReturned) {
			order.setStatus(OrderStatus.RETURNED);
		}

		orderRepo.save(order);

		return "Item returned successfully";
	}

	public String cancelOrder(String username, Long orderId, String reason) {
		Order order = getOrderById(username, orderId);

		if (order.getStatus() == OrderStatus.DELIVERED) {
			throw new RuntimeException("Delivered Order cannot be Cancelled");
		}

		if (order.getStatus() == OrderStatus.CANCELLED) {
			throw new RuntimeException("Order already cancelled");
		}

		// restore stock
		restoreStock(order);

		// refund online payment
		if (order.getPayment() != null
		        && order.getPayment().getPaymentStatus() == PaymentStatus.SUCCESS
		        && order.getPayment().getPaymentMethod() == PaymentMethod.RAZORPAY) {
		    paymentService.refundPayment(order.getId());
		}

		order.setStatus(OrderStatus.CANCELLED);
		order.setCancelledAt(LocalDateTime.now());
		order.setCancelReason(reason);

		orderRepo.save(order);

		return "Order Cancelled Successfully";
	}


	private void reduceStock(Product product, int quantity) {
		product.setStockQuantity(product.getStockQuantity() - quantity);

		updateStockStatus(product);
	}

	private void restoreStock(Order order) {
		for (OrderItem item : order.getOrderItems()) {
			Product product = item.getProduct();

			product.setStockQuantity(product.getStockQuantity() + item.getQuantity());

			updateStockStatus(product);
		}
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
	
	private void validateReturnWindow(Order order) {

	    if (order.getDeliveredAt() == null) {
	        throw new RuntimeException("Delivery date not found");
	    }

	    LocalDateTime returnLastDate = order.getDeliveredAt().plusDays(7);

	    if (LocalDateTime.now().isAfter(returnLastDate)) {
	        throw new RuntimeException(
	            "Return period expired. Returns allowed only within 7 days of delivery"
	        );
	    }
	}
}