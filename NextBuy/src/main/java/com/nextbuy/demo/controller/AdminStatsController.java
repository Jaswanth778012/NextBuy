package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CategorySalesDTO;
import com.nextbuy.demo.dto.MonthlyOrderCountDTO;
import com.nextbuy.demo.dto.MonthlyStatsDTO;
import com.nextbuy.demo.dto.TopSellingProductDTO;
import com.nextbuy.demo.service.AdminStatsService;

@RestController
@RequestMapping("/AdminStats")
public class AdminStatsController {
	AdminStatsService adminStatsService;
	
	public AdminStatsController(AdminStatsService adminStatsService) {
		super();
		this.adminStatsService = adminStatsService;
	}
   @GetMapping("/getTotalStats")
	public MonthlyStatsDTO getTotalStats () {
		return adminStatsService.getTotalStats();
	}
   
   @GetMapping("/getTopSellingProducts")
   public List<TopSellingProductDTO> getTopSellingProducts() {
	   return adminStatsService.getTopSellingProducts();
   }
   
   @GetMapping("/getMonthlyStats/{month}/{year}")
   public MonthlyStatsDTO getMonthlyStats(@PathVariable int month,@PathVariable int year) {
	   return adminStatsService.getMonthlyStats(month, year);
   }
   
   @GetMapping("/getYearlyStats/{year}")
   public  MonthlyStatsDTO getYearlyStats(@PathVariable int year) {
	   return adminStatsService.getYearlyStats(year);
   }
   @GetMapping("/lowStockProducts")
   public List<TopSellingProductDTO> lowStockProducts(){
	   return adminStatsService.lowStockProducts();
	   
   }
   @GetMapping("/limitedStockProducts")
   public List<TopSellingProductDTO> HighStockProducts(){
	   return adminStatsService.LimitedStockProducts();
	   
   }
   @GetMapping("/getCategoryStats")
   public List< CategorySalesDTO> getCategoryStats() {
	   return adminStatsService.getCategoryStats();
			   
   }
   @GetMapping("/getSubCatagoryStats/{categoryId}")
   public List< CategorySalesDTO> getSubCategoryStatsByCategoryId(@PathVariable Long categoryId){
	   return adminStatsService.getSubCategoryStatsByCategoryId(categoryId);
   }
   
   @GetMapping("/monthlyOrderCount")
   public List<MonthlyOrderCountDTO> monthlyOrderCount(){
	   return adminStatsService.monthlyOrderCount();
	   
   }
}
