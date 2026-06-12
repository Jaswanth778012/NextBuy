package com.nextbuy.demo.entity;

import java.time.LocalDateTime;

import com.nextbuy.demo.enums.CuponStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cupon {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true)
    private String code;
	
	private String description;
	
	private int usageCount = 0;

    private Double discountPercentage;

    private Double minimumAmount;

    private LocalDateTime expiryDate;
    
    @Enumerated(EnumType.STRING)
    private CuponStatus cuponStatus;
}
