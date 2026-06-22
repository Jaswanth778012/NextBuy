package com.nextbuy.demo.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class userProfileDTO {

	private String name;
	
	private Long mobileNumber;
	private String Username;
	
	private String addressLine1;
	
	
	private String city;
	
	
	private String state;
	
	private Long pincode;
	private String country;
	
	
	private String dpUrl;
	
	private String email;
	
	
}
