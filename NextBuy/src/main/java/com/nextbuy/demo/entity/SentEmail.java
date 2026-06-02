package com.nextbuy.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SentEmail {
	
	  	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String recipients;

	    private String subject;

	    @Column(columnDefinition = "TEXT")
	    private String body;

	    private String type; 
	    // BROADCAST / SELECTED_USERS / SCHEDULED

	    private LocalDateTime sentAt;
	    
	    public SentEmail(String recipients, String subject,
                String body, String type,
                LocalDateTime sentAt) {
   this.recipients = recipients;
   this.subject = subject;
   this.body = body;
   this.type = type;
   this.sentAt = sentAt;
}


}
