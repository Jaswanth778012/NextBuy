package com.nextbuy.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.nextbuy.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
