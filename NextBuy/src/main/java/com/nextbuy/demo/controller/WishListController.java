package com.nextbuy.demo.controller;


import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.WishListRequestDto;
import com.nextbuy.demo.entity.WishList;
import com.nextbuy.demo.service.WishListService;

@RestController
@RequestMapping("/Wishlist")
public class WishListController {
	
	private WishListService wishListService;
	
	public WishListController(WishListService wishListService) {
		this.wishListService = wishListService;
	}
	
	@PostMapping("/create")
	public String createWishList(Principal principal, @RequestBody WishListRequestDto wishListDTO) {
		return wishListService.createWishList(principal.getName(), wishListDTO);
	}
	
	@PostMapping("/addProduct/{wishListId}/{productId}")
	public String addProductToWishList(Principal principal, @PathVariable Long wishListId, @PathVariable Long productId) {
		return wishListService.addProductToWishList(principal.getName(),wishListId ,productId);
	}
	
	@PostMapping("/addWishlistToCart/{wishListId}")
	public String addWishlistToCart(Principal principal,
	                                @PathVariable Long wishListId) {
	    return wishListService.addWishListItemToCart(principal.getName(), wishListId);
	}

	@GetMapping("/getWishList")
	public List<WishList> getWishList(Principal principal) {
		return wishListService.getWishlists(principal.getName());
	}
	
	@DeleteMapping("/removeWishlist/{wishListId}")
	public String removeWishList(Principal principal, @PathVariable Long wishListId) {
		return wishListService.deleteWishList(principal.getName(), wishListId);
	}
	
	@GetMapping("/getWishListProducts/{wishListId}")
	public List<String> getWishListProducts(Principal principal, @PathVariable Long wishListId) {
		return wishListService.getWishListById(principal.getName(), wishListId);
	}
	
	@DeleteMapping("/removeProduct/{wishListId}/{productId}")
	public String removeProductFromWishList(Principal principal, @PathVariable Long wishListId, @PathVariable Long productId) {
		return wishListService.removeProductFromWishList(principal.getName(), wishListId, productId);
	}
}