package com.nextbuy.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cart {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Double totalPrice= 0.0;
	
	private Double discount= 0.0;
	
	private Double finalPrice= 0.0;
	
	private Double shipingCharges= 0.0;
	
	 private Boolean active = true; 
	 
	 private Double cuponDiscount;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
	
	@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CartItem> cartItems;
	 @OneToOne
	@JoinColumn(name = "user_id")
	 @JsonIgnore
	private User user;
	 
	 @ManyToOne
	 @JoinColumn(name = "cupon_id")
	 private Cupon appliedCupon;
	
	 @PrePersist
	    public void prePersist() {

	        createdAt = LocalDateTime.now();
	        updatedAt = LocalDateTime.now();
	    }

	 @PreUpdate
	    public void preUpdate() {

	        updatedAt = LocalDateTime.now();
	    }
	
	
}
