package com.nextbuy.demo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.nextbuy.demo.dto.BrandRequestDto;
import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.repository.BrandRepository;

@Service
public class BrandService {
	
	BrandRepository brandRepository;
	CloudinaryService cloudinaryService;
	
	public BrandService(BrandRepository brandRepository, CloudinaryService cloudinaryService) {
		this.brandRepository = brandRepository;
		this.cloudinaryService = cloudinaryService;
	}
	
	public String addBrand(BrandRequestDto brandRequestDto, MultipartFile logoFile) {
		
		if(brandRepository.existsByName(brandRequestDto.getName())) {
			throw new RuntimeException("Brand with the same name already exists");
		}
		
		Brand brand = new Brand();
		
		brand.setName(brandRequestDto.getName());
		brand.setDescription(brandRequestDto.getDescription());
		brand.setCountry(brandRequestDto.getCountry());
		brand.setCreatedAt(LocalDate.now());
		
		if(logoFile != null && !logoFile.isEmpty()) {
			String logoUrl = cloudinaryService.uploadBrandLogo(logoFile);
			brand.setLogoUrl(logoUrl);
		}
		
		brandRepository.save(brand);
		
		return "Brand added successfully";
	}
	
	
	public String updateBrand(Long brandId, BrandRequestDto brandRequestDto, MultipartFile logoFile) {
		
		Brand brand = brandRepository.findById(brandId)
				.orElseThrow(() -> new RuntimeException("Brand not found with id: " + brandId));
		
		brand.setName(brandRequestDto.getName());
		brand.setDescription(brandRequestDto.getDescription());
		brand.setCountry(brandRequestDto.getCountry());
		
		if(logoFile != null && !logoFile.isEmpty()) {
			String logoUrl = cloudinaryService.uploadBrandLogo(logoFile);
			brand.setLogoUrl(logoUrl);
		}
		
		brandRepository.save(brand);
		
		return "Brand updated successfully";
	}
	
	public String deleteBrand(Long brandId) {
		
		Brand brand = brandRepository.findById(brandId)
				.orElseThrow(() -> new RuntimeException("Brand not found with id: " + brandId));
		
		brandRepository.delete(brand);
		
		return "Brand deleted successfully";
	}
	
	public Brand getBrandById(Long brandId) {
		
		return brandRepository.findById(brandId)
				.orElseThrow(() -> new RuntimeException("Brand not found with id: " + brandId));
	}
	
	public Brand getBrandByName(String name) {
		
		return brandRepository.findAll().stream()
				.filter(brand -> brand.getName().equalsIgnoreCase(name))
				.findFirst()
				.orElseThrow(() -> new RuntimeException("Brand not found with name: " + name));
	}		
	
	public List<Brand> getAllBrands() {
		return brandRepository.findAll();
	}
}
