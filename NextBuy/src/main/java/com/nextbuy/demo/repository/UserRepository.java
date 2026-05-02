package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
