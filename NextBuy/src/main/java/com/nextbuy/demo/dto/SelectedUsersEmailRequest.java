package com.nextbuy.demo.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SelectedUsersEmailRequest {
	
	private List<Long> userIds;
    private String subject;
    private String body;

}
