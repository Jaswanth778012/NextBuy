package com.nextbuy.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.CartItemResponseDTO;
import com.nextbuy.demo.dto.CartRequestDTO;
import com.nextbuy.demo.dto.CartResponseDTO;
import com.nextbuy.demo.entity.Cart;
import com.nextbuy.demo.entity.CartItem;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.repository.CartItemRepository;
import com.nextbuy.demo.repository.CartRepository;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
@Transactional
public class CartService {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final EmailService emailService;

    public CartService(
            UserRepository userRepo,
            ProductRepository productRepo,
            CartRepository cartRepo,
            CartItemRepository cartItemRepo,
            EmailService emailService
    ) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.emailService = emailService;
    }

    public String addCart(String username, CartRequestDTO cartDTO) {

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
                    newCart.setTotalPrice(0.0);
                    newCart.setDiscount(0.0);
                    newCart.setFinalPrice(0.0);
                    newCart.setShipingCharges(0.0);
                    newCart.setCuponDiscount(0.0);

                    return cartRepo.save(newCart);
                });

        Optional<CartItem> existingItemOpt =
                cartItemRepo.findByCartAndProduct(cart, product);

        int qty =
                cartDTO.getQuantity() == null ||
                cartDTO.getQuantity() <= 0
                        ? 1
                        : cartDTO.getQuantity();

        if (existingItemOpt.isPresent()) {

            CartItem item = existingItemOpt.get();

            int updatedQuantity = item.getQuantity() + qty;

            if (product.getStockQuantity() < updatedQuantity) {
                return "Not enough stock available. Only " +
                        product.getStockQuantity() +
                        " left.";
            }

            item.setQuantity(updatedQuantity);
            item.setActualProdPrice(
                    round(product.getFinalPrice() * updatedQuantity)
            );

            cartItemRepo.save(item);

        } else {

            if (qty > product.getStockQuantity()) {
                return "Not enough stock available. Only " +
                        product.getStockQuantity() +
                        " left.";
            }

            CartItem item = new CartItem();

            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(qty);
            item.setActualProdPrice(
                    round(product.getFinalPrice() * qty)
            );

            cartItemRepo.save(item);
        }

        recalculateCart(cart);

        return "Product added to cart successfully";
    }

    public String deleteItem(String username, Long cartItemId) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUserAndActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Invalid cart item");
        }

        cartItemRepo.delete(item);

        recalculateCart(cart);

        return "Item deleted successfully";
    }

    public CartResponseDTO viewCart(String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUserAndActiveTrue(user).orElse(null);

        if (cart == null) {
            return new CartResponseDTO();
        }

        List<CartItem> items = cartItemRepo.findByCartId(cart.getId());

        if (items.isEmpty()) {
            return new CartResponseDTO();
        }

        recalculateCart(cart);

        return mapToResponseDTO(cart);
    }

    public List<CartItemResponseDTO> viewItems(String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUserAndActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return cartItemRepo.findByCartId(cart.getId())
                .stream()
                .map(this::mapToItemResponseDTO)
                .toList();
    }

    public String clearCart(String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUserAndActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> items = cartItemRepo.findByCartId(cart.getId());

        if (!items.isEmpty()) {
            cartItemRepo.deleteAll(items);
        }

        cart.setTotalPrice(0.0);
        cart.setDiscount(0.0);
        cart.setFinalPrice(0.0);
        cart.setShipingCharges(0.0);
        cart.setCuponDiscount(0.0);
        cart.setAppliedCupon(null);
        cart.setUpdatedAt(LocalDateTime.now());

        cartRepo.save(cart);

        return "Cart cleared successfully";
    }

    public String updateQuantity(
            String username,
            Long cartItemId,
            int quantity
    ) {

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUserAndActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Invalid cart item");
        }

        Product product = item.getProduct();

        if (quantity > product.getStockQuantity()) {
            throw new RuntimeException(
                    "Not enough stock available. Only " +
                            product.getStockQuantity() +
                            " left."
            );
        }

        item.setQuantity(quantity);
        item.setActualProdPrice(
                round(quantity * product.getFinalPrice())
        );

        cartItemRepo.save(item);

        recalculateCart(cart);

        return "Quantity updated successfully";
    }

    public int getCartItemCount(String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepo.findByUserAndActiveTrue(user)
                .map(cart -> cartItemRepo.findByCartId(cart.getId()).size())
                .orElse(0);
    }

    public String ToRemindCart(
            String username,
            String subject,
            String body
    ) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepo.findByUserAndActiveTrue(user).orElse(null);

        if (cart == null) {
            return "Cart is empty";
        }

        List<CartItem> items = cartItemRepo.findByCartId(cart.getId());

        if (items.isEmpty()) {
            return "Cart is empty";
        }

        try {
            emailService.sendEmail(user.getEmail(), subject, body);

            return "Reminder email sent successfully to " +
                    user.getEmail();

        } catch (Exception e) {
            return "Failed to send email: " + e.getMessage();
        }
    }

    private void recalculateCart(Cart cart) {

        List<CartItem> items = cartItemRepo.findByCartId(cart.getId());

        double totalPrice = items.stream()
                .mapToDouble(CartItem::getActualProdPrice)
                .sum();

        double shipping = totalPrice > 0 ? 80.0 : 0.0;

        boolean couponApplied = cart.getAppliedCupon() != null;

        double discount = 0.0;

        /*
         * Cart discount should work only when coupon is NOT applied.
         */
        if (!couponApplied) {
            if (totalPrice > 100000) {
                discount = 20.0;
            } else if (totalPrice > 10000) {
                discount = 10.0;
            }
        }

        double cartDiscountAmount =
                round(totalPrice * discount / 100);

        double couponDiscount = 0.0;

        /*
         * Coupon discount should work only when coupon is applied.
         */
        if (
                couponApplied &&
                cart.getAppliedCupon().getDiscountPercentage() != null
        ) {
            couponDiscount = round(
                    totalPrice *
                            cart.getAppliedCupon().getDiscountPercentage() /
                            100
            );
        }

        double finalPrice =
                totalPrice +
                        shipping -
                        cartDiscountAmount -
                        couponDiscount;

        if (finalPrice < 0) {
            finalPrice = 0;
        }

        cart.setTotalPrice(round(totalPrice));
        cart.setShipingCharges(round(shipping));

        /*
         * If coupon is applied, discount becomes 0.
         * If no coupon is applied, discount becomes 10 or 20.
         */
        cart.setDiscount(discount);

        /*
         * If no coupon is applied, coupon discount becomes 0.
         * If coupon is applied, this stores actual coupon discount amount.
         */
        cart.setCuponDiscount(round(couponDiscount));

        cart.setFinalPrice(round(finalPrice));
        cart.setUpdatedAt(LocalDateTime.now());

        cartRepo.save(cart);
    }

    private CartResponseDTO mapToResponseDTO(Cart cart) {

        CartResponseDTO dto = new CartResponseDTO();

        List<CartItem> items =
                cartItemRepo.findByCartId(cart.getId());

        dto.setId(cart.getId());
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setDiscount(cart.getDiscount());
        dto.setFinalPrice(cart.getFinalPrice());
        dto.setShippingCharges(cart.getShipingCharges());
        dto.setCuponDiscount(cart.getCuponDiscount());
        dto.setItemCount(items.size());

        if (cart.getAppliedCupon() != null) {
            dto.setAppliedCouponCode(
                    cart.getAppliedCupon().getCode()
            );

            dto.setCouponDiscountPercent(
                    cart.getAppliedCupon()
                            .getDiscountPercentage()
            );
        }

        dto.setItems(
                items.stream()
                        .map(this::mapToItemResponseDTO)
                        .toList()
        );

        return dto;
    }

    private CartItemResponseDTO mapToItemResponseDTO(CartItem item) {

        CartItemResponseDTO dto = new CartItemResponseDTO();

        dto.setId(item.getId());
        dto.setQuantity(item.getQuantity());
        dto.setActualProdPrice(item.getActualProdPrice());

        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductSlug(item.getProduct().getSlug());

        dto.setProductImage(
                item.getProduct().getImageUrls() != null &&
                        !item.getProduct().getImageUrls().isEmpty()
                        ? item.getProduct().getImageUrls().get(0)
                        : null
        );

        dto.setProductFinalPrice(
                item.getProduct().getFinalPrice()
        );

        dto.setProductMrpPrice(
                item.getProduct().getMrp_price()
        );

        dto.setAvailableStock(
                item.getProduct().getStockQuantity()
        );

        return dto;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}