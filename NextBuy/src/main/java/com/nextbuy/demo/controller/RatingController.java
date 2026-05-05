package com.nextbuy.demo.controller;

import java.security.Principal;
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
	public String rateProductRating(@RequestParam Long prodId, @RequestParam int rating, Principal principal)
	{
		return ratingService.RateProduct(prodId, principal.getName(), rating);
	}
	
	@DeleteMapping("/deleteRating")
	public String deleteProductRating(@RequestParam Long prodId, Principal principal)
	{
		return ratingService.deleteRating(prodId, principal.getName());
	}
	
	@GetMapping("/product/{prodId}")
	public List<Rating> getRatingByProduct(@PathVariable Long prodId)
	{
		return ratingService.getRatingsByProduct(prodId);
	}
	
//	@GetMapping("/user")
//	public Rating getUserRating(  @RequestParam Long productId, @RequestParam Long userId) 
//	{
//	    return ratingService.getUserRating(productId, userId);
//	}
	
	@GetMapping("/my-ratings")
	public List<Rating> getMyRatings(Principal principal) {

	    return ratingService.getRatingsByUser(principal.getName());
	}
}
