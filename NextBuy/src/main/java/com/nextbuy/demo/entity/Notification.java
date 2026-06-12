package com.nextbuy.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class Notification {
	
	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String type;

	    private String title;

	    @Column(columnDefinition = "TEXT")
	    private String message;

	    private Long referenceId;

	    private String referenceType;

	    private String priority;

	    private Boolean isRead = false;

	    private LocalDateTime createdAt;
}
