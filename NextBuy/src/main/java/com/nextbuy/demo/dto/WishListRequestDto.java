package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishListRequestDto {
	
	private String wishListName;
	
	private boolean isPublic;

}
