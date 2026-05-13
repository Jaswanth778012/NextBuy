package com.nextbuy.demo.service;


import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import com.nextbuy.demo.dto.AdminUserResponceDto;

import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.Role;
import com.nextbuy.demo.repository.UserRepository;


@Service
public class AdminService {
	
	UserRepository  userRepo;
	PasswordEncoder passwordEncoder;
	
	

	public AdminService(PasswordEncoder passwordEncoder,UserRepository userRepo) {
		
		this.passwordEncoder = passwordEncoder;
		this.userRepo = userRepo;
	}



	public AdminUserResponceDto searchUser(String username) {
        Optional<User> optionalUser = userRepo.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();
     return  mapToResponseDto(user);
              
    }
	
	 public List<AdminUserResponceDto> viewAllUsers() {
	        List<User> users = userRepo.findAll();

	        return users.stream()
	                .map(this::mapToResponseDto)
	                .toList();
	    }
	
	
	 public String updateUser(String username, String password) {

		    if (username == null || username.isBlank()) {
		        throw new RuntimeException("Username is required");
		    }

		    Optional<User> optionalUser = userRepo.findByUsername(username);

		    if (optionalUser.isEmpty()) {
		        throw new RuntimeException("User not found");
		    }

		    User existingUser = optionalUser.get();

		    if (password != null && !password.isBlank()) {
		        existingUser.setPassword(passwordEncoder.encode(password));
		    }

		    userRepo.save(existingUser);

		    return "password changed!";
		}
	 
	 
	 
	 public String deleteUser(String username) {
	        if (!userRepo.existsByUsername(username)) {
	            return "User not found";
	        }

	         User user = userRepo.findByUsername(username).get();
	        
	         userRepo.deleteById(user.getId());
	        return "User deleted successfully";
	    }
	 
	 
	 public String adminUpdate(String username,String password, String newPass) {
		 User userex = userRepo.findByUsername(username).get();
		 if(!userex.getPassword() .equals(password) && !userex.getUsername().equals(username) ) {
			 return "Admin not found!";
		 }
		 userex.setPassword(passwordEncoder.encode(newPass));
		 userRepo.save(userex);
		 return "Successfully updated!";
	 }

	 public String addAdmin(String email ,String username,String password) {
		   User user = userRepo.findByEmail(email).get();
		   Optional<User> use = userRepo.findByEmail(email);
		   if(!use.isPresent()) {
			   return "Person is not found !";
		   }
	
         user.setRole(Role.ADMIN);
         user.setUsername(username);
         user.setPassword(passwordEncoder.encode(password));
         userRepo.save(user);
		 return " ADDED NEW ADDMIN !"; 
	 }

	public String deleteAdmin(String username, String password) {
		User admin = userRepo.findByUsername(username).get();
		if(admin.getUsername().equals(username)&& admin.getPassword().equals(password)) {
			userRepo.deleteById(admin.getId());
			return "Deleted successfully!";
		}
		return "worng admin details !";
	}
	 
	 
	 public AdminUserResponceDto mapToResponseDto(User user) {
		  AdminUserResponceDto AdminURD = new AdminUserResponceDto();
		  AdminURD.setUsername(user.getUsername());
	        AdminURD.setName(user.getName());
	        AdminURD.setMobileNumber(user.getMobileNumber());
	        AdminURD.setEmail(user.getEmail());
	        AdminURD.setGender(user.getGender());
	        AdminURD.setDob(user.getDob());
	        AdminURD.setAddress(user.getAddressLine1());
	        return AdminURD;
	     
	      
	  }
	 

}
