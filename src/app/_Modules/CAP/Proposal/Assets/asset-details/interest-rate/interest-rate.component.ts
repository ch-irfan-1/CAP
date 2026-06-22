import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IPRPL_FINL_AGRMInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { BaseRateSourceCode } from '@NFS_Enums/BaseRateSourceCode.enum';
import { BusinessRuleModelCode } from '@NFS_Enums/BusinessRuleModelCode.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { MarginTypeCode } from '@NFS_Enums/MarginType.enum';
import { RentalCalculationMethod } from '@NFS_Enums/RentalCalculationMethod.enum';
import { RuleModelType } from '@NFS_Enums/RuleModelType.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormBuilder, FormGroup } from 'src/Library';
import { BaseRateComponent } from './base-rate/base-rate.component';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';

@Component({
    selector: 'app-interest-rate',
    templateUrl: './interest-rate.component.html',
    styleUrls: ['./interest-rate.component.css'],
    standalone: false
})
export class InterestRateComponent implements OnInit {
  panelOpenState = false;
  public isEffectiveDisable: boolean = true;
  public isFlatDisable: boolean = true;
  public chartCriteria!: string;
  public chartName!: string;
  public overrideInd!: boolean;
  public mask: string = "separator.5";
  proposalFinancialAgrmnt!: IPRPL_FINL_AGRMInfo;
  constructor(private _proposalMapper: ProposalEntityMapperService, private dialog: MatDialog, public _dataService: ProposalDataService, private _formbuilder: FormBuilder,
    private _ProposalForm: ProposalEntityFormService, private _proposalManagerService: ProposalManagerService, private _calculationService: CalculationService, private _formModeService: FormModeService,) { }

  ngOnInit(): void {

    // if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
    //   this.isEffective = this._proposalManagerService.isEffective.valueOf();
    // }else{
    //   this.isEffective=false;
    // }
    if (this._formModeService.FormMode != FormMode.VIEW && this._dataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.Refinance) {
      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD && (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD.value == RentalCalculationMethod.EqualPrincipalFlat || this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD.value == RentalCalculationMethod.Flat)
        && this._dataService.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.value) {
        //financer flat enable
        this.isEffectiveDisable = true;
        this.isFlatDisable = false;
        //financer effective disable
      }
      else if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD && (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD.value == RentalCalculationMethod.EqualPrincipal || this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD.value == RentalCalculationMethod.Annuity)
        && this._dataService.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.value) {
        //financer flat disable
        //financer effective enable
        this.isEffectiveDisable = false;
        this.isFlatDisable = true;
      }
    }
    this.overrideInd = this._dataService.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.value;
    this.proposalFinancialAgrmnt = this._dataService.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.value as IPRPL_FINL_AGRMInfo;
    this.chartCriteria = this._dataService.ProposalEntity.controls.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.value.filter(p => p.MODELTYPECDE === BusinessRuleModelCode.InterestChartsModel)[0].USEREXPRESSION;
    if (this._dataService.ProposalEntity.controls.PROPOSALCHART !== null && this._dataService.ProposalEntity.controls.PROPOSALCHART.value.filter(p => p.MODELTYPE === RuleModelType.InterestRatechart).length > 0) {
      this.chartName = this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE === RuleModelType.InterestRatechart)[0].CHARTNME;
    }
  }

  onFinancerRateEffective(event: any) {
    if (event != undefined) {
      if (this._proposalManagerService.isEffective) {
        let chargeAmt = event;
        if (isNaN(chargeAmt) || chargeAmt > 100 || chargeAmt == "") {
          chargeAmt = 0;
          this.proposalFinancialAgrmnt.FINANCIERMARGINRTE = chargeAmt;
          this.proposalFinancialAgrmnt.FINANCERRTEEFFECTIVE = chargeAmt;
          return;
        }
        this.proposalFinancialAgrmnt.FINANCIERMARGINRTE = chargeAmt;
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCERRTEEFFECTIVE.setValue(chargeAmt);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCIERMARGINRTE.setValue(chargeAmt);
        this._calculationService.ResetRentalDetail();
      }
    }
  }

  onFinancerRateFlat(event: any) {
    if (event != undefined) {
      if (this._proposalManagerService.isFlat) {
        let chargeAmt = event;
        if (isNaN(chargeAmt) || chargeAmt > 100) {
          chargeAmt = 0;
          this.proposalFinancialAgrmnt.FINANCIERMARGINRTE = chargeAmt;
          this.proposalFinancialAgrmnt.FINANCERRTEFLAT = chargeAmt;
          return;
        }
        this.proposalFinancialAgrmnt.FINANCIERMARGINRTE = chargeAmt;
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCERRTEFLAT.setValue(chargeAmt);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FINANCIERMARGINRTE.setValue(chargeAmt);
        this._calculationService.ResetRentalDetail();

      }
    }
  }

  openBaseRate() {
    const dialogRef = this.dialog.open(BaseRateComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  getMarginCodeDescription(code: string): string {
    return MarginTypeCode.GetStringValueByCode(code);
  }

  getBaseCodeDescription(code: string): string {
    return BaseRateSourceCode.GetStringValueByCode(code);
  }
}
