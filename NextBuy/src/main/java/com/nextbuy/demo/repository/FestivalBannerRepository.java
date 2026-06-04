package com.nextbuy.demo.repository;

import com.nextbuy.demo.entity.FestivalBanner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FestivalBannerRepository extends JpaRepository<FestivalBanner, Long> {

    List<FestivalBanner> findByActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByPriorityAsc(
            LocalDate today1,
            LocalDate today2
    );
}