package com.nextbuy.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.User;

public interface CartRepository extends JpaRepository<Cart, Long> {
	
	Optional<Cart> findByUserAndActiveTrue(User user);

}
