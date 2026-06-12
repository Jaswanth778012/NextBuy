package com.nextbuy.demo.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.nextbuy.demo.entity.WishlistAlert;
import com.nextbuy.demo.enums.AlertStatus;
import com.nextbuy.demo.enums.AlertType;

@Repository
public interface WishlistAlertRepository extends JpaRepository<WishlistAlert, Long> {

    List<WishlistAlert> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<WishlistAlert> findByUserIdAndStatus(Long userId, AlertStatus status);

    List<WishlistAlert> findByProductIdAndAlertTypeAndStatus(
            Long productId,
            AlertType alertType,
            AlertStatus status
    );

    List<WishlistAlert> findByAlertTypeAndStatus(
            AlertType alertType,
            AlertStatus status
    );

    @Query("SELECT wa FROM WishlistAlert wa JOIN FETCH wa.product p WHERE wa.alertType = com.nextbuy.demo.enums.AlertType.PRICE_DROP AND wa.status = com.nextbuy.demo.enums.AlertStatus.ACTIVE")
    List<WishlistAlert> findActivePriceDropAlerts();

    @Query("SELECT wa FROM WishlistAlert wa JOIN FETCH wa.product p WHERE wa.alertType = com.nextbuy.demo.enums.AlertType.PRICE_TARGET AND wa.status = com.nextbuy.demo.enums.AlertStatus.ACTIVE")
    List<WishlistAlert> findActivePriceTargetAlerts();

    @Query("SELECT wa FROM WishlistAlert wa JOIN FETCH wa.product p WHERE wa.alertType = com.nextbuy.demo.enums.AlertType.BACK_IN_STOCK AND wa.status = com.nextbuy.demo.enums.AlertStatus.ACTIVE")
    List<WishlistAlert> findActiveBackInStockAlerts();

    @Query("SELECT wa FROM WishlistAlert wa WHERE wa.status = com.nextbuy.demo.enums.AlertStatus.ACTIVE AND wa.createdAt < :expiryDate")
    List<WishlistAlert> findExpiredAlerts(@Param("expiryDate") LocalDateTime expiryDate);

    Optional<WishlistAlert> findByUserIdAndProductIdAndAlertType(
            Long userId,
            Long productId,
            AlertType alertType
    );

    boolean existsByUserIdAndProductIdAndAlertTypeAndStatus(
            Long userId,
            Long productId,
            AlertType alertType,
            AlertStatus status
    );

    @Query("SELECT COUNT(wa) FROM WishlistAlert wa WHERE wa.user.id = :userId AND wa.status = com.nextbuy.demo.enums.AlertStatus.ACTIVE")
    Long countActiveAlertsByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("""
            UPDATE WishlistAlert wa
            SET wa.status = com.nextbuy.demo.enums.AlertStatus.TRIGGERED,
                wa.lastNotifiedAt = :now,
                wa.lastNotifiedPrice = :currentPrice,
                wa.notificationCount = wa.notificationCount + 1
            WHERE wa.id = :alertId
            """)
    void markAlertAsTriggered(
            @Param("alertId") Long alertId,  
            @Param("now") LocalDateTime now,
            @Param("currentPrice") BigDecimal currentPrice
    );

    @Modifying
    @Query("""
            UPDATE WishlistAlert wa
            SET wa.status = com.nextbuy.demo.enums.AlertStatus.ACTIVE
            WHERE wa.id = :alertId
            """)
    void reactivateAlert(@Param("alertId") Long alertId);
}