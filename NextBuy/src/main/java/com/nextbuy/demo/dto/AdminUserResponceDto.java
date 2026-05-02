package com.nextbuy.demo.dto;

import java.time.LocalDate;

import com.nextbuy.demo.enums.Gender;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class AdminUserResponceDto {
	
		
	    private String username;


	    private Long mobileNumber;
	    
	    private String name;

	    
	    private String email;

	    private Gender gender;

	   
	    private String address;

	    private LocalDate dob;
	}


