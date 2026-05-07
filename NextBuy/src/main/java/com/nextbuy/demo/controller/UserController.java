package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.SystemNotificationResponse;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.service.BroadcastService;
import com.nextbuy.demo.service.JwtService;
import com.nextbuy.demo.service.UserService;



@RestController
@RequestMapping("User")
public class UserController {
	
	BroadcastService broadcastService;
	
	JwtService jwtservice;
	UserService userService;
	
	
	
	public UserController(BroadcastService broadcastService, JwtService jwtservice, UserService userService) {
		super();
		this.broadcastService = broadcastService;
		this.jwtservice = jwtservice;
		this.userService = userService;
	}

}
