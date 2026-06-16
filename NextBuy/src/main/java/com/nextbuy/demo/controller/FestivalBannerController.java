package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.FestivalBannerRequestDto;
import com.nextbuy.demo.dto.FestivalBannerResponseDto;
import com.nextbuy.demo.dto.ProductSearchRequestDTO;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.service.FestivalBannerService;

@RestController
@RequestMapping("/festival-banner")
public class FestivalBannerController {

    private final FestivalBannerService festivalBannerService;

    public FestivalBannerController(FestivalBannerService festivalBannerService) {
        this.festivalBannerService = festivalBannerService;
    }

    @PostMapping("/create")
	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createBanner(
            @RequestPart("fs") FestivalBannerRequestDto festivalBannerRequestDto,
            @RequestPart("image") MultipartFile image
    ) {
        String message = festivalBannerService.createBanner(
                festivalBannerRequestDto,
                image
        );

        return ResponseEntity.ok(message);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FestivalBannerResponseDto>> getAllBanners() {
        return ResponseEntity.ok(
                festivalBannerService.getAllBanners()
        );
    }

    @GetMapping("/getActive")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<FestivalBannerResponseDto>> getActiveBanners() {
        return ResponseEntity.ok(
                festivalBannerService.getActiveBanners()
        );
    }

    @GetMapping("/getBannerById/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<FestivalBannerResponseDto> getBannerById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                festivalBannerService.getBannerById(id)
        );
    }

    @PutMapping("/updateBanner/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateBanner(
            @PathVariable Long id,
            @RequestPart("fs") FestivalBannerRequestDto festivalBannerRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        String message = festivalBannerService.updateBanner(
                id,
                festivalBannerRequestDto,
                image
        );

        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteBanner(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                festivalBannerService.deleteBanner(id)
        );
    }
    @GetMapping("/festivalProducts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getFestivalProducts(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                festivalBannerService.getFestivalProductsBybannerId(id)
        );
    }
    
    @PostMapping("/BannerProducts")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestBody ProductSearchRequestDTO request) {

        return ResponseEntity.ok(
                festivalBannerService.searchProducts(request)
        );
    }
}