package com.nextbuy.demo.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextbuy.demo.dto.BackInStockNotificationDto;
import com.nextbuy.demo.dto.CreateWishlistAlertRequestDto;
import com.nextbuy.demo.dto.PriceDropNotificationDto;
import com.nextbuy.demo.dto.WishlistAlertResponseDto;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.entity.User;
import com.nextbuy.demo.entity.WishlistAlert;
import com.nextbuy.demo.enums.AlertStatus;
import com.nextbuy.demo.enums.ProductStatus;
import com.nextbuy.demo.exception.ResourceNotFoundException;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.UserRepository;
import com.nextbuy.demo.repository.WishListItemRepository;
import com.nextbuy.demo.repository.WishlistAlertRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistAlertService {

    private final WishlistAlertRepository wishlistAlertRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final WishListItemRepository wishListItemRepository;
    private final EmailService emailService;

    @Transactional
    public WishlistAlertResponseDto createAlert(String username, CreateWishlistAlertRequestDto dto) {
        User user = getUserByUsername(username);
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Long userId = user.getId();

        boolean inWishlist = wishListItemRepository.existsByUserIdAndProductId(
                userId,
                dto.getProductId()
        );

        if (!inWishlist) {
            throw new IllegalArgumentException("Product must be in your wishlist to set up alerts");
        }

        boolean exists = wishlistAlertRepository.existsByUserIdAndProductIdAndAlertTypeAndStatus(
                userId,
                dto.getProductId(),
                dto.getAlertType(),
                AlertStatus.ACTIVE
        );

        if (exists) {
            throw new IllegalArgumentException("An active alert already exists for this product and type");
        }

        WishlistAlert alert = WishlistAlert.builder()
                .user(user)
                .product(product)
                .alertType(dto.getAlertType())
                .status(AlertStatus.ACTIVE)
                .targetPrice(dto.getTargetPrice())
                .lastNotifiedPrice(BigDecimal.valueOf(product.getFinalPrice()))
                .emailEnabled(dto.getEmailEnabled() != null ? dto.getEmailEnabled() : true)
                .build();

        return mapToAlertResponse(wishlistAlertRepository.save(alert));
    }

    @Transactional(readOnly = true)
    public List<WishlistAlertResponseDto> getUserAlerts(String username) {
        User user = getUserByUsername(username);
        return wishlistAlertRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToAlertResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WishlistAlertResponseDto> getUserActiveAlerts(String username) {
        User user = getUserByUsername(username);
        return wishlistAlertRepository.findByUserIdAndStatus(user.getId(), AlertStatus.ACTIVE)
                .stream()
                .map(this::mapToAlertResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAlert(String username, Long alertId) {
        User user = getUserByUsername(username);
        WishlistAlert alert = wishlistAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

        if (!alert.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        wishlistAlertRepository.delete(alert);
    }

    @Transactional
    public WishlistAlertResponseDto toggleAlertStatus(String username, Long alertId) {
        User user = getUserByUsername(username);
        WishlistAlert alert = wishlistAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

        if (!alert.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        alert.setStatus(
                alert.getStatus() == AlertStatus.ACTIVE
                        ? AlertStatus.PAUSED
                        : AlertStatus.ACTIVE
        );

        return mapToAlertResponse(wishlistAlertRepository.save(alert));
    }

    @Transactional
    public WishlistAlertResponseDto updateAlertSettings(
            String username,
            Long alertId,
            CreateWishlistAlertRequestDto dto
    ) {
        User user = getUserByUsername(username);
        WishlistAlert alert = wishlistAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

        if (!alert.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        alert.setAlertType(dto.getAlertType());
                alert.setTargetPrice(dto.getTargetPrice());
        alert.setEmailEnabled(dto.getEmailEnabled() != null ? dto.getEmailEnabled() : alert.getEmailEnabled());
        alert.setStatus(AlertStatus.ACTIVE);

        return mapToAlertResponse(wishlistAlertRepository.save(alert));
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void checkPriceDrops() {
        List<WishlistAlert> priceDropAlerts = wishlistAlertRepository.findActivePriceDropAlerts();

        for (WishlistAlert alert : priceDropAlerts) {
            try {
                Product product = alert.getProduct();
                BigDecimal currentPrice = BigDecimal.valueOf(product.getFinalPrice());
                BigDecimal lastPrice = alert.getLastNotifiedPrice();

                if (lastPrice == null || currentPrice.compareTo(lastPrice) >= 0) {
                    continue;
                }

                BigDecimal discountAmount = lastPrice.subtract(currentPrice);
                BigDecimal discountPercentage = discountAmount
                        .divide(lastPrice, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.HALF_UP);

                PriceDropNotificationDto notification = PriceDropNotificationDto.builder()
                        .userId(alert.getUser().getId())
                        .userEmail(alert.getUser().getEmail())
                        .userName(alert.getUser().getName())
                        .productId(product.getId())
                        .productName(product.getName())
                        .productUrl("/product/" + product.getId())
                        .oldPrice(lastPrice)
                        .newPrice(currentPrice)
                        .discountAmount(discountAmount)
                        .discountPercentage(discountPercentage)
                        .targetPrice(alert.getTargetPrice())
                        .build();

                if (Boolean.TRUE.equals(alert.getEmailEnabled())) {
                    sendPriceDropEmail(notification);
                }

                wishlistAlertRepository.markAlertAsTriggered(
                        alert.getId(),
                        LocalDateTime.now(),
                        currentPrice
                );

            } catch (Exception e) {
                log.error("Error processing price drop alert {}: {}", alert.getId(), e.getMessage());
            }
        }
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void checkTargetPriceAlerts() {
        // FIXED: Pointed method name to updated Repository JPQL layer
        List<WishlistAlert> targetAlerts = wishlistAlertRepository.findActivePriceTargetAlerts();

        for (WishlistAlert alert : targetAlerts) {
            try {
                Product product = alert.getProduct();
                BigDecimal currentPrice = BigDecimal.valueOf(product.getFinalPrice());
                BigDecimal targetPrice = alert.getTargetPrice();

                if (targetPrice == null || currentPrice.compareTo(targetPrice) > 0) {
                    continue;
                }

                PriceDropNotificationDto notification = PriceDropNotificationDto.builder()
                        .userId(alert.getUser().getId())
                        .userEmail(alert.getUser().getEmail())
                        .userName(alert.getUser().getName())
                        .productId(product.getId())
                        .productName(product.getName())
                        .productUrl("/product/" + product.getId())
                        .oldPrice(alert.getLastNotifiedPrice())
                        .newPrice(currentPrice)
                        .targetPrice(targetPrice)
                        .build();

                if (Boolean.TRUE.equals(alert.getEmailEnabled())) {
                    sendTargetPriceEmail(notification);
                }

                wishlistAlertRepository.markAlertAsTriggered(
                        alert.getId(),
                        LocalDateTime.now(),
                        currentPrice
                );

            } catch (Exception e) {
                log.error("Error processing target price alert {}: {}", alert.getId(), e.getMessage());
            }
        }
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void checkBackInStockAlerts() {
        // FIXED: Pointed method name to updated Repository JPQL layer
        List<WishlistAlert> stockAlerts = wishlistAlertRepository.findActiveBackInStockAlerts();

        for (WishlistAlert alert : stockAlerts) {
            try {
                Product product = alert.getProduct();

                if (product.getStockQuantity() == null || product.getStockQuantity() <= 0) {
                    continue;
                }

                if (product.getProductStatus() != ProductStatus.ACTIVE) {
                    continue;
                }

                BigDecimal currentPrice = BigDecimal.valueOf(product.getFinalPrice());

                BackInStockNotificationDto notification = BackInStockNotificationDto.builder()
                        .userId(alert.getUser().getId())
                        .userEmail(alert.getUser().getEmail())
                        .userName(alert.getUser().getName())
                        .productId(product.getId())
                        .productName(product.getName())
                        .productUrl("/product/" + product.getId())
                        .currentPrice(currentPrice)
                        .stockQuantity(product.getStockQuantity())
                        .build();

                if (Boolean.TRUE.equals(alert.getEmailEnabled())) {
                    sendBackInStockEmail(notification);
                }

                wishlistAlertRepository.markAlertAsTriggered(
                        alert.getId(),
                        LocalDateTime.now(),
                        currentPrice
                );

            } catch (Exception e) {
                log.error("Error processing back in stock alert {}: {}", alert.getId(), e.getMessage());
            }
        }
    }

    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupExpiredAlerts() {
        LocalDateTime expiryDate = LocalDateTime.now().minusDays(90);
        List<WishlistAlert> expiredAlerts = wishlistAlertRepository.findExpiredAlerts(expiryDate);

        for (WishlistAlert alert : expiredAlerts) {
            alert.setStatus(AlertStatus.EXPIRED);
            wishlistAlertRepository.save(alert);
        }
    }

    private void sendPriceDropEmail(PriceDropNotificationDto dto) {
        emailService.sendEmail(dto.getUserEmail(), "Price Drop Alert", dto.getProductName());
    }

    private void sendTargetPriceEmail(PriceDropNotificationDto dto) {
        emailService.sendEmail(dto.getUserEmail(), "Target Price Reached", dto.getProductName());
    }

    private void sendBackInStockEmail(BackInStockNotificationDto dto) {
        emailService.sendEmail(dto.getUserEmail(), "Back in Stock", dto.getProductName());
    }

    private WishlistAlertResponseDto mapToAlertResponse(WishlistAlert alert) {
        WishlistAlertResponseDto dto = new WishlistAlertResponseDto();
        Product product = alert.getProduct();

        dto.setId(alert.getId());
        dto.setProductId(product.getId());
        dto.setProductName(product.getName());
        dto.setProductImageUrl(product.getImageUrls());
        dto.setCurrentPrice(BigDecimal.valueOf(product.getFinalPrice()));
        dto.setOriginalPrice(alert.getLastNotifiedPrice());
        dto.setAlertType(alert.getAlertType());
        dto.setStatus(alert.getStatus());
        dto.setTargetPrice(alert.getTargetPrice());
        dto.setLastNotifiedPrice(alert.getLastNotifiedPrice());
        dto.setLastNotifiedAt(alert.getLastNotifiedAt());
        dto.setNotificationCount(alert.getNotificationCount());
        dto.setEmailEnabled(alert.getEmailEnabled());
        dto.setCreatedAt(alert.getCreatedAt());
        dto.setUpdatedAt(alert.getUpdatedAt());

        return dto;
    }
}