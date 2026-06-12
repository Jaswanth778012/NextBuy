package com.nextbuy.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.CategoryDTO;
import com.nextbuy.demo.entity.Category;
import com.nextbuy.demo.repository.CategoryRepository;

@Service
public class CategoryService {
	
	private CategoryRepository categoryRepository;
	
		 public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

    public CategoryDTO createCategory(CategoryDTO dto) {

    	 Category category = new Category();

    	    category.setName(dto.getName());
    	    category.setDescription(dto.getDescription());

    	    Category saved = categoryRepository.save(category);

    	    return new CategoryDTO(
    	            saved.getId(),
    	            saved.getName(),
    	            saved.getDescription()
    	    );
    }

    public List<CategoryDTO> getAllCategories() {

    	return categoryRepository.findAll()
                .stream()
                .map(category ->
                        new CategoryDTO(
                                category.getId(),
                                category.getName(),
                                category.getDescription()
                        ))
                .toList();
    }

    public CategoryDTO getCategoryById(Long id) {

    	Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        return new CategoryDTO(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {

    	Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        Category updated = categoryRepository.save(category);

        return new CategoryDTO(
                updated.getId(),
                updated.getName(),
                updated.getDescription()
        );
    }

    public void deleteCategory(Long id) {

        categoryRepository.deleteById(id);
    }
}
