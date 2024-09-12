package com.CreditCard.CreditCardFr.dto;

import com.CreditCard.CreditCardFr.enumeration.Type;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class FraudDataCrudeDTO {
    private Type type;
    private Double amount;
    private String nameOrig;
    private Double oldbalanceOrg;
    private Double newbalanceOrig;
    private String nameDest;
    private Double oldbalanceDest;
    private Double newbalanceDest;
}
