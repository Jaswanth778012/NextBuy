package com.nextbuy.demo.service;

import org.springframework.stereotype.Service;

import com.nextbuy.demo.dto.AdminGlobalSearchResponse;
import com.nextbuy.demo.repository.BrandRepository;
import com.nextbuy.demo.repository.CategoryRepository;
import com.nextbuy.demo.repository.OrderRepository;
import com.nextbuy.demo.repository.ProductRepository;
import com.nextbuy.demo.repository.SubCategoryRepository;
import com.nextbuy.demo.repository.UserRepository;

@Service
public class AdminSearchService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;

    public AdminSearchService(
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            SubCategoryRepository subCategoryRepository) {

        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
    }

    public AdminGlobalSearchResponse search(String keyword) {

        return new AdminGlobalSearchResponse(
                productRepository.findByNameContainingIgnoreCase(keyword),
                orderRepository.findByOrderNumberContainingIgnoreCase(keyword),
                userRepository.searchUsers(keyword),
                brandRepository.findByNameContainingIgnoreCase(keyword),
                categoryRepository.findByNameContainingIgnoreCase(keyword),
                subCategoryRepository.findByNameContainingIgnoreCase(keyword)
        );
    }
}
