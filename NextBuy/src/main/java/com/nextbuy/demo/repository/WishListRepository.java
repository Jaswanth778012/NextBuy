package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.entity.WishList;

public interface WishListRepository extends JpaRepository<WishList, Long> {
		List<WishList> findByUser(User user);
}
