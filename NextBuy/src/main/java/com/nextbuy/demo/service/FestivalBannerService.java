package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.FestivalBannerRequestDto;
import com.nextbuy.demo.dto.FestivalBannerResponseDto;
import com.nextbuy.demo.dto.UserResponceDTO;
import com.nextbuy.demo.entity.FestivalBanner;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.repository.FestivalBannerRepository;

@Service
public class FestivalBannerService {

    private final FestivalBannerRepository fsRepo;
    private final CloudinaryService cloudinaryService;

    public FestivalBannerService(
            FestivalBannerRepository fsRepo,
            CloudinaryService cloudinaryService
    ) {
        this.fsRepo = fsRepo;
        this.cloudinaryService = cloudinaryService;
    }

    public String createBanner(
            FestivalBannerRequestDto fsdto,
            MultipartFile image
    ) {
        validateDates(fsdto.getStartDate(), fsdto.getEndDate());

        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Festival banner image is required");
        }

        FestivalBanner banner = new FestivalBanner();

        String imageUrl = cloudinaryService.uploadFestBanner(image);
        banner.setImageUrl(imageUrl);

        banner.setFestivalName(fsdto.getFestivalName());
        banner.setTitle(fsdto.getTitle());
        banner.setSubtitle(fsdto.getSubtitle());
        banner.setRedirectUrl(fsdto.getRedirectUrl());
        banner.setStartDate(fsdto.getStartDate());
        banner.setEndDate(fsdto.getEndDate());
        banner.setPriority(fsdto.getPriority() == null ? 1 : fsdto.getPriority());
        banner.setActive(fsdto.getActive() == null || fsdto.getActive());
        banner.setCategory(fsdto.getCategory());
        banner.setProduct(fsdto.getProduct());
        banner.setSubCategory(fsdto.getSubCategory()); 
        
        fsRepo.save(banner);

        return "Festival banner created successfully";
    }

    public List<FestivalBannerResponseDto> getAllBanners() {
        return fsRepo.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    public List<FestivalBannerResponseDto> getActiveBanners() {
        LocalDate today = LocalDate.now();

        return fsRepo
                .findByActiveTrueAndStartDateLessThanEqualAndEndDateGreaterThanEqualOrderByPriorityAsc(
                        today,
                        today
                )
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    public FestivalBannerResponseDto getBannerById(Long id) {
        FestivalBanner banner = fsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Festival banner not found"));

        return mapToResponseDto(banner);
    }
    
    public String getFestivalProductsBybannerId(Long id) {
    	 FestivalBanner b = fsRepo.findById(id).get();
    	 LocalDate date = LocalDate.now();
    	 if(date == b.getEndDate()) {
    		 b.setActive(false);
    		 fsRepo.save(b);
    	 }
    	 if(b.getActive() == false) {
    		return "banner not Active";
    	 }
    	 if(b.getProduct() != null) {
    		 return "/Common/searchProducts?search="+b.getProduct();
    	 }
    	 if(b.getCategory() != null) {
    		 return "/Common/searchProducts?category="+b.getCategory();
    	 }
    	 if(b.getSubCategory() != null) {
    		 return "/Common/searchProducts?subCategory="+b.getSubCategory();
    	 }
    	 return "No products";
    }

    public String updateBanner(
            Long id,
            FestivalBannerRequestDto fsdto,
            MultipartFile image
    ) {
        FestivalBanner banner = fsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Festival banner not found"));

        validateDates(fsdto.getStartDate(), fsdto.getEndDate());

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFestBanner(image);
            banner.setImageUrl(imageUrl);
        }

        banner.setFestivalName(fsdto.getFestivalName());
        banner.setTitle(fsdto.getTitle());
        banner.setSubtitle(fsdto.getSubtitle());
        banner.setRedirectUrl(fsdto.getRedirectUrl());
        banner.setStartDate(fsdto.getStartDate());
        banner.setEndDate(fsdto.getEndDate());
        banner.setPriority(fsdto.getPriority() == null ? banner.getPriority() : fsdto.getPriority());
        banner.setActive(fsdto.getActive() == null ? banner.getActive() : fsdto.getActive());
        banner.setCategory(fsdto.getCategory());
        banner.setProduct(fsdto.getProduct());
        banner.setSubCategory(fsdto.getSubCategory()); 
        fsRepo.save(banner);

        return "Festival banner updated successfully";
    }

    public String deleteBanner(Long id) {
        FestivalBanner banner = fsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Festival banner not found"));

        fsRepo.delete(banner);

        return "Festival banner deleted successfully";
    }

    private FestivalBannerResponseDto mapToResponseDto(FestivalBanner banner) {
        FestivalBannerResponseDto dto = new FestivalBannerResponseDto();

        dto.setFestivalName(banner.getFestivalName());
        dto.setTitle(banner.getTitle());
        dto.setSubtitle(banner.getSubtitle());
        dto.setImageUrl(banner.getImageUrl());
        dto.setRedirectUrl(banner.getRedirectUrl());
        dto.setStartDate(banner.getStartDate());
        dto.setEndDate(banner.getEndDate());
        dto.setPriority(banner.getPriority());
        dto.setActive(banner.getActive());
        dto.setCreatedAt(banner.getCreatedAt());
        dto.setUpdatedAt(banner.getUpdatedAt());

        return dto;
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new RuntimeException("Start date and end date are required");
        }

        if (endDate.isBefore(startDate)) {
            throw new RuntimeException("End date cannot be before start date");
        }
    }
}