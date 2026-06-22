import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IPBLE_ACCT_CNFGInfo } from '@NFS_Entity/BusinessPartner-Entity/IPBLE_ACCT_CNFGInfo';
import { IAssetEntity, IJP1JP2RecipientEntity, IPRPL_COMM_SCHMInfo, IPRPL_JP1_JP2_RPNTInfo, IPRPL_JP1_JP2_RPNT_TAXInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { CommissionDivisionType } from '@NFS_Enums/CommissionDivisionType.enum';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { PayableTypeCode } from '@NFS_Enums/PayableTypeCode.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { ICalculationInfoParam } from '@NFS_Interfaces/RequestInterfaces/ICalculationInfoParam';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ResizeEvent } from 'angular-resizable-element';
import { JP1JP2CommissionTaxDetailComponent } from './jp1-jp2-commission-tax-detail/jp1-jp2-commission-tax-detail.component';

@Component({
    selector: 'app-commission-distribution',
    templateUrl: './commission-distribution.component.html',
    styleUrls: ['./commission-distribution.component.css'],
    standalone: false
})
export class CommissionDistributionComponent implements OnInit {

  @Output() OJKEventEmitter: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() AssetDetailsCommonEventEmitter: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  //JP1JP2RECIPIENT: FormArray<IJP1JP2RecipientEntity> = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT;
  //PRPLJP1JP2RPNT: FormGroup<IPRPL_JP1_JP2_RPNTInfo> = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls[0].controls.PRPLJP1JP2RPNT;
  JP1JP2Recipient: FormArray<IJP1JP2RecipientEntity> = this._fb.array<IJP1JP2RecipientEntity>([]);
  displayedColumns: string[] = ['ROLEDSC', 'RECIPIENTID', 'JP1COMMISSIONAMT', 'OPENJP1', 'JP1ACCBANKNME', 'JP1ACCNBR', 'JP2COMMISSIONAMT', 'OPENJP2', 'JP2ACCBANKNME', 'JP2ACCNBR'];

  jp1 = true;
  jp2 = true;
  scheme!: FormGroup<IPRPL_COMM_SCHMInfo>;
  schemeTemp = this._proposalFormService.PRPLCOMMSCHMForm();
  mask: string = "separator.2";
  dataSource = new MatTableDataSource<IPRPL_JP1_JP2_RPNTInfo>();
  public recepientsMasterData: any = [];
  isViewMode = false;
  cmbPreviousVal = 0;
  resizeResetGrid = true;

  constructor(private dialog: MatDialog, public _proposaldataService: ProposalDataService, private _proposalFormService: ProposalEntityFormService, public _genericService: GeneralService,
    private _proposalService: ProposalService, private _proposalMapperService: ProposalEntityMapperService, private _fb: FormBuilder,
    private _messageService: MessageService, private _FormState: StateManagment, public _formModeService: FormModeService) { }

  ngOnInit(): void {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isViewMode = true;
    }

    if (!this._genericService.IsMarketingCommission) {
      this.scheme = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMMSCHM.controls.find(
        p => p.controls.COMMISSIONTYPECDE.value == CommissionType.GetStringValue(CommissionType.SOFCommission)) as FormGroup<IPRPL_COMM_SCHMInfo>;
    }
    else {
      this.scheme = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMMSCHM.controls.find(
        p => p.controls.COMMISSIONTYPECDE.value == CommissionType.GetStringValue(CommissionType.MarketingCommission)) as FormGroup<IPRPL_COMM_SCHMInfo>;
    }
    this.initialization();
  }

  openJP1CommissionTaxDetail(element: any) {
    //this.initialization();
    this.schemeTemp.patchValue(this.scheme.value);
    this.schemeTemp.controls.COMMISSIONTYPECDE.setValue(CommissionType.GetDescription(this.scheme.value.COMMISSIONTYPECDE));

    let temp_values = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.PRPLJP1JP2RPNT.VISIBLEIND == true) as Array<IJP1JP2RecipientEntity>;
    this.JP1JP2Recipient = this._fb.array<IJP1JP2RecipientEntity>([]);
    temp_values.forEach(item => {
      this.JP1JP2Recipient.push(this._proposalMapperService.JP1JP2RECIPIENTMapper(this._proposalFormService.JP1JP2RecipientForm(), item));
    })

    let recepient = this.JP1JP2Recipient.controls.find(control => control.controls.PRPLJP1JP2RPNT.value.RECIPIENTID == element.RECIPIENTID && control.controls.PRPLJP1JP2RPNT.value.ROLECDE == element.ROLECDE) as FormGroup<IJP1JP2RecipientEntity>;
    const dialogRef = this.dialog.open(JP1JP2CommissionTaxDetailComponent, {
      width: '950px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "Recepient": recepient, 'DivisionType': CommissionDivisionType.JP1 },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
      }
    });
  }
  onResizeEnd(event: ResizeEvent, columnName: string): void {
    if (event.edges.right) {
      const cssValue = event.rectangle.width + 'px';
      const columnElts = document.getElementsByClassName(
        'mat-column-' + columnName
      );
      for (let i = 0; i < columnElts.length; i++) {
        const currentEl = columnElts[i] as HTMLDivElement;
        currentEl.style.width = cssValue;
      }
      console.log('Element was resized', event);
    }
  }
  getFilteredValue(val: any) {
    return this.recepientsMasterData[val.ROLECDE].filter((data: any) => {
      return data.TextValue.toLowerCase().includes(val.filterData.toLowerCase());
    }).sort((a: any, b: any) => a.TextValue.localeCompare(b.TextValue));
  }

  btnOK() {
    if (this._formModeService.FormMode != FormMode.VIEW) {
      if (this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.PRPLJP1JP2RPNT.RECIPIENTID <= 0).length > 0) {
        this._messageService.showMesssage("msgAllRecipientSelect", MessageType.Info);
      }
      else {
        if (this.jp2 == true) {
          if (this._genericService.IsMarketingCommission)
            this.OJKEvent();
          else
            this.AssetDetailsCommonEvent();
        }
        else {
          this.jp2 = false;
        }
      }
    }
    else {
      if (this._genericService.IsMarketingCommission)
        this.OJKEvent();
      else
        this.AssetDetailsCommonEvent();

    }
  }

  OJKEvent() {
    this.OJKEventEmitter.emit(false);
  }

  AssetDetailsCommonEvent() {
    this._genericService.FormMode = FormMode.EDIT;
    this.AssetDetailsCommonEventEmitter.emit(false);
  }
  openJP2CommissionTaxDetail(element: any) {
    //this.initialization()
    this.schemeTemp.patchValue(this.scheme.value);
    this.schemeTemp.controls.COMMISSIONTYPECDE.setValue(CommissionType.GetDescription(this.scheme.value.COMMISSIONTYPECDE));

    let temp_values = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.PRPLJP1JP2RPNT.VISIBLEIND == true) as Array<IJP1JP2RecipientEntity>;
    this.JP1JP2Recipient = this._fb.array<IJP1JP2RecipientEntity>([]);
    temp_values.forEach(item => {
      this.JP1JP2Recipient.push(this._proposalMapperService.JP1JP2RECIPIENTMapper(this._proposalFormService.JP1JP2RecipientForm(), item));
    })
    let recepient = this.JP1JP2Recipient.controls.find(control => control.controls.PRPLJP1JP2RPNT.value.RECIPIENTID == element.RECIPIENTID && control.controls.PRPLJP1JP2RPNT.value.ROLECDE == element.ROLECDE) as FormGroup<IJP1JP2RecipientEntity>;
    const dialogRef = this.dialog.open(JP1JP2CommissionTaxDetailComponent, {
      width: '950px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "Recepient": recepient, 'DivisionType': CommissionDivisionType.JP2 },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
      }
    });
  }

  initialization() {
    this.schemeTemp.patchValue(this.scheme.value);
    this.schemeTemp.controls.COMMISSIONTYPECDE.setValue(CommissionType.GetDescription(this.scheme.value.COMMISSIONTYPECDE));

    let temp_values = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.PRPLJP1JP2RPNT.VISIBLEIND == true) as Array<IJP1JP2RecipientEntity>;
    this.JP1JP2Recipient = this._fb.array<IJP1JP2RecipientEntity>([]);
    temp_values.forEach(item => {
      this.JP1JP2Recipient.push(this._proposalMapperService.JP1JP2RECIPIENTMapper(this._proposalFormService.JP1JP2RecipientForm(), item));
    })

    this.updateTableData();
  }

  public txtJP2CommAmnt_LostFocus(element: any) {
    // this.resizeResetGrid = false;
    element.JP2COMMISSIONAMT = Number(element.JP2COMMISSIONAMT);

    this.jp2 = true;

    let amt = element.JP2COMMISSIONAMT;

    let index = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.findIndex(control => control.value.PRPLJP1JP2RPNT.PROPOSALID == element.PROPOSALID && control.controls.PRPLJP1JP2RPNT.value.COMMISSIONTYPECDE == element.COMMISSIONTYPECDE && control.controls.PRPLJP1JP2RPNT.value.ROLECDE == element.ROLECDE && control.controls.PRPLJP1JP2RPNT.value.RECIPIENTID == element.RECIPIENTID) as number;

    let currRow = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls[index];
    currRow.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(element.JP2COMMISSIONAMT);
    //currRow.controls.RowState.setValue(DataRowState.Updated);
    if (currRow.controls.RowState.value !== DataRowState.Added) {
      currRow.controls.RowState.setValue(DataRowState.Updated);
      currRow.controls.PRPLJP1JP2RPNT.controls.RowState.setValue(DataRowState.Updated);
      currRow.controls.PRPLJP1JP2RPNTTAX.controls.forEach(tax => {
        if (tax.value.DIVISIONTYPECDE == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2) && tax.value.RowState != DataRowState.Removed && tax.value.RowState != DataRowState.Added) {
          tax.controls.RowState.setValue(DataRowState.Updated);
        }
      })
      //this._FormState.ResetFormState(currRow, DataRowState.Updated);
    }
    let sumCommExcDealer = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.PRPLJP1JP2RPNT.ROLECDE != RoleCode.Dealer).reduce(function (tot, record) {
      return tot + record.PRPLJP1JP2RPNT.JP2COMMISSIONAMT;
    }, 0)

    if (+sumCommExcDealer.toFixed(2) > Number(this.schemeTemp.value.JP2COMMISSIONAMT)) {
      //this.jp2 = false;
      this._messageService.showMesssage("msgJP2AmntGreater", MessageType.Info);

      currRow.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(0);
      element.JP2COMMISSIONAMT = 0;
      this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.RECIPIENTID == element.RECIPIENTID && p.controls.PRPLJP1JP2RPNT.value.ROLECDE == element.ROLECDE) ?.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(0);

      this.ResetCommissionByRoleAndRecipient(currRow.value.PRPLJP1JP2RPNT.ROLECDE, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2));
      this.JP2AmountDistribution(this.scheme.value.COMMISSIONTYPECDE);
      this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2), currRow.value.PRPLJP1JP2RPNT.JP2COMMISSIONAMT, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, currRow.value.PRPLJP1JP2RPNT.ROLECDE);
    }
    else {
      this.ResetCommissionByRoleAndRecipient(currRow.value.PRPLJP1JP2RPNT.ROLECDE, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2));
      this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2), amt, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, currRow.value.PRPLJP1JP2RPNT.ROLECDE);
      let roundedFinalAmount = Number(this.schemeTemp.value.JP2COMMISSIONAMT) - Number(sumCommExcDealer.toFixed(2));
      this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(+roundedFinalAmount.toFixed(2))// = Convert.ToDecimal(txtJP2CommissionAmount.Value) - sumCommExcDealer;
      if (this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.RowState.value != DataRowState.Removed && this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.RowState.value != DataRowState.Added)
        this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.RowState.setValue(DataRowState.Updated);
      this.JP2AmountDistribution(this.scheme.value.COMMISSIONTYPECDE);
    }

  }

  public txtJP1CommAmnt_LostFocus(element: any) {
    // this.resizeResetGrid = false;
    element.JP1COMMISSIONAMT = Number(element.JP1COMMISSIONAMT);

    this.jp2 = true;

    let amt = element.JP1COMMISSIONAMT;

    let index = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.findIndex(control => control.value.PRPLJP1JP2RPNT.PROPOSALID == element.PROPOSALID && control.controls.PRPLJP1JP2RPNT.value.COMMISSIONTYPECDE == element.COMMISSIONTYPECDE && control.controls.PRPLJP1JP2RPNT.value.ROLECDE == element.ROLECDE && control.controls.PRPLJP1JP2RPNT.value.RECIPIENTID == element.RECIPIENTID) as number;

    let currRow = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls[index];
    currRow.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(element.JP1COMMISSIONAMT);
    //currRow.controls.RowState.setValue(DataRowState.Updated);
    // if (currRow.controls.RowState.value !== DataRowState.Added) {
    //   currRow.controls.RowState.setValue(DataRowState.Updated);
    //   //this._FormState.ResetFormState(currRow, DataRowState.Updated);
    // }
    if (currRow.controls.RowState.value !== DataRowState.Added) {
      currRow.controls.RowState.setValue(DataRowState.Updated);
      currRow.controls.PRPLJP1JP2RPNT.controls.RowState.setValue(DataRowState.Updated);
      currRow.controls.PRPLJP1JP2RPNTTAX.controls.forEach(tax => {
        if (tax.value.DIVISIONTYPECDE == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1) && tax.value.RowState != DataRowState.Removed && tax.value.RowState != DataRowState.Added) {
          tax.controls.RowState.setValue(DataRowState.Updated);
        }
      })
      //this._FormState.ResetFormState(currRow, DataRowState.Updated);
    }
    let sumCommExcDealer = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.PRPLJP1JP2RPNT.ROLECDE != RoleCode.Dealer).reduce(function (tot, record) {
      return tot + record.PRPLJP1JP2RPNT.JP1COMMISSIONAMT;
    }, 0)

    if (+sumCommExcDealer.toFixed(2) > Number(this.schemeTemp.value.JP1COMMISSIONAMT)) {
      this.jp1 = false;
      this._messageService.showMesssage("msgJP1AmntGreater", MessageType.Info);

      currRow.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(0);
      element.JP2COMMISSIONAMT = 0;
      this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.RECIPIENTID == element.RECIPIENTID && p.controls.PRPLJP1JP2RPNT.value.ROLECDE == element.ROLECDE) ?.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(0);

      this.ResetCommissionByRoleAndRecipient(currRow.value.PRPLJP1JP2RPNT.ROLECDE, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1));
      this.JP1AmountDistribution(this.scheme.value.COMMISSIONTYPECDE);
      this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1), currRow.value.PRPLJP1JP2RPNT.JP1COMMISSIONAMT, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, currRow.value.PRPLJP1JP2RPNT.ROLECDE);
    }
    else {
      this.ResetCommissionByRoleAndRecipient(currRow.value.PRPLJP1JP2RPNT.ROLECDE, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1));
      this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1), currRow.value.PRPLJP1JP2RPNT.JP1COMMISSIONAMT, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, currRow.value.PRPLJP1JP2RPNT.ROLECDE);
      let roundedFinalAmount = Number(this.schemeTemp.value.JP1COMMISSIONAMT) - Number(sumCommExcDealer.toFixed(2));
      this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(+roundedFinalAmount.toFixed(2))// = Convert.ToDecimal(txtJP2CommissionAmount.Value) - sumCommExcDealer;
      if (this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.RowState.value != DataRowState.Removed && this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.RowState.value != DataRowState.Added)
        this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.RowState.setValue(DataRowState.Updated);
      this.JP1AmountDistribution(this.scheme.value.COMMISSIONTYPECDE);
    }

  }

  public ResetCommissionByRoleAndRecipient(rolecode: string, recipientid: number, commissiontype: string, divisiontypecode: string) {

    let abc = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == '00001' && p.PRPLJP1JP2RPNT.RECIPIENTID == this.cmbPreviousVal && p.PRPLJP1JP2RPNT.ROLECDE == rolecode);

    this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.forEach(recepient => {
      if (recepient.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == commissiontype && recepient.value.PRPLJP1JP2RPNT.RECIPIENTID == recipientid && recepient.value.PRPLJP1JP2RPNT.ROLECDE == rolecode) {
        recepient.controls.PRPLJP1JP2RPNTTAX.controls.forEach((tax: any, index) => {
          if (tax.value.DIVISIONTYPECDE == divisiontypecode) {
            if (tax.value.RowState != DataRowState.Added)
              tax.controls.RowState.setValue(DataRowState.Removed);
            else
              recepient.controls.PRPLJP1JP2RPNTTAX.removeAt(index);
          }
        });
      }
    })
    return true;
  }

  private JP2AmountDistribution(CommissionType: string) {
    let TotalCommissionAmt = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE != RoleCode.Dealer).reduce(function (tot, record) {
      return tot + record.PRPLJP1JP2RPNT.JP2COMMISSIONAMT;
    }, 0)//.Sum(p => p.PRPLJP1JP2RPNT.JP2COMMISSIONAMT);
    let roundedFinalAmount = Number(this.schemeTemp.value.JP2COMMISSIONAMT) - Number(TotalCommissionAmt.toFixed(2));
    this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(+roundedFinalAmount.toFixed(2));// = JP2CommAmnt - TotalCommissionAmt;

    let amt = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer)[0].PRPLJP1JP2RPNT.JP2COMMISSIONAMT;
    let recipientid = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer)[0].PRPLJP1JP2RPNT.RECIPIENTID;
    let rolecde = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer)[0].PRPLJP1JP2RPNT.ROLECDE;
    this.ResetCommissionByRoleAndRecipient(rolecde, recipientid, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2));
    this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2), amt, recipientid, rolecde);
    return true;
  }

  private JP1AmountDistribution(CommissionType: string) {
    let TotalCommissionAmt = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE != RoleCode.Dealer).reduce(function (tot, record) {
      return tot + record.PRPLJP1JP2RPNT.JP1COMMISSIONAMT;
    }, 0)//.Sum(p => p.PRPLJP1JP2RPNT.JP2COMMISSIONAMT);
    let roundedFinalAmount = Number(this.schemeTemp.value.JP1COMMISSIONAMT) - Number(TotalCommissionAmt.toFixed(2));
    this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer) ?.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(+roundedFinalAmount.toFixed(2));// = JP2CommAmnt - TotalCommissionAmt;

    let amt = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer)[0].PRPLJP1JP2RPNT.JP1COMMISSIONAMT;
    let recipientid = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer)[0].PRPLJP1JP2RPNT.RECIPIENTID;
    let rolecde = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType && p.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer)[0].PRPLJP1JP2RPNT.ROLECDE;
    this.ResetCommissionByRoleAndRecipient(rolecde, recipientid, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1));
    this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1), amt, recipientid, rolecde);
    return true;
  }

  public JP1JP2CommissionTaxByRecipient(commissiontype: string, divisiontype: string, chargeamount: number, recipientid: number, rolecde: string, oldbusinesspartnerid: number = 0) {
    try {

      let params = {} as ICalculationInfoParam;

      params.COMMISSIONTYP = commissiontype;
      params.DIVISIONTYP = divisiontype;
      params.ChargeAmount = chargeamount;
      params.RECEPIENTID = recipientid;
      params.ROLECDE = rolecde;
      params.BPINTRODUCERID = this._proposaldataService.PROPOSAL.value.BPINTRODUCERID;
      params.FINANCETYP = this._proposaldataService.PROPOSAL.value.FINANCETYP;
      params.CONTRACTSTARTDTE = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTSTARTDTE;
      this.resizeResetGrid = false;
      this._proposalService.CalculateTaxByRecipients(params).subscribe(res => {
        this.ExtractCommissionTaxesByRecipient(res.ResultSet, this._proposaldataService.ASSETENTITY, commissiontype, divisiontype, recipientid, rolecde, oldbusinesspartnerid);
        this.updateTableData();
      })
      return true;

    }
    catch (Exception) {
      return false;
    }
  }

  public ExtractCommissionTaxesByRecipient(result: any, assetEntity: FormGroup<IAssetEntity>, commissionType: string, divisiontype: string, recipientid: number, rolecde: string, oldbusinesspartner: number = 0, RemoveOldTaxes: boolean = true) {
    if (RemoveOldTaxes) {
      this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.forEach(p => {
        for (var j = p.value.PRPLJP1JP2RPNTTAX.length - 1; j >= 0; j--) {
          if (p.value.PRPLJP1JP2RPNTTAX[j].COMMISSIONTYPECDE == commissionType && p.value.PRPLJP1JP2RPNTTAX[j].BUSINESSPARTNERID == recipientid && p.value.PRPLJP1JP2RPNT.ROLECDE == rolecde && p.value.PRPLJP1JP2RPNTTAX[j].DIVISIONTYPECDE == divisiontype) {
            if (p.controls.PRPLJP1JP2RPNTTAX.value[j].RowState == DataRowState.Added)
              p.controls.PRPLJP1JP2RPNTTAX.removeAt(j);
            else
              p.controls.PRPLJP1JP2RPNTTAX.controls[j].controls.RowState.setValue(DataRowState.Removed);
          }
          if (oldbusinesspartner > 0) {
            if (p.value.PRPLJP1JP2RPNTTAX.length > 0 && p.value.PRPLJP1JP2RPNTTAX[j].COMMISSIONTYPECDE == commissionType && p.value.PRPLJP1JP2RPNTTAX[j].BUSINESSPARTNERID == oldbusinesspartner && p.value.PRPLJP1JP2RPNT.ROLECDE == rolecde && p.value.PRPLJP1JP2RPNTTAX[j].DIVISIONTYPECDE == divisiontype) {
              if (p.controls.PRPLJP1JP2RPNTTAX.value[j].RowState == DataRowState.Added)
                p.controls.PRPLJP1JP2RPNTTAX.removeAt(j);
              else
                p.controls.PRPLJP1JP2RPNTTAX.controls[j].controls.RowState.setValue(DataRowState.Removed);
            }
          }
        }
      });
    }

    // Populating Component wise Tax
    if (result != null) {
      result.forEach((tax: any) => {
        // Populating Charges Taxes

        if (tax.AmountComponentCode == AmountComponent.GetStringValue(AmountComponent.ChargePayable)) {
          if (tax.ChargePayableComponentCollection != null && tax.ChargePayableComponentCollection.length > 0 && assetEntity.value.PROPOSALCOMMISSIONENTITY != null && assetEntity.value.PROPOSALCOMMISSIONENTITY.length > 0) {
            tax.ChargePayableComponentCollection.forEach((s: any) => {
              if (s.DivisionTypeCode == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1) || s.DivisionTypeCode == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) {
                //let ent = assetEntity.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.find(p => p.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == commissionType) as FormGroup<IJP1JP2RecipientEntity>;
                this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.forEach((ent, i) => {
                  if (ent.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == commissionType) {

                    if (ent.value.PRPLJP1JP2RPNT.RECIPIENTID == s.RecipientBPId && ent.value.PRPLJP1JP2RPNT.ROLECDE == s.RoleCode) {

                      if (s.DivisionTypeCode == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) {
                        ent.controls.JP2TAXINCULSIVEAMT.setValue(s.TaxInclusiveAmount);
                        ent.controls.JP2TAXEXCULSIVEAMT.setValue(s.TaxExclusiveAmount);
                        ent.controls.PRPLJP1JP2RPNT.controls.JP2TAXEXCLUSIVEAMT.setValue(s.TaxExclusiveAmount);
                        ent.controls.PRPLJP1JP2RPNT.controls.JP2TAXINCLUSIVEAMT.setValue(s.TaxInclusiveAmount);
                      }

                      if (s.DivisionTypeCode == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1)) {
                        ent.controls.JP1TAXINCULSIVEAMT.setValue(s.TaxInclusiveAmount);
                        ent.controls.JP1TAXEXCULSIVEAMT.setValue(s.TaxExclusiveAmount);
                        ent.controls.PRPLJP1JP2RPNT.controls.JP1TAXINCLUSIVEAMT.setValue(s.TaxInclusiveAmount);
                        ent.controls.PRPLJP1JP2RPNT.controls.JP1TAXEXCLUSIVEAMT.setValue(s.TaxExclusiveAmount);
                      }

                      let proposalTax = {} as IPRPL_JP1_JP2_RPNT_TAXInfo
                      proposalTax.COMMISSIONTYPECDE = this.scheme.value.COMMISSIONTYPECDE
                      proposalTax.BUSINESSPARTNERID = s.RecipientBPId;
                      proposalTax.DIVISIONTYPECDE = s.DivisionTypeCode;
                      proposalTax.RECIPIENTNME = ent.value.PRPLJP1JP2RPNT.RECIPIENTNME;
                      proposalTax.BASEAMOUNT = s.BaseAmount;
                      proposalTax.TAXAMT = s.TaxAmount;
                      proposalTax.TAXAMTPCT = 0;
                      proposalTax.TAXAPBLTYPECDE = s.TaxIncExcType;
                      proposalTax.TAXRATE = s.TaxRate;
                      proposalTax.TAXTYPECDE = s.TaxTypeCode;
                      proposalTax.TAXTYPEDSC = TaxType.GetDescription(proposalTax.TAXTYPECDE);
                      proposalTax.ISAMNTCMPTITC = s.IsAmountComponentITC;
                      proposalTax.ITCAMT = s.ITCTaxAmount;
                      proposalTax.ISWHTDEDUCTED = s.WHTDeducted;
                      proposalTax.RowState = DataRowState.Added;
                      //if (proposalTax.TAXAMT>0)
                      let group = this._proposalFormService.PRPLJP1JP2RPNTTAXForm();
                      group.patchValue(proposalTax)
                      ent.controls.PRPLJP1JP2RPNTTAX.push(group);
                    }

                  }
                })

              }
            });

          }
        }
      });
    }

  }

  updateTableData() {
    this.resizeResetGrid = false;
    this.dataSource = new MatTableDataSource<IPRPL_JP1_JP2_RPNTInfo>();
    this.JP1JP2Recipient.clear();
    this.recepientsMasterData = new Array();
    let temp_values = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.filter(p => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == this.scheme.value.COMMISSIONTYPECDE && p.PRPLJP1JP2RPNT.VISIBLEIND == true) as Array<IJP1JP2RecipientEntity>;
    temp_values.forEach(item => {
      item.PRPLJP1JP2RPNT.PreviousBPId = item.PRPLJP1JP2RPNT.RECIPIENTID;
      this.JP1JP2Recipient.push(this._proposalMapperService.JP1JP2RECIPIENTMapper(this._proposalFormService.JP1JP2RecipientForm(), item));
    })

    this.JP1JP2Recipient.value.map((c: any) => {
      this.dataSource.data.push(c.PRPLJP1JP2RPNT);

      let tempArray = this.recepientsMasterData[c.PRPLJP1JP2RPNT.ROLECDE] as Array<any>;
      if (tempArray == undefined)
        tempArray = new Array();
      //let rcpt = tempArray?.find(x => x.PRPLJP1JP2RPNT?.RECIPIENTID == c.PRPLJP1JP2RPNT.RECIPIENTID);
      // if(rcpt == undefined || rcpt == null){
      //   tempArray.push({code: c.PRPLJP1JP2RPNT.RECIPIENTID, TextValue: c.PRPLJP1JP2RPNT.RECIPIENTNME, Role: c.PRPLJP1JP2RPNT.ROLECDE});
      // }
      if (c.PRPLJP1JP2ROLERPNT ?.length > 0) {
        c.PRPLJP1JP2ROLERPNT.forEach((r: any) => {
          let temp = tempArray.find(x => x ?.code == r.RECIPIENTID);
          if (temp == null || temp == undefined)
            tempArray.push({ code: r.RECIPIENTID, TextValue: r.DESCRIPTION, Role: r.ROLECDE });
        })
      }
      else {
        tempArray.push({ code: c.PRPLJP1JP2RPNT.RECIPIENTID, TextValue: c.PRPLJP1JP2RPNT.RECIPIENTNME, Role: c.PRPLJP1JP2RPNT.ROLECDE });
      }


      this.recepientsMasterData[c.PRPLJP1JP2RPNT.ROLECDE] = tempArray;
    });
    this.resizeResetGrid = true;
  }

  recepientOnChange(val: any, index: any, element: any) {

    // this.resizeResetGrid = false;
    let currRow = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.filter(x => x.value.PRPLJP1JP2RPNT.RECIPIENTID == element.PreviousBPId && x.value.PRPLJP1JP2RPNT.ROLECDE == element.ROLECDE && x.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == element.COMMISSIONTYPECDE)[0];
    this.cmbPreviousVal = currRow.controls.PRPLJP1JP2RPNT.controls.RECIPIENTID.value;
    let temp_value = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.filter(x => x.value.PRPLJP1JP2RPNT.RECIPIENTID == val && x.value.PRPLJP1JP2RPNT.ROLECDE == element.ROLECDE && x.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == element.COMMISSIONTYPECDE);

    if (temp_value.length > 0) {
      this._messageService.showMesssage("msgDuplicateRecipient", MessageType.Info);
      this.resizeResetGrid = false;
      this._proposalService.dummyAPi().subscribe((resp: any) => {
        this.updateTableData();
      })
      return;
    }


    currRow.controls.PRPLJP1JP2RPNT.controls.RECIPIENTID.setValue(val);
    currRow.controls.PRPLJP1JP2RPNT.controls.PreviousBPId.setValue(currRow.controls.PRPLJP1JP2RPNT.controls.RECIPIENTID.value);
    if (currRow.value.PRPLJP1JP2ROLERPNT.find(x => x.RECIPIENTID == val) ?.RECIPIENTDSC) {
      currRow.controls.PRPLJP1JP2RPNT.controls.RECIPIENTNME.setValue(currRow.value.PRPLJP1JP2ROLERPNT.find(x => x.RECIPIENTID == val) ?.RECIPIENTDSC || '');
    }
    if (currRow.value.PRPLJP1JP2RPNT.RowState != DataRowState.Added)
      currRow.controls.PRPLJP1JP2RPNT.controls.RowState.setValue(DataRowState.Updated);

    //let bankCollection = await GetAccountByRecipienID(val);

    let param = {} as IBusinessPartnerInfoParm;
    param.BusinessPartnerId = val;
    this.resizeResetGrid = false;
    this._proposalService.GetAccountByRecipientID(param).subscribe(resp => {

      let bankCollection = resp.ResultSet;
      let jp1entity = this.GetAccountInfo(bankCollection, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1)) as IPBLE_ACCT_CNFGInfo;
      let jp2entity = this.GetAccountInfo(bankCollection, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) as IPBLE_ACCT_CNFGInfo;

      if (jp1entity != null) {
        currRow.controls.PRPLJP1JP2RPNT.controls.JP1ACCBANKID.setValue(jp1entity.BANKBPID);
        currRow.controls.PRPLJP1JP2RPNT.controls.JP1ACCBANKNME.setValue(jp1entity.BANKNME);
        currRow.controls.PRPLJP1JP2RPNT.controls.JP1ACCNBR.setValue(jp1entity.ACCOUNTNBR);
      }
      else {
        currRow.controls.PRPLJP1JP2RPNT.controls.JP1ACCBANKID.setValue(0);
        currRow.controls.PRPLJP1JP2RPNT.controls.JP1ACCBANKNME.setValue("");
        currRow.controls.PRPLJP1JP2RPNT.controls.JP1ACCNBR.setValue("");
      }
      if (jp2entity != null) {
        currRow.controls.PRPLJP1JP2RPNT.controls.JP2ACCBANKID.setValue(jp2entity.BANKBPID);
        currRow.controls.PRPLJP1JP2RPNT.controls.JP2ACCBANKNME.setValue(jp2entity.BANKNME);
        currRow.controls.PRPLJP1JP2RPNT.controls.JP2ACCNBR.setValue(jp2entity.ACCOUNTNBR);
      }
      else {
        currRow.controls.PRPLJP1JP2RPNT.controls.JP2ACCBANKID.setValue(0);
        currRow.controls.PRPLJP1JP2RPNT.controls.JP2ACCBANKNME.setValue("");
        currRow.controls.PRPLJP1JP2RPNT.controls.JP2ACCNBR.setValue("");
      }

      /// SOCD-17238
      if (bankCollection != null && bankCollection.Count > 0)
        currRow.controls.PRPLJP1JP2RPNT.controls.ISVATAPPLICABLE.setValue(bankCollection[0].ISVATREGISTER);



      this.updateTableData()
    });

    this.ResetCommissionByRoleAndRecipient(currRow.value.PRPLJP1JP2RPNT.ROLECDE, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1));
    this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1), currRow.value.PRPLJP1JP2RPNT.JP1COMMISSIONAMT, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, currRow.value.PRPLJP1JP2RPNT.ROLECDE, this.cmbPreviousVal);
    this.ResetCommissionByRoleAndRecipient(currRow.value.PRPLJP1JP2RPNT.ROLECDE, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2));
    this.JP1JP2CommissionTaxByRecipient(this.scheme.value.COMMISSIONTYPECDE, CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2), currRow.value.PRPLJP1JP2RPNT.JP2COMMISSIONAMT, currRow.value.PRPLJP1JP2RPNT.RECIPIENTID, currRow.value.PRPLJP1JP2RPNT.ROLECDE, this.cmbPreviousVal);
    //});

  }

  public GetAccountInfo(collection: Array<IPBLE_ACCT_CNFGInfo>, commType: string, division: string): IPBLE_ACCT_CNFGInfo | null {
    let entity = {} as IPBLE_ACCT_CNFGInfo;

    if (collection == null || collection.length <= 0) return null;

    if (commType == CommissionType.GetStringValue(CommissionType.AdminFeeCommission)) {
      if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.AdminFeeCommissionJP1)) as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.AdminFeeCommissionJP2)) as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2Scheme)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.AdminFeeCommissionJP2Scheme)) as IPBLE_ACCT_CNFGInfo;
      }
    }
    else if (commType == CommissionType.GetStringValue(CommissionType.InsuranceCommission)) {
      if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.InsuranceCommissionJP1)) as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.InsuranceCommissionJP2)) as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2Scheme)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.InsuranceCommissionJP2Scheme)) as IPBLE_ACCT_CNFGInfo;
      }
    }
    else if (commType == CommissionType.GetStringValue(CommissionType.MarketingCommission)) {
      if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1)) {
        entity = collection.find(p => p.PAYABLETYPECDE == '00044') as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) {
        entity = collection.find(p => p.PAYABLETYPECDE == '00048') as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2Scheme)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.MarketingCommissionJP2Scheme)) as IPBLE_ACCT_CNFGInfo;
      }
    }
    else if (commType == CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission)) {
      if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.ProvisionFeeCommissionJP1)) as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.ProvisionFeeCommissionJP2)) as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2Scheme)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.ProvisionFeeCommissionJP2Scheme)) as IPBLE_ACCT_CNFGInfo;
      }
    }
    /// While selecting recipient for JP1-JP2 Commission, System was not getting Bank Info in case of SOF Commission
    else if (commType == CommissionType.GetStringValue(CommissionType.SOFCommission)) {
      if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.SOFJP1Commission)) as IPBLE_ACCT_CNFGInfo;
      }
      else if (division == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2)) {
        entity = collection.find(p => p.PAYABLETYPECDE == PayableTypeCode.GetStringValue(PayableTypeCode.SOFJP2Commission)) as IPBLE_ACCT_CNFGInfo;
      }
    }

    return entity;
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
