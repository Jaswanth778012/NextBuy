package com.nextbuy.demo.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextbuy.demo.dto.CreateWishlistAlertRequestDto;
import com.nextbuy.demo.dto.WishlistAlertResponseDto;
import com.nextbuy.demo.service.WishlistAlertService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wishlist-alerts")
@RequiredArgsConstructor
public class WishlistAlertController {

    private final WishlistAlertService wishlistAlertService;

    @PostMapping
    public ResponseEntity<WishlistAlertResponseDto> createAlert(
            @Valid @RequestBody CreateWishlistAlertRequestDto dto,
            Principal principal
    ) {
        String username = principal.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(wishlistAlertService.createAlert(username, dto));
    }

    @GetMapping
    public ResponseEntity<List<WishlistAlertResponseDto>> getMyAlerts(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(wishlistAlertService.getUserAlerts(username));
    }

    @GetMapping("/active")
    public ResponseEntity<List<WishlistAlertResponseDto>> getMyActiveAlerts(Principal principal) {
        String username = principal.getName();
        return ResponseEntity.ok(wishlistAlertService.getUserActiveAlerts(username));
    }

    @PutMapping("/{alertId}")
    public ResponseEntity<WishlistAlertResponseDto> updateAlert(
            @PathVariable Long alertId,
            @Valid @RequestBody CreateWishlistAlertRequestDto dto,
            Principal principal
    ) {
        String username = principal.getName();
        return ResponseEntity.ok(wishlistAlertService.updateAlertSettings(username, alertId, dto));
    }

    @PatchMapping("/{alertId}/toggle")
    public ResponseEntity<WishlistAlertResponseDto> toggleAlertStatus(
            @PathVariable Long alertId,
            Principal principal
    ) {
        String username = principal.getName();
        return ResponseEntity.ok(wishlistAlertService.toggleAlertStatus(username, alertId));
    }

    @DeleteMapping("/{alertId}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long alertId, Principal principal) {
        String username = principal.getName();
        wishlistAlertService.deleteAlert(username, alertId);
        return ResponseEntity.noContent().build();
    }
}