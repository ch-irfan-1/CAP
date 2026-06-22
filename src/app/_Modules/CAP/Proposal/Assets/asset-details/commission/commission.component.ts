import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IProposalArticleEntity, IProposalCommissionEntity, IPRPL_FINL_AGRMInfo, IPRPL_MKTG_COMMInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { CommissionCalculationMethod } from '@NFS_Enums/CommissionCalculationMethod';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { CommissionCalculationParam } from '@NFS_Interfaces/RequestInterfaces/CommissionCalculationParam';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormGroup } from 'src/Library';
import { CommissionDistributionComponent } from '../commission-distribution/commission-distribution.component';
import { OJKInsuranceCommissionComponent } from '../ojk-insurance-commission/ojk-insurance-commission.component';
import { AssetDetailsCommonComponent } from '../asset-details-common/asset-details-common.component';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import { FormMode } from '@NFS_Enums/FormMode.enum';

@Component({
    selector: 'app-commission',
    templateUrl: './commission.component.html',
    styleUrls: ['./commission.component.css'],
    standalone: false
})
export class CommissionComponent implements OnInit {
  @Output() commissionFlagEvent = new EventEmitter();
  PROPOSALFINANCIALAGREEMENT = this._proposalFormService.ProposalFinancialAgreementForm();
  commissionMethodMasterData = [] as Array<INFSDropDownData>;
  OJKFlag : Boolean = false;
  isClosed : Boolean = false;
  isCommissionPassToCustomer : boolean = true;
  constructor(private dialog: MatDialog, public _proposaldataService: ProposalDataService, private _proposalFormService: ProposalEntityFormService, private _proposalService: ProposalService, private _formatter: FormatterService,
    private _proposalManager: ProposalManagerService, private _calculationService: CalculationService, public _genericService: GeneralService) { }

  ngOnInit(): void {
    //this.PROPOSALFINANCIALAGREEMENT.patchValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value);
    this.cmbCommissionCalcMethod_SelectionChanged();
    this.getCommissionMethodLookup();
  }
  openOJKCommission() {
    this.OJKFlag = true;
    this._genericService.IsMarketingCommission = true;
    
    // const dialogRef = this.dialog.open(CommissionDistributionComponent, {
    //   width: '95vw',
    //   height: '92%',
    //   maxWidth: '95vw',
    //   position: { right: '2vw', top: '3vh' },
    //   panelClass: 'cdk-overlay-pane-custom',
    //   disableClose: true,
    //   data: { "id": 113 },
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   //console.log("session closed");
    //   if (result != undefined) {
    //   }
    // });

  }

  childOutput(event: any) {
    this.OJKFlag = false;
  }



  commissionEventEmitter(){
    this._genericService.FormMode = FormMode.EDIT;
    this.commissionFlagEvent.emit(false);
  
  }

  closeOJKType() {
    this.isClosed = true;
    this.OJKFlag = true;
    this.commissionEventEmitter();
  }



  private cmbCommissionCalcMethod_SelectionChanged() {
    let info = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLMKTGCOMM.find(p => p.ISDEFAULT == true) as IPRPL_MKTG_COMMInfo;

    if (info != null || this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT > 0) {
      let txtMaxFixCommissionAmount = 0;
      let txtMaxCommissionPercentage = 0;
      let txtBasicCommissionCalPercentage = 0;
      let txtIntroducerCommissionPer = 0;
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE == '' || this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE == null)
        this.PROPOSALFINANCIALAGREEMENT.controls.COMMMTHDCDE.setValue(info?.COMMISSIONMTHDCDE);
      else
        this.PROPOSALFINANCIALAGREEMENT.controls.COMMMTHDCDE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE);
      //this.PROPOSALFINANCIALAGREEMENT.controls.COMMMTHDCDE.setValue(info?.COMMISSIONMTHDCDE);
      this.PROPOSALFINANCIALAGREEMENT.controls.COMMCALCPCT.setValue(info?.DEFAULTAMTPCT);
      // SOCD-27611
      this.PROPOSALFINANCIALAGREEMENT.controls.COMMBASICCALCPCT.setValue(info?.MAXAMTPCT);//this.PROPOSALFINANCIALAGREEMENT.controls.COMMBASICCALCPCT.setValue(info.DEFAULTAMTPCT);
      this.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT);
      this.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.OJKMARKETINGCOMMISSIONAMT);
    }
  }


  public CommissionCalcMethodOnChange(event: any) {
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMMTHDCDE.setValue(event.value);
  }


  private getCommissionMethodLookup() {
    this._proposalService.GetCommissionMethodLookup().subscribe(res => {
      this.commissionMethodMasterData = res.ResultSet.DataCollection;
    });
  }

  public OJKCommissionOnChange(event: Event) {
    let assetAmnt = this._formatter.FormatCurrencyToNumber(String(event));
    this.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(assetAmnt);
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(assetAmnt);
    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RowState !== DataRowState.Added)
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.RowState.setValue(DataRowState.Updated);

    this._calculationService.calculateCommission();
  }
  btnResetOJKCommission_Click() {
    if (this._proposaldataService.ASSETENTITY.value != null
      && this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].PRPLMKTGCOMM != null
      && this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].PRPLMKTGCOMM.length > 0) {
      this._calculationService.ReCalculateOJKCommission(AmountComponent.JP1Commission, CommissionType.MarketingCommission);
      this.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT);

      let request = new CommissionCalculationParam();
      request.PROPOSALARTICLE = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
      request.COMMISSIONAMNT = this.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.value;
      request.COMMISSIONTYPE = CommissionType.GetStringValue(CommissionType.MarketingCommission);
      request.CHKEMPLOYEE = this._proposaldataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
      request.COMMISSIONCALCIND = this._proposalManager.CommissionCalcInd;
      request.BPINTRODUCERID = this._proposaldataService.PROPOSAL.value.BPINTRODUCERID;

      this._proposalService.CalculateCommission(request).subscribe(res => {
        //this._formState.ResetFormArrayState(this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY, DataRowState.Removed);
        if (this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
          this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._proposalFormService.PropsalCommissionForm());
        //this._entityMapperService.ProposalCommissionEntityMapper(this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0], res?.ResultSet[0]);
        this._proposalManager.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, '00001');
      });
    }
  }
}
