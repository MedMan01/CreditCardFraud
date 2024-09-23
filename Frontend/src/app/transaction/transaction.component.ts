import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FraudDataService } from '../services/fraud-data.service';
import { AddFraudDataDialogComponent } from '../add-fraud-data-dialog/add-fraud-data-dialog.component';
import { FraudData } from '../model/fraud-data.model';
import { EditFraudDataDialogComponent } from '../edit-fraud-data-dialog/edit-fraud-data-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'type', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig', 'nameDest', 'oldbalanceDest', 'newbalanceDest', 'isFraud', 'action'];
  dataSource = new MatTableDataSource<FraudData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  fraudStatuses = [
    { value: 0, viewValue: 'Normal' },
    { value: 1, viewValue: 'Suspect' },
    { value: 2, viewValue: 'Fraud' }
  ];

  constructor(private fraudDataService: FraudDataService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getFraudData(); // Load all data initially
  }

  getFraudData() {
    this.fraudDataService.getAllFraudData().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(status: number) {
    if (status === -1) {
      this.getFraudData(); // Reset to original data
    } else {
      this.fraudDataService.filterByIsFraud(status).subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddFraudDataDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFraudData();
      }
    });
  }

  openEditDialog(element: FraudData) {
    const dialogRef = this.dialog.open(EditFraudDataDialogComponent, {
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getFraudData();
      }
    });
  }

  deleteRecord(element: FraudData) {
    this.fraudDataService.deleteFraudData(element.id).subscribe(() => {
      this.snackBar.open('Transaction supprimée!', 'Fermer', { duration: 1000 });
      this.getFraudData();
    });
  }

  getFraudStatusClass(status: number): string {
    switch (status) {
      case 0: return 'normal-row';
      case 1: return 'suspect-row';
      case 2: return 'fraud-row';
      default: return '';
    }
  }

  getFraudStatusText(status: number): string {
    switch (status) {
      case 0: return 'Normal';
      case 1: return 'Suspect';
      case 2: return 'Fraud';
      default: return '';
    }
  }
}
