package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.entity.Rating;
import com.nextbuy.demo.service.RatingService;

@RestController
@RequestMapping("/Rating")
public class RatingController {
	
	private RatingService ratingService;
	
	RatingController(RatingService ratingService)
	{
		this.ratingService = ratingService;
	}
	
	
	@PostMapping("/addRating")
	public String rateProductRating(@RequestParam Long prodId, @RequestParam Long userId, @RequestParam int rating)
	{
		return ratingService.RateProduct(prodId, userId, rating);
	}
	
	@DeleteMapping("/deleteRating")
	public String deleteProductRating(@RequestParam Long prodId, @RequestParam Long userId)
	{
		return ratingService.deleteRating(prodId, userId);
	}
	
	@GetMapping("/product/{prodId}")
	public List<Rating> getRatingByProduct(@PathVariable Long prodId)
	{
		return ratingService.getRatingsByProduct(prodId);
	}
	
	@GetMapping("/user")
	public Rating getUserRating(  @RequestParam Long productId, @RequestParam Long userId) 
	{
	    return ratingService.getUserRating(productId, userId);
	}
}
