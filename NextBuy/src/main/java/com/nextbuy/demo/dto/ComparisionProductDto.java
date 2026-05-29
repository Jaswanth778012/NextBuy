package com.nextbuy.demo.dto;

import java.util.Map;

import com.nextbuy.demo.entity.Brand;
import com.nextbuy.demo.entity.Category;
import com.nextbuy.demo.entity.SubCategory;

import lombok.Data;

@Data
public class ComparisionProductDto {

    private String name;

    private String slug;

    private String imageUrl;

    private Double mrpPrice;

    private Double finalPrice;

    private Double averageRating;

    private Category category;
    
    private SubCategory subCategory;

    private Brand brand;

    private Map<String, String> attributes;
}
