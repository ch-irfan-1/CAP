import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IProposalArticleEntity, IProposalCommissionEntity, IPRPL_CMPT_CNFGInfo, IPRPL_COMM_SCHMInfo, IPRPL_TPLE_RNTL_INTInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { CommissionCalculationParam } from '@NFS_Interfaces/RequestInterfaces/CommissionCalculationParam';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';

@Component({
    selector: 'app-commission-scheme-configurations',
    templateUrl: './commission-scheme-configurations.component.html',
    styleUrls: ['./commission-scheme-configurations.component.css'],
    standalone: false
})
export class CommissionSchemeConfigurationsComponent implements OnInit {

  displayedColumns: string[] = ['COMMISSIONTYPENME', 'JP1PCT', 'JP1COMMISSIONAMT', 'JP2PCT', 'JP2COMMISSIONAMT', 'JP2SCHEMEPCT', 'JP2SCHEMECOMMISSIONAMT'];
  mask: string = "separator.2";
  dataSource = new MatTableDataSource<IPRPL_COMM_SCHMInfo>();
  viewMode = false;
  constructor(private _proposalDataService: ProposalDataService, private _messageService: MessageService, private _proposalService: ProposalService,
    private _proposalManager: ProposalManagerService, private _entityMapperService: ProposalEntityMapperService, private _formState: StateManagment,
    private _entityFormService: ProposalEntityFormService,
    public dialog: MatDialog, public _formMode: FormModeService) { }

  ngOnInit(): void {
    this.updateTableData();
    if (this._formMode.FormMode == FormMode.VIEW) {
      this.viewMode = true;
    }
  }

