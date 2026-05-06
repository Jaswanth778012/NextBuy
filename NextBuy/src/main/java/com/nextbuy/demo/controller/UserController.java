package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.SystemNotificationResponse;
import com.nextbuy.demo.service.BroadcastService;
import com.nextbuy.demo.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("User")
public class UserController {
	
	BroadcastService broadcastService;
	
	JwtService jwtservice;
	
	
	public UserController(BroadcastService broadcastService, JwtService jwtservice) {
		super();
		this.broadcastService = broadcastService;
		this.jwtservice = jwtservice;
	}
	@GetMapping("/notifications")
	  public ResponseEntity<List<SystemNotificationResponse>> getNotifications() {
	      return ResponseEntity.ok(broadcastService.getAllNotifications());
	  }
	
}
