package com.nextbuy.demo.service;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.CategorySalesDTO;
import com.nextbuy.demo.dto.MonthlyOrderCountDTO;
import com.nextbuy.demo.dto.MonthlyStatsDTO;
import com.nextbuy.demo.dto.TopSellingProductDTO;
import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.OrderStatus;
import com.nextbuy.demo.enums.Role;
import com.nextbuy.demo.repository.OrderItemRepository;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class AdminStatsService {
	
	UserRepository userRpo;
	OrderRepository orderRepo;
	ProductRepository productRepo;
	OrderItemRepository orderItemRepo;
	
	public AdminStatsService(UserRepository userRpo, OrderRepository orderRepo, ProductRepository productRepo,
			OrderItemRepository orderItemRepo) {
		super();
		this.userRpo = userRpo;
		this.orderRepo = orderRepo;
		this.productRepo = productRepo;
		this.orderItemRepo = orderItemRepo;
	}

	public MonthlyStatsDTO getTotalStats () {
		
	 	long totalUsers = userRpo.findAll().stream().filter(u->u.getRole()==Role.USER).count();
	 	long totalProducts = productRepo.count();
	 double totalRevanue = orderRepo.findAll()
        .stream()
        .filter(order ->
                order.getStatus() == OrderStatus.DELIVERED)
        .mapToDouble(Order::getFinalPrice)
        .sum();
	  long deliveredOrders = orderRepo.countByStatus(OrderStatus.DELIVERED);
	  long cancelledOrders = orderRepo.countByStatus(OrderStatus.CANCELLED);
	  long pendingOrders = orderRepo.countByStatus(OrderStatus.PENDING);
	  long totalLowP = productRepo.findAll().stream().filter(p->p.getStockQuantity()<100).count();
	  long totalHighP= productRepo.findAll().stream().filter(p->p.getStockQuantity()>100).count();
	  MonthlyStatsDTO  msd = new MonthlyStatsDTO ();
	  msd.setTotalUsers(totalUsers);
	  msd.setTotalProducts(totalProducts);
	  msd.setTotalRevanue(totalRevanue);
	  msd.setDeliveredOrders(deliveredOrders);
	  msd.setCancelledOrders(cancelledOrders);
	  msd.setPendingOrders(pendingOrders);
	  msd.setTotallowStockProducts(totalLowP);
	  msd.setTotalHighStockProducts(totalHighP);
	 return msd;
	}
	
	public List<TopSellingProductDTO> getTopSellingProducts() {

	    List<Object[]> results =
	            orderItemRepo.getTopSellingProducts();

	    List<TopSellingProductDTO> list =
	            new ArrayList<>();

	    for(Object[] obj : results) {

	        Product product = (Product) obj[0];

	        Long totalSold = (Long) obj[1];

	        TopSellingProductDTO dto =
	                new TopSellingProductDTO();

	        dto.setProductId(product.getId());

	        dto.setProductName(product.getName());
            dto.setCategory(product.getCategory());
            if(product.getSubCategory() != null){

                dto.setSubCategory(
                    product.getSubCategory().getName()
                );

            }
            dto.setImg(product.getImageUrl());
	        dto.setTotalSold(totalSold);
            
	        list.add(dto);
	    }

	    return list;
	}
	
	
	public MonthlyStatsDTO getMonthlyStats(int month,int year) {
	   List<Order> stats = orderRepo.findByMonthAndYear(month, year);
	   if(stats.isEmpty()) {
		   throw new RuntimeException("No data !!");
	   }
	   long totalUsers = userRpo.findAll().stream().filter(u->u.getRole()==Role.USER).count();
	 	long totalProducts = productRepo.count();
	 	
	 	 double totalRevanue = orderRepo.findAll()
	 	        .stream()
	 	        .filter(order ->
	 	                order.getStatus() == OrderStatus.DELIVERED)
	 	        .mapToDouble(Order::getFinalPrice)
	 	        .sum();
	 	
	Double MonthlyRevanue= orderRepo.findByMonthAndYear(month, year).stream().filter(o->o.getStatus()==OrderStatus.DELIVERED)
	   .mapToDouble(Order::getFinalPrice).sum();
	
	  Double yearlyRevanue = orderRepo.findByYear(year).stream().filter(o->o.getStatus()==OrderStatus.DELIVERED)
			   .mapToDouble(Order::getFinalPrice).sum();
	  
	  long deliveredOrders= orderRepo.findByMonthAndYear(month, year).stream().filter(o->o.getStatus()==OrderStatus.DELIVERED).count();
	  long cancelledOrders=orderRepo.findByMonthAndYear(month, year).stream().filter(o->o.getStatus()==OrderStatus.CANCELLED).count();
	  long pendingOrders=orderRepo.findByMonthAndYear(month, year).stream().filter(o->o.getStatus()==OrderStatus.PENDING).count();
	  
	  MonthlyStatsDTO  msd = new MonthlyStatsDTO ();
	  msd.setTotalUsers(totalUsers);
	  msd.setTotalProducts(totalProducts);
	  msd.setTotalRevanue(totalRevanue);
	  msd.setDeliveredOrders(deliveredOrders);
	  msd.setCancelledOrders(cancelledOrders);
	  msd.setPendingOrders(pendingOrders);
	  msd.setMonthlyRevanue(MonthlyRevanue);
	  msd.setYearlyRevanue(yearlyRevanue);
	  return msd;
	}
   public  MonthlyStatsDTO getYearlyStats(int year) {
	   long totalUsers = userRpo.findAll().stream().filter(u->u.getRole()==Role.USER).count();
	 	long totalProducts = productRepo.count();
	 	double yearlyRevanue = orderRepo.findByYear(year).stream().filter(o->o.getStatus()==OrderStatus.DELIVERED).mapToDouble(Order::getFinalPrice).sum();
	 	 long deliveredOrders= orderRepo.findByYear(year).stream().filter(o->o.getStatus()==OrderStatus.DELIVERED).count();
		  long cancelledOrders=orderRepo.findByYear(year).stream().filter(o->o.getStatus()==OrderStatus.CANCELLED).count();
		  double totalRevanue = orderRepo.findAll()
		 	        .stream()
		 	        .filter(order ->
		 	                order.getStatus() == OrderStatus.DELIVERED)
		 	        .mapToDouble(Order::getFinalPrice)
		 	        .sum();
		  long pendingOrders=orderRepo.findByYear(year).stream().filter(o->o.getStatus()==OrderStatus.PENDING).count();
		  MonthlyStatsDTO  msd = new MonthlyStatsDTO ();
		  msd.setTotalUsers(totalUsers);
		  msd.setTotalProducts(totalProducts);
		  msd.setTotalRevanue(totalRevanue);
		  msd.setDeliveredOrders(deliveredOrders);
		  msd.setCancelledOrders(cancelledOrders);
		  msd.setPendingOrders(pendingOrders);
		  msd.setYearlyRevanue(yearlyRevanue);
		  return msd;
   }
   public List<TopSellingProductDTO> lowStockProducts(){
	   List<Product> product = productRepo.findAll();
	   return product.stream()
			   .filter(p->p.getStockQuantity()<100)
               .map(this::mapToResponceDto)
               .toList();
   }
   public List<TopSellingProductDTO> HighStockProducts(){
	   List<Product> product = productRepo.findAll();
	   return product.stream()
			   .filter(p->p.getStockQuantity()>100)
               .map(this::mapToResponceDto)
               .toList();
   }
  
   public TopSellingProductDTO mapToResponceDto(Product product) {
	   TopSellingProductDTO t = new  TopSellingProductDTO();
	   t.setProductId(product.getId());
	   t.setProductName(product.getName());
	   t.setImg(product.getImageUrl());
	   t.setCategory(product.getCategory());
	   t.setStockQuantity(product.getStockQuantity());
	   return t;
	   
	   
   }
   
   public List< CategorySalesDTO> getCategoryStats() {
	       List<Object[]> categorys = orderItemRepo.getCategoryWiseSales();
	       List<CategorySalesDTO> list = new ArrayList<>();
	       for(Object[] obj : categorys) {
	    	   Long id =(Long)obj[0];
	    	   String name = (String)obj[1];
	    	   Long sold =(Long)obj[2];
	    	   CategorySalesDTO csd = new CategorySalesDTO();
	    	   csd.setCategoryId(id);
	    	   csd.setCategoryName(name);
	    	   csd.setTotalSold(sold);
	    	   list.add(csd);
	       }
	       return list;
   }
   
    public List< CategorySalesDTO> getSubCategoryStatsByCategoryId(Long categoryId){
	          List<Object[]> result = orderItemRepo.getSubCategorySalesByCategory(categoryId);
	          List<CategorySalesDTO> list =new ArrayList<>();
	          for(Object[] obj: result) {
	        	  Long id =(Long) obj[0];
	        	  String name =  (String)obj[1];
	        	  Long sold =(Long) obj[2];
	        	  CategorySalesDTO csd = new CategorySalesDTO();
	        	  csd.setCategoryId(id);
	        	  csd.setCategoryName(name);
	        	  csd.setTotalSold(sold);
	        	  list.add(csd);
	        	  
	          }
	          return list;
   }
     
    public List<MonthlyOrderCountDTO> monthlyOrderCount(){
    	LocalDate now = LocalDate.now();
    	int year = now.getYear();
    	ArrayList<String> months = new ArrayList<>();
    	 months.add("January");
    	 months.add("February");
    	 months.add("March");
    	 months.add("April");
    	 months.add("May");
    	 months.add("Jun");
    	 months.add("July");
    	 months.add("August");
    	 months.add("September");
    	 months.add("October");
    	 months.add("November");
    	 months.add("December");
    	 
    List<MonthlyOrderCountDTO> list = new ArrayList<>();
     for(int i = 1; i <= 12; i++) {
    long month = orderRepo.findByMonthAndYear(i, year).stream().filter(o->o.getStatus()==OrderStatus.DELIVERED).count();
    MonthlyOrderCountDTO mc = new MonthlyOrderCountDTO();
       
         mc.setMonth(months.get(i-1));
         mc.setCount(month);
         list.add(mc);
     }
     return list;
    }
   
   

}
