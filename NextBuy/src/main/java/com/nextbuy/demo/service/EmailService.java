package com.nextbuy.demo.service;

import java.io.File;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String toEmail, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
    
    public void sendInvoiceEmail(String toEmail, String subject, String body, File invoiceFile) {
    	
    	try
    	{
    		MimeMessage message = mailSender.createMimeMessage();
    		
    		MimeMessageHelper helper = new MimeMessageHelper(message, true);
    		
    		helper.setTo(toEmail);
    		helper.setSubject(subject);
    		helper.setText(body);
    		helper.addAttachment(invoiceFile.getName(), invoiceFile);
    		
    		mailSender.send(message);
    		
    		System.out.println(
                    "Invoice email sent successfully");
    	}
    	catch(Exception e)
    	{
    		throw new RuntimeException("Failed to send invoice email: " + e.getMessage());
    	}
    }
}