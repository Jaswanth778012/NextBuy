package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.nextbuy.demo.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long>{

	boolean existsByName(String name);

}
