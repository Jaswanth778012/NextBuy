package com.nextbuy.demo.controller;

import java.security.Principal;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CuponRequestDto;
import com.nextbuy.demo.service.CuponService;

@RestController
@RequestMapping("/Cupon")

public class CuponController {
	
	private CuponService cuponService;
	
	CuponController(CuponService cuponService)
	{
		this.cuponService = cuponService;
	}
	
	@PostMapping("/create")
	public String cuponCreate(@RequestBody CuponRequestDto requestDto)
	{
		return cuponService.createCupon(requestDto);
	}
	
	@PostMapping("/apply/{code}")
	public String applyCupon(Principal principal, @PathVariable String code)
	{
		return cuponService.applyCoupon(principal.getName(), code);
	}
	
	@PutMapping("/update/{code}")
	public String updateCupon(@PathVariable String code,
	                          @RequestBody CuponRequestDto requestDto)
	{
	    return cuponService.updateCupon(code, requestDto);
	}
	
	@DeleteMapping("/remove")
	public String removeCupon(Principal principal)
	{
		return cuponService.removeCupon(principal.getName());
	}
}
