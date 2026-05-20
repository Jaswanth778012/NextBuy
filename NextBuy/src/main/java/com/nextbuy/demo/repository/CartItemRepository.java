package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.CartItem;
import com.nextbuy.demo.entity.Product;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	List<CartItem> findByCartId(Long cartId);
	Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
