package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequestDto {
	
	 	private String type;
	    private String title;
	    private String message;
	    private Long referenceId;
	    private String referenceType;
	    private String priority;
	
}
