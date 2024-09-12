package com.CreditCard.CreditCardFr.model;


import com.CreditCard.CreditCardFr.enumeration.Type;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class FraudData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private Type type;
    private Double amount;
    private String nameOrig;
    private Double oldbalanceOrg;
    private Double newbalanceOrig;
    private String nameDest;
    private Double oldbalanceDest;
    private Double newbalanceDest;
    private Integer isFraud;

    // Getters et setters
}

