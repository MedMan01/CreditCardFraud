import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FraudDataService } from '../services/fraud-data.service';
import { FraudDataDTO, Type } from '../model/fraud-data.model';
import { PredictionDialogComponent } from '../prediction-dialog/prediction-dialog.component';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent {
  Type = Type; // Make enum available in template
  dto: FraudDataDTO = {
    type: Type.PAYMENT,
    amount: 0,
    oldbalanceOrg: 0,
    oldbalanceDest: 0,
    newbalanceDest: 0
  };

  constructor(private fraudDataService: FraudDataService, private dialog: MatDialog) { }

  predictFraud() {
    this.fraudDataService.predictFraud(this.dto).subscribe(result => {
      console.log('Raw prediction result:', result); // Log raw result to debug
  
      // Ensure the result is treated as a string for comparison
      const resultStr = result.toString().trim();
      let message: string;
      let color: string;
  
      switch (resultStr) {
        case '0':
          message = 'Transaction is normal';
          color = 'green';
          break;
        case '1':
          message = 'Transaction is suspect';
          color = 'yellow';
          break;
        case '2':
          message = 'Transaction is fraud';
          color = 'red';
          break;
        default:
          message = 'Unknown result';
          color = 'gray';
          break;
      }
  
      this.openDialog(message, color);
    }, error => {
      console.error('Error predicting fraud:', error);
    });
  }
  

  openDialog(message: string, color: string) {
    this.dialog.open(PredictionDialogComponent, {
      data: { message, color }
    });
  }
}
