package com.nextbuy.demo.service;

import com.nextbuy.demo.dto.ProductRequest; // Create this DTO if not present
import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.entity.Product;
import com.nextbuy.demo.enums.ProductStatus;
import com.nextbuy.demo.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepo;
    private final BrandService brandService;
    private final CloudinaryService cloudinaryService;

    public Product createProduct(ProductRequest request, MultipartFile imageFile) {
        Brand brand = brandService.getBrandById(request.getBrandId());

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setDis_count(request.getDiscount());
        product.setBrand(brand);
        product.setStockStatus(request.getStockStatus());
        product.setAttributes(request.getAttributes());
        product.setDeliveryTimeInDays(request.getDeliveryTimeInDays());
        product.setProductStatus(ProductStatus.ACTIVE);
        product.setTotalRating(0.0);
        product.setAverageRating(0.0);
        product.setUpdatedAt(LocalDateTime.now());

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            product.setImageUrl(imageUrl);
        }
        return productRepo.save(product);
    }

    public Product updateProduct(Long productId, ProductRequest request, MultipartFile imageFile) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Brand brand = brandService.getBrandById(request.getBrandId());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setDis_count(request.getDiscount());
        product.setBrand(brand);
        product.setStockStatus(request.getStockStatus());
        product.setAttributes(request.getAttributes());
        product.setDeliveryTimeInDays(request.getDeliveryTimeInDays());
        product.setUpdatedAt(LocalDateTime.now());

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            product.setImageUrl(imageUrl);
        }
        return productRepo.save(product);
    }

    public Product updateStatus(Long productId, ProductStatus status) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setProductStatus(status);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepo.save(product);
    }

    public void deleteProduct(Long productId) {
        productRepo.deleteById(productId);
    }

    public Product getProductById(Long productId) {
        return productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Page<Product> getProductsWithFilters(String search, String category,
                                                Double minPrice, Double maxPrice,
                                                String stockStatus, Long brandId,
                                                Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }
            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            if (stockStatus != null && !stockStatus.isEmpty()) {
                predicates.add(cb.equal(root.get("stockStatus").as(String.class), stockStatus));
            }
            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return productRepo.findAll(spec, pageable);
    }

    public List<String> getAllDistinctCategories() {
        return productRepo.findAll().stream()
                .map(Product::getCategory)
                .distinct()
                .sorted()
                .toList();
    }
}