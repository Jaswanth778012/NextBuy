package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.WishList;
import com.nextbuy.demo.entity.WishListItem;

@Repository
public interface WishListItemRepository extends JpaRepository<WishListItem, Long> {

    Optional<WishListItem> findByWishlistAndProduct(WishList wishList, Product product);

    List<WishListItem> findByWishlist(WishList wishList);

    boolean existsByWishlistAndProduct(WishList wishList, Product product);

    @Query("SELECT wli FROM WishListItem wli WHERE wli.wishlist.user.id = :userId AND wli.product.id = :productId")
    Optional<WishListItem> findByUserIdAndProductId(
            @Param("userId") Long userId,
            @Param("productId") Long productId
    );

    @Query("SELECT CASE WHEN COUNT(wli) > 0 THEN true ELSE false END FROM WishListItem wli WHERE wli.wishlist.user.id = :userId AND wli.product.id = :productId")
    boolean existsByUserIdAndProductId(
            @Param("userId") Long userId,
            @Param("productId") Long productId
    );

    @Query("SELECT wli.product.id FROM WishListItem wli WHERE wli.wishlist.user.id = :userId")
    List<Long> findProductIdsByUserId(@Param("userId") Long userId);

    Long countByWishlist(WishList wishList);
}