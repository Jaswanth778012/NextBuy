package com.nextbuy.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.Rating;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.RatingRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class RatingService {
	
	private RatingRepository ratingRepo;
	
	private UserRepository userRepo;
	
	private ProductRepository prodRepo;
	
	public RatingService(RatingRepository ratingRepo, UserRepository userRepo, ProductRepository prodRepo)
	{
		this.ratingRepo = ratingRepo;
		this.userRepo = userRepo;
		this.prodRepo = prodRepo;
	}
	
	public String RateProduct(Long productId, Long userId, int rating)
	{
		if(rating < 1 || rating > 5) 
		{
			throw new RuntimeException("Rating should be inside 1 and 5");
		}
		
		Product product = prodRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product Not Found"));
		
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		Rating existingRating = ratingRepo.findByProductAndUser(product, user).orElse(null);
		
		if(existingRating != null)
		{
			int oldRating = existingRating.getRating();
			existingRating.setRating(rating);
			
			updateProductRating(product, oldRating, rating);
			ratingRepo.save(existingRating);
			
		}
		else {
			Rating rate = new Rating();
			rate.setProduct(product);
			rate.setUser(user);
			rate.setRating(rating);
			
			ratingRepo.save(rate);
			
			addProductRating(product, rating);
		}
		
		prodRepo.save(product);
		
		return "Rating Submitted Successfully";
	}
	
	
	public String deleteRating(Long productId, Long userId)
	{
		Product product = prodRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product Not Found"));
		
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User Not Found"));
		
		Rating existingRating = ratingRepo.findByProductAndUser(product, user).orElseThrow(() -> new RuntimeException("Rating already Exists by user"));
		
		 int rating = existingRating.getRating();
		
		removeProductRating(product, rating);
		
		ratingRepo.delete(existingRating);
		
		prodRepo.save(product);
		
		return "Rating Deleted Successfully";
	
	}
	
	public void addProductRating(Product prod, int newRating)
	{
		double total = prod.getTotalRating();
		
		int count = prod.getRatingsCount();
		
		total += newRating;
		count++;
		
		prod.setTotalRating(total);
		prod.setRatingsCount(count);
		prod.setAverageRating(total / count);
	}
	
	public void updateProductRating(Product prod, int oldRating, int newRating)
	{
		double total = prod.getTotalRating();
		
		total = total - oldRating + newRating;
		
		prod.setTotalRating(total);
		prod.setAverageRating(total/ prod.getRatingsCount());
	}
	
	public void removeProductRating(Product prod, int rating)
	{
		
		double total = prod.getTotalRating();
		int count = prod.getRatingsCount();

		total -= rating;
		count--;

		if (count <= 0) {
			prod.setTotalRating(0.0);
			prod.setRatingsCount(0);
			prod.setAverageRating(0.0);
		} else {
			prod.setTotalRating(total);
			prod.setRatingsCount(count);
			prod.setAverageRating(total / count);
		}
	}
	
	
	public List<Rating> getRatingsByProduct(Long productId) {

	    Product product = prodRepo.findById(productId)
	            .orElseThrow(() -> new RuntimeException("Product not found"));

	    return ratingRepo.findByProduct(product);
	}
	
	public Rating getUserRating(Long productId, Long userId) {

	    Product product = prodRepo.findById(productId)
	            .orElseThrow(() -> new RuntimeException("Product not found"));

	    User user = userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    return ratingRepo.findByProductAndUser(product, user)
	            .orElseThrow(() -> new RuntimeException("Rating not found"));
	}
}
