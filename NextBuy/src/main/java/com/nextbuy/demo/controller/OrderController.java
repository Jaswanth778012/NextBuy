package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CancelOrderRequestDto;
import com.nextbuy.demo.dto.CheckOutRequestDto;
import com.nextbuy.demo.dto.CheckOutResponseDto;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.service.OrderService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/Orders")
public class OrderController {
	
	private OrderService orderService;
	
	public OrderController(OrderService orderService)
	{
		this.orderService = orderService;
	}
	
	@PostMapping("/checkout")
	public ResponseEntity<CheckOutResponseDto> checkout(Principal principal, @RequestBody CheckOutRequestDto dto)
	{
		return ResponseEntity.ok(orderService.checkout(principal.getName(), dto));
	}	
	
	
	@GetMapping("/my-orders")
	public ResponseEntity<List<Order>> myOrder(Principal principal)
	{
		return ResponseEntity.ok(orderService.getMyOrders(principal.getName()));
	}
	
	@GetMapping("/getOrder/{id}")
	public ResponseEntity<Order> getOrderById(Principal principal, @PathVariable Long id)
	{
		return ResponseEntity.ok(orderService.getOrderById(principal.getName(), id));
	}
	
	@GetMapping("/getAllReturnedOrders")
	public ResponseEntity<List<Order>> getAllReturnedOrders(Principal principal)
	{
		return ResponseEntity.ok(orderService.getReturnedOrders(principal.getName()));
	}
	
	@PostMapping("/return/{orderId}")
	public String returnOrder( Principal principal, @PathVariable Long orderId)
	{
	    return orderService.returnOrder(principal.getName(), orderId);
	}
	
	@PutMapping("/{orderId}/return-item/{orderItemId}")
	public String returnOrderItem(Principal principal, @PathVariable Long orderId, @PathVariable Long orderItemId) {
		return orderService.returnOrderItem(principal.getName(), orderId, orderItemId);
	}
	
	@PutMapping("/cancelOrder/{id}")
	public ResponseEntity<String> cancelOrder(Principal principal, @PathVariable Long id, @RequestBody CancelOrderRequestDto cancelRequest)
	{
		return ResponseEntity.ok(orderService.cancelOrder(principal.getName(), id, cancelRequest.getReason())); 
	}
	 @GetMapping("/conformOrders")
	   public  List<Order> conformOrders(Authentication authentication){
		   String username = authentication.getName();
		   return orderService.confirmOrders(username);
	   }
}
