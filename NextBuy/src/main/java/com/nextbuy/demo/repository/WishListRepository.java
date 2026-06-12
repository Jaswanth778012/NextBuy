package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.entity.WishList;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Long> {

    List<WishList> findByUser(User user);

    List<WishList> findByUserId(Long userId);

    Optional<WishList> findByIdAndUserId(Long wishListId, Long userId);

    boolean existsByUserId(Long userId);

    @Modifying
    @Query("DELETE FROM WishList w WHERE w.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    Long countByUserId(Long userId);
}