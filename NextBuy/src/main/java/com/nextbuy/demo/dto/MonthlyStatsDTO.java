package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyStatsDTO {
	
	
	 private Long totalUsers;
	 private Long totalProducts;
	 private Double TotalRevanue;
	 private Double monthlyRevanue;
	 private Double yearlyRevanue;
	 private Long deliveredOrders;
	 private Long cancelledOrders;
	 private Long pendingOrders;
	 private Long shippedOrdes;
	 private Long returnOrders;
	  private Long TotallowStockProducts;
	  private Long TotalLimitedStockProducts;
	

}
