package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.SavedItem;

public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {

}
