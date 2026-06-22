package com.nextbuy.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.WishListRequestDto;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.CartItem;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.entity.WishList;
import com.nextbuy.demo.entity.WishListItem;
import com.nextbuy.demo.exception.ResourceNotFoundException;
import com.nextbuy.demo.exception.WishlistException;
import com.nextbuy.demo.repository.CartItemRepository;
import com.nextbuy.demo.repository.CartRepository;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;
import com.nextbuy.demo.repository.WishListItemRepository;
import com.nextbuy.demo.repository.WishListRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Automatically creates constructor for final fields safely
public class WishListService {
    
    private final WishListRepository wishListRepository;
    private final WishListItemRepository wishListItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public String createWishList(String username, WishListRequestDto request) {
         User user = userRepository.findByUsername(username)
                 .orElseThrow(() -> new ResourceNotFoundException("User not found"));
         
         WishList wishList = new WishList();
         wishList.setWishListName(request.getWishListName());
         wishList.setPublic(request.isPublic());
         wishList.setUser(user);
         
         wishListRepository.save(wishList);
         return "WishList created successfully";
    }
    
    @Transactional
    public String addProductToWishList(String username, Long wishListId, Long productId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        WishList wishList = wishListRepository.findById(wishListId)
                .orElseThrow(() -> new ResourceNotFoundException("WishList not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        boolean alreadyExists = wishList.getWishlistItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(productId));
        
        if (alreadyExists) {
        	throw new WishlistException("Product already in wishlist");
        }
        
        if (!wishList.getUser().getId().equals(user.getId())) {
            throw new WishlistException("Unauthorized access to wishlist");
        }
        
        WishListItem wishListItem = new WishListItem();
        wishListItem.setProduct(product);
        wishListItem.setWishlist(wishList);
        wishList.getWishlistItems().add(wishListItem);
        
        wishListItemRepository.save(wishListItem);
        return "Product added to wishlist successfully";
    }
    
    @Transactional
    public String removeProductFromWishList(String username, Long productId, Long wishListId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        WishList wishList = wishListRepository.findById(wishListId)
                .orElseThrow(() -> new ResourceNotFoundException("WishList not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        WishListItem wishListItem = wishListItemRepository.findByWishlistAndProduct(wishList, product)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in wishlist"));
        
        if (!wishList.getUser().getId().equals(user.getId())) {
            throw new WishlistException("Unauthorized access to wishlist");
        }
        
        wishList.getWishlistItems().remove(wishListItem);
        wishListItemRepository.delete(wishListItem);
        
        return "Product removed from wishlist successfully";
    }
    
    @Transactional
    public String deleteWishList(String username, Long wishListId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        WishList wishList = wishListRepository.findById(wishListId)
                .orElseThrow(() -> new ResourceNotFoundException("WishList not found"));
        
        if (!wishList.getUser().getId().equals(user.getId())) {
            throw new WishlistException("Unauthorized access to wishlist");
        }
        
        wishListRepository.delete(wishList);
        return "WishList deleted successfully";
    }
    
    @Transactional(readOnly = true)
    public List<WishList> getWishlists(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return wishListRepository.findByUser(user);
    }
    
    @Transactional(readOnly = true)
    public List<WishListItem> getWishListById(
            String username,
            Long wishListId) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        WishList wishList = wishListRepository.findById(wishListId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Wishlist not found"));

        if (!wishList.isPublic()
                && !wishList.getUser().getId().equals(user.getId())) {
            throw new WishlistException(
                    "Unauthorized access to wishlist");
        }

        return wishList.getWishlistItems();
    }
    
    @Transactional
    public String addWishListItemToCart(String username, Long wishListId) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WishList wishList = wishListRepository.findById(wishListId)
                .orElseThrow(() -> new ResourceNotFoundException("WishList not found"));

        if (!wishList.getUser().getId().equals(user.getId())) {
            throw new WishlistException("Unauthorized access to wishlist");
        }

        Cart cart = cartRepository.findByUserAndActiveTrue(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setActive(true);
                    newCart.setCartItems(new ArrayList<>());
                    return cartRepository.save(newCart);
                });

        if (cart.getCartItems() == null) {
            cart.setCartItems(new ArrayList<>());
        }

        for (WishListItem wishListItem : wishList.getWishlistItems()) {

            Product product = wishListItem.getProduct();

            CartItem existingCartItem = cart.getCartItems().stream()
                    .filter(item -> item.getProduct().getId().equals(product.getId()))
                    .findFirst()
                    .orElse(null);

            if (existingCartItem != null) {

                int updatedQty = existingCartItem.getQuantity() + 1;

                existingCartItem.setQuantity(updatedQty);

                // ✅ SET ACTUAL PRODUCT PRICE
                existingCartItem.setActualProdPrice(
                        product.getFinalPrice() * updatedQty
                );

                cartItemRepository.save(existingCartItem);

            } else {

                CartItem cartItem = new CartItem();

                cartItem.setProduct(product);

                cartItem.setQuantity(1);

                cartItem.setCart(cart);

                // ✅ SET ACTUAL PRODUCT PRICE
                cartItem.setActualProdPrice(product.getFinalPrice());

                cart.getCartItems().add(cartItem);

                cartItemRepository.save(cartItem);
            }
        }

        // ✅ RECALCULATE CART TOTALS

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        double totalAmount = items.stream()
                .mapToDouble(CartItem::getActualProdPrice)
                .sum();

        cart.setTotalPrice(totalAmount);

        double shipping = 80.0;
        cart.setShipingCharges(shipping);

        double discount = 0;

        if (totalAmount > 100000) {
            discount = 20;
        } else if (totalAmount > 10000) {
            discount = 10;
        }

        cart.setDiscount(discount);

        double finalPrice =
                shipping + totalAmount - (totalAmount * discount / 100);
        double result = ((long)(finalPrice * 100)) / 100.0;
	    cart.setFinalPrice(result);


        cartRepository.save(cart);

        return "All items from wishlist added to cart successfully";
    }
}