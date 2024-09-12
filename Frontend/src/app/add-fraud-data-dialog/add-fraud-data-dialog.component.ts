import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FraudDataService } from '../services/fraud-data.service';

@Component({
  selector: 'app-add-fraud-data-dialog',
  templateUrl: './add-fraud-data-dialog.component.html',
  styleUrls: ['./add-fraud-data-dialog.component.css']
})
export class AddFraudDataDialogComponent {
  data: any = {
    type: '',
    amount: null,
    nameOrig: '',
    oldbalanceOrg: null,
    newbalanceOrg: null,
    nameDest: '',
    oldbalanceDest: null,
    newbalanceDest: null,
    isFraud: 0,
    isFlaggedFraud: 0
  };

  typeOptions = [
    { value: 'PAYMENT', viewValue: 'Payment' },
    { value: 'TRANSFER', viewValue: 'Transfer' },
    { value: 'CASH_OUT', viewValue: 'Cash Out' },
    { value: 'DEBIT', viewValue: 'Debit' },
    { value: 'CASH_IN', viewValue: 'Cash In' }
  ];

  constructor(
    public dialogRef: MatDialogRef<AddFraudDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private fraudDataService: FraudDataService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.fraudDataService.createFraudData(this.data).subscribe(response => {
      console.log('Data added successfully', response);
      this.dialogRef.close();
    }, error => {
      console.error('Error adding data', error);
    });
  }
}
