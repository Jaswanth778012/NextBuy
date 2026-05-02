package com.nextbuy.demo.service;


import org.springframework.stereotype.Service;

import com.nextbuy.demo.repository.UserRepository;

@Service
public class UserService {
	
	  UserRepository userRepo;

	 public UserService(UserRepository userRepo) {
		super();
		this.userRepo = userRepo;
	 }
	 
	 
	 
	

}
