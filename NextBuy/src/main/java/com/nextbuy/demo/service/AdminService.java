package com.nextbuy.demo.service;


import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.AdminUserResponceDto;
import com.nextbuy.demo.dto.userProfileDTO;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.Role;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.UserRepository;


@Service
public class AdminService {
	
	private UserRepository  userRepo;
	private PasswordEncoder passwordEncoder;
	private EmailService emailSevice;
	private CloudinaryService cludinaryService;
	private OrderRepository orderRepo;

	


	public AdminService(UserRepository userRepo, PasswordEncoder passwordEncoder, EmailService emailSevice, CloudinaryService cloudinaryService, OrderRepository orderRepo) {
		super();
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
		this.emailSevice = emailSevice;
		this.cludinaryService = cloudinaryService;
		this.orderRepo = orderRepo;
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
	        		.filter(user ->user.getRole() != Role.ADMIN)
	                .map(this::mapToResponseDto)
	                .toList();
	    }
	
	
	 public String updateUserPassword(String username, String password) {

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
	 
	 
	 public String UpdateAdminPassword(String username,String password, String newPass) {
		 User userex = userRepo.findByUsername(username).get();
		 if(!userex.getPassword() .equals(password) && !userex.getUsername().equals(username) ) {
			 return "Admin not found!";
		 }
		 userex.setPassword(passwordEncoder.encode(newPass));
		 userRepo.save(userex);
		 return "Successfully updated!";
	 }
	 
	 public String makeUserToAdmin(String email ,String name,String password) {
		   User user = userRepo.findByEmail(email).get();
		   Optional<User> use = userRepo.findByEmail(email);
		   if(!use.isPresent()) {
			   return "Person is not found !";
		   }
	
         user.setRole(Role.ADMIN);
         user.setUsername(name);
         user.setPassword(passwordEncoder.encode(password));
         userRepo.save(user);
         String body = "Welcome to NextBuy as a Admin \r\n"
        		 +"AdminName : "+name +" \r\n"
        		 +"password :" + password + "";
         emailSevice.sendEmail(email, "FROM NEXTBUY",body );
         
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
	
	public userProfileDTO profile(String username) {
		  User admin = userRepo.findByUsername(username).get();
		  userProfileDTO ur = new userProfileDTO();
		  ur.setName(admin.getName());
		  ur.setDpUrl(admin.getDpUrl());
		  ur.setAddressLine1(admin.getAddressLine1());
		  ur.setCity(admin.getCity());
		  ur.setCountry(admin.getCountry());
		  ur.setMobileNumber(admin.getMobileNumber());
		  ur.setState(admin.getState());
		  ur.setEmail(admin.getEmail());
		  return ur;
	}
	
	public String EditProfile(String userName , userProfileDTO userDTO, MultipartFile imgUrl) {
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
	   
	   if(imgUrl != null && !imgUrl.isEmpty())
	   {
		   String profileUrl = cludinaryService.uploadDpUrl(imgUrl);
		   u.setDpUrl(profileUrl);
	   }
	   
	   userRepo.save(u);
	   return "Successfully Saved !!";
}
	 
	 
	 public AdminUserResponceDto mapToResponseDto(User user) {
		  AdminUserResponceDto AdminURD = new AdminUserResponceDto();
		  	AdminURD.setId(user.getId());
		  	AdminURD.setUsername(user.getUsername());
	        AdminURD.setName(user.getName());
	        AdminURD.setMobileNumber(user.getMobileNumber());
	        AdminURD.setImgUrl(user.getDpUrl());
	        AdminURD.setEmail(user.getEmail());
	        AdminURD.setGender(user.getGender());
	        AdminURD.setState(user.getState());
	        AdminURD.setDob(user.getDob());
	        AdminURD.setAddress(user.getAddressLine1());
	        AdminURD.setCreatedAt(user.getCreatedAt());
	        AdminURD.setLastLogin(user.getLastLogin());
	        
	        Long totalOrders = orderRepo.countByUser(user);
	        AdminURD.setTotalOrders(totalOrders);
	        
	        Double totalSpent = orderRepo.getTotalAmountSpentByUser(user.getId());
	        AdminURD.setTotalSpent(totalSpent);
	        
	        return AdminURD;
	     
	      
	  }
	 

}
