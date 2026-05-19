package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.nextbuy.demo.entity.CartItem;

import java.util.List;




public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	List<CartItem> findByCartId(Long cartId);
}
