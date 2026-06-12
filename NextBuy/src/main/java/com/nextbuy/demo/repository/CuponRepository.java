package com.nextbuy.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.Cupon;
import com.nextbuy.demo.enums.CuponStatus;

public interface CuponRepository extends JpaRepository<Cupon, Long> {

	Optional<Cupon> findByCode(String code);
	List<Cupon> findByCuponStatusAndExpiryDateAfter(CuponStatus status,LocalDateTime now);
}
