package com.nextbuy.demo.dto;

import com.nextbuy.demo.enums.TicketCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTicketDto {
	
	    private String subject;

	    private String description;

	    private TicketCategory category;
}
