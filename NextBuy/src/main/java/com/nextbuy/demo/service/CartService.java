package com.nextbuy.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.CartRequestDTO;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.CartItem;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.CartItemRepository;
import com.nextbuy.demo.repository.CartRepository;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service

public class CartService {
	UserRepository userRepo;
	ProductRepository productRepo;
	CartRepository  cartRepo;
	CartItemRepository cartItemrepo;
	
	
	public CartService(UserRepository userRepo, ProductRepository productRepo, CartRepository cartRepo,
			CartItemRepository cartItemrepo) {
		super();
		this.userRepo = userRepo;
		this.productRepo = productRepo;
		this.cartRepo = cartRepo;
		this.cartItemrepo = cartItemrepo;
	}
	//add-to-cart
	public String addCart(String username,CartRequestDTO cartDTO) {
		  
		

		    // 1. Get User
		    User user = userRepo.findByUsername(username)
		            .orElseThrow(() -> new RuntimeException("User not found"));

		    // 2. Get Product
		    Product product = productRepo.findById(cartDTO.getProductId())
		            .orElseThrow(() -> new RuntimeException("Product not found"));

		    // 3. Get or Create Cart
		    Cart cart = cartRepo.findByUserAndActiveTrue(user)
		            .orElseGet(() -> {
		                Cart newCart = new Cart();
		                newCart.setUser(user);
		                newCart.setActive(true);
		                return cartRepo.save(newCart);
		            });

		    // 4. Check if product already exists in cart
		    Optional<CartItem> existingItemOpt = cart.getCartItems()
		            .stream()
		            .filter(item -> item.getProduct().getId().equals(product.getId()))
		            .findFirst();
		    int qty = (cartDTO.getQuantity() == null || cartDTO.getQuantity() <= 0)
	                ? 1
	                : cartDTO.getQuantity();
		    if (existingItemOpt.isPresent()) {

		        // UPDATE EXISTING ITEM
		        CartItem item = existingItemOpt.get();
		        
		       
		        item.setQuantity(item.getQuantity() + qty);
		        item.setSubtotal(item.getQuantity() * product.getPrice());
		        
            
		        cartItemrepo.save(item);

		    } else {

		        // ADD NEW ITEM
		        CartItem item = new CartItem();
		        item.setCart(cart);
		        item.setProduct(product);
		        
		        item.setSubtotal(product.getPrice() * qty);
		       
		        cartItemrepo.save(item);
		    }

		 
		    List<CartItem> items = cartItemrepo.findByCartId(cart.getId());

		    double totalAmount = items.stream()
		            .mapToDouble(CartItem::getSubtotal)
		            .sum();

		    cart.setTotalPrice(totalAmount);

		    // 6. Shipping Charge
		    double shipping = 80.0;
		    cart.setShipingCharges(shipping);

		    // 7. Discount Logic
		    double discount = 0;

		    if (totalAmount > 100000) {
		        discount = 20;   // 20%
		    } else if (totalAmount > 10000) {
		        discount = 10;   // 10%
		    }

		    cart.setDiscount(discount);

		    double finalPrice = totalAmount - totalAmount*discount/100;
		    cart.setFinalPrice(finalPrice);

		    cartRepo.save(cart);

		    return "Product added to cart successfully";
		
	        
	}
	
	
	//detete-item
	public String deleteItem(String username, Long cartItemId) {

	    // 1. Get user
	    User user = userRepo.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    // 2. Get cart
	    Cart cart = cartRepo.findByUserAndActiveTrue(user)
	            .orElseThrow(() -> new RuntimeException("Cart not found"));

	    // 3. Get cart item
	    CartItem item = cartItemrepo.findById(cartItemId)
	            .orElseThrow(() -> new RuntimeException("Item not found"));

	    // 4. Validate ownership
	    if (!item.getCart().getId().equals(cart.getId())) {
	        throw new RuntimeException("Invalid cart item");
	    }

	    // 5. Delete item
	    cartItemrepo.delete(item);

	    // 6. IMPORTANT → Re-fetch updated items
	    List<CartItem> items = cartItemrepo.findByCartId(cart.getId());

	    // 7. Recalculate total properly
	    double total = items.stream()
	            .mapToDouble(CartItem::getSubtotal)
	            .sum();

	    cart.setTotalPrice(total);

	    // 8. Shipping
	    double shipping = 80;
	    cart.setShipingCharges(shipping);

	    // 9. Discount logic (correct)
	    double discount = 0;

	    if (total > 100000) {
	        discount = 20;
	    } else if (total > 50000) {
	        discount = 10;
	    }

	    cart.setDiscount(discount);

	    // 10. Final price
	    cart.setFinalPrice(shipping+total -(total*discount/100));

	    // 11. Save cart
	    cartRepo.save(cart);

	    return "Item deleted successfully";
	}
	//VIEWCART
	public Cart viewCart(String username) {
	   User user = userRepo.findByUsername(username)
			   .orElseThrow(()-> new RuntimeException("user not found"));
	 Cart cart = cartRepo.findByUser(user)
			 .orElseThrow(()->new RuntimeException("cart not found"));
	if( cart.getUser().getId().equals(user.getId())) {
		Cart cartt = cartRepo.findByUserId(user.getId()).get();
		return cartt;
		 
	}
	return cart;
	}
	
//VIEWITEMS
	public List< CartItem> viewItems(String username) {
		User user = userRepo.findByUsername(username)
				.orElseThrow(()->new RuntimeException("User not found"));
		 Cart cart = cartRepo.findByUser(user)
				 .orElseThrow(()->new RuntimeException("cart not found"));
		return cartItemrepo.findByCartId(cart.getId());
		
	}
	//DELETECART
	public String deleteCart(String username) {
		User user = userRepo.findByUsername(username)
				.orElseThrow(()->new RuntimeException("User not found"));
		Cart cart = cartRepo.findByUser(user)
				 .orElseThrow(()->new RuntimeException("cart not found"));
		List<CartItem> cartItem = cartItemrepo.findByCartId(cart.getId());
	      cartItemrepo.deleteAll(cartItem);
		cartRepo.deleteById(user.getId());
		 cart.setTotalPrice(0.0);
		    cart.setDiscount(0.0);
		    cart.setFinalPrice(0.0);

		    cartRepo.save(cart);
		return "cart deleted !!!";
	}
	//UPDATEQUANTITY
	public String updateQuantity(String username, Long cartItemId, int quantity) {

	    if (quantity <= 0) {
	        throw new RuntimeException("Quantity must be greater than 0");
	    }

	    User user = userRepo.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Cart cart = cartRepo.findByUserAndActiveTrue(user)
	            .orElseThrow(() -> new RuntimeException("Cart not found"));

	    CartItem item = cartItemrepo.findById(cartItemId)
	            .orElseThrow(() -> new RuntimeException("Cart item not found"));

	    if (!item.getCart().getId().equals(cart.getId())) {
	        throw new RuntimeException("Invalid cart item");
	    }
	    item.setQuantity(quantity);

	    double subtotal = quantity * item.getProduct().getPrice();
	    item.setSubtotal(subtotal);

	    cartItemrepo.save(item);
	    List<CartItem> items = cartItemrepo.findByCartId(cart.getId());

	    double total = items.stream()
	            .mapToDouble(CartItem::getSubtotal)
	            .sum();

	    cart.setTotalPrice(total);

	    double shipping = 80;
	    cart.setShipingCharges(shipping);

	    double discount = 0;

	    if (total > 100000) {
	        discount = 20;
	    } else if (total > 50000) {
	        discount =10;
	    }

	    cart.setDiscount(discount);

	    cart.setFinalPrice(total-(total*discount/100)+shipping);

	    cartRepo.save(cart);

	    return "Quantity updated successfully";
	}
	
}
