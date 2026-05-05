package com.nextbuy.demo.service;

import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepo;
    private final CloudinaryService cloudinaryService;

    public Brand createBrand(String name, String description,
                             String country, MultipartFile logoFile) {
        Brand brand = new Brand();
        brand.setName(name);
        brand.setDescription(description);
        brand.setCountry(country);
        brand.setCreatedAt(LocalDateTime.now());
        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = cloudinaryService.uploadImage(logoFile);
            brand.setLogoUrl(logoUrl);
        }
        return brandRepo.save(brand);
    }

    public Brand updateBrand(Long brandId, String name, String description,
                             String country, MultipartFile logoFile) {
        Brand brand = brandRepo.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        brand.setName(name);
        brand.setDescription(description);
        brand.setCountry(country);
        if (logoFile != null && !logoFile.isEmpty()) {
            String logoUrl = cloudinaryService.uploadImage(logoFile);
            brand.setLogoUrl(logoUrl);
        }
        return brandRepo.save(brand);
    }

    public void deleteBrand(Long brandId) {
        brandRepo.deleteById(brandId);
    }

    public Brand getBrandById(Long brandId) {
        return brandRepo.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));
    }

    public List<Brand> getAllBrands() {
        return brandRepo.findAll();
    }
}