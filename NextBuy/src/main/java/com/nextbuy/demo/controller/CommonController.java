package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.UserResponceDTO;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.service.CommonService;


@RestController
@RequestMapping("/Common")
public class CommonController {
	
	CommonService commonService;
	
	public CommonController(CommonService commonService) {
		super();
		this.commonService = commonService;
	}
  @GetMapping("/viewAllProducts")
	public List<UserResponceDTO> viewAllProducts(){
		return commonService.viewAllProducts();
	}
  @GetMapping("/searchByName/{name}")
  public List<UserResponceDTO> searchByName(@PathVariable String name){
	  return commonService.searchByName(name);
  }
    @GetMapping("/searchCategory/{category}")
    public List<UserResponceDTO> searchCategory(@PathVariable String category){
    	return   commonService.searchCategory(category);
    	
    }
    
    @GetMapping("/searchProducts")
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String stockStatus,
            @RequestParam(required = false) Long brandId,
            @RequestParam(defaultValue = "0") int page) {

        Pageable pageable = PageRequest.of(page, 3);

        Page<Product> products = commonService.getProductsWithFilters(
                search,
                category,
                minPrice,
                maxPrice,
                stockStatus,
                brandId,
                pageable
        );

        return ResponseEntity.ok(products);
    }
    @GetMapping("/getAllCategorys")
    public List<String> getAllCategory(){
    	return commonService.getAllCategorys();
    }
    @GetMapping("/findProductById/{id}")
    public Product searchById(@PathVariable Long id) {
    	return commonService.findProductById(id);
    }
}

