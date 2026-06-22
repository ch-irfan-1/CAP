import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CommissionDistributionComponent } from '../commission-distribution/commission-distribution.component';
import { TotalAdminFeesComponent } from './total-admin-fees/total-admin-fees.component';

@Component({
    selector: 'app-total-admin-fee',
    templateUrl: './total-admin-fee.component.html',
    styleUrls: ['./total-admin-fee.component.css'],
    standalone: false
})
export class TotalAdminFeeComponent implements OnInit, OnDestroy {
  private subscription$ = new Subject();
  isCF: boolean = true;
  constructor(private dialog: MatDialog, public _proposaldataService: ProposalDataService, private _proposalmanagerservice: ProposalManagerService,
    private _calculationService: CalculationService, private _FormModeService: FormModeService, private _messageService: MessageService, private appTypeService: ApplicationTypeService) { }

  ngOnInit(): void {
    this.valueSubscription();
    if (this._proposalmanagerservice.ISCFNONMCOMIND) {
      this.isCF = false;
    }
  }

  openTotalAdminiFeeAmount() {
    const dialogRef = this.dialog.open(TotalAdminFeesComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 224 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openAdminFeeCommission() {
    const dialogRef = this.dialog.open(CommissionDistributionComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 225 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  valueSubscription() {
    this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADDITIONALADMINFEE.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(val => {
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(0);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEESUBSIDY.setValue(0);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEDISCOUNT.setValue(0);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.setValue(0);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEFINANCEIND.setValue(false);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.setValue(0);
      this.CalculateAdminFee();
      this.UpdateAdminFee();
    })

    this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEDISCOUNT.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(val => {
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(0);
      //await RemoveCommission();
      this._calculationService.RemoveArticleComponent(AmountComponent.FinancedAdminFee);
      this._calculationService.RemoveArticleComponent(AmountComponent.UpfrontAdminFee);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.setValue(0);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.setValue(0);

      if ((this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEESUBSIDY.value + this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEDISCOUNT.value)
        > (this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.STANDARDADMINFEE.value + this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADDITIONALADMINFEE.value)) {
        this._messageService.showMesssage("AdminFeeDiscountValidation", MessageType.Info);
        this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEDISCOUNT.setValue(0);
        this.CalculateAdminFee();
        this.UpdateAdminFee();
        // await Controller.ReCalculateOJKCommission(AmountComponent.AdminFee, CommissionType.AdminFeeCommission);
        //           return;
      }
      this.CalculateAdminFee();
      this.UpdateAdminFee();
    })

    this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEESUBSIDY.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(val => {
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(0);
      //await RemoveCommission();
      this._calculationService.RemoveArticleComponent(AmountComponent.FinancedAdminFee);
      this._calculationService.RemoveArticleComponent(AmountComponent.UpfrontAdminFee);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.setValue(0);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.setValue(0);

      if ((this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEESUBSIDY.value + this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEDISCOUNT.value)
        > (this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.STANDARDADMINFEE.value + this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADDITIONALADMINFEE.value)) {
        this._messageService.showMesssage("AdminFeeSubsidytValidation", MessageType.Info);
        this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEESUBSIDY.setValue(0);
        //this.CalculateAdminFee();
        this.UpdateAdminFee();
        // await Controller.ReCalculateOJKCommission(AmountComponent.AdminFee, CommissionType.AdminFeeCommission);
        //           return;
      }
      this.CalculateAdminFee();
      this.UpdateAdminFee();
    })

    this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(val => {
      this.UpdateAdminFee();
      //let _taxinclusive = this._proposaldataService.ASSETENTITY.value.PRPLARTICLECOMPONENTENTITYCOL.filter(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee))[0].TAXINCULSIVEAMT;
      let _taxinclusive = 0;
      this._proposaldataService.PROPOSALARTICLEFORMGROUP.value.ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.forEach(p => {
        if (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee)) {
          _taxinclusive = p.TAXINCULSIVEAMT;
        }
      })
      if (this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.value > _taxinclusive) {
        this._messageService.showMesssage("AdminFeeFinanceAmountValidation", MessageType.Info);
        this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.setValue(0);
        return;
      }
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.setValue(_taxinclusive - this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.value);
      if ((this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.value + this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.value) > _taxinclusive) {
        this._messageService.showMesssage("AdminFeeFinanceAmountValidation", MessageType.Info);
        this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.setValue(0);
      }
      this.UpdateAdminFee();
    })
    this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(val => {
      this.UpdateAdminFee();
    })
  }

  NetOffChanged(event: any) {
    if (Boolean(event) == true) {
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.DEALERNETOFFIND.setValue(true);
    }
    else {
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.DEALERNETOFFIND.setValue(false);
    }
    if (this._FormModeService.FormMode != FormMode.VIEW) {
      this.UpdateAdminFee();
    }
  }

  FinancedChanged(event: any) {
    if (Boolean(event) == true) {
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEFINANCEIND.setValue(true);
      this.UpdateAdminFee();
      this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.value, AmountComponent.FinancedAdminFee, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Finance, null, 0, null, this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.RECEIVEDBYDEALERIND.value);
    }
    else {
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEFINANCEIND.setValue(false);
      this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.setValue(0);
      this.UpdateAdminFee();
      this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.value, AmountComponent.FinancedAdminFee, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Finance, null, 0, null, this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.RECEIVEDBYDEALERIND.value);
    }
  }

  ReceivedByDealerChanged(event: any) {
    if (Boolean(event) == true) {

    }
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalmanagerservice.DealerPOAmount());
  }

  CalculateAdminFee() {
    this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.TOTALADMINFEE.setValue(this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.STANDARDADMINFEE.value
      + this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADDITIONALADMINFEE.value
      - this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEESUBSIDY.value
      + this._proposaldataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEDISCOUNT.value);
  }

  UpdateAdminFee() {
    this._calculationService.UpdateAdminFeeFields();
    if (this._FormModeService.FormMode != FormMode.VIEW) {
      this._calculationService.ResetRentalDetail();
    }
  }

  OK_clicked() {
    this.dialog.closeAll();
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  isControlDisable(controlName: string) {
    return this.appTypeService.isControlDisable(controlName)
  }

}
