package com.nextbuy.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.BrandRequestDto;
import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.service.BrandService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Brands")
public class BrandController {
	
	BrandService brandService;
	
	public BrandController(BrandService brandService) {
		this.brandService = brandService;
	}
	
	@PostMapping("/addBrand")
	public ResponseEntity<?> addBrand(@RequestPart("brand") @Valid BrandRequestDto request, @RequestPart(value ="logo", required = false) MultipartFile logo)
	{
		String result = brandService.addBrand(request, logo);
		
		return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", result));
	}
	
	@PutMapping("/updateBrand/{brandId}")
	public ResponseEntity<?> updateBrand(@PathVariable Long brandId, @RequestPart("brand") @Valid BrandRequestDto request, @RequestPart(value ="logo", required = false) MultipartFile logo)
	{
		String result = brandService.updateBrand(brandId, request, logo);
		
		return ResponseEntity.ok(Map.of("message", result));
	}

	@GetMapping("/brand/{brandId}")
	public Brand getBrandById(@PathVariable Long brandId) {
		return brandService.getBrandById(brandId);
	}
	
	@GetMapping("/brandname/{name}")
	public Brand getBrandByName(@PathVariable String name) {
		return brandService.getBrandByName(name);
	}
	
	@GetMapping("/brand/all")
	public List<Brand> getAllBrands() {
		return brandService.getAllBrands();
	}
	
	@DeleteMapping("/brand/{brandId}")
	public ResponseEntity<?> deleteBrand(@PathVariable Long brandId) {
		String result = brandService.deleteBrand(brandId);
		
		return ResponseEntity.ok(Map.of("message", result));
	}
}
