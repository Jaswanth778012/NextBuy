package com.nextbuy.demo.dto;

import java.time.LocalDate;

import com.nextbuy.demo.enums.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;	
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequestDto {
	@NotBlank(message = "Username is required")
    @Size(min=3,max=50)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min=6, message = "Password must be at least 6 characters long")
    private String password;

    private Long mobileNumber;
    
    private String name;

    @Email(message = "Enter valid email")
    private String email;

    private Gender gender;

    @NotBlank(message = "Address is required")
    private String address;

    private LocalDate dob;
}
