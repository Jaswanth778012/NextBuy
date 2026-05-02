package com.nextbuy.service;


import org.springframework.stereotype.Service;

import com.nextbuy.repository.UserRepository;

@Service
public class UserService {
	
	  UserRepository userRepo;

	 public UserService(UserRepository userRepo) {
		super();
		this.userRepo = userRepo;
	 }
	 
	 
	 
	

}
