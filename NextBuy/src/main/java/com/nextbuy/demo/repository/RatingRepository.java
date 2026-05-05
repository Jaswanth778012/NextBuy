package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.Rating;
import com.nextbuy.demo.entity.User;

public interface RatingRepository extends JpaRepository<Rating, Long> {
	
	Optional<Rating> findByProductAndUser(Product product, User user);
	
	List<Rating> findByProduct(Product product);


}
