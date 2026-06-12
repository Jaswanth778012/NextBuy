package com.nextbuy.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupportReplyRequestDto {
	
	@NotBlank(message = "Message cannot be empty")
    private String message;
}
