package com.nextbuy.demo.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.service.AdminOrderService;

@RestController
@RequestMapping("/adminOrder")
public class AdminOrderController {
    AdminOrderService adminOrderService;

	public AdminOrderController(AdminOrderService adminOrderService) {
		super();
		this.adminOrderService = adminOrderService;
	}
	
	
	@GetMapping("/getAllOrders")
	 public List<Order> getAllOrders(){
 	   return adminOrderService.getAllOrders();
  }
	@GetMapping("/getPendingOrders")
	public List<Order> getPendingOrders(){
		return adminOrderService.getPendingOrders();
	}
  
  @GetMapping("/getOrderById/{id}")
  public Order getOrderById(@PathVariable Long id){
 	      return adminOrderService.getOrderById(id);
  }
  
  @PatchMapping("/updateOrderStatus/{id}/{status}")
  public String updateOrderStatus(@PathVariable Long id,@PathVariable OrderStatus status) {
 	 return adminOrderService.updateOrderStatus(id, status);
  }
  
  @GetMapping("/getUserOrders/{userId}")
  public List<Order> getUserOrders(@PathVariable Long userId){
 	     return adminOrderService.getUserByIdOrders(userId);
  }
  
  @GetMapping("/getOrdersByDate/{date}")
  public List<Order> getOrdersByDate(@PathVariable LocalDate date){
 	    return adminOrderService.getOrdersByDate(date);
  }
  
  @GetMapping("/todayOrders")
  public List<Order> todayOrders(){
	  LocalDateTime date = LocalDateTime.now();
	  LocalDate d = date.toLocalDate();
 	   return adminOrderService.todayOrders(d);
  }
  
  @GetMapping("/getOrdersByStatus/{status}")
  public List<Order> getByStatus(@PathVariable OrderStatus status){
 	   return adminOrderService.getByStatus(status);
  }
  
  @GetMapping("/totalSales")
  public Double totalSales() {
	return  adminOrderService.totalSales();
  }
  
  @GetMapping("/countOfAllOrders")
  public int countOfAllOrders() {
	  return adminOrderService.countOfAllOrders();
  }
  
  
}
