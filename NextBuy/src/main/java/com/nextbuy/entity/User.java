package com.nextbuy.entity;

import java.time.LocalDate;

import com.nextbuy.enums.Gender;
import com.nextbuy.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	
	@Column(nullable = false , unique = true)
	private String userName;

	
	@Column(nullable = false)
	private String name;
	
	@Column
	private String password;
	
	@Column
	private Long mobileNumber;
	
	@Column
	private String email;
	
	@Enumerated(EnumType.STRING)
	@Column
	private Gender gender;
	
	@Enumerated(EnumType.STRING)
	@Column
	private Role role;
	
	@Column
	private String addressLine1;
	
	
	
	@Column
	private String dpUrl;
	
	@Column
	private LocalDate dob;
	
	@Column
	private LocalDate createdAt;
	
	@Column
	private LocalDate lastLogin;
}
