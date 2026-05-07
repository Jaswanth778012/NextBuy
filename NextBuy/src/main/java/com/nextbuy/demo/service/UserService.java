package com.nextbuy.demo.service;



import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.userProfileDTO;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class UserService {
	
	  UserRepository userRepo;

	ProductRepository productRepo;

	PasswordEncoder passwordEncoder;
	
	
	
	public UserService(UserRepository userRepo, ProductRepository productRepo, PasswordEncoder passwordEncoder) {
		super();
		this.userRepo = userRepo;
		this.productRepo = productRepo;
		this.passwordEncoder = passwordEncoder;
	 }

	//getProfile
	public Optional<User> getProfileByUsername(String username) {
        return userRepo.findByUsername(username);
    }
	//updateProfile
	public String updateProfile(String userName , userProfileDTO userDTO) {
		     Optional<User> user = userRepo.findByUsername(userName);
		    if(user.isEmpty()) {
		    	return "User Not found !!";
		    }
		   User u = user.get();
		   u.setName(userDTO.getName());
		   u.setMobileNumber(userDTO.getMobileNumber());
		   u.setAddressLine1(userDTO.getAddressLine1());
		   u.setCity(userDTO.getCity());
		   u.setCountry(userDTO.getCountry());
		   u.setState(userDTO.getState());
		   u.setDpUrl(userDTO.getDpUrl());
		   userRepo.save(u);
		   return "Successfully Saved !!";
	}
	//deleteProfile
	public String deleteProfile(String userName,String username,String oldpassword) {
		      Optional<User> u = userRepo.findByUsername(userName);
		      if(u.isEmpty()) {
		    	  return "User not Found !!";
		      }
		     User user = u.get();
		     boolean matches = passwordEncoder.matches(oldpassword,user.getPassword());
		     if(matches && user.getUsername().equals(username)) {
		    	 userRepo.deleteById(user.getId());
		    	 return "Account Deleted !!";
		     }
		     return  " opps!! Username & Password must be yours " ;
	}
	//passwordUpdate
	public String passwordUpdated(String username,String oldpassword,String newpassword ,String Confirm) {
		     Optional<User> u = userRepo.findByUsername(username);
		     if(u.isEmpty()) {
		    	 return "User not Found!!";
		     }
		   User user = u.get();
		   if(!newpassword.equals(Confirm)) {
			   return "Confirm password dose not match";
		   }
		   boolean matches = passwordEncoder.matches(
		            oldpassword,
		            user.getPassword());
	       if(matches) {
			  
			   user.setPassword(passwordEncoder.encode(newpassword));
			   userRepo.save(user);
			   return "newPassword Updated !!";
		   }
		 
		   return matches+ " Enter oldPassword!!";
	}
}
    
