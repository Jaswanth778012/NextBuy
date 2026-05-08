package com.nextbuy.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.WishListRequestDto;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.entity.WishList;
import com.nextbuy.demo.entity.WishListItem;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;
import com.nextbuy.demo.repository.WishListItemRepository;
import com.nextbuy.demo.repository.WishListRepository;

@Service
public class WishListService {
	
	private WishListRepository wishListRepository;
	
	private WishListItemRepository wishListItemRepository;
	
	private ProductRepository productRepository;
	
	private UserRepository userRepository;
	
	public WishListService(WishListRepository wishListRepository, WishListItemRepository wishListItemRepository, ProductRepository productRepository, UserRepository userRepository) {
		this.wishListRepository = wishListRepository;
		this.wishListItemRepository = wishListItemRepository;
		this.productRepository = productRepository;
		this.userRepository = userRepository;
	}
	
	public  String createWishList(String username, WishListRequestDto request) {
		
		 User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		 
		 WishList wishList = new WishList();
		 
		 wishList.setWishListName(request.getWishListName());
		 
		 wishList.setPublic(request.isPublic());
		 
		 wishList.setUser(user);
		 
		 wishListRepository.save(wishList);
		 
		 return "WishList created successfully";
	}
	
	
	public String addProductToWishList(String username, Long productId, Long wishListId)
	{
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		
		WishList wishList = wishListRepository.findById(wishListId).orElseThrow(() -> new RuntimeException("WishList not found"));
		
		Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
		
		boolean alreadyExists = wishList.getWishlistItems().stream().anyMatch(item -> item.getProduct().getId().equals(productId));
		
		if (alreadyExists) {

            throw new RuntimeException(
                    "Product already in wishlist");
        }
		
		WishListItem wishListItem = new WishListItem();
		
		wishListItem.setProduct(product);
		wishListItem.setWishlist(wishList);
		wishList.getWishlistItems().add(wishListItem);
		
		wishListItemRepository.save(wishListItem);
		
		return "Product added to wishlist successfully";
	}
	
	public String removeProductFromWishList(String username,Long productId, Long wishListId)
	{
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		
		WishList wishList = wishListRepository.findById(wishListId).orElseThrow(() -> new RuntimeException("WishList not found"));
		
		Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));
		
		WishListItem wishListItem = wishListItemRepository.findByWishlistAndProduct(wishList, product).orElseThrow(() -> new RuntimeException("Product not found in wishlist"));
		
		wishList.getWishlistItems().remove(wishListItem);
		
		wishListItemRepository.delete(wishListItem);
		
		return "Product removed from wishlist successfully";
	}
	
	public String deleteWishList(String username, Long wishListId)
	{
		User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
		
		WishList wishList = wishListRepository.findById(wishListId).orElseThrow(() -> new RuntimeException("WishList not found"));
		
		wishListRepository.delete(wishList);
		
		return "WishList deleted successfully";
	}
	
	public List<WishList> getWishlists(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return wishListRepository.findByUser(user);
    }
}
