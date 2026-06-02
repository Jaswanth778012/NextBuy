package com.nextbuy.demo.controller;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.service.AdminOrderService;
import com.nextbuy.demo.service.InvoiceService;


@RestController
@RequestMapping("/adminOrder")
public class AdminOrderController {
  private  AdminOrderService adminOrderService;
  private  InvoiceService invoiceService;
   private OrderRepository orderRepo;
   
   
	
	public AdminOrderController(AdminOrderService adminOrderService, InvoiceService invoiceService,
			OrderRepository orderRepo) {
	super();
	this.adminOrderService = adminOrderService;
	this.invoiceService = invoiceService;
	this.orderRepo = orderRepo;
}
	@GetMapping("/getAllOrders")
	public ResponseEntity<Page<Order>> getAllOrders(
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "5") int size
	) {

	    return ResponseEntity.ok(
	            adminOrderService.getAllOrders(page, size)
	    );
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
  @GetMapping("/getOrdersByMonth/{month}")
  public List<Order> getOrdersByMonth(@PathVariable int month){
	    return  adminOrderService.getOrdersByMonth(month);
  }
  @GetMapping("/getOrdersByYear/{year}")
  public List<Order> getOrdersByyear(@PathVariable int year){
	 return  adminOrderService.getOrdersByYear(year);
  }
  @GetMapping("/getOrdersByMonthAndYear/{month}/{year}")
  public List<Order> getOrdersByMonthAndYear(@PathVariable int month, @PathVariable int year){
	 return  adminOrderService.getOrdersByMonthAndyear(month, year);
  }
  @GetMapping("/orders/{orderId}/invoice/download")
  public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long orderId) {

      try {
          Order order = orderRepo.findById(orderId)
                  .orElseThrow(() -> new RuntimeException("Order not found"));

          File pdfFile = invoiceService.generateInvoice(order);

          byte[] fileContent = java.nio.file.Files.readAllBytes(pdfFile.toPath());

          return ResponseEntity.ok()
                  .header("Content-Disposition",
                          "attachment; filename=invoice_" + order.getOrderNumber() + ".pdf")
                  .contentType(MediaType.APPLICATION_PDF)
                  .body(fileContent);

      } catch (Exception e) {
          e.printStackTrace(); // 🔥 IMPORTANT
          throw new RuntimeException("Invoice download failed: " + e.getMessage());
      }
  }
}
