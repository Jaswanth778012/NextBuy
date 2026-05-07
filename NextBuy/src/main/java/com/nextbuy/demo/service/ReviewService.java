package com.nextbuy.demo.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.Rating;
import com.nextbuy.demo.entity.Review;
import com.nextbuy.demo.entity.ReviewReaction;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.RatingRepository;
import com.nextbuy.demo.repository.ReviewReactionRepository;
import com.nextbuy.demo.repository.ReviewRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class ReviewService {
	
	private ReviewRepository reviewRepo;
	
	private RatingRepository ratingRepo;
	
	private ReviewReactionRepository reviewReactionRepo;
	
	private UserRepository userRepo;
	
	private ProductRepository productRepo;
	
	private CloudinaryService cloudinaryService;
	
	ReviewService(ReviewRepository reviewRepo, RatingRepository ratingRepo, ReviewReactionRepository reviewReactionRepo, UserRepository userRepo, ProductRepository productRepo, CloudinaryService cloudinaryService) {
		this.reviewRepo = reviewRepo;
		this.ratingRepo = ratingRepo;
		this.reviewReactionRepo = reviewReactionRepo;
		this.userRepo = userRepo;
		this.productRepo = productRepo;
		this.cloudinaryService = cloudinaryService;
		
	}
	
	 public String addReview(Long productId, String username, String comment, List<MultipartFile> images) {

	        Product product = productRepo.findById(productId)
	                .orElseThrow(() -> new RuntimeException("Product not found"));

	        User user = userRepo.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Rating rating = ratingRepo.findByProductAndUser(product, user)
	                .orElseThrow(() -> new RuntimeException("You must rate before reviewing"));

	        if (rating.getReview() != null) {
	            throw new RuntimeException("Review already exists");
	        }
	        
	        List<String> imageUrls = cloudinaryService.uploadImagesReview(images);
	        
	        Review review = new Review();
	        review.setComment(comment);
	        review.setImageUrls(imageUrls);
	        review.setRating(rating);

	        reviewRepo.save(review);

	        return "Review added successfully";
	    }
	 
	   public String reactToReview(Long reviewId, String username, boolean liked) {

	        Review review = reviewRepo.findById(reviewId)
	                .orElseThrow(() -> new RuntimeException("Review not found"));

	        User user = userRepo.findByUsername(username)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        Optional<ReviewReaction> existing = reviewReactionRepo.findByUserAndReview(user, review);

	        if (existing.isPresent()) {
	            ReviewReaction reaction = existing.get();
	            reaction.setLiked(liked); // update reaction
	            reviewReactionRepo.save(reaction);
	        } else {
	            ReviewReaction reaction = new ReviewReaction();
	            reaction.setUser(user);
	            reaction.setReview(review);
	            reaction.setLiked(liked);
	            reviewReactionRepo.save(reaction);
	        }

	        return liked ? "Liked" : "Disliked";
	    }

	    // ✅ Get Reviews of Product
	    public List<Review> getReviewsByProduct(Long productId) {

	        Product product = productRepo.findById(productId)
	                .orElseThrow(() -> new RuntimeException("Product not found"));

	        return product.getRatings()
	                .stream()
	                .map(Rating::getReview)
	                .filter(Objects::nonNull)
	                .toList();
	    }

	    // ✅ Count Likes
	    public long getLikes(Long reviewId) {
	        Review review = reviewRepo.findById(reviewId)
	                .orElseThrow(() -> new RuntimeException("Review not found"));

	        return reviewReactionRepo.countByReviewAndLikedTrue(review);
	    }

	    // ✅ Count Dislikes
	    public long getDislikes(Long reviewId) {
	        Review review = reviewRepo.findById(reviewId)
	                .orElseThrow(() -> new RuntimeException("Review not found"));

	        return reviewReactionRepo.countByReviewAndLikedFalse(review);
	    }
}
