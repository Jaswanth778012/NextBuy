package com.nextbuy.demo.controller;



import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.ProductDTO;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.ProductStatus;
import com.nextbuy.demo.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/Product")
public class ProductController {
	
	ProductService productService;
	
	public ProductController(ProductService productService) {
		
		this.productService = productService;
	}
    @PostMapping("/addProduct")
	public String addProduct(@RequestPart("product") @Valid ProductDTO Pdto, @RequestPart(value = "image", required = false)  MultipartFile image) {
    	
		return productService.addProduct(Pdto, image);
	}
    @DeleteMapping("/deleteProduct/{name}/{id}")
    public String deleteProduct(@PathVariable String name, @PathVariable Long id) {
    	return productService.deleteproduct(name,id);
    }
    @GetMapping("/viewAllProducts")
    public List<Product> viewAllProducts(){
    	return productService.viewAllProducts();
    }
    @PatchMapping("/updateProduct/{id}")
    public String updateProduct(@PathVariable Long id , @RequestPart("product") ProductDTO productDto, @RequestPart(value = "image", required = false) MultipartFile image) {
    	return productService.updateProduct(id,productDto, image);
    }
    @PatchMapping("/updateProductStockQality/{id}/{stock}")
    public String updateProductStockQality(@PathVariable Long id, @PathVariable int stock) {
    	return productService.updateProductStockQantity(id, stock);
    }

    @PatchMapping("/updateProductStatus/{id}/{status}")
    public String updateProductStatus(@PathVariable Long id, @PathVariable ProductStatus status) {
    	return productService.updateProductStatus(id, status);
    }
}