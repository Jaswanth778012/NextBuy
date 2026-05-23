package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long>{

	boolean existsByName(String name);
	
	List<Brand> findByNameContainingIgnoreCase(String keyword);
}
