import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IProposalRepaymentPlanEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/IProposalRepaymentPlanEntity.model';
import { IPRPL_RPMT_PLANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AdjustmentType } from '@NFS_Enums/AdjustmentType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder, Control } from 'src/Library';

// export interface PeriodicElement {
//   feeOpen: string;
//   InstallmentNo: number;
//   RentalDue: number;
//   PrincipalAmount: number;
//   InterestAmount: number;
//   GrossRentalAmount: number;
//   PrincipalOutstandingAmount: number;
// }
// const ELEMENT_DATA: PeriodicElement[] = [
//   {
//     feeOpen:'',
//     InstallmentNo: 1,
//     RentalDue: 1000,
//     PrincipalAmount: 2000,
//     InterestAmount: 30000,
//     GrossRentalAmount: 2000,
//     PrincipalOutstandingAmount: 2000
//   },
//   {
//     feeOpen:'',
//     InstallmentNo: 2,
//     RentalDue: 1000,
//     PrincipalAmount: 2000,
//     InterestAmount: 30000,
//     GrossRentalAmount: 2000,
//     PrincipalOutstandingAmount: 2000
//   }
// ];

@Component({
    selector: 'app-repayment-plan',
    templateUrl: './repayment-plan.component.html',
    styleUrls: ['./repayment-plan.component.css'],
    standalone: false
})

export class RepaymentPlanComponent implements OnInit {
  // dataSource1 = ELEMENT_DATA;
  // columnsToDisplay = [ 'feeOpen','Installment No.', 'Rental Due', 'Principal Amount', 'Interest Amount', 'Gross Rental Amount', 'Principal Outstanding Amount' ];
  // expandedElement: PeriodicElement | null | undefined;

  public RPColumns = ['INSTALLMENTNUMBER', 'RENTALDTE', 'PRINCIPALAMT', 'INTERESTAMT', 'GROSSRENTAL', 'PRINCIPALOUTSTANDINGAMT'];
  public RPLabel = ['Installment No.', 'Rental Due', 'Principal Amount', 'Interest Amount', 'Gross Rental Amount', 'Principal Outstanding Amount'];
  public Pipes = [null, 'formatDate', 'formatCurrency', 'formatCurrency', 'formatCurrency', 'formatCurrency'];
  public dataSource: FormArray<IPRPL_RPMT_PLANInfo> = this.fb.array<IPRPL_RPMT_PLANInfo>([]); //= {} as FormArray<IProposalRepaymentPlanEntity>
  // public Totals: any[] = [];
  constructor(public dialogRef: MatDialogRef<RepaymentPlanComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, public _proposaldataService: ProposalDataService, private _proposalService: ProposalService, private _proposalForm: ProposalEntityFormService,
    public _masterDataService: MasterDataService, public _proposalManagerService: ProposalManagerService, public _calculationService: CalculationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this._proposaldataService.PROPOSALREPAYMENTPLANENTITYCOL.controls.filter(r => r.value.PRPLRPMTPLAN.RowState !== DataRowState.Removed).forEach(p => {
      p.controls.PRPLRPMTPLAN.controls.TOTALTAXAMOUNT.patchValue(p.value.PRPLRPMTPLANTAX.reduce(function (tot, record) {
        return tot + record.TAXAMT
      }, 0));
      p.controls.PRPLRPMTPLAN.controls.GSTAMT.patchValue(p.value.PRPLRPMTPLAN.TOTALTAXAMOUNT);
      if (this._proposalManagerService.TaxTypes != null && this._proposalManagerService.TaxTypes.length > 0)
        p.controls.PRPLRPMTPLANTAX.controls.forEach(x => {
          x.controls.TAXTYPE.patchValue(this._proposalManagerService.TaxTypes.filter(k => k.TAXTYPECDE == x.value.TAXTYPECDE).length > 0 ? this._proposalManagerService.TaxTypes.filter(k => k.TAXTYPECDE == x.value.TAXTYPECDE)[0].TAXTYPEDSC : "");
        });
    });

    this.CalculateSubsidy();
    this.SetGridViewForOperatingLease();
    this._proposaldataService.PROPOSALREPAYMENTPLANENTITYCOL.controls.filter(r => r.value.PRPLRPMTPLAN.RowState !== DataRowState.Removed).forEach(item => {
      this.dataSource.push(item.controls.PRPLRPMTPLAN);
    });
    this.CalculateSummary();
  }

