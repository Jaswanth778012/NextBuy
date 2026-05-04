package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.ProductDTO;
import com.nextbuy.demo.entity.Product;
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
    @DeleteMapping("/deleteProduct/{name}/{id}")
    public String deleteProduct(@PathVariable String name, @PathVariable Long id) {
    	return productService.deleteproduct(name,id);
    }
    @GetMapping("/viewAllProducts")
    public List<Product> viewAllProducts(){
    	return productService.viewAllProducts();
    }
    @PatchMapping("/updateProduct/{id}")
    public String updateProduct(@PathVariable Long id , @RequestBody ProductDTO productDto) {
    	return productService.updateProduct(id,productDto);
    }
    @PatchMapping("/updateProductStockQality/{id}/{stock}")
    public String updateProductStockQality(@PathVariable Long id, @PathVariable int stock) {
    	return productService.updateProductStockQantity(id, stock);
    }
}