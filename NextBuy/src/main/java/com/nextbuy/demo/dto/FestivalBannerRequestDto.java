package com.nextbuy.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.nextbuy.demo.entity.Product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FestivalBannerRequestDto {
	
	 	private String festivalName;
	    private String title;
	    private String subtitle;
	    private String imagePublicId;
	    private String imageUrl;
	    private String description;
	    private LocalDate startDate;
	    private LocalDate endDate;
	    private Integer priority;
	    private Boolean active;
	    private List<String> categories;
	    private List<String> subCategories;
	    private List<String> relatedCategories;
	    private List<String> relatedSubCategories;
	    private List<Long> productIds;

	    
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;

}
