import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPL_CSFL_DETLInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_CSFL_DETLInfo.model';
import { CashflowType } from '@NFS_Enums/CashflowType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-assetLiability',
    templateUrl: './assetLiability.component.html',
    standalone: false
})
export class assetLiabilityComponent implements OnInit, OnDestroy {
  @Input() ApplicantAssetLiability !: FormArray<IPRPL_CSFL_DETLInfo>;
  @Input() ComponentName!: string;
  public AssetColumns = ['CSFLDSC', 'Value'];
  public AssetLabel = ['Asset Description', 'Value'];
  public LiabiltyColumns = ['CSFLDSC', 'Value'];
  public LiabiltyLabel = ['Liabilty Description', 'Value'];
  private subscription$ = new Subject();
  assetDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
  liabitityDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
  newAsset: any;
  newLiabilty: any;
  isControlDisable = false;
  Pipes = ['formatCurrency'];
  mask: string = "separator.2";

  constructor(private _ProposalService : ProposalService, public _masterDataService: MasterDataService, private _proposaldataService: ProposalDataService, private fb: FormBuilder
    ,private _ProposalForm: ProposalEntityFormService, private _formModeService: FormModeService) { }

  ngOnInit(): void {

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    if (this.ApplicantAssetLiability.length == 0) {
      this._ProposalService.ReadCashFlowIdentifier({}).pipe(takeUntil(this.subscription$))
      .subscribe(response => {
        this._masterDataService.CashFlowIdentifier = response.ResultSet;
        this._masterDataService.CashFlowIdentifier.forEach((element: any) => {
            let tempAssetLiablityItem: FormGroup<IPRPL_CSFL_DETLInfo> = this._ProposalForm.proposalCSFDetailInfoForm();

            tempAssetLiablityItem.controls.CSFLITEMCDE.setValue(element.CSFLITEMCDE);
            tempAssetLiablityItem.controls.CSFLITEMVALUE.setValue(element.Value);
            tempAssetLiablityItem.controls.EXECUTIONDTE.setValue(element.EXECUTIONDTE);
            tempAssetLiablityItem.controls.EXECUTIONOFFSET.setValue(element.EXECUTIONOFFSET);
            tempAssetLiablityItem.controls.SESSIONID.setValue(element.SESSIONID);
            tempAssetLiablityItem.controls.SESSIONCDE.setValue(element.SESSIONCDE);
            tempAssetLiablityItem.controls.RATOGRUPCODE.setValue(element.RATOGRUPCDE);
            tempAssetLiablityItem.controls.CSFLTYP.setValue(element.CSFLTYP);
            tempAssetLiablityItem.controls.RECORDYEAR1.setValue(element.Year1);
            tempAssetLiablityItem.controls.IDENTIFIER.setValue(element.IDENTIFIER);
            tempAssetLiablityItem.controls.RELIABLEIND.setValue(element.ISAUDITABLE);
            tempAssetLiablityItem.controls.RECORDYEAR2.setValue(element.Year2);
            tempAssetLiablityItem.controls.RECORDYEAR3.setValue(element.Year3);
            tempAssetLiablityItem.controls.CSFLDSC.setValue(element.CSFLDSC);
            tempAssetLiablityItem.controls.CSFLPRIORITY.setValue(element.PRIORITY);

            this.ApplicantAssetLiability.push(tempAssetLiablityItem);
            this.updateTableData();
      });
    })
  }
    else{
      this.updateTableData();
    }
  }

  childOutput(event:any){

  }

  DefaultSelectionChange(event:any){

  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  updateTableData(){
    this.assetDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
    this.liabitityDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();

    this.ApplicantAssetLiability.value.map((c: any) => {
      if (c.CSFLTYP == CashflowType.Asset) {
        this.assetDataSource.data.push(c);
      }
      if (c.CSFLTYP == CashflowType.Liability) {
        this.liabitityDataSource.data.push(c);
      }

      if (c.CSFLITEMVALUE == undefined) {
        c.CSFLITEMVALUE = "0.00"
      }

    });

    this.calculateAssetSum();
    this.calculateLiabilitiesSum();
    this.calculateQuote();
  }

  totalAsset = 0.00;
  totalLiabiliies = 0.00;

  onAssetUpdate(evnt: Event, element: any, index: any, dtId: any) {
    if (element.CSFLITEMVALUE == '') {
      element.CSFLITEMVALUE = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateAssetSum();
      this.calculateQuote();
    }
    else {
      let templength = parseInt(element.CSFLITEMVALUE)
      let templenString = templength.toString();
      let length = templenString.length;
      if (length <= 13) {
        let tempId = parseInt(dtId) - 1;
        if (element.RowState != DataRowState.Added) {
          element.RowState = DataRowState.Updated;
        }
        this.ApplicantAssetLiability.controls[tempId].patchValue(element);
        this.calculateAssetSum();
        this.calculateQuote();
      }
      else {
        this.calculateAssetSum();
        this.calculateQuote();
      }
    }
  }

  onLiablityUpdate(evnt: Event, element: any, index: any, dtId: any) {
    if (element.CSFLITEMVALUE == '') {
      element.CSFLITEMVALUE = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateLiabilitiesSum();
      this.calculateQuote();
    }
    else {
      let templength = parseInt(element.CSFLITEMVALUE)
      let templenString = templength.toString();
      let length = templenString.length;
      if (length <= 13) {
        let tempId = parseInt(dtId) - 1;
        if (element.RowState != DataRowState.Added) {
          element.RowState = DataRowState.Updated;
        }
        this.ApplicantAssetLiability.controls[tempId].patchValue(element);
        this.calculateLiabilitiesSum();
        this.calculateQuote();
      }
      else {
        this.calculateLiabilitiesSum();
        this.calculateQuote();
      }
    }
  }

  calculateAssetSum() {
    let tempSum = 0.00;

    for (let ele of this.assetDataSource.data) {
      if (ele.CSFLITEMVALUE != undefined) {
        let tempLen = ((Math.floor(ele.CSFLITEMVALUE)).toString()).length;
        if (tempLen <= 13) {
          tempSum += parseFloat(String(ele.CSFLITEMVALUE));
        }
      }
    }
    this.totalAsset = tempSum;
  }

  calculateLiabilitiesSum() {
    let tempSum = 0.00;
    for (let ele of this.liabitityDataSource.data) {
      if (ele.CSFLITEMVALUE != undefined) {
        let tempLen = ((Math.floor(ele.CSFLITEMVALUE)).toString()).length;
        if (tempLen <= 13) {
          tempSum += parseFloat(String(ele.CSFLITEMVALUE));
        }
      }
    }
    this.totalLiabiliies = tempSum;
  }


  comment = "";
  AssetLiabilityDiff = 0.00;


  calculateQuote() {

    let tempAsset = parseFloat(String(this.totalAsset));
    let tempLiabilities = parseFloat(String(this.totalLiabiliies));
    let tempDifference = 0.00;

    if(tempAsset > tempLiabilities) {
      this.comment = "SurPlus";
      tempDifference = tempAsset - tempLiabilities;
      this.AssetLiabilityDiff = tempDifference;
    }
    else if(tempAsset < tempLiabilities){
        this.comment = "Deficit";
        tempDifference = tempLiabilities - tempAsset;
        this.AssetLiabilityDiff = tempDifference;
    }
    else{
      this.comment = "";
      this.AssetLiabilityDiff = 0.00
    }
  }

  checkLength(val: any) {
    let temp = parseInt(val).toString();
    if(temp.length <= 13){
      return false
    }
    else{
      return true
    }
  }

}
