package com.nextbuy.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.nextbuy.demo.enums.OrderStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String orderNumber;

	    @ManyToOne
	    @JoinColumn(name = "user_id")
	    private User user;

	    @ManyToOne
	    @JoinColumn(name = "address_id")
	    private Address shippingAddress;
	    
	    @ManyToOne
	    @JoinColumn(name = "cupon_id")
	    private Cupon appliedCupon;

	    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<OrderItem> orderItems;


	    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
	    private Payment payment;


	    private Double totalPrice = 0.0;
	    private Double discount = 0.0;
	    private Double couponDiscount = 0.0;
	    private Double shippingCharges = 0.0;
	    private Double finalPrice = 0.0;

	    @Enumerated(EnumType.STRING)
	    private OrderStatus status = OrderStatus.PENDING;

	    private String trackingNumber;
	    private String cancelReason;

	    private LocalDateTime orderedAt;
	    private LocalDateTime updatedAt;
	    private LocalDateTime deliveredAt;
	    private LocalDateTime cancelledAt;

	    @PrePersist
	    public void prePersist() {
	        orderedAt = LocalDateTime.now();
	        updatedAt = LocalDateTime.now();

	        if (orderNumber == null) {
	            orderNumber = "ORD-" + System.currentTimeMillis();
	        }
	    }

	    @PreUpdate
	    public void preUpdate() {
	        updatedAt = LocalDateTime.now();
	    }
}
