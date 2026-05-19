package com.nextbuy.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Cupon;

public interface CuponRepository extends JpaRepository<Cupon, Long> {

	Optional<Cupon> findByCode(String code);
}
