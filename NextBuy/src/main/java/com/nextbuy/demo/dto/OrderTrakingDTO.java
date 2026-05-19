package com.nextbuy.demo.dto;



import com.nextbuy.demo.entity.Address;
import com.nextbuy.demo.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderTrakingDTO {
	 private String orderedAt;
	    private String updatedAt;
	    private String  shippedAt;
	    private String deliveredAt;
	    private String cancelledAt;
	    private String estimatedDeliveryDate;
	    private String trackingNumber;
	    private String cancelReason;
	    private OrderStatus status ;
	    private Address shippingAddress;
	    private String orderNumber;
}
