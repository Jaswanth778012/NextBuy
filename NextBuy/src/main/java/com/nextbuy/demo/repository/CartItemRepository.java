package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}
