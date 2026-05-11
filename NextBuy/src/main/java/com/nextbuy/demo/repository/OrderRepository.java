package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {
	
	List<Order> findByUserOrderByOrderedAtDesc(User user);
	
	Optional<Order> findByIdAndUser(Long id, User user);
}
