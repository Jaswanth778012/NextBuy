package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.FestivalBannerRequestDto;
import com.nextbuy.demo.dto.FestivalBannerResponseDto;
import com.nextbuy.demo.dto.ProductSearchRequestDTO;

import com.nextbuy.demo.entity.FestivalBanner;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.repository.FestivalBannerRepository;
import com.nextbuy.demo.repository.ProductRepository;

@Service
public class FestivalBannerService {
	@Autowired
	private RestTemplate restTemplate;
    private final FestivalBannerRepository fsRepo;
    private final CloudinaryService cloudinaryService;
    private final ProductRepository productRepo;
    public FestivalBannerService(
            FestivalBannerRepository fsRepo,
            CloudinaryService cloudinaryService,
            ProductRepository productRepo
    ) {
        this.fsRepo = fsRepo;
        this.cloudinaryService = cloudinaryService;
        this.productRepo = productRepo;
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
        banner.setCategories(fsdto.getCategories());
       
        
        banner.setSubCategories(fsdto.getSubCategories()); 
        
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
    
    

   
    public List<Product> getFestivalProductsBybannerId(Long id) {

        FestivalBanner banner = fsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner not found"));

        LocalDate today = LocalDate.now();

      
        if (!today.isBefore(banner.getEndDate())) {
            banner.setActive(false);
            fsRepo.save(banner);
        }

        
        if (!Boolean.TRUE.equals(banner.getActive())) {
            throw new RuntimeException("Banner is not active");
        }

        
        ProductSearchRequestDTO request = new ProductSearchRequestDTO();

        request.setCategories(banner.getCategories());
        request.setSubCategories(banner.getSubCategories());
       
        
        ResponseEntity<Product[]> response =
                restTemplate.postForEntity(
                        "http://localhost:9090/festival-banner/BannerProducts",
                        request,
                        Product[].class
                );

        Product[] productArray = response.getBody();

        if (productArray == null || productArray.length == 0) {
            return Collections.emptyList();
        }

        return Arrays.asList(productArray);
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
        banner.setCategories(fsdto.getCategories());
        banner.setSubCategories(fsdto.getSubCategories()); 
        
        fsRepo.save(banner);

        return "Festival banner updated successfully";
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {

        if (startDate == null) {
            throw new RuntimeException("Start date is required");
        }

        if (endDate == null) {
            throw new RuntimeException("End date is required");
        }

        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("Start date cannot be after end date");
        }

        if (endDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("End date cannot be in the past");
        }
    }
    
	public String deleteBanner(Long id) {
        FestivalBanner banner = fsRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Festival banner not found"));

        fsRepo.delete(banner);
           
        return "Festival banner deleted successfully";
	}
	
	
    public List<Product> searchProducts(ProductSearchRequestDTO request) {

        return productRepo.multisearchProducts(
                request.getCategories(),
                request.getSubCategories()
                
        );
    }
    
    
    
    private FestivalBannerResponseDto mapToResponseDto(FestivalBanner banner) {
        FestivalBannerResponseDto dto = new FestivalBannerResponseDto();
   dto.setId(banner.getId());
        dto.setFestivalName(banner.getFestivalName());
        dto.setTitle(banner.getTitle());
        dto.setSubtitle(banner.getSubtitle());
        dto.setImageUrl(banner.getImageUrl());
        dto.setRedirectUrl(banner.getRedirectUrl());
        dto.setStartDate(banner.getStartDate());
        dto.setEndDate(banner.getEndDate());
        dto.setPriority(banner.getPriority());
        dto.setCategories(banner.getCategories());
        dto.setSubCategories(banner.getSubCategories());
        
        dto.setActive(banner.getActive());
        dto.setCreatedAt(banner.getCreatedAt());
        dto.setUpdatedAt(banner.getUpdatedAt());

        return dto;
    }

}