  txtJP1Percentage_LostFocus(event: Event, element: any, index: any) {
    try {
      let currRow = this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[this._proposalDataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].controls.PRPLCOMMSCHM.controls[index];

      if (element.JP1PCT === '') {
        element.JP1PCT = 0;
      }

      if (element.JP1COMMISSIONAMT === '') {
        element.JP1COMMISSIONAMT = 0;
      }

      currRow.patchValue(element);
      if (currRow != null) {
        currRow.controls.JP2PCT.setValue(+(100 - (Number(currRow.value.JP1PCT) + Number(currRow.value.JP2SCHEMEPCT))).toFixed(2));
        if (+Number(currRow.value.JP1PCT).toFixed(2) > 100) {
          currRow.controls.JP1PCT.setValue(0);
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }
        else if (+(Number(currRow.value.JP1PCT) + Number(currRow.value.JP2SCHEMEPCT)).toFixed(2) > 100) {
          currRow.controls.JP1PCT.setValue(0);
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }
        else if (+(Number(currRow.value.JP1PCT) + Number(currRow.value.JP2PCT) + Number(currRow.value.JP2SCHEMEPCT)).toFixed(2) > 100) {
          currRow.controls.JP1PCT.setValue(0);
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }
        currRow.controls.JP2PCT.setValue(+(100 - (Number(currRow.value.JP1PCT) + Number(currRow.value.JP2SCHEMEPCT))).toFixed(2));

        let commissionAmnt = 0;
        if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.AdminFeeCommission))
          commissionAmnt = this._proposalDataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.value.DEALERADMINFEECOMMISSION;
        else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.InsuranceCommission))
          commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.value;
        else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission))
          commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.value;
        else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission))
          commissionAmnt = this._proposalDataService.ASSETENTITY.value.PROPOSALPROVISIONFEEDETAIL.PROVISIONFEECOMMISSION;
        else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.SOFCommission))
          commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.value.TOTALJP2COMMAMOUNT;
        Math.round(((commissionAmnt * currRow.value.JP1PCT / 100) + Number.EPSILON) * 100) / 100
        currRow.controls.JP1COMMISSIONAMT.setValue(Math.round(((commissionAmnt * currRow.value.JP1PCT / 100) + Number.EPSILON) * 100) / 100);
        currRow.controls.JP2COMMISSIONAMT.setValue(Math.round(Math.round(((commissionAmnt * currRow.value.JP2PCT / 100) + Number.EPSILON) * 100) / 100));

        this.updateTableData();

        let request = new CommissionCalculationParam();
        request.PROPOSALARTICLE = this._proposalDataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
        request.COMMISSIONAMNT = commissionAmnt;
        request.COMMISSIONTYPE = currRow.value.COMMISSIONTYPECDE;
        request.CHKEMPLOYEE = this._proposalDataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
        request.COMMISSIONCALCIND = this._proposalManager.CommissionCalcInd;
        request.BPINTRODUCERID = this._proposalDataService.PROPOSAL.value.BPINTRODUCERID;
        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP1JP2RPNTTAX = new Array();
        })
        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP2RPNTTAX = new Array();
        })
        this._proposalService.CalculateCommissionforScheme(request).subscribe(res => {
          this._proposalManager.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, currRow.value.COMMISSIONTYPECDE);
          this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManager.DealerPOAmount());
          this.updateTableData();
        });
      }

    }
    catch { }
  }

  txtJP1CommAmnt_LostFocus(event: Event, element: any, index: any) {
    try {
      let currRow = this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[this._proposalDataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].controls.PRPLCOMMSCHM.controls[index];

      if (element.JP1COMMISSIONAMT === '') {
        element.JP1COMMISSIONAMT = 0;
      }

      currRow.patchValue(element);

      let jp1Amount = currRow.value.JP1COMMISSIONAMT;

      let commissionAmnt = 0;
      if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.AdminFeeCommission))
        commissionAmnt = this._proposalDataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.value.DEALERADMINFEECOMMISSION;
      else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.InsuranceCommission))
        commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.value;
      else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission))
        commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.value;
      else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission))
        commissionAmnt = this._proposalDataService.ASSETENTITY.value.PROPOSALPROVISIONFEEDETAIL.PROVISIONFEECOMMISSION;

      if (currRow != null) {
        if (commissionAmnt > 0) {
          currRow.controls.JP1PCT.setValue(Math.round(((jp1Amount / commissionAmnt * 100) + Number.EPSILON) * 100) / 100)
          if (currRow.value.JP1PCT == 0)
            currRow.controls.JP1COMMISSIONAMT.setValue(0);// = 0;
        }
        else {
          currRow.controls.JP1PCT.setValue(0);
          currRow.controls.JP2PCT.setValue(0);
          currRow.controls.JP2SCHEMEPCT.setValue(0);
          currRow.controls.JP1COMMISSIONAMT.setValue(0);
          currRow.controls.JP2COMMISSIONAMT.setValue(0);
          currRow.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);

          let request = new CommissionCalculationParam();
          request.PROPOSALARTICLE = this._proposalDataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
          request.COMMISSIONAMNT = commissionAmnt;
          request.COMMISSIONTYPE = currRow.value.COMMISSIONTYPECDE;
          request.CHKEMPLOYEE = this._proposalDataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
          request.COMMISSIONCALCIND = this._proposalManager.CommissionCalcInd;
          request.BPINTRODUCERID = this._proposalDataService.PROPOSAL.value.BPINTRODUCERID;
          request.PRPLCMPTCNFG = this._proposalDataService.PRPLCMPTCNFG.value as Array<IPRPL_CMPT_CNFGInfo>;
          request.PROPOSALTEMPLATERENTALINT = this._proposalDataService.ProposalEntity.value.PROPOSALTEMPLATERENTALINT as IPRPL_TPLE_RNTL_INTInfo;

          request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.forEach(recepient => {
            recepient.PRPLJP1JP2RPNTTAX = new Array();
          })
          request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP2RECIPIENT.forEach(recepient => {
            recepient.PRPLJP2RPNTTAX = new Array();
          })

          this._proposalService.CalculateCommission(request).subscribe(res => {
            this._proposalManager.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, currRow.value.COMMISSIONTYPECDE);
            this.updateTableData();
          });
        }
        currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
        if (+currRow.value.JP1PCT.toFixed(2) > 100) {
          currRow.controls.JP1PCT.setValue(0);
          currRow.controls.JP1COMMISSIONAMT.setValue(0);
          currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }
        if (+(currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT).toFixed(2) > 100) {
          currRow.controls.JP1PCT.setValue(0);
          currRow.controls.JP1COMMISSIONAMT.setValue(0);
          currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }

        if (+(currRow.value.JP1PCT + currRow.value.JP2PCT + currRow.value.JP2SCHEMEPCT).toFixed(2) > 100) {
          currRow.controls.JP1PCT.setValue(0);
          currRow.controls.JP1COMMISSIONAMT.setValue(0);
          currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }
        currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
        currRow.controls.JP2COMMISSIONAMT.setValue(Math.round(((commissionAmnt * currRow.value.JP2PCT / 100) + Number.EPSILON) * 100) / 100);

        let request = new CommissionCalculationParam();
        request.PROPOSALARTICLE = this._proposalDataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
        request.COMMISSIONAMNT = commissionAmnt;
        request.COMMISSIONTYPE = currRow.value.COMMISSIONTYPECDE;
        request.CHKEMPLOYEE = this._proposalDataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
        request.COMMISSIONCALCIND = this._proposalManager.CommissionCalcInd;
        request.BPINTRODUCERID = this._proposalDataService.PROPOSAL.value.BPINTRODUCERID;


        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP1JP2RPNTTAX = new Array();
        })
        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP2RPNTTAX = new Array();
        })

        this._proposalService.CalculateCommissionforScheme(request).subscribe(res => {
          if (this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
            this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._entityFormService.PropsalCommissionForm());
          this._proposalManager.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, currRow.value.COMMISSIONTYPECDE);
          this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManager.DealerPOAmount());
          this.updateTableData();
        });

        this.updateTableData();
      }
    }
    catch
    {

    }
  }

  txtJP2SchemePercentage_LostFocus(event: Event, element: any, index: any) {
    try {
      let currRow = this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[this._proposalDataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].controls.PRPLCOMMSCHM.controls[index];

      if (element.JP2SCHEMEPCT === '') {
        element.JP2SCHEMEPCT = 0;
      }

      currRow.patchValue(element);

      if (currRow.value != null) {
        currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
        if (+currRow.value.JP2SCHEMEPCT.toFixed(2) > 100) {
          currRow.controls.JP2SCHEMEPCT.setValue(0);
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }

        if (+(currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT).toFixed(2) > 100) {
          currRow.controls.JP2SCHEMEPCT.setValue(0);
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }

        if (+(currRow.value.JP1PCT + currRow.value.JP2PCT + currRow.value.JP2SCHEMEPCT).toFixed(2) > 100) {
          currRow.controls.JP2SCHEMEPCT.setValue(0);
          this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
        }

        currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));

        let commissionAmnt = 0;
        if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.AdminFeeCommission))
          commissionAmnt = this._proposalDataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.value.DEALERADMINFEECOMMISSION;
        else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.InsuranceCommission))
          commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.value;
        else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission))
          commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.value;
        else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission))
          commissionAmnt = this._proposalDataService.ASSETENTITY.value.PROPOSALPROVISIONFEEDETAIL.PROVISIONFEECOMMISSION;

        currRow.controls.JP2SCHEMECOMMISSIONAMT.setValue(Math.round(((commissionAmnt * currRow.value.JP2SCHEMEPCT / 100) + Number.EPSILON) * 100) / 100);
        currRow.controls.JP2COMMISSIONAMT.setValue(Math.round(((commissionAmnt * currRow.value.JP2PCT / 100) + Number.EPSILON) * 100) / 100);

        this.updateTableData();

        let request = new CommissionCalculationParam();
        request.PROPOSALARTICLE = this._proposalDataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
        request.COMMISSIONAMNT = commissionAmnt;
        request.COMMISSIONTYPE = currRow.value.COMMISSIONTYPECDE;
        request.CHKEMPLOYEE = this._proposalDataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
        request.COMMISSIONCALCIND = this._proposalManager.CommissionCalcInd;
        request.BPINTRODUCERID = this._proposalDataService.PROPOSAL.value.BPINTRODUCERID;

        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP1JP2RPNTTAX = new Array();
        })
        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP2RPNTTAX = new Array();
        })

        this._proposalService.CalculateCommissionforScheme(request).subscribe(res => {

          if (this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
            this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._entityFormService.PropsalCommissionForm());
          this._proposalManager.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, currRow.value.COMMISSIONTYPECDE);
          this.updateTableData();
        });

      }

    }
    catch { }
  }

  txtJP2SchemeCommAmnt_LostFocus(event: Event, element: any, index: any) {
    this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[this._proposalDataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].controls.PRPLCOMMSCHM.controls[index].patchValue(element);

    if (element.JP2SCHEMECOMMISSIONAMT === '') {
      element.JP2SCHEMECOMMISSIONAMT = 0;
    }

    let currRow = this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[this._proposalDataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].controls.PRPLCOMMSCHM.controls[index];

    let jp2schemeAmount = currRow.value.JP2SCHEMECOMMISSIONAMT;

    let commissionAmnt = 0;
    if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.AdminFeeCommission))
      commissionAmnt = this._proposalDataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.value.DEALERADMINFEECOMMISSION;
    else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.InsuranceCommission))
      commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.value;
    else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission))
      commissionAmnt = this._proposalDataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.value;
    else if (currRow.value.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission))
      commissionAmnt = this._proposalDataService.ASSETENTITY.value.PROPOSALPROVISIONFEEDETAIL.PROVISIONFEECOMMISSION;

    if (currRow != null) {
      if (commissionAmnt > 0) {
        currRow.controls.JP2SCHEMEPCT.setValue(Math.round(((jp2schemeAmount / commissionAmnt * 100) + Number.EPSILON) * 100) / 100);
        if (currRow.value.JP2SCHEMEPCT == 0)
          currRow.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);
      }
      else {
        currRow.controls.JP1PCT.setValue(0);
        currRow.controls.JP2PCT.setValue(0);
        currRow.controls.JP2SCHEMEPCT.setValue(0);
        currRow.controls.JP1COMMISSIONAMT.setValue(0);
        currRow.controls.JP2COMMISSIONAMT.setValue(0);
        currRow.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);
        let request = new CommissionCalculationParam();
        request.PROPOSALARTICLE = this._proposalDataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
        request.COMMISSIONAMNT = commissionAmnt;
        request.COMMISSIONTYPE = currRow.value.COMMISSIONTYPECDE;
        request.CHKEMPLOYEE = this._proposalDataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
        request.COMMISSIONCALCIND = this._proposalManager.CommissionCalcInd;
        request.BPINTRODUCERID = this._proposalDataService.PROPOSAL.value.BPINTRODUCERID;
        request.PRPLCMPTCNFG = this._proposalDataService.PRPLCMPTCNFG.value as Array<IPRPL_CMPT_CNFGInfo>;
        request.PROPOSALTEMPLATERENTALINT = this._proposalDataService.ProposalEntity.value.PROPOSALTEMPLATERENTALINT as IPRPL_TPLE_RNTL_INTInfo;

        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP1JP2RPNTTAX = new Array();
        })
        request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP2RECIPIENT.forEach(recepient => {
          recepient.PRPLJP2RPNTTAX = new Array();
        })

        this._proposalService.CalculateCommission(request).subscribe(res => {
          //this._formState.ResetFormArrayState(this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY, DataRowState.Removed);
          if (this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
            this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._entityFormService.PropsalCommissionForm());

          this._proposalManager.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, currRow.value.COMMISSIONTYPECDE);
          this.updateTableData();
        });
      }
    }
    currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
    if (+currRow.value.JP2SCHEMEPCT.toFixed(2) > 100) {
      currRow.controls.JP2SCHEMEPCT.setValue(0);
      currRow.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);
      currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
      this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
      this.updateTableData();
    }
    if (+(currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT).toFixed(2) > 100) {
      currRow.controls.JP2SCHEMEPCT.setValue(0);
      currRow.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);
      currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
      this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
      this.updateTableData();
    }

    if (+(currRow.value.JP1PCT + currRow.value.JP2PCT + currRow.value.JP2SCHEMEPCT).toFixed(2) > 100) {
      currRow.controls.JP2SCHEMEPCT.setValue(0);
      currRow.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);
      currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
      this._messageService.showMesssage("msgCommGreaterthan100", MessageType.Info);
      this.updateTableData();
    }
    currRow.controls.JP2PCT.setValue(+(100 - (currRow.value.JP1PCT + currRow.value.JP2SCHEMEPCT)).toFixed(2));
    currRow.controls.JP2COMMISSIONAMT.setValue(Math.round(((commissionAmnt * currRow.value.JP2PCT / 100) + Number.EPSILON) * 100) / 100)

    let request = new CommissionCalculationParam();
    request.PROPOSALARTICLE = this._proposalDataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
    request.COMMISSIONAMNT = commissionAmnt;
    request.COMMISSIONTYPE = currRow.value.COMMISSIONTYPECDE;
    request.CHKEMPLOYEE = this._proposalDataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
    request.COMMISSIONCALCIND = this._proposalManager.CommissionCalcInd;
    request.BPINTRODUCERID = this._proposalDataService.PROPOSAL.value.BPINTRODUCERID;

    request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.forEach(recepient => {
      recepient.PRPLJP1JP2RPNTTAX = new Array();
    })
    request.PROPOSALARTICLE.ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP2RECIPIENT.forEach(recepient => {
      recepient.PRPLJP2RPNTTAX = new Array();
    })

    this._proposalService.CalculateCommissionforScheme(request).subscribe(res => {
      if (this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
        this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._entityFormService.PropsalCommissionForm());
      this._proposalManager.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, currRow.value.COMMISSIONTYPECDE);
      this.updateTableData();
    });
  }

  updateTableData() {
    this.dataSource = new MatTableDataSource<IPRPL_COMM_SCHMInfo>();
    this._proposalDataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[this._proposalDataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length - 1].PRPLCOMMSCHM.map((c: any) => {
      c.COMMISSIONTYPENME = CommissionType.GetDescription(c.COMMISSIONTYPECDE);
      this.dataSource.data.push(c);
    });
  }

  onClickOk() {
    this.dialog.closeAll()
  }

}
