package com.nextbuy.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminGlobalSearchResponse {
	
	private List<?> products;
    private List<?> orders;
    private List<?> users;
    private List<?> brands;
    private List<?> categories;
    private List<?> subCategories;

}
