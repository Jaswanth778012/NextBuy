package com.nextbuy.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.SavedItem;
import com.nextbuy.demo.entity.User;

public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
	List<SavedItem> findByUser(User user);
}
