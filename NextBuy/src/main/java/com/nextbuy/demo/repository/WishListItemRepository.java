package com.nextbuy.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.WishList;
import com.nextbuy.demo.entity.WishListItem;

public interface WishListItemRepository extends JpaRepository<WishListItem, Long> {
	
	Optional<WishListItem> findByWishlistAndProduct(WishList wishList, Product product);
}
