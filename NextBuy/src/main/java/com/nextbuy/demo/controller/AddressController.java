package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.entity.Address;
import com.nextbuy.demo.service.AddressService;

@RestController
@RequestMapping("/Address")
public class AddressController {
	
	private AddressService addressService;
	
	public AddressController(AddressService addressService) {
		this.addressService = addressService;
	}
	
	@PostMapping("/createAddress")
	public ResponseEntity<Address> createAddress(Principal principal,@RequestBody Address address)
	{
		return ResponseEntity.ok(addressService.createAddress(principal.getName(), address));
	}
	
	@GetMapping("/getAddress")
	public ResponseEntity<List<Address>> getAddresses(Principal principal)
	{
		return ResponseEntity.ok(addressService.getAddresses(principal.getName()));
	}
	
	@GetMapping("/getAddress/{id}")
	public ResponseEntity<Address> getAddressById(Principal principal, @PathVariable Long id)
	{
		return ResponseEntity.ok(addressService.getAddressById(principal.getName(), id));
	}
	
	@PutMapping("/UpdateAddress/{id}")
	public ResponseEntity<Address> updateAddress(Principal principal,@PathVariable Long id, @RequestBody Address address)
	{
		return ResponseEntity.ok(addressService.updateAddress(principal.getName(), id, address));
	}
	
	@DeleteMapping("/deleteAddress/{id}")
	public ResponseEntity<String> deleteAddress(Principal principal, @PathVariable Long id)
	{
		return ResponseEntity.ok(addressService.deleteAddress(principal.getName(), id));
	}
	
	@PutMapping("/default/{id}")
	public ResponseEntity<String> setDefaultAddress(Principal principal, @PathVariable Long id)
	{
		return ResponseEntity.ok(addressService.setDefaultAddress(principal.getName(), id));
	}
}
