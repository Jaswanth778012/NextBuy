package com.nextbuy.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.SavedItem;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.SavedItemRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class SavedItemService {
	
	private UserRepository userRepo;
	
	private ProductRepository productRepo;
	
	private SavedItemRepository savedItemRepo;
	
	public SavedItemService(UserRepository userRepo, ProductRepository productRepo, SavedItemRepository savedItemRepo)
	{
		this.userRepo = userRepo;
		this.productRepo = productRepo;
		this.savedItemRepo = savedItemRepo;
	}
	
	public String saveForItem(String username, Long productId)
	{
		User user = userRepo.findByUsername(username).orElseThrow(()-> new RuntimeException("User not Found"));
		
		Product product = productRepo.findById(productId).orElseThrow(() -> new RuntimeException("Product not Found"));
		
		boolean alreadySaved = savedItemRepo.findByUser(user).stream().anyMatch(item -> item.getProduct().getId().equals(productId));
		
		if(alreadySaved)
		{
			throw new RuntimeException("Product Already Saved");
		}
		
		SavedItem item = new SavedItem();
		
		item.setUser(user);
		item.setProduct(product);
		
		savedItemRepo.save(item);
		
		return "Item Saved for Later";
	}
	
	public List<SavedItem> getSavedItems(String username)
	{
		User user = userRepo.findByUsername(username).orElseThrow(()-> new RuntimeException("User not Found"));
		
		return savedItemRepo.findByUser(user);
	}
	
	public String removeSavedItem(Long SavedId)
	{
		savedItemRepo.deleteById(SavedId);
		
		return "Saved For Later Deleted";
	}
}
