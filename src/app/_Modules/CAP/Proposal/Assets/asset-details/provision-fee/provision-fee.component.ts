import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { IPRPL_PRVN_FEE_DETLInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormGroup } from 'src/Library';
import { CommissionDistributionComponent } from '../commission-distribution/commission-distribution.component';
import { ProvisionFeeAmountComponent } from './provision-fee-amount/provision-fee-amount.component';

@Component({
    selector: 'app-provision-fee',
    templateUrl: './provision-fee.component.html',
    styleUrls: ['./provision-fee.component.css'],
    standalone: false
})
export class ProvisionFeeComponent implements OnInit {
  isCF: boolean = true;
  constructor(public dialogRef: MatDialogRef<ProvisionFeeComponent>,private dialog: MatDialog, private _dataService: ProposalDataService, private _formatter: FormatterService,
    private _msgService: MessageService, private _calculationService: CalculationService, private _proposalManger: ProposalManagerService) { }
  PROPOSALPROVISIONFEEDETAIL!: FormGroup<IPRPL_PRVN_FEE_DETLInfo>;
  ngOnInit(): void {
    this.PROPOSALPROVISIONFEEDETAIL = this._dataService.PROPOSALPROVISIONFEEDETAIL;

    if (this._proposalManger.ISCFNONMCOMIND) {
      this.isCF = false;
    }

    this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEE.setValue(Number(this.getMinProvisionFee()));
  }
  get ProvisionTaxEnable() {
    if (this.PROPOSALPROVISIONFEEDETAIL != null && this.PROPOSALPROVISIONFEEDETAIL != undefined && this.PROPOSALPROVISIONFEEDETAIL.value.TOTALPROVISIONFEE > 0)
      return true;
    else
      return false;
  }
  openProvisionFeeAmount() {
    const dialogRef = this.dialog.open(ProvisionFeeAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 222 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openProvisionFeeCommission() {
    const dialogRef = this.dialog.open(CommissionDistributionComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 223 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  totalProvisionFeeChange(event: Event) {

    let TOTALPROVISIONFEE = this._formatter.FormatCurrencyToNumber(String(event));

    if (TOTALPROVISIONFEE >= this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT || TOTALPROVISIONFEE < this.PROPOSALPROVISIONFEEDETAIL.value.MINPROVISIONFEE) {
      if(TOTALPROVISIONFEE >= this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT)
      this._msgService.showMesssage("msgprovisionfeeamountlimit", MessageType.Info);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(0);
      this._calculationService.ResetRentalDetail();
      this._calculationService.RemoveArticleComponent(AmountComponent.ProvisionFee);
      this._calculationService.UpdateFinancialAgreementDetail(this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value, AmountComponent.ProvisionFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, null, this._dataService.PROPOSAL.value.BPCOMPANYID, AmountClassification.Receivable, false);
    } else if (this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT > 0) {
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.setValue(TOTALPROVISIONFEE);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.setValue(Math.round((
        (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value * 100) /
        (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value -
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value) + Number.EPSILON) * 100) / 100); //Controller.ProvisionFeePct;

      this._calculationService.ResetRentalDetail();
      this._calculationService.RemoveArticleComponent(AmountComponent.ProvisionFee);
      this._calculationService.UpdateFinancialAgreementDetail(this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value, AmountComponent.ProvisionFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, null, this._dataService.PROPOSAL.value.BPCOMPANYID, AmountClassification.Receivable, false);
      //if (response) /// UpdateFinancialAgreementDetail is not returning bool
      // await Controller.CalculateReceiveableTax(AmountComponent.ProvisionFee, this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE, ChargeTypes.ProvisionFee.GetStringValue());
      this.Validation();
      this.CalculateUpfrontAmount();
      this._calculationService.UpdateProvisionFeeFields();
    }
    // RemoveCommission();
    //isProvisionFeeChanged = false;
    //await Controller.ReCalculateOJKCommission(AmountComponent.ProvisionFee, CommissionType.ProvisionFeeCommission);


  }
  totalProvisionFeePercentageChange(event: Event) {
    let PROVISIONFEEPERCENTAGE = this._formatter.FormatCurrencyToNumber(String(event));
    if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MAXPROVISIONFEEPERCENTAGE.value < 100 && PROVISIONFEEPERCENTAGE <= this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MAXPROVISIONFEEPERCENTAGE.value && PROVISIONFEEPERCENTAGE >= this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEEPERCENTAGE.value) {
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.setValue(Math.round(((PROVISIONFEEPERCENTAGE / 100) * (this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value - this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value) + Number.EPSILON) * 100) / 100);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.setValue(PROVISIONFEEPERCENTAGE);

    }
    else {
      if(PROVISIONFEEPERCENTAGE > this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MAXPROVISIONFEEPERCENTAGE.value)
      this._msgService.showMesssage("maxprovisionfeevalidation", MessageType.Info);
      else if(PROVISIONFEEPERCENTAGE < this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEEPERCENTAGE.value)
      this._msgService.showMesssage("minprovisionfeevalidation", MessageType.Info);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(0);
      // this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.setValue(Math.round(((this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.value / 100) * (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value - this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value)+ Number.EPSILON) * 100) / 100);
    }
    this._calculationService.ResetRentalDetail();
    this._calculationService.RemoveArticleComponent(AmountComponent.ProvisionFee);
    let response = this._calculationService.UpdateFinancialAgreementDetail(this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value, AmountComponent.ProvisionFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, null, this._dataService.PROPOSAL.value.BPCOMPANYID, AmountClassification.Receivable, false);
    //if (response) UpdateFinancialAgreementDetail is of void type
    // Controller.CalculateReceiveableTax(AmountComponent.ProvisionFee, this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE, ChargeTypes.ProvisionFee.GetStringValue());
    this.Validation();

    this.CalculateUpfrontAmount();
    this._calculationService.UpdateProvisionFeeFields();
    //RemoveCommission();
    // await Controller.ReCalculateOJKCommission(AmountComponent.ProvisionFee, CommissionType.ProvisionFeeCommission);
  }
  provisionFeeUpfrontAmountChange(event: Event) {
    let PROVISIONFEEUPFRONT = this._formatter.FormatCurrencyToNumber(String(event));
    this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(PROVISIONFEEUPFRONT);
    let _article = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed);
    let taxinclusive = 0;
    if ((_article != null || _article != undefined) && _article.length > 0)
      taxinclusive = _article[0].value.TAXINCULSIVEAMT;

    if (PROVISIONFEEUPFRONT <= taxinclusive) {
      let diff = taxinclusive - this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value;
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(diff);
    }
    else {
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(taxinclusive);
    }
    if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.value + this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value > taxinclusive) {
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(taxinclusive);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(0);
      this._msgService.showMesssage("upfrontfinancedvalidationmsg", MessageType.Info);
    }
    this._calculationService.ResetRentalDetail();
    this.CalculateUpfrontAmount();
    this._calculationService.UpdateProvisionFeeFields();
  }
  provisionFeeFinanceAmountChange(event: Event) {
    this._calculationService.ResetRentalDetail();
    let PROVISIONFEEFINANCED = this._formatter.FormatCurrencyToNumber(String(event));
    this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(PROVISIONFEEFINANCED);
    let _article = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed);
    let taxinclusive = 0;
    if ((_article != null || _article != undefined) && _article.length > 0)
      taxinclusive = _article[0].value.TAXINCULSIVEAMT;
    if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.value <= taxinclusive) {
      let diff = taxinclusive - this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.value;
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(diff);
    }
    else if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.value + this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value > taxinclusive) {
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(taxinclusive);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(0);
      this._msgService.showMesssage("upfrontfinancedvalidationmsg", MessageType.Info);
    }
    this._calculationService.UpdateProvisionFeeFields();
  }
  receivedByDealerChange(event: any) {
    if (event != undefined) {
      this._calculationService.UpdateProvisionFeeFields();
    }
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManger.DealerPOAmount());
  }
  private Validation() {
    if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEEPERCENTAGE.value > this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.value) {
      let taxinclusive = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee))[0]?.value.TAXINCULSIVEAMT;
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(taxinclusive); //this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE;
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(0);

    }
    else {
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(0);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(0);
      if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.value == 0) {
        this._calculationService.UpdateProvisionFeeFields();
      }
    }
    if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MAXPROVISIONFEEPERCENTAGE.value < this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.value) {
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.setValue(Number(this.getMinProvisionFee()));
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.setValue(this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEEPERCENTAGE.value);
      this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(0);
      //txtProvisionFeeAmount_LostFocus(null, null);
      this._calculationService.RemoveArticleComponent(AmountComponent.ProvisionFee);
      this._msgService.showMesssage("maxprovisionfeevalidation", MessageType.Info);
      this.CalculateUpfrontAmount();
    }

  }
  private getMinProvisionFee() {
    return Number(Number((this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEEPERCENTAGE.value / 100).toFixed(2)) * (this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT - this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.value.CASHDEPOSITAMT)).toFixed(2);
  }
  private CalculateUpfrontAmount() {
    let taxinclusive = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) && p.value.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed);
    if (taxinclusive != null && taxinclusive != undefined) {
      if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value <= taxinclusive.value.TAXINCULSIVEAMT) {
        let diff = taxinclusive.value.TAXINCULSIVEAMT - this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value;
        this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(diff);
      }
      else {
        this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(0);
        this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(taxinclusive.value.TAXINCULSIVEAMT);
        //Message.InfoMessage("upfrontfinancedvalidationmsg");
      }
      if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.value + this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value > taxinclusive.value.TAXINCULSIVEAMT) {
        this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(0);
        this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(taxinclusive.value.TAXINCULSIVEAMT);
        this._msgService.showMesssage("upfrontfinancedvalidationmsg", MessageType.Info);
      }
    }
  }

  btnOk_click(){
    if(this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value < this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEE.value){
      this._msgService.showMesssage("totalprovisionfeevalidation", MessageType.Info);
      return;
    }
    this.dialogRef.close();
  }
}
