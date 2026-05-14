package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CartRequestDTO;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.CartItem;
import com.nextbuy.demo.service.CartService;
import com.nextbuy.demo.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/Cart")
public class CartController {
	  CartService cartService;
	  JwtService jwtService;
	  
	public CartController(CartService cartService, JwtService jwtService) {
		super();
		this.cartService = cartService;
		this.jwtService = jwtService;
	}
   @PostMapping("/addCart")
	public String addCart(HttpServletRequest request ,@RequestBody CartRequestDTO cartDTO) {
		String token = request.getHeader("Authorization").substring(7);
		String username = jwtService.extractUsername(token);
		return cartService.addCart(username,cartDTO);
	}
   
   @PostMapping("/toRemindCart")
   public String toRemindCart(HttpServletRequest request) {
	   String token = request.getHeader("Authorization").substring(7);
	   String username = jwtService.extractUsername(token);
	   String subject = "⏳ Your Cart is Waiting for You 🛒";
	   String body = "Hiiii "+username+" 💙 💙 💙,\r\n"
	   		+ "\r\n"
	   		+ "You still have amazing products waiting in your cart 🛍️.\r\n"
	   		+ "\r\n"
	   		+ "Complete your purchase before they go out of stock.\r\n"
	   		+ "\r\n"
	   		+ "Visit your cart now and continue shopping with NextBuy.\r\n"
	   		+ "\r\n"
	   		+ "Happy Shopping ....💖,\r\n"
	   		+ "Team NextBuy ✨";
	   return cartService.ToRemindCart(username, subject, body);
	   
   }
  
   @DeleteMapping("/delete/{cartItemId}")
   public ResponseEntity<String> deleteItem(
           @PathVariable Long cartItemId,
           Authentication authentication) {

       String username = authentication.getName();

       return ResponseEntity.ok(
               cartService.deleteItem(username, cartItemId)
       );
   }
   @GetMapping("/viewCart")
   public ResponseEntity<Cart> viewCart( Authentication authentication){
	   String username = authentication.getName();
	   return ResponseEntity.ok(cartService.viewCart(username));
   }
   @GetMapping("/viewItems")
   public List<CartItem> viewItems(Authentication authentication){
	   String username = authentication.getName();
	   return cartService.viewItems(username);
   }
   @DeleteMapping("/clearCart")
   public String ClearCart(Authentication authentication) {
	   String username = authentication.getName();
	   return cartService.clearCart(username);
   }
   @PutMapping("/cart/{id}/{quantity}")
   public ResponseEntity<String> updateQty(
          @RequestHeader("Authorization") String token,
          @PathVariable Long id,
          @PathVariable int quantity) {

	   String username = jwtService.extractUsername(token.substring(7));

	   return ResponseEntity.ok(
              cartService.updateQuantity(username, id, quantity)
			);
   }
}
