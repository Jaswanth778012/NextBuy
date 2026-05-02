package com.nextbuy.demo.controller;



import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.AdminUserResponceDto;

import com.nextbuy.demo.service.AdminService;


@RestController
@RequestMapping("/Admin")
public class AdminController {
	AdminService adminService;
	
	
  public AdminController(AdminService adminService) {
		
		this.adminService = adminService;
	}


  @GetMapping("/searchUser/{username}")
  public AdminUserResponceDto searchUserID(@PathVariable String username) {
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

}
