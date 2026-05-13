package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {
	
	List<Order> findByUserOrderByOrderedAtDesc(User user);
	
	Optional<Order> findByIdAndUser(Long id, User user);
	
	List<Order> findByUserAndStatusOrderByOrderedAtDesc(User user, OrderStatus status);
}
