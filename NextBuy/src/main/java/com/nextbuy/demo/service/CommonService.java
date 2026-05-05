package com.nextbuy.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;


import com.nextbuy.demo.dto.UserResponceDTO;
import com.nextbuy.demo.entity.Product;

import com.nextbuy.demo.repository.ProductRepository;

@Service
public class CommonService {
	
	ProductRepository productRepo;
	
	public CommonService(ProductRepository productRepo) {
		super();
		this.productRepo = productRepo;
	}

	public List<UserResponceDTO> viewAllProducts(){
		
		 List<Product> pr = productRepo.findAll();
		 if(pr.isEmpty()) {
			 throw new RuntimeException("Username is required");
		 }
		return pr.stream().map(this::mapToResponseDto).toList();
		
	}
	
	public List<UserResponceDTO> searchByName(String name){
		    Optional<Product> products = productRepo.findByName(name);
		    return products.stream().map(this::mapToResponseDto).toList();
	}
	public UserResponceDTO mapToResponseDto(Product product) {
		UserResponceDTO userDto = new UserResponceDTO ();
		  userDto.setName(product.getName());
	        userDto.setDescription(product.getDescription());
	        userDto.setCategory(product.getCategory());
	        userDto.setPrice(product.getPrice());
	        userDto.setDis_count(product.getDis_count());
	        userDto.setImageUrl(product.getImageUrl());
	        userDto .setAttributes(product.getAttributes());
	        userDto.setAverageRating(product.getAverageRating());
	        userDto.setBrand(product.getBrand());
	        userDto.setDeliveryTimeInDays(product.getDeliveryTimeInDays());
	        return userDto;
	     
	      
	  }
	
   public   List<UserResponceDTO> searchCategory(String category){
	          return productRepo.findAll()
	            .stream()
	            .filter(p -> p.getCategory().equalsIgnoreCase(category))
	            .map(this::mapToResponseDto)
	            .distinct()
	            .sorted()
	            .toList();
	
	  
   }
}