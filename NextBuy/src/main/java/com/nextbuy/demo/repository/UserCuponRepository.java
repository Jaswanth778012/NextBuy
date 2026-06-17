package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Cupon;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.entity.UserCupon;

public interface UserCuponRepository
        extends JpaRepository<UserCupon, Long> {

    boolean existsByUserAndCupon(User user, Cupon cupon);
}