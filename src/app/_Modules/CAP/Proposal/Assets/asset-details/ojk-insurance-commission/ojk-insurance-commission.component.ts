import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OJKJP1JP2CommissionTaxDetailComponent } from './ojk-jp1-jp2-commission-tax-detail/ojk-jp1-jp2-commission-tax-detail.component';

@Component({
    selector: 'app-ojk-insurance-commission',
    templateUrl: './ojk-insurance-commission.component.html',
    styleUrls: ['./ojk-insurance-commission.component.css'],
    standalone: false
})
export class OJKInsuranceCommissionComponent implements OnInit {

  displayedColumns: string[] = ['Role', 'Recipient', 'JP1CommissionAmount', 'BankName1', 'Account1', 'JP2CommissionAmount', 'BankName2', 'Account2'];

  dataSource2 = ELEMENT_DATA2;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openJOJKJP1JP2CommissionTaxDetail() {
    const dialogRef = this.dialog.open(OJKJP1JP2CommissionTaxDetailComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 221 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

}


// Demo Data
export interface PeriodicElement {
  Role: string;
  Recipient: string;
  JP1CommissionAmount: string;
  BankName1: string;
  Account1: string;
  JP2CommissionAmount: string;
  BankName2: string;
  Account2: string;

}

const ELEMENT_DATA2: PeriodicElement[] = [
  { Role: '', Recipient: '', JP1CommissionAmount: '', BankName1: '', Account1: '', JP2CommissionAmount: '', BankName2: '', Account2: '' },
  { Role: '', Recipient: '', JP1CommissionAmount: '', BankName1: '', Account1: '', JP2CommissionAmount: '', BankName2: '', Account2: '' }
];
