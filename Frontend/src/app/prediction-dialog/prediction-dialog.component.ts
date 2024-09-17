import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-prediction-dialog',
  templateUrl: './prediction-dialog.component.html',
  styleUrls: ['./prediction-dialog.component.css']
})
export class PredictionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string, color: string }) { }
}
