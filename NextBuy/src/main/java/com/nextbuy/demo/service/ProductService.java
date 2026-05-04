package com.nextbuy.demo.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.nextbuy.demo.dto.ProductDTO;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.enums.ProductStatus;
import com.nextbuy.demo.repository.BrandRepository;
import com.nextbuy.demo.repository.ProductRepository;

@Service
public class ProductService {
	
	ProductRepository  productRepo;
	BrandRepository brandRepo;
	
	public ProductService(ProductRepository productRepo, BrandRepository brandRepo) {
		super();
		this.productRepo = productRepo;
		this.brandRepo = brandRepo;
	}
	public String addProduct(ProductDTO Pdto) {
		Product p = new Product();
		if(productRepo.existsByNameAndBrand(Pdto.getName(),Pdto.getBrand() )) {
			return "Product alredy existed !!!";
		}
		
    	p.setName(Pdto.getName());
    	p.setDescription(Pdto.getDescription());
    	p.setCategory(Pdto.getCategory());
    	p.setPrice(Pdto.getPrice());
    	p.setDis_count(Pdto.getDis_count());
    	p.setStockQuantity(Pdto.getStockQuantity());
    	if(p.getStockQuantity() <= 0) {
    		p.setStockStatus(AvailabilityStockStatus.NOT_AVAILABLE);
    	}else if(p.getStockQuantity() >= 50) {
    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
    	}else {
    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
    	}
    	
    	p.setImageUrl(null);
    	p.setAverageRating(Pdto.getAverageRating());
    	p.setTotalRating(Pdto.getTotalRating());
    	p.setProductStatus(Pdto.getProductStatus());
    	p.setCreatedAt(Pdto.getCreatedAt());
    	p.setUpdatedAt(Pdto.getUpdatedAt());
    	p.setDeliveryTimeInDays(Pdto.getDeliveryTimeInDays());
    	p.setAttributes(Pdto.getAttributes());
		p.setBrand(Pdto.getBrand());
		
		productRepo.save(p);
		return "Successfully Addad";
	}
	

	public String deleteproduct(String name, Long Brand_id) {
		  
		  Optional<Product> pr = productRepo.findByName(name);
		  if(pr.isEmpty()) {
			  return "Something went worng";
		  }
		  Product product = productRepo.findByName(name).get();
		  if(!product.getName().equals(name) && !product.getBrand().equals(Brand_id)) {
			 
			  return "something went Worng";
		  }
		 
		  productRepo.deleteById(product.getId());
		  return "Product Deleted !!";
		
	}
	public List<Product> viewAllProducts() {
		 List<Product> allproducts = productRepo.findAll();
		 if(allproducts.isEmpty()) {
			 throw new RuntimeException("Username is required");
		 }
		return allproducts;
	}
	
	public String updateProduct(Long id ,ProductDTO product ) {
		
		    Optional<Product> pr = productRepo.findById(id) ;
		    if(pr.isEmpty()) {
		    	return "Product not found";
		    }
		     Product p = productRepo.findById(id).get();
		     
		p.setName(product.getName());
    	p.setDescription(product.getDescription());
    	p.setCategory(product.getCategory());
    	p.setPrice(product.getPrice());
    	p.setDis_count(product.getDis_count());
    	p.setStockQuantity(product.getStockQuantity());
    	if(p.getStockQuantity() <= 0) {
    		p.setStockStatus(AvailabilityStockStatus.NOT_AVAILABLE);
    	}else if(p.getStockQuantity() >= 50) {
    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
    	}else {
    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
    	}
    	
    	p.setImageUrl(null);
    	p.setAverageRating(product.getAverageRating());
    	p.setTotalRating(product.getTotalRating());
    	
    	if(p.getStockQuantity() <= 0) {
    		p.setProductStatus(ProductStatus.INACTIVE);
    	
    	}else {
    		p.setProductStatus(ProductStatus.ACTIVE);
    	}
    	
    	
    	
    	p.setCreatedAt(product.getCreatedAt());
    	p.setUpdatedAt(product.getUpdatedAt());
    	p.setDeliveryTimeInDays(product.getDeliveryTimeInDays());
    	p.setAttributes(product.getAttributes());
		p.setBrand(product.getBrand());
		
		productRepo.save(p);
		return "Successfully updated";
		
	}
	public String updateProductStockQantity(Long id,int stock) {
		   Optional<Product> pr = productRepo.findById(id);
		  if(pr.isEmpty()) {
			  return "Product not Found";
		  }
		  Product p = productRepo.findById(id).get();
		  p.setStockQuantity(stock);
		  if(p.getStockQuantity() <= 0) {
	    		p.setStockStatus(AvailabilityStockStatus.NOT_AVAILABLE);
	    	}else if(p.getStockQuantity() >= 50) {
	    		p.setStockStatus(AvailabilityStockStatus.AVAILABLE);
	    	}else {
	    		p.setStockStatus(AvailabilityStockStatus.LIMITED_STOCK);
	    	}

	    	if(p.getStockQuantity() <= 0) {
	    		p.setProductStatus(ProductStatus.INACTIVE);
	    	
	    	}else {
	    		p.setProductStatus(ProductStatus.ACTIVE);
	    	}
		  productRepo.save(p);
		  return "Successfully updated";
	}
	
}
