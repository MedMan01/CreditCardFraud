import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FraudData, FraudDataCrudeDTO, Type } from '../model/fraud-data.model';
import { FraudDataService } from '../services/fraud-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-fraud-data-dialog',
  templateUrl: './edit-fraud-data-dialog.component.html',
  styleUrls: ['./edit-fraud-data-dialog.component.css']
})
export class EditFraudDataDialogComponent {
  editForm: FormGroup;
  fraudStatuses = [
    { value: Type.PAYMENT, viewValue: 'Payment' },
    { value: Type.CASH_OUT, viewValue: 'Cash Out' },
    { value: Type.CASH_IN, viewValue: 'Cash In' },
    { value: Type.TRANSFER, viewValue: 'Transfer' },
    { value: Type.DEBIT, viewValue: 'Debit' }
  ];

  constructor(
    public dialogRef: MatDialogRef<EditFraudDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FraudData,
    private fb: FormBuilder,
    private fraudDataService: FraudDataService, // Inject FraudDataService
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      type: [data.type, Validators.required],
      amount: [data.amount, Validators.required],
      nameOrig: [data.nameOrig, Validators.required],
      oldbalanceOrg: [data.oldbalanceOrg, Validators.required],
      newbalanceOrig: [data.newbalanceOrig, Validators.required],
      nameDest: [data.nameDest, Validators.required],
      oldbalanceDest: [data.oldbalanceDest, Validators.required],
      newbalanceDest: [data.newbalanceDest, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedData: FraudDataCrudeDTO = this.editForm.value;
      
      // Call the update service with the ID and updated data
      this.fraudDataService.updateFraudData(this.data.id, updatedData).subscribe({
        next: (response) => {
          this.dialogRef.close(response); // Close the dialog and return the updated data
          this.snackBar.open('Fraud data updated successfully!', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Update failed', err);
          this.snackBar.open('Failed to update fraud data', 'Close', {
            duration: 3000,
          });
        }
      });
    }
  }
}
