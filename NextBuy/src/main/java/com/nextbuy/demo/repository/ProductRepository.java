package com.nextbuy.demo.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.entity.Product;

public interface ProductRepository  extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product>{
	 long count();
	boolean existsByNameAndBrand(String name, Brand brand);
	Optional<Product> findByName(String name);
	List<Product> findByCategory(String category);
	 @Query("SELECT DISTINCT p.category FROM Product p")
	List<String> findAllProductCategory();
	 
	 
	 @Query("""
	           SELECT p FROM Product p
	           WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
	           OR LOWER(p.slug) LIKE LOWER(CONCAT('%', :keyword, '%'))
	           OR LOWER(p.category) LIKE LOWER(CONCAT('%', :keyword, '%'))
	           OR LOWER(p.brand.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
	           """)
	    List<Product> searchProducts(String keyword);
	 
	 
	 @Query("""
		       SELECT p
		       FROM Product p
		       WHERE LOWER(p.category.name)
		       LIKE LOWER(CONCAT('%', :name, '%'))
		       """)
		List<Product> findByCategoryNameLike(
		        @Param("name") String name);
	 
	 List<Product> findByNameContainingIgnoreCase(String keyword);
}
