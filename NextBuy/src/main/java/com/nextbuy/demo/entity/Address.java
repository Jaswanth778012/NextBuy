package com.nextbuy.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nextbuy.demo.enums.AddressType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String fullName;
	
	private String mobileNumber;
	
	private String pincode;
	
	private String houseNo;
	
	private String area;
	
	private String landmark;
	
	private String city;
	
	private String state;
	
	private String country= "India";
	
	@Enumerated(EnumType.STRING)
	private AddressType addressType;
	
	private Boolean defaultAddress = false;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonIgnore
	private User user;
	
}
