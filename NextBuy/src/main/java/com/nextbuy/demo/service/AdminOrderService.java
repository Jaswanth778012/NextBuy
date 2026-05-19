 package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.repository.OrderItemRepository;
import com.nextbuy.demo.repository.OrderRepository;

@Service
@Transactional
public class AdminOrderService {

    private OrderRepository orderRepo;
  

    public AdminOrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

	 public Page<Order> getAllOrders(int page, int size){
    	    List<Order> allOrders = orderRepo.findAll();
    	    if(allOrders.isEmpty()) {
    	    	throw new RuntimeException("no orders");
    	    }
    	    Pageable pageable = PageRequest.of(page, size);
    	    return orderRepo.findByStatusNotOrderByOrderedAtDesc(OrderStatus.PENDING, pageable);
    	    
     }
    
	 public List<Order> getPendingOrders(){
		return orderRepo.findByStatusOrderByOrderedAtDesc(OrderStatus.PENDING);
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
    	       orderRepo.save(orde);
    	       if(OrderStatus.DELIVERED == orde.getStatus() ) {
    	    	   orde.setDeliveredAt(LocalDateTime.now());
    	       }else if(orde.getStatus() == OrderStatus.SHIPPED){
    	    	   int randomNum = ThreadLocalRandom.current().nextInt(100000, 999999);
    	    	   orde.setTrackingNumber("NextBY-"+randomNum);
    	    	   orde.setShippedAt(LocalDateTime.now());
    	       }
    	       orderRepo.save(orde);
    	       
    	        return "Status changed";
     }
     
     public List<Order> getUserByIdOrders(Long userId){
    	 
    	      return orderRepo.findByUserIdOrderByIdDesc(userId);
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
    	   return orderRepo.findByStatusOrderByOrderedAtDesc(status);
     }

     public int countOfAllOrders() {
    	 return orderRepo.findAll().size();
     }

   

    public Double totalSales() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.DELIVERED)
                .mapToDouble(Order::getFinalPrice)
                .sum();
    }


    public long deliveredOrdersCount() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.DELIVERED)
                .count();
    }

    public long cancelledOrdersCount() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.CANCELLED)
                .count();
    }

    public long returnedOrdersCount() {

        return orderRepo.findAll()
                .stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.RETURNED)
                .count();
    }
    public List<Order> getOrdersByMonth(int month){
    	List<Order> monthorders = orderRepo.findByMonthOrders(month);
    	if(monthorders.isEmpty()) {
    		 throw new RuntimeException("this Month orders Empty !!");
    	}
    	return monthorders;
    	
    }
    public List<Order> getOrdersByYear(int year){
    	  List<Order> yearOrders = orderRepo.findByYear(year);
    	  if(yearOrders.isEmpty()) {
    		  throw new RuntimeException("this Year orders Empty !!");
    	  }
    	  return yearOrders;
    }
    public List<Order> getOrdersByMonthAndyear(int month , int year){
    	     List<Order> ordersMandY = orderRepo.findByMonthAndYear(month,year);
    	     if(ordersMandY.isEmpty()) {
    	    	 throw new RuntimeException("this Month&Year orders Empty !!");
    	     }
    	     return ordersMandY;
    	     
    }
    
}