import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FraudDataService } from '../services/fraud-data.service';
import { FraudDataCrudeDTO, Type } from '../model/fraud-data.model';

@Component({
  selector: 'app-add-fraud-data-dialog',
  templateUrl: './add-fraud-data-dialog.component.html',
  styleUrls: ['./add-fraud-data-dialog.component.css']
})
export class AddFraudDataDialogComponent {
  data: FraudDataCrudeDTO = {
    type: Type.PAYMENT, // Enum representing the type of transaction
    amount: 0,
    nameOrig: '',
    oldbalanceOrg: 0,
    newbalanceOrig: 0,
    nameDest: '',
    oldbalanceDest: 0,
    newbalanceDest: 0
  };

  typeOptions = [
    { value: Type.PAYMENT, viewValue: 'Payment' },
    { value: Type.TRANSFER, viewValue: 'Transfer' },
    { value: Type.CASH_OUT, viewValue: 'Cash Out' },
    { value: Type.DEBIT, viewValue: 'Debit' },
    { value: Type.CASH_IN, viewValue: 'Cash In' }
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
      this.fraudDataService.predictFraud(this.data).subscribe(prediction => {
        let message = '';
        let color = '';

        switch (prediction.trim()) {
          case '0':
            message = 'La transaction est normale';
            color = 'green';
            break;
          case '1':
            message = 'La transaction est suspecte';
            color = 'yellow';
            break;
          case '2':
            message = 'La transaction est frauduleuse';
            color = 'red';
            break;
          default:
            message = 'Prédiction inconnue';
            color = 'gray';
            break;
        }

        this.openDialog(message, color);
      });
    }, error => {
      console.error('Error adding data', error);
      alert('Erreur lors de l\'ajout des données : ' + error.message);
    });
  }

  openDialog(message: string, color: string): void {
    alert(`%c${message}`);
  }
}
