package com.nextbuy.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	 long count();
	Optional<User> findByUsername(String username);
	
	boolean existsByUsername(String username);
	
	Optional<User> findByEmail(String email);
	
}
