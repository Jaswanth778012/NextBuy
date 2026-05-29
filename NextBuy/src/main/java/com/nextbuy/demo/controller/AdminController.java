package com.nextbuy.demo.controller;



import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.AdminGlobalSearchResponse;
import com.nextbuy.demo.dto.AdminUserResponceDto;
import com.nextbuy.demo.dto.BroadcastEmailRequest;
import com.nextbuy.demo.dto.BroadcastNotificationRequest;
import com.nextbuy.demo.dto.userProfileDTO;
import com.nextbuy.demo.service.AdminSearchService;
import com.nextbuy.demo.service.AdminService;
import com.nextbuy.demo.service.BroadcastService;

import jakarta.validation.Valid;



@RestController
@RequestMapping("/Admin")
public class AdminController {
	private AdminService adminService;
	private BroadcastService broadcastService;
	private  AdminSearchService adminSearchService;
	
  public AdminController(AdminService adminService, BroadcastService broadcastService, AdminSearchService adminSearchService) {
		
		this.adminService = adminService;
		this.broadcastService = broadcastService;
		this.adminSearchService = adminSearchService;
	}


  @GetMapping("/searchUser/{username}")
  public AdminUserResponceDto searchUser(@PathVariable String username) {
	  return adminService.searchUser(username);
	  
  }
  
	
  @GetMapping("/viewAllUsers")
  public List<AdminUserResponceDto> viewAllUsers() {
      return adminService.viewAllUsers();
  }

  
  
  @PatchMapping("/updateUserPassword/{username}")
  public String updateUserPassword(@PathVariable String username ,@RequestParam String password) {
      return  adminService.updateUserPassword(username,password);
  }

  @DeleteMapping("/deleteUser")
  public String deleteUser(@RequestParam String username) {
	  return adminService.deleteUser(username);
	  
	 
  }
  //AdminPasswordUpdate
  @PatchMapping("/adminUpdate/{username}/{password}")
  public String updateAdmin(@PathVariable String username,@PathVariable String password,@RequestParam String newPass){
	  return adminService.UpdateAdminPassword(username, password, newPass);
	  
  }
  
  @GetMapping("/globalSearch")
  public ResponseEntity<AdminGlobalSearchResponse> search(
          @RequestParam String keyword) {

      return ResponseEntity.ok(
              adminSearchService.search(keyword)
      );
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

 @PatchMapping("/makeUserToAdmin/{email}/{username}/{password}")
 public String addAdmin(@PathVariable String email,@PathVariable String username,@PathVariable String password) {
	 return adminService.makeUserToAdmin(email, username, password);
	 
 }
 
 @DeleteMapping("/deleteAdmin/{username}/{password}")
 public String deleteAdmin(@PathVariable String username, @PathVariable String password) {
	 return adminService.deleteAdmin(username, password);
 }
 @GetMapping("/profile")
 public userProfileDTO profile(Principal principal) {
	  String adminName = principal.getName();
	  return adminService.profile(adminName);
 }
 @PatchMapping("/editProfile")
 public String EditProfile(Principal principal,  @RequestPart("profile")
		    userProfileDTO userDTO, @RequestPart(value = "img", required = false) MultipartFile img) {
	 String adimin = principal.getName();
	 return adminService.EditProfile(adimin, userDTO, img);
 }
}
