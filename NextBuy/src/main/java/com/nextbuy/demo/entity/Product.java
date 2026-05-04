package com.nextbuy.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.ProductStatus;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	private String description;
	
	private String category;
	
	private Double price;
	
	private String imageUrl;
	
	private Integer stockQuantity;
	
	private Double dis_count; 
	
	
	@ManyToOne
	@JoinColumn(name = "brand_id")
	private Brand brand;
	
	@Enumerated(EnumType.STRING)
	private AvailabilityStockStatus stockStatus;

	private Double totalRating;
	
	private Double averageRating;
	
	@Enumerated(EnumType.STRING)
	private ProductStatus productStatus;
	
	@Column(updatable = false)
	private LocalDate createdAt;
	
	private LocalDateTime updatedAt;
	
	@ElementCollection
	@CollectionTable(name = "product_attributes", 
	    joinColumns = @JoinColumn(name = "product_id"))
	@MapKeyColumn(name = "attribute_key")
	@Column(name = "attribute_value")
	private Map<String, String> attributes;
	
	private int deliveryTimeInDays;
	
	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDate.now();
	}
	
	
}
