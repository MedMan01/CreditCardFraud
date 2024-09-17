import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FraudDataService } from '../services/fraud-data.service';
import { FraudDataCrudeDTO, FraudData, Type } from '../model/fraud-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-fraud-data-dialog',
  templateUrl: './add-fraud-data-dialog.component.html',
  styleUrls: ['./add-fraud-data-dialog.component.css']
})
export class AddFraudDataDialogComponent {
  data: FraudDataCrudeDTO = {
    type: Type.PAYMENT,
    amount: 0,
    nameOrig: '',
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    nameDest: '',
    oldbalanceDest: 0,
    newbalanceDest: 0
  };

  typeOptions = [
    { value: 'PAYMENT', viewValue: 'Payment' },
    { value: 'TRANSFER', viewValue: 'Transfer' },
    { value: 'CASH_OUT', viewValue: 'Cash Out' }, 
    { value: 'CASH_IN', viewValue: 'Cash In' },
    { value: 'DEBIT', viewValue: 'Debit' }
  ];

  constructor(
    public dialogRef: MatDialogRef<AddFraudDataDialogComponent>,
    private fraudDataService: FraudDataService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    this.fraudDataService.createFraudData(this.data).subscribe({
      next: (response: FraudData) => {
        // Close the dialog
        this.dialogRef.close(true);
        
        // Determine the prediction result
        let message = '';
        if (response.isFraud === 0) {
          message = 'Transaction is Normal';
        } else if (response.isFraud === 1) {
          message = 'Transaction is Suspect';
        } else if (response.isFraud === 2) {
          message = 'Transaction is Fraud';
        }

        // Show result in a snackbar
        this.snackBar.open(message, 'Close', {
          duration: 5000,
          panelClass: this.getSnackBarClass(response.isFraud)
        });
      },
      error: (err) => {
        console.error('Error creating transaction:', err);
        this.snackBar.open('Failed to create transaction data', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Add a method to get the class for the snackbar based on the fraud result
  getSnackBarClass(isFraud: number): string[] {
    if (isFraud === 0) {
      return ['normal-transaction'];
    } else if (isFraud === 1) {
      return ['suspect-transaction'];
    } else {
      return ['fraud-transaction'];
    }
  }
}
