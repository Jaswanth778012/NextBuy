package com.nextbuy.demo.dto;

import java.util.Map;

import com.nextbuy.demo.entity.Brand;

import lombok.Data;

@Data
public class ComparisionProductDto {

    private String name;

    private String slug;

    private String imageUrl;

    private Double mrpPrice;

    private Double finalPrice;

    private Double averageRating;

    private String category;

    private Brand brand;

    private Map<String, String> attributes;
}
