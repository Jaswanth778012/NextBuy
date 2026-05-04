package com.nextbuy.demo.service;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.ProductDTO;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.AvailabilityStockStatus;
import com.nextbuy.demo.repository.BrandRepository;
import com.nextbuy.demo.repository.ProductRepository;

@Service
public class ProductService {
	
	ProductRepository  productRepo;

	BrandRepository brandRepo;
	
	
	public ProductService(ProductRepository productRepo) {
		
		this.productRepo = productRepo;
		
	}

	public String addProduct(ProductDTO Pdto) {
		Product p = new Product();
		if(productRepo.existsByNameAndBrand(Pdto.getName(), Pdto.getBrand())) {
			
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
	
	

}
