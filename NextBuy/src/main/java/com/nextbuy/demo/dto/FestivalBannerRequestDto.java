package com.nextbuy.demo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
	    private String redirectUrl;
	    private LocalDate startDate;
	    private LocalDate endDate;
	    private Integer priority;
	    private Boolean active;
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;

}
