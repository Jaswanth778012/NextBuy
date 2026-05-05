package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.UserResponceDTO;
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
}

