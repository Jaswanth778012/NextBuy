package com.nextbuy.demo.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class userProfileDTO {

private String name;
	
	
	
	
	
	private Long mobileNumber;
	
	
	private String addressLine1;
	
	
	private String city;
	
	
	private String state;
	
	
	private String country;
	
	
	private MultipartFile dpUrl;
	
	private String email;
	
	
	
}
