
export interface FraudData {
    id: number; // Represents the primary key (Id)
    type: Type; // Enum for the transaction type
    amount: number;
    nameOrig: string;
    oldbalanceOrg: number;
    newbalanceOrig: number;
    nameDest: string;
    oldbalanceDest: number;
    newbalanceDest: number;
    isFraud: number; // 0 = Not fraud, 1 = Fraud, 2 = Suspect
  }
  
  export interface FraudDataDTO {
    type: Type;
    amount: number;
    oldbalanceOrg: number;
    newbalanceDest: number;
    oldbalanceDest: number;
  }
  
  export interface FraudDataCrudeDTO {
    type: Type; // Enum representing the type of transaction
    amount: number;
    nameOrig: string;
    oldbalanceOrg: number;
    newbalanceOrig: number;
    nameDest: string;
    oldbalanceDest: number;
    newbalanceDest: number;
  }
  
  export enum Type {
    PAYMENT = 'PAYMENT',
    CASH_OUT = 'CASH_OUT',
    CASH_IN = 'CASH_IN',
    TRANSFER = 'TRANSFER',
    DEBIT = 'DEBIT'
  }
  