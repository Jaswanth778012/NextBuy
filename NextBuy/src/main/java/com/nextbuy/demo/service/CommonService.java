package com.nextbuy.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import com.nextbuy.demo.dto.UserResponceDTO;
import com.nextbuy.demo.entity.Product;

import com.nextbuy.demo.repository.ProductRepository;

import jakarta.persistence.criteria.Predicate;

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
	        userDto.setDiscountPercentage(product.getDiscountPercentage());
	        userDto.setImageUrl(product.getImageUrl());
	        userDto .setAttributes(product.getAttributes());
	        userDto.setAverageRating(product.getAverageRating());
	        userDto.setBrand(product.getBrand());
	        userDto.setDeliveryTimeInDays(product.getDeliveryTimeInDays());
	        userDto.setFinalPrice(product.getFinalPrice());
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
   
   public Page<Product> getProductsWithFilters(String search, String category,
           Double minPrice, Double maxPrice,
           String stockStatus, Long brandId,
           Pageable pageable) {
Specification<Product> spec = (root, query, cb) -> {
List<Predicate> predicates = new ArrayList<>();
if (search != null && !search.isEmpty()) {
String pattern = "%" + search.toLowerCase() + "%";
predicates.add(cb.or(
cb.like(cb.lower(root.get("name")), pattern),
cb.like(cb.lower(root.get("description")), pattern)
));
}
if (category != null && !category.isEmpty()) {
predicates.add(cb.equal(root.get("category"), category));
}
if (minPrice != null) {
predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
}
if (maxPrice != null) {
predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
}
if (stockStatus != null && !stockStatus.isEmpty()) {
predicates.add(cb.equal(root.get("stockStatus").as(String.class), stockStatus));
}
if (brandId != null) {
predicates.add(cb.equal(root.get("brand").get("id"), brandId));
}
return cb.and(predicates.toArray(new Predicate[0]));
};
return productRepo.findAll(spec, pageable);
}
   
   public List<String> getAllCategorys(){
	    List<String> category = productRepo.findAllProductCategory().stream().distinct().sorted().toList();
	    if(category.isEmpty()) {
	     throw new RuntimeException("Category Empty!!");
	    }
	    return category;
   }
   public  Product findProductById(Long id) {
		Optional<Product> p = productRepo.findById(id);
		if(p.isEmpty()) {
			throw new RuntimeException("Product not Found");
		}
		    Product product = productRepo.findById(id).get();
		    return product;
	}
}