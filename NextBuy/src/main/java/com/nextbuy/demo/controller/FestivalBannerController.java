package com.nextbuy.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.FestivalBannerRequestDto;
import com.nextbuy.demo.dto.FestivalBannerResponseDto;
import com.nextbuy.demo.service.FestivalBannerService;

@RestController
@RequestMapping("/festival-banner")
public class FestivalBannerController {

    private final FestivalBannerService festivalBannerService;

    public FestivalBannerController(FestivalBannerService festivalBannerService) {
        this.festivalBannerService = festivalBannerService;
    }

    @PostMapping("/create")
    public ResponseEntity<String> createBanner(
            @RequestPart("fes") FestivalBannerRequestDto festivalBannerRequestDto,
            @RequestPart("image") MultipartFile image
    ) {
        String message = festivalBannerService.createBanner(
                festivalBannerRequestDto,
                image
        );

        return ResponseEntity.ok(message);
    }

    @GetMapping("/all")
    public ResponseEntity<List<FestivalBannerResponseDto>> getAllBanners() {
        return ResponseEntity.ok(
                festivalBannerService.getAllBanners()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<FestivalBannerResponseDto>> getActiveBanners() {
        return ResponseEntity.ok(
                festivalBannerService.getActiveBanners()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<FestivalBannerResponseDto> getBannerById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                festivalBannerService.getBannerById(id)
        );
    }

    @PutMapping("/update/{id}")
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
    public ResponseEntity<String> deleteBanner(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                festivalBannerService.deleteBanner(id)
        );
    }
}