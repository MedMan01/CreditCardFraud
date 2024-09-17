package com.CreditCard.CreditCardFr.repository;

// Java Program to Illustrate Creation Of
// Service Interface

// Importing required classes
import com.SpringBootEmail.Entity.EmailDetails;
import org.springframework.stereotype.Service;

// Interface

public interface EmailService {

    // Method
    // To send a simple email
    String sendSimpleMail(EmailDetails details);

    // Method
    // To send an email with attachment
    String sendMailWithAttachment(EmailDetails details);
    void sendHtmlMail(EmailDetails details);
}

