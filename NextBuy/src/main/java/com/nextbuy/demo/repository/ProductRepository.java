package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Product;

public interface ProductRepository  extends JpaRepository<Product, Long>{

}
