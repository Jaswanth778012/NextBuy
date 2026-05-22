package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CategoryDTO;
import com.nextbuy.demo.service.CategoryService;

@RestController
@RequestMapping("/Categories")
public class CategoryController {
	
	private CategoryService categoryService;
	
	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	    @PostMapping("/addCategory")
	    public ResponseEntity<CategoryDTO> createCategory(
	            @RequestBody CategoryDTO dto) {

	        return new ResponseEntity<>(
	                categoryService.createCategory(dto),
	                HttpStatus.CREATED
	        );
	    }

	    @GetMapping("/allCategories")
	    public ResponseEntity<List<CategoryDTO>> getAllCategories() {

	        return ResponseEntity.ok(
	                categoryService.getAllCategories()
	        );
	    }

	    @GetMapping("/getcategoryById/{id}")
	    public ResponseEntity<CategoryDTO> getCategoryById(
	            @PathVariable Long id) {

	        return ResponseEntity.ok(
	                categoryService.getCategoryById(id)
	        );
	    }

	    @PutMapping("/updateCategory/{id}")
	    public ResponseEntity<CategoryDTO> updateCategory(
	            @PathVariable Long id,
	            @RequestBody CategoryDTO dto) {

	        return ResponseEntity.ok(
	                categoryService.updateCategory(id, dto)
	        );
	    }

	    @DeleteMapping("/deleteCategory/{id}")
	    public ResponseEntity<String> deleteCategory(
	            @PathVariable Long id) {

	        categoryService.deleteCategory(id);

	        return ResponseEntity.ok("Category deleted successfully");
	    }
}
