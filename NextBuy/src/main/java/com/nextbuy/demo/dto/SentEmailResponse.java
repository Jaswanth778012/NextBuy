package com.nextbuy.demo.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SentEmailResponse {
	
	  	private Long id;
	    private String recipients;
	    private String subject;
	    private String body;
	    private String type;
	    private LocalDateTime sentAt;

}
