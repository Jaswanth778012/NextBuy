package com.nextbuy.demo.service;



import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.userProfileDTO;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.Role;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;
import com.nextbuy.demo.repository.WishListRepository;

@Service
public class UserService {
	
	private UserRepository userRepo;

	private ProductRepository productRepo;

	private PasswordEncoder passwordEncoder;
	private WishListRepository wishListRepository;
	
	private CloudinaryService cloudinaryService;
	
	
	
	public UserService(UserRepository userRepo, ProductRepository productRepo, PasswordEncoder passwordEncoder, CloudinaryService cloudinaryService,WishListRepository wishListRepository) {
		super();
		this.userRepo = userRepo;
		this.productRepo = productRepo;
		this.passwordEncoder = passwordEncoder;
		this.cloudinaryService = cloudinaryService;
		this.wishListRepository = wishListRepository;
	 }

	//getProfile
	public Optional<User> getProfileByUsername(String username) {
        return userRepo.findByUsername(username);
    }
	//updateProfile
	public String updateProfile(String userName , userProfileDTO userDTO, MultipartFile file) {
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
		   u.setEmail(userDTO.getEmail());
		   u.setPincode(userDTO.getPincode());
		   if(file !=null && !file.isEmpty())
		   {
			   String imgeUrl = cloudinaryService.uploadImage(file);
			   u.setDpUrl(imgeUrl);
		   }
		   userRepo.save(u);
		   return "Successfully Saved !!";
	}
	//deleteProfile
	@Transactional
	public String deleteProfile(String username, String oldPassword) {

	    Optional<User> optionalUser = userRepo.findByUsername(username);

	    if (optionalUser.isEmpty()) {
	        return "User not found!";
	    }

	    User user = optionalUser.get();

	    // Verify current password
	    if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
	        return "Current password is incorrect!";
	    }

	    // Delete wishlist entries first
	    wishListRepository.deleteByUserId(user.getId());

	    // Delete user (cascade will handle related entities)
	    userRepo.delete(user);

	    return "Account deleted successfully!";
	}
	//passwordUpdate
	public String passwordUpdated(String username,String oldpassword,String newpassword ,String Confirm) {
		     Optional<User> u = userRepo.findByUsername(username);
		     if(u.isEmpty()) {
		    	 return "User not Found!!";
		     }
		   User user = u.get();
		   if(user.getRole() != Role.USER) {
			   return "worng old password";
		   }
		   if(!newpassword.equals(Confirm)) {
			   return "Confirm password dose not match";
		   }
		   if(oldpassword.equals(newpassword)) {
			   return "use different password!";
		   }
		   boolean matches = passwordEncoder.matches(
		            oldpassword,
		            user.getPassword());
	       if(matches) {
			  
			   user.setPassword(passwordEncoder.encode(newpassword));
			   userRepo.save(user);
			   return "newPassword Updated !!";
		   }
	       
		 
		   return  " Enter oldPassword!!";
	}
	
	public boolean verifyPassword(
	        String username,
	        String password) {

	    User user =
	        userRepo.findByUsername(username)
	                .orElse(null);

	    if (user == null) {
	        return false;
	    }

	    return passwordEncoder.matches(
	        password,
	        user.getPassword()
	    );
	}
}
    