  private CalculateSubsidy() {
    this._proposaldataService.PROPOSALREPAYMENTPLANENTITYCOL.controls.forEach(item => {
      item.controls.PRPLRPMTPLAN.controls.INSTALLMENTSUBSIDY.patchValue(0);
    });

    let ResultantRentals = [] as Array<IProposalRepaymentPlanEntity>;
    ResultantRentals = this._proposaldataService.PROPOSALREPAYMENTPLANENTITYCOL.value.filter(s => s.PRPLRPMTPLAN.ISGPRENTAL != true && s.PRPLRPMTPLAN.RowState !== DataRowState.Removed) as Array<IProposalRepaymentPlanEntity>;
    if (this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.ADJUSTMENTTYPECODE == AdjustmentType.StartTerms) {
      for (let index = 0; index < this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.NOOFINSTALLMENTS; index++) {
        ResultantRentals.push(ResultantRentals[index])
      }
    }
    else if (this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.ADJUSTMENTTYPECODE == AdjustmentType.StartTerms) {
      for (let index = 0; index < ResultantRentals.length && index > (ResultantRentals.length - this._proposaldataService.PROPOSALSUBSIDYDETAIL.value.NOOFINSTALLMENTS); index++) {
        ResultantRentals.push(ResultantRentals[index])
      }
    }
    ResultantRentals.forEach(item => {
      item.PRPLRPMTPLAN.INSTALLMENTSUBSIDY = item.PRPLRPMTPLAN.GROSSRENTAL;
    });
  }

  private SetGridViewForOperatingLease() {
    if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
      this.RPColumns = ['INSTALLMENTNUMBER', 'RENTALDTE', 'PRINCIPALAMT', 'INTERESTAMT', 'GROSSRENTAL'];
      this.RPLabel = ['Installment No.', 'Rental Due', 'Net Rental Amount', 'VAT Amount', 'Gross Rental Amount'];
      // this.Pipes = [null, 'formatDate', null, null, null, null, null];
    }
    else if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
    }
  }
  public childOutput($event: any) {

  }
  public DefaultSelectionChange($event: any) {

  }

  public Close() {

  }

  private CalculateSummary() {
    let PRINCIPALAMT = this.dataSource.value.reduce(function (tot, record) {
      return tot + record['PRINCIPALAMT']
    }, 0);
    let INTERESTAMT = this.dataSource.value.reduce(function (tot, record) {
      return tot + record['INTERESTAMT']
    }, 0);
    // let RENTALAMT = this.dataSource.value.reduce(function (tot, record) {
    //   return tot + record['RENTALAMT']
    // }, 0);
    let GROSSRENTAL = this.dataSource.value.reduce(function (tot, record) {
      return tot + record['GROSSRENTAL']
    }, 0);

    let PRINCIPALOUTSTANDINGAMT = this.dataSource.value.reduce(function (tot, record) {
      return tot + record['PRINCIPALOUTSTANDINGAMT']
    }, 0);
    var a={} as IPRPL_RPMT_PLANInfo;
    a.INSTALLMENTNUMBER='Total',
    a.RENTALDTE=new Date('') as Control<Date>,
    a.PRINCIPALAMT=PRINCIPALAMT;
    a.INTERESTAMT=INTERESTAMT;
    a.GROSSRENTAL=GROSSRENTAL;
    a.isBold=true;
    this.dataSource.push(this.fb.group<IPRPL_RPMT_PLANInfo>(a));
  }
}
