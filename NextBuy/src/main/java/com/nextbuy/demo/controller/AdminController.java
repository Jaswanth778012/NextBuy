package com.nextbuy.demo.controller;



import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.AdminUserResponceDto;
import com.nextbuy.demo.dto.BroadcastEmailRequest;
import com.nextbuy.demo.dto.BroadcastNotificationRequest;
import com.nextbuy.demo.dto.SystemNotificationResponse;
import com.nextbuy.demo.service.AdminService;
import com.nextbuy.demo.service.BroadcastService;

import jakarta.validation.Valid;



@RestController
@RequestMapping("/Admin")
public class AdminController {
	AdminService adminService;
	BroadcastService broadcastService;
	
  public AdminController(AdminService adminService, BroadcastService broadcastService) {
		
		this.adminService = adminService;
		this.broadcastService = broadcastService;
	}


  @GetMapping("/searchUser/{username}")
  public AdminUserResponceDto searchUser(@PathVariable String username) {
	  return adminService.searchUser(username);
	  
  }
  
	
  @GetMapping("/viewAllUsers")
  public List<AdminUserResponceDto> viewAllUsers() {
      return adminService.viewAllUsers();
  }

  
  
  @PatchMapping("/updateUser/{username}")
  public String updateUser(@PathVariable String username ,@RequestParam String password) {
      return  adminService.updateUser(username,password);
  }

  @DeleteMapping("/deleteUser")
  public String deleteUser(@RequestParam String username) {
	  return adminService.deleteUser(username);
	  
	 
  }
  //AdminPasswordUpdate
  @PatchMapping("/adminUpdate/{username}/{password}")
  public String updateAdmin(@PathVariable String username,@PathVariable String password,@RequestParam String newPass){
	  return adminService.adminUpdate(username, password, newPass);
	  
  }
  
  // Notifications
  
  @PostMapping("/broadcast/notification")
  public ResponseEntity<String> broadcastNotification(@Valid @RequestBody BroadcastNotificationRequest request) {
      broadcastService.sendNotificationToAll(request);
      return ResponseEntity.ok("System notification broadcasted successfully");
  }

  // ----- Admin: Send Cold Email -----
  @PostMapping("/broadcast/email")
  public ResponseEntity<String> broadcastEmail(@Valid @RequestBody BroadcastEmailRequest request) {
      broadcastService.sendEmailToAll(request);
      return ResponseEntity.ok("Email sent to all registered users");
  }

 @PatchMapping("/addAdmin/{email}")
 public String addAdmin(@PathVariable String email,@RequestParam String username,@RequestParam String password) {
	 return adminService.addAdmin(email, username, password);
	 
 }
 
 @DeleteMapping("/deleteAdmin/{username}/{password}")
 public String deleteAdmin(@PathVariable String username, @PathVariable String password) {
	 return adminService.deleteAdmin(username, password);
 }
}
