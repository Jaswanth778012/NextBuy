package com.nextbuy.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.ProductCondition;
import com.nextbuy.demo.enums.ProductStatus;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
	
	@Column(unique = true, nullable = false)
	private String slug;
	
	private String description;
	
	private String category;
	
	private Double mrp_price;
	
	private String imageUrl;
	
	private Integer stockQuantity;
	
	private Double discountPercentage; 
	
	private Double finalPrice;
	
	
	@ManyToOne
	@JoinColumn(name = "brand_id")
	private Brand brand;
	
	@Enumerated(EnumType.STRING)
	private AvailabilityStockStatus stockStatus;
	
	private Integer ratingsCount = 0;
	
	private Double totalRating = 0.0;
	
	private Double averageRating = 0.0;
	
	private Double gstPercentage = 0.0;
	
	private Double taxablePrice = 0.0;
	
	@Enumerated(EnumType.STRING)
	private ProductStatus productStatus;
	
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private ProductCondition productCondition;
	
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
	
	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<Rating> ratings;
	
	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDate.now();
		if(this.slug == null || this.slug.isEmpty()) {
	        this.slug = generateSlug(this.name);
	    }
	}
	
	@PreUpdate
	protected void onUpdate() {

	    this.updatedAt = LocalDateTime.now();

	    if(this.name != null) {
	        this.slug = generateSlug(this.name);
	    }
	}
	
	private String generateSlug(String text) {

	    return text.toLowerCase()
	            .trim()
	            .replace(" ", "-")
	            .replaceAll("[^a-z0-9-]", "");
	}
	
}
