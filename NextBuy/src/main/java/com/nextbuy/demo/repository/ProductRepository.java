package com.nextbuy.demo.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.entity.Product;

public interface ProductRepository  extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product>{
	
	boolean existsByNameAndBrand(String name, Brand brand);
	Optional<Product> findByName(String name);
	List<Product> findByCategory(String category);

}
