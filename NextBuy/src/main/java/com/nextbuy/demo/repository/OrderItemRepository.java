package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nextbuy.demo.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	@Query("""
		       SELECT oi.product, SUM(oi.quantity)
		       FROM OrderItem oi
		       WHERE oi.order.status =
		       com.nextbuy.demo.enums.OrderStatus.DELIVERED
		       GROUP BY oi.product
		       ORDER BY SUM(oi.quantity) DESC
		       """)
		List<Object[]> getTopSellingProducts();
		
		@Query("""
			       SELECT
			       oi.product.category.id,
			       oi.product.category.name,
			       SUM(oi.quantity)

			       FROM OrderItem oi

			       WHERE oi.order.status =
			       com.nextbuy.demo.enums.OrderStatus.DELIVERED

			       GROUP BY
			       oi.product.category.id,
			       oi.product.category.name

			       ORDER BY SUM(oi.quantity) DESC
			       """)
			List<Object[]> getCategoryWiseSales();
			
			
			@Query("""
				       SELECT
				       oi.product.subCategory.id,
				       oi.product.subCategory.name,
				       SUM(oi.quantity)

				       FROM OrderItem oi

				       WHERE oi.order.status =
				       com.nextbuy.demo.enums.OrderStatus.DELIVERED

				       AND oi.product.category.id = :categoryId

				       GROUP BY
				       oi.product.subCategory.id,
				       oi.product.subCategory.name

				       ORDER BY SUM(oi.quantity) DESC
				       """)
				List<Object[]> getSubCategorySalesByCategory(
				        @Param("categoryId") Long categoryId);
		
}
