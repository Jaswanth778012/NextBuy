package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.entity.SavedItem;
import com.nextbuy.demo.service.SavedItemService;

@RestController
@RequestMapping("/SaveForLater")
public class SavedItemController {
	
	private SavedItemService savedService;
	
	public SavedItemController(SavedItemService savedService) {
		this.savedService = savedService;
	}
	
	@PostMapping("/saveForItem/{prodId}")
	public String saveForLater(Principal principal, @PathVariable Long prodId)
	{
		return savedService.saveForItem(principal.getName(), prodId);
	}
	
	@GetMapping("/getSavedItem")
	public List<SavedItem> getSavedItem(Principal principal)
	{
		return savedService.getSavedItems(principal.getName());
	}
	
	@DeleteMapping("/removeSaved/{savedItemId}")
	public String removeSavedItem(@PathVariable Long savedItemId)
	{
		return savedService.removeSavedItem(savedItemId);
	}
	
	
}
