package com.nextbuy.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Review;
import com.nextbuy.demo.entity.ReviewReaction;
import com.nextbuy.demo.entity.User;

public interface ReviewReactionRepository extends JpaRepository<ReviewReaction, Long> {
		Optional<ReviewReaction> findByUserAndReview(User user, Review review);
		
		long countByReviewAndLikedTrue(Review review);
		
		long countByReviewAndLikedFalse(Review review);
}
