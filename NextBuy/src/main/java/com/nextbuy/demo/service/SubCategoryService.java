package com.nextbuy.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.SubCategoryDTO;
import com.nextbuy.demo.entity.Category;
import com.nextbuy.demo.entity.SubCategory;
import com.nextbuy.demo.repository.CategoryRepository;
import com.nextbuy.demo.repository.SubCategoryRepository;

@Service
public class SubCategoryService {

    private SubCategoryRepository subCategoryRepository;

    private CategoryRepository categoryRepository;

    public SubCategoryService(
            SubCategoryRepository subCategoryRepository,
            CategoryRepository categoryRepository) {

        this.subCategoryRepository = subCategoryRepository;
        this.categoryRepository = categoryRepository;
    }

    public SubCategoryDTO createSubCategory(
            Long categoryId,
            SubCategoryDTO dto) {

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException("Category not found"));

        SubCategory subCategory = new SubCategory();

        subCategory.setName(dto.getName());
        subCategory.setCategory(category);

        SubCategory saved = subCategoryRepository.save(subCategory);

        return new SubCategoryDTO(
                saved.getId(),
                saved.getName(),
                saved.getCategory().getId(),
                saved.getCategory().getName()
        );
    }

    public List<SubCategoryDTO> getAllSubCategories() {

        return subCategoryRepository.findAll()
                .stream()
                .map(subCategory -> new SubCategoryDTO(
                        subCategory.getId(),
                        subCategory.getName(),
                        subCategory.getCategory().getId(),
                        subCategory.getCategory().getName()
                ))
                .toList();
    }

    public List<SubCategoryDTO> getSubCategoriesByCategory(Long categoryId) {

        return subCategoryRepository.findByCategoryId(categoryId)
                .stream()
                .map(subCategory -> new SubCategoryDTO(
                        subCategory.getId(),
                        subCategory.getName(),
                        subCategory.getCategory().getId(),
                        subCategory.getCategory().getName()
                ))
                .toList();
    }

    public SubCategoryDTO getSubCategoryById(Long id) {

        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("SubCategory not found"));

        return new SubCategoryDTO(
                subCategory.getId(),
                subCategory.getName(),
                subCategory.getCategory().getId(),
                subCategory.getCategory().getName()
        );
    }

    public SubCategoryDTO updateSubCategory(
            Long id,
            SubCategoryDTO dto) {

        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("SubCategory not found"));

        subCategory.setName(dto.getName());

        SubCategory updated = subCategoryRepository.save(subCategory);

        return new SubCategoryDTO(
                updated.getId(),
                updated.getName(),
                updated.getCategory().getId(),
                updated.getCategory().getName()
        );
    }


    public void deleteSubCategory(Long id) {

        subCategoryRepository.deleteById(id);
    }
}