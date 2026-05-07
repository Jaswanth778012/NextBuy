package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

}
