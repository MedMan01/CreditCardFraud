import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FraudDataService } from '../services/fraud-data.service';
import { AddFraudDataDialogComponent } from '../add-fraud-data-dialog/add-fraud-data-dialog.component';
import { FraudData } from '../model/fraud-data.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'type', 'amount', 'nameOrig', 'oldbalanceOrg', 'newbalanceOrig', 'nameDest', 'oldbalanceDest', 'newbalanceDest', 'isFraud', 'actions'];
  dataSource = new MatTableDataSource<FraudData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  fraudStatuses = [
    { value: 0, viewValue: 'Normal' },
    { value: 1, viewValue: 'Suspect' },
    { value: 2, viewValue: 'Fraud' }
  ];

  constructor(private fraudDataService: FraudDataService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getFraudData();
  }

  getFraudData() {
    this.fraudDataService.getAllFraudData().subscribe((data: FraudData[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(isFraud: number | null) {
    if (isFraud === null) {
      this.getFraudData(); // Reset the filter
    } else {
      this.fraudDataService.filterByIsFraud(isFraud).subscribe((data: FraudData[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      });
    }
  }

  viewFraudDetails(element: FraudData) {
    // Logic to view detailed information about the fraud data
    console.log('Viewing fraud details:', element);
  }

  getFraudStatusText(isFraud: number): string {
    if (isFraud === 0) {
      return 'Normal';
    } else if (isFraud === 1) {
      return 'Suspect';
    } else if (isFraud === 2) {
      return 'Fraud';
    } else {
      return 'Unknown';
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddFraudDataDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getFraudData(); // Refresh the data after closing the dialog
    });
  }

  getFraudStatusClass(isFraud: number): string {
    if (isFraud === 0) {
      return 'normal-row';
    } else if (isFraud === 1) {
      return 'suspect-row';
    } else if (isFraud === 2) {
      return 'fraud-row';
    } else {
      return '';
    }
  }
}
