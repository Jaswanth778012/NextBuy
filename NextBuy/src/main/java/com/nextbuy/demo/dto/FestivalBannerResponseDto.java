package com.nextbuy.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FestivalBannerResponseDto {
    private Long id;
    private String festivalName;
    private String title;
    private String subtitle;
    private String imageUrl;
    private String redirectUrl;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer priority;
    private Boolean active;
    private List<String> categories;
    private List<String> subCategories;

    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
