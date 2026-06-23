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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CartItemResponseDTO;
import com.nextbuy.demo.dto.CartRequestDTO;
import com.nextbuy.demo.dto.CartResponseDTO;
import com.nextbuy.demo.service.CartService;

@RestController
@RequestMapping("/Cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/addCart")
    public ResponseEntity<String> addCart(
            Authentication authentication,
            @RequestBody CartRequestDTO cartDTO
    ) {
        String username = authentication.getName();

        return ResponseEntity.ok(
                cartService.addCart(username, cartDTO)
        );
    }

    @PostMapping("/toRemindCart")
    public ResponseEntity<String> toRemindCart(
            Authentication authentication
    ) {
        String username = authentication.getName();

        String subject = "⏳ Your Cart is Waiting for You 🛒";

        String body = "Hiiii " + username + " 💙 💙 💙,\r\n"
                + "\r\n"
                + "You still have amazing products waiting in your cart 🛍️.\r\n"
                + "\r\n"
                + "Complete your purchase before they go out of stock.\r\n"
                + "\r\n"
                + "Visit your cart now and continue shopping with NextBuy.\r\n"
                + "\r\n"
                + "Happy Shopping ....💖,\r\n"
                + "Team NextBuy ✨";

        return ResponseEntity.ok(
                cartService.ToRemindCart(username, subject, body)
        );
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ResponseEntity<String> deleteItem(
            @PathVariable Long cartItemId,
            Authentication authentication
    ) {
        String username = authentication.getName();

        return ResponseEntity.ok(
                cartService.deleteItem(username, cartItemId)
        );
    }

    @GetMapping("/viewCart")
    public ResponseEntity<CartResponseDTO> viewCart(
            Authentication authentication
    ) {
        String username = authentication.getName();

        return ResponseEntity.ok(
                cartService.viewCart(username)
        );
    }

    @GetMapping("/viewItems")
    public ResponseEntity<List<CartItemResponseDTO>> viewItems(
            Authentication authentication
    ) {
        String username = authentication.getName();

        return ResponseEntity.ok(
                cartService.viewItems(username)
        );
    }

    @DeleteMapping("/clearCart")
    public ResponseEntity<String> clearCart(
            Authentication authentication
    ) {
        String username = authentication.getName();

        return ResponseEntity.ok(
                cartService.clearCart(username)
        );
    }

    @PutMapping("/updateQuantity/{cartItemId}/{quantity}")
    public ResponseEntity<String> updateQuantity(
            @PathVariable Long cartItemId,
            @PathVariable int quantity,
            Authentication authentication
    ) {
        String username = authentication.getName();

        return ResponseEntity.ok(
                cartService.updateQuantity(username, cartItemId, quantity)
        );
    }

    @GetMapping("/itemCount")
    public ResponseEntity<Integer> getCartItemCount(
            Authentication authentication
    ) {
        String username = authentication.getName();

        return ResponseEntity.ok(
                cartService.getCartItemCount(username)
        );
    }
}