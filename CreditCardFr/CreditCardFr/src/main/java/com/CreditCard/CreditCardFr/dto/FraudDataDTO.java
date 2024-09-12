package com.CreditCard.CreditCardFr.dto;

import com.CreditCard.CreditCardFr.enumeration.Type;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FraudDataDTO {
    private Type type;
    private Double amount;
    private Double oldbalanceOrg;
    private Double oldbalanceDest;
    private Double newbalanceDest;

    // Method to map the type to an integer
    public int getTypeAsInt() {
        switch (type) {
            case PAYMENT: return 1;
            case TRANSFER: return 4;
            case CASH_OUT: return 2;
            case DEBIT: return 5;
            case CASH_IN: return 3;
            default: throw new IllegalArgumentException("Unexpected value: " + type);
        }
    }
}
