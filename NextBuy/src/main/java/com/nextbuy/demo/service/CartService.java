package com.nextbuy.demo.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

@Service

public class CartService {
	UserRepository userRepo;
	ProductRepository productRepo;
	CartRepository  cartRepo;
	CartItemRepository cartItemrepo;
	EmailService emailService;
	
	
	public CartService(UserRepository userRepo, ProductRepository productRepo, CartRepository cartRepo,
			CartItemRepository cartItemrepo,EmailService emailService) {
		super();
		this.userRepo = userRepo;
		this.productRepo = productRepo;
		this.cartRepo = cartRepo;
		this.cartItemrepo = cartItemrepo;
		this.emailService = emailService;
	}
	public String addCart(String username,CartRequestDTO cartDTO) {
		  
		    User user = userRepo.findByUsername(username)
		            .orElseThrow(() -> new RuntimeException("User not found"));

		    Product product = productRepo.findById(cartDTO.getProductId())
		            .orElseThrow(() -> new RuntimeException("Product not found"));
		    if (product.getStockQuantity() <= 0) {
		      return "Product Out Of Stock";
		    } 
		    Cart cart = cartRepo.findByUserAndActiveTrue(user)
		            .orElseGet(() -> {
		                Cart newCart = new Cart();
		                newCart.setUser(user);
		                newCart.setActive(true);
		                return cartRepo.save(newCart);
		            });
		    Optional<CartItem> existingItemOpt =
		            cartItemrepo.findByCartAndProduct(cart, product);
		    int qty =0;
		    if( cartDTO.getQuantity() == null ||cartDTO.getQuantity() <=0) {
		    	qty = 1;
		    }else {
		    	qty = cartDTO.getQuantity();
		    }
		    if (existingItemOpt.isPresent()) {
		        CartItem item = existingItemOpt.get();
		        int updatedQuantity = item.getQuantity()+qty;
		        if(product.getStockQuantity() < updatedQuantity) {
		        	return "Not enough stock available";
		        }
		        item.setQuantity(updatedQuantity);
		        item.setActualProdPrice(product.getFinalPrice()*updatedQuantity);
		        cartItemrepo.save(item);
		    }else {
		    	  if (qty > product.getStockQuantity()) {
		              return "Not enough stock available";
		          }
		    	CartItem item = new CartItem();
		    	item.setCart(cart);
		    	item.setProduct(product);
		    	item.setQuantity(qty);
		    	item.setActualProdPrice(product.getFinalPrice()*qty);
		    	cartItemrepo.save(item);
		    }
		    List<CartItem> items = cartItemrepo.findByCartId(cart.getId());
		    double totalAmount = items.stream()
		            .mapToDouble(CartItem::getActualProdPrice)
		            .sum();
		    cart.setTotalPrice(totalAmount);
		    double shipping = 80.0;
		    cart.setShipingCharges(shipping);
		    double discount = 0;
		    if (totalAmount > 100000) {
		        discount = 20;   // 20%
		    } else if (totalAmount > 10000) {
		        discount = 10;   // 10%
		    }

		    cart.setDiscount(discount);
		    cart.setCuponDiscount(null);

		    double finalPrice = shipping + totalAmount - totalAmount*discount/100;
		    double result = ((long)(finalPrice * 100)) / 100.0;
		    cart.setFinalPrice(result);

		    cartRepo.save(cart);

		    return "Product added to cart successfully";
		
	       
	}
	
	
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
	            .mapToDouble(CartItem::getActualProdPrice)
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
	public String clearCart(String username) {
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
		return "cart items cleared !!!";
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

	    double subtotal = quantity * item.getProduct().getFinalPrice();
	    item.setActualProdPrice(subtotal);

	    cartItemrepo.save(item);
	    List<CartItem> items = cartItemrepo.findByCartId(cart.getId());

	    double total = items.stream()
	            .mapToDouble(CartItem::getActualProdPrice)
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
	
	public  String ToRemindCart (String username, String subject, String body) {
		User user = userRepo.findByUsername(username).get();
		  Optional<Cart> cart = cartRepo.findByUserId(user.getId());
		  if(cart.isEmpty()) {
			  return "cart is empty";
		  }
		  
		    Cart cartt = cart.get();
		    LocalDateTime now = LocalDateTime.now();
		    DateTimeFormatter formatter =
		            DateTimeFormatter.ofPattern("hh:mm:ss a");
		    String time = now.format(formatter);
		    String cartTime = cartt.getCreatedAt().format(formatter);
		    
		  int day = now.getDayOfMonth();
		   
		 if(time.equals(cartTime)&& day%2 == 0 ) {
		 List<CartItem> cartitems = cartItemrepo.findByCartId(cartt.getId());
		 if(cartitems.isEmpty()) {
			 return "cart is empty";
		 }
		
		String toEmail = user.getEmail();
		try {
			
			emailService.sendEmail(toEmail, subject, body);
		
		return "Email Sent Successfully to "+toEmail;
		
		}catch(Exception e) {
			return "message Faild "+e ;
		}
		 }
		 return "message did't send" +time +" " + cartTime ;
	}
	
	
}
