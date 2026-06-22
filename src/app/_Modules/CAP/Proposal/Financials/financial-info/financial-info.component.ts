import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { IPRPL_FINL_AGRMInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FinancialInfoHelper } from '@NFS_Modules/CAP/_helpers/FinancialInfoHelper';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RepaymentPlanComponent } from '../../Assets/asset-details/repayment-plan/repayment-plan.component';

@Component({
    selector: 'app-financial-info',
    templateUrl: './financial-info.component.html',
    styleUrls: ['./financial-info.component.css'],
    standalone: false
})
export class FinancialInfoComponent implements OnInit, OnDestroy {
  //tempData: any = [{ code: "00001", TextValue: "one 1" }, { code: "00002", TextValue: "two 2" }, { code: "00003", TextValue: "three 3" }];
  private subscription$ = new Subject();
  financialInfoForm: FormGroup<FinancialInfoHelper> = this._proposaldataService.FinancialHelperForm;
  PROPOSALFINANCIALAGREEMENT!: FormGroup<IPRPL_FINL_AGRMInfo>;

  PROPOSALINDVFAMMEMBR!: FormArray<IPRPL_FINL_AGRMInfo>;
  constructor(private dialog: MatDialog, private _proposaldataService: ProposalDataService,
    public _FCMasterDataService: FinancialClubMasterDataService, public _proposalManagerService: ProposalManagerService, public _calculationService: CalculationService) { }

  ngOnInit(): void {
    this.PROPOSALFINANCIALAGREEMENT = this._proposaldataService.PROPOSALFINANCIALAGREEMENT;
    this.disableControls();
    this.valueChangeSubscriptions();
    // this._FCMasterDataService.getmasterDataForFinancialClub(13).subscribe(data => {
    //   console.log(data);
    //   this._FCMasterDataService.Frequencies = data?.Frequencies?.ResultSet?.DataCollection;
    //   this._FCMasterDataService.RentalModes = data?.RentalModes?.ResultSet?.DataCollection;
    // });
  }


  openRepaymentPlan() {
    const dialogRef = this.dialog.open(RepaymentPlanComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: {
        "ProposalId": 0,
        "ApplicantId": 0,
        "FamilyMemberID": 0,
        "callFrom": 'financialInfo'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  disableControls() {
    this.financialInfoForm.disable();
  }

  valueChangeSubscriptions() {
    this.PROPOSALFINANCIALAGREEMENT.controls.FREQUENCYCDE.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val => {
        this._calculationService.GetRentalFrequency(val);
      }));
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
