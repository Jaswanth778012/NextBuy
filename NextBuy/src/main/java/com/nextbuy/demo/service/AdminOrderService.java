 package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.repository.OrderItemRepository;
import com.nextbuy.demo.repository.OrderRepository;
@Service
public class AdminOrderService {
     OrderRepository orderRepo;
     OrderItemRepository orderItemsRepo;
     
     
     public AdminOrderService(OrderRepository orderRepo, OrderItemRepository orderItemsRepo) {
		super();
		this.orderRepo = orderRepo;
		this.orderItemsRepo = orderItemsRepo;
	}


	 public List<Order> getAllOrders(){
    	    List<Order> allOrders = orderRepo.findAll();
    	    return allOrders.stream().filter(o->o.getStatus()!= OrderStatus.PENDING).toList();
    	    
     }
     
     
     public Order getOrderById(Long id){
    	       Optional<Order> order = orderRepo.findById(id);
    	       if(order.isEmpty()) {
    	    	   throw new RuntimeException("Order Id not found");
    	       }
    	       
    	       return orderRepo.findById(id).get();
     }
     
     
     public String updateOrderStatus(Long id,OrderStatus status) {
    	 Optional<Order> order = orderRepo.findById(id);
    	 if(order.isEmpty()) {
	    	   throw new RuntimeException("Order Id not found");
	       }
    	       Order orde = order.get();
    	       orde.setStatus(status);
    	        orderRepo.save(orde);
    	        return "Status changed";
     }
     
     public List<Order> getUserOrders(Long userId){
    	       List<Order> order = orderRepo.findByUserId(userId);
    	       if(order.isEmpty()) {
    	    	   throw new RuntimeException("User Id not found");
    	       }
    	       return order;
     }
     
     public List<Order> getOrdersByDate(LocalDate date){
    	     LocalDateTime start = date.atStartOfDay();
    	     LocalDateTime end = date.atTime(LocalTime.MAX);
    	     return orderRepo.findByOrderedAtBetween(start, end);
     }
     public List<Order> todayOrders(LocalDate date){
    	    LocalDateTime start = date.atStartOfDay();
    	    LocalDateTime end = date.atTime(LocalTime.MAX);
    	    return orderRepo.findByOrderedAtBetween(start, end);
    	    
     }
     public List<Order> getByStatus(OrderStatus status){
    	   return orderRepo.findByStatus(status);
     }
     public Double totalSales() {
    	    List<Order> orders = orderRepo.findAll();
    	 return orders.stream().filter(order->order.getStatus()==OrderStatus.DELIVERED)
    	    .mapToDouble(Order::getFinalPrice)
    	    .sum();
     }
     public int countOfAllOrders() {
    	 return orderRepo.findAll().size();
     }
}
