package com.nextbuy.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.nextbuy.demo.enums.Gender;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserResponceDto {
		
		
		private Long id;
		
	    private String username;


	    private Long mobileNumber;
	    
	    private String name;
	    
	    private String email;

	    private Gender gender;

	    private String imgUrl;
	    
	    private String address;

	    private LocalDate dob;
	    
	    private Long totalOrders;
	    
	    private Double totalSpent;
	    
	    private LocalDate createdAt;
	    
	    private LocalDateTime lastLogin;
	    
	    private String state;
	    
	    
	}


