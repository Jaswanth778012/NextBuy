package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.SystemNotificationResponse;
import com.nextbuy.demo.service.BroadcastService;

@RestController
@RequestMapping("User")
public class UserController {
	
	BroadcastService broadcastService;
	
	public UserController(BroadcastService broadcastService)
	{
		this.broadcastService = broadcastService; 
	}
	
	@GetMapping("/notifications")
	  public ResponseEntity<List<SystemNotificationResponse>> getNotifications() {
	      return ResponseEntity.ok(broadcastService.getAllNotifications());
	  }
}
