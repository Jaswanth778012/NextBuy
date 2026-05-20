package com.nextbuy.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.nextbuy.demo.enums.Gender;
import com.nextbuy.demo.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	
	@Column(nullable = false , unique = true)
	private String username;


	@Column(nullable = false)
	private String name;
	
	@Column
	private String password;
	
	@Column
	private Long mobileNumber;
	
	@Column(nullable = false , unique = true)
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
	private String city;
	
	@Column
	private String state;
	
	@Column
	private String country;
	
	@Column
	private String dpUrl;
	
	@Column
	private LocalDate dob;
	
	@Column(updatable = false)
	private LocalDate createdAt;
	
	@Column
	private LocalDateTime lastLogin;
	
	@OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
	private Cart cart;
	
	@OneToMany(mappedBy="user", cascade = CascadeType.ALL, orphanRemoval=true)
	private List<Address> addresses;
	
	@OneToMany(mappedBy="user", cascade = CascadeType.ALL, orphanRemoval=true)
	  @JsonManagedReference
	private List<Order> orders;
	
	@PrePersist
	protected void onCreate() {
	    createdAt = LocalDate.now();
	}
	
}
