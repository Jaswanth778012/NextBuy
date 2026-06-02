package com.nextbuy.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class ScheduleEmailRequest {
	
	 	private List<Long> userIds;

	    private String subject;

	    private String body;

	    private LocalDateTime scheduledTime;

}
