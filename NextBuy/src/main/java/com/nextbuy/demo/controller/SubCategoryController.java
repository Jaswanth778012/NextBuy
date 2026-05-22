package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nextbuy.demo.dto.SubCategoryDTO;
import com.nextbuy.demo.service.SubCategoryService;

@RestController
@RequestMapping("/Subcategories")
public class SubCategoryController {

    private SubCategoryService subCategoryService;

    public SubCategoryController(
            SubCategoryService subCategoryService) {

        this.subCategoryService = subCategoryService;
    }

    @PostMapping("/subCate/{categoryId}")
    public ResponseEntity<SubCategoryDTO> createSubCategory(
            @PathVariable Long categoryId,
            @RequestBody SubCategoryDTO dto) {

        return new ResponseEntity<>(
                subCategoryService.createSubCategory(categoryId, dto),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/getAllSubCategories")
    public ResponseEntity<List<SubCategoryDTO>> getAllSubCategories() {

        return ResponseEntity.ok(
                subCategoryService.getAllSubCategories()
        );
    }

    @GetMapping("/subCategoryByCategory/{categoryId}")
    public ResponseEntity<List<SubCategoryDTO>> getSubCategoriesByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                subCategoryService.getSubCategoriesByCategory(categoryId)
        );
    }

    @GetMapping("/subCategoryById/{id}")
    public ResponseEntity<SubCategoryDTO> getSubCategoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                subCategoryService.getSubCategoryById(id)
        );
    }

    @PutMapping("/updateSubCategory/{id}")
    public ResponseEntity<SubCategoryDTO> updateSubCategory(
            @PathVariable Long id,
            @RequestBody SubCategoryDTO dto) {

        return ResponseEntity.ok(
                subCategoryService.updateSubCategory(id, dto)
        );
    }

    @DeleteMapping("/deleteSubCategory/{id}")
    public ResponseEntity<String> deleteSubCategory(
            @PathVariable Long id) {

        subCategoryService.deleteSubCategory(id);

        return ResponseEntity.ok("SubCategory deleted successfully");
    }
}
