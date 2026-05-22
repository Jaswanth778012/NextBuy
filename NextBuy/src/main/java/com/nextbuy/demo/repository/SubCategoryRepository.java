package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.SubCategory;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
	
	Optional<SubCategory> findByName(String name);
	
	List<SubCategory> findByCategoryId(Long categoryId);

}
