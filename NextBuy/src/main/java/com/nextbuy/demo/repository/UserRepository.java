package com.nextbuy.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.nextbuy.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	 long count();
	Optional<User> findByUsername(String username);
	
	boolean existsByUsername(String username);
	
	Optional<User> findByEmail(String email);
	
	@Query("""
			SELECT u
			FROM User u
			WHERE lower(u.username) LIKE lower(concat('%',:keyword,'%'))
			   OR lower(u.email) LIKE lower(concat('%',:keyword,'%'))
			""")
			List<User> searchUsers(String keyword);
	
}
