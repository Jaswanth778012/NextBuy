package com.nextbuy.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupportStatsDto {
	
	private long total;

    private long open;

    private long inProgress;

    private long resolved;

    private long closed;
}