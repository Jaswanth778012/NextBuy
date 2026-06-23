package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CuponRequestDto;
import com.nextbuy.demo.entity.Cupon;
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
	@PreAuthorize("hasRole('ADMIN')")
	public String cuponCreate(@RequestBody CuponRequestDto requestDto)
	{
		return cuponService.createCupon(requestDto);
	}
	
	
	@PostMapping("/apply/{code}")
	@PreAuthorize("hasRole('USER')")
	public String applyCupon(Principal principal, @PathVariable String code)
	{
		return cuponService.applyCoupon(principal.getName(), code);
	}
	
	
	@PutMapping("/update/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public String updateCupon(
	        @PathVariable Long id,
	        @RequestBody CuponRequestDto requestDto)
	{
	    return cuponService.updateCupon(id, requestDto);
	}
	
	@DeleteMapping("/delete/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public String deleteCupon(@PathVariable Long id)
	{
	    return cuponService.deleteCupon(id);
	}
	
	@DeleteMapping("/remove")
	@PreAuthorize("hasRole('USER')")
	public String removeCupon(Principal principal)
	{
		return cuponService.removeCupon(principal.getName());
	}
	
	
	@GetMapping("/all")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<Cupon>> getAllCupons() {
	    return ResponseEntity.ok(cuponService.getAllCupons());
	}
	
	@GetMapping("/available")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<Cupon>> getAvailableCupons() {
	    return ResponseEntity.ok(cuponService.getAvailableCupons());
	}
	

	@GetMapping("/availableforUser")
	@PreAuthorize("hasRole('USER')")
	public ResponseEntity<List<Cupon>> getAvailableCouponsForUser(
	        Principal principal)
	{
	    return ResponseEntity.ok(
	            cuponService.getAvailableCouponsForUser(
	                    principal.getName()
	            )
	    );
	}
	
	
}
