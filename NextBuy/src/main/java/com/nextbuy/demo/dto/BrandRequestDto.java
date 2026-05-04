package com.nextbuy.demo.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrandRequestDto {
	
	private String name;
	
	private String description;

	private String logoUrl;

	private String country;
	
	private LocalDate createdAt;
}
