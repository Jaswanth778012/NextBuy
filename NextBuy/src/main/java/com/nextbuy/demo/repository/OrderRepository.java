package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nextbuy.demo.entity.Order;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.enums.OrderStatus;
import java.time.LocalDateTime;


public interface OrderRepository extends JpaRepository<Order, Long> {
	
	List<Order> findByUserOrderByOrderedAtDesc(User user);
	
	Optional<Order> findByIdAndUser(Long id, User user);

	List<Order> findByStatusOrderByOrderedAtDesc(OrderStatus status);
	List<Order> findByUserId(Long userId);
	List<Order> findByOrderedAt(LocalDateTime orderedAt);
	List<Order> findByOrderedAtBetween(LocalDateTime start, LocalDateTime end);
	
	
	List<Order> findByUserIdOrderByIdDesc(Long userId);
	List<Order> findByUserIdAndStatusOrderByOrderedAtDesc(
	        Long userId,
	        OrderStatus status
	);
	Page<Order> findByStatusNotOrderByOrderedAtDesc(
	        OrderStatus status,
	        Pageable pageable
	);
	 @Query("SELECT o FROM Order o WHERE MONTH(o.orderedAt) = :month")
	    List<Order> findByMonthOrders(@Param("month") int month);
	 @Query("SELECT o FROM Order o WHERE MONTH(o.orderedAt) = :month AND YEAR(o.orderedAt) = :year")
	 List<Order> findByMonthAndYear(
	         @Param("month") int month,
	         @Param("year") int year);
	 @Query("SELECT o FROM Order o WHERE YEAR(o.orderedAt) = :year")
	    List<Order> findByYear(@Param("year") int year);
	 
	 long countByStatus(OrderStatus status);
}

