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
import com.nextbuy.demo.enums.ProductStatus;
import com.nextbuy.demo.repository.ProductRepository;

import jakarta.persistence.criteria.Predicate;

@Service
public class CommonService {
	
	ProductRepository productRepo;
	
	public CommonService(ProductRepository productRepo) {
		super();
		this.productRepo = productRepo;
	}

	public List<Product> viewAllProducts() {
		 List<Product> allproducts = productRepo.findAll();
		 if(allproducts.isEmpty()) {
			 throw new RuntimeException("No products found");
		 }
		return allproducts.stream()
				   .filter(p->p.getProductStatus()==ProductStatus.ACTIVE)
				   .sorted((a,b) ->
			        a.getName().compareTo(b.getName()))
				   .toList();
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
	        userDto.setSubCategory(product.getSubCategory());
	        userDto.setPrice(product.getMrp_price());
	        userDto.setDiscountPercentage(product.getDiscountPercentage());
	        userDto.setImageUrls(product.getImageUrls());
	        userDto .setAttributes(product.getAttributes());
	        userDto.setAverageRating(product.getAverageRating());
	        userDto.setBrand(product.getBrand());
	        userDto.setDeliveryTimeInDays(product.getDeliveryTimeInDays());
	        userDto.setFinalPrice(product.getFinalPrice());
	        return userDto;
	     
	      
	  }
	
	public List<UserResponceDTO> searchCategory(String category){

	    return productRepo.findByCategoryNameLike(category)
	            .stream()
	            .map(this::mapToResponseDto)
	            .toList();
	}
	
	public List<UserResponceDTO> searchBySubCategory(String subCategory){

	    return productRepo.findAll()
	            .stream()
	            .filter(p -> p.getSubCategory().getName()
	                    .equalsIgnoreCase(subCategory))
	            .map(this::mapToResponseDto)
	            .toList();
	}
   
   public Page<Product> getProductsWithFilters(String search, String category, String subCategory,
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
	predicates.add(
		    cb.equal(
		        cb.lower(root.get("category").get("name")),
		        category.toLowerCase()
		    )
		);
}

if(subCategory != null && !subCategory.isEmpty()) {
	predicates.add(
		    cb.equal(
		        cb.lower(root.get("subCategory").get("name")),
		        subCategory.toLowerCase()
		    )
		);
}
if (minPrice != null) {
predicates.add(cb.greaterThanOrEqualTo(root.get("mrp_price"), minPrice));
}
if (maxPrice != null) {
predicates.add(cb.lessThanOrEqualTo(root.get("mrp_price"), maxPrice));
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