package com.nextbuy.demo.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.userProfileDTO;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.service.BroadcastService;
import com.nextbuy.demo.service.JwtService;
import com.nextbuy.demo.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
@RestController
@RequestMapping("User")
public class UserController {
	
	BroadcastService broadcastService;

	JwtService jwtService;
	UserService userService;

	public UserController(BroadcastService broadcastService, JwtService jwtService, UserService userService) {
		super();
		this.broadcastService = broadcastService;

		this.jwtService = jwtService;
		this.userService = userService;
	}
	
	
	@GetMapping("/profile")
	 public ResponseEntity<User> getProfile(Principal principal) {
			String username = principal.getName();
	        return userService.getProfileByUsername(username)
	                .map(ResponseEntity::ok)
	                .orElse(ResponseEntity.notFound().build());
	    }
	// front-end implemention
	   @PostMapping("/logout")
	    public ResponseEntity<String> logout() {
	        return ResponseEntity.ok("Logout successful");
	    }
	   @PatchMapping("/updateProfile")
	   public String updateProfile(HttpServletRequest request ,@RequestBody userProfileDTO userDTO) {
		   String token = request.getHeader("Authorization").substring(7);
		   String username = jwtService.extractUsername(token);
		   return userService.updateProfile(username, userDTO);
	   }
     @DeleteMapping("/deleteProfile/{username}/{oldpassword}")
     public String deleteProfile(HttpServletRequest request,@PathVariable String username,@PathVariable String oldpassword) {
    	 String token = request.getHeader("Authorization").substring(7);
    	 String userName = jwtService.extractUsername(token);
    	 return userService.deleteProfile(userName, username, oldpassword);
    	
     }
     @PatchMapping("/passwordUpdated/{oldpassword}/{newpassword}/{Confirm}")
     public String  passwordUpdated(HttpServletRequest request,@PathVariable String oldpassword,@PathVariable String newpassword,@PathVariable String Confirm) {
    	 String token = request.getHeader("Authorization").substring(7);
		   String username = jwtService.extractUsername(token);
		   return userService.passwordUpdated(username, oldpassword, newpassword,Confirm);
     }
     
}
