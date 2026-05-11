package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
