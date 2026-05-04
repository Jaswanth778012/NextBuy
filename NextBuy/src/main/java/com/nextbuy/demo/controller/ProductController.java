package com.nextbuy.demo.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.ProductDTO;

import com.nextbuy.demo.service.ProductService;

@RestController
@RequestMapping("/Product")
public class ProductController {
	
	ProductService productService;
	
	public ProductController(ProductService productService) {
		
		this.productService = productService;
	}
    @PostMapping("/addProduct")
	public String addProduct(@RequestBody  ProductDTO Pdto) {
    	
		return productService.addProduct(Pdto);
	}
    

}