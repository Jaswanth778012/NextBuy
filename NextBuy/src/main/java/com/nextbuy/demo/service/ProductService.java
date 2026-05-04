package com.nextbuy.demo.service;

import org.springframework.stereotype.Service;



import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.repository.BrandRepository;
import com.nextbuy.demo.repository.ProductRepository;

@Service
public class ProductService {
	
	ProductRepository  productRepo;

	BrandRepository brandRepo;
	
	
	public ProductService(ProductRepository productRepo) {
		
		this.productRepo = productRepo;
		
	}

	public String addProduct(Product product) {
		
		productRepo.save(product);
		return "Successfully Addad";
	}
	
	

}
