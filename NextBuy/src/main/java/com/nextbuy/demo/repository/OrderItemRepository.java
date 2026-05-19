package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nextbuy.demo.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	@Query("""
		       SELECT oi.product, SUM(oi.quantity)
		       FROM OrderItem oi
		       WHERE oi.status = 'DELIVERED'
		       GROUP BY oi.product
		       ORDER BY SUM(oi.quantity) DESC
		       """)
		List<Object[]> getTopSellingProducts();
}
