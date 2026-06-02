package com.nextbuy.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextbuy.demo.entity.SentEmail;

public interface SentEmailRepository extends JpaRepository<SentEmail, Long> {

}
