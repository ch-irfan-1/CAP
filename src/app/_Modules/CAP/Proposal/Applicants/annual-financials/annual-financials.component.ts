import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { CSFL_ITEM_CODEInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ICSFL_ITEM_CODEInfo.model';
import { IPRPL_CSFL_DETLInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_CSFL_DETLInfo.model';
import { CashflowType } from '@NFS_Enums/CashflowType.enum';
import { ComponentName } from '@NFS_Enums/ComponentName.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-annual-financials',
    templateUrl: './annual-financials.component.html',
    styleUrls: ['./annual-financials.component.css'],
    standalone: false
})

export class AnnualFinancialsComponent implements OnInit, OnDestroy {
  @Input() AnnualFinancials!: FormArray<IPRPL_CSFL_DETLInfo>;
  @Input() ComponentName: string = '';

  private subscription$ = new Subject();

  public BalanceSheetLabel = ['Account', 'Year1', 'Year2', 'Year3'];
  public ProfitnLossLabel = ['Account', 'Year1', 'Year2', 'Year3'];

  public CashFlowFilterTab: FormArray<CSFL_ITEM_CODEInfo> = this.fb.array<CSFL_ITEM_CODEInfo>([]);
  public CashFlowFilterLabel = ['Account', 'Year1', 'Year2', 'Year3'];

  BalanceSheet = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
  ProfitnLoss = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
  isControlDisable = false;
  mask: string = "separator.2";

  constructor(private _ProposalService: ProposalService, public _masterDataService: MasterDataService, private fb: FormBuilder
    , private _ProposalForm: ProposalEntityFormService, private _formModeService: FormModeService) { }

  ngOnInit(): void {

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }

    if (this.AnnualFinancials.length == 0 && this.ComponentName != ComponentName.CoBorrowerCompany && this.ComponentName != ComponentName.GuarantorCompany) {
      this._ProposalService.ReadCashFlowIdentifier({}).pipe(takeUntil(this.subscription$))
        .subscribe(response => {
          this._masterDataService.CashFlowIdentifier = response.ResultSet;
          this._masterDataService.CashFlowIdentifier.forEach((element: any) => {
            let tempAssetLiablityItem: FormGroup<IPRPL_CSFL_DETLInfo> = this._ProposalForm.proposalCSFDetailInfoForm();

            tempAssetLiablityItem.controls.CSFLITEMCDE.setValue(element.CSFLITEMCDE);
            tempAssetLiablityItem.controls.CSFLITEMVALUE.setValue(element.Value);
            tempAssetLiablityItem.controls.CSFLITEMVALUE1.setValue(element.Value);
            tempAssetLiablityItem.controls.CSFLITEMVALUE2.setValue(element.Value);
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
            this.AnnualFinancials.push(tempAssetLiablityItem);
            this.updateTableData();

          });
        })
    }
    else {
      this.updateTableData();
    }

    if (this.AnnualFinancials.controls[0].controls.RECORDYEAR1.value != undefined) {
      this.inputYear1 = this.AnnualFinancials.controls[0].controls.RECORDYEAR1.value;
      this.inputYear2 = this.AnnualFinancials.controls[0].controls.RECORDYEAR2.value;
      this.inputYear3 = this.AnnualFinancials.controls[0].controls.RECORDYEAR3.value;
    }
  }

  updateTableData() {
    this.BalanceSheet = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
    this.ProfitnLoss = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
    this.AnnualFinancials.value.map((c: any) => {

      if (c.CSFLTYP == CashflowType.Asset || c.CSFLTYP == CashflowType.Liability) {
        this.BalanceSheet.data.push(c);
      }

      if (c.CSFLTYP == CashflowType.Income || c.CSFLTYP == CashflowType.Expense) {
        this.ProfitnLoss.data.push(c);
      }

      if (c.CSFLITEMVALUE == undefined && c.CSFLITEMVALUE1 == undefined && c.CSFLITEMVALUE2 == undefined) {
        if (c.CSFLTYP == CashflowType.Asset || c.CSFLTYP == CashflowType.Liability || c.CSFLTYP == CashflowType.Income || c.CSFLTYP == CashflowType.Expense) {
          c.CSFLITEMVALUE = "0.00";
          c.CSFLITEMVALUE1 = "0.00";
          c.CSFLITEMVALUE2 = "0.00";
        }
      }
    });
    this.calculateBalanceSheetSum();
    this.calculateProfitnLossSum();
  }


  onBalanceSheetUpdate(evnt: Event, element: any, index: any, dtId: any) {
    if (element.CSFLITEMVALUE == '') {
      element.CSFLITEMVALUE = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateBalanceSheetSum();
    }
    else if (element.CSFLITEMVALUE1 == '') {
      element.CSFLITEMVALUE1 = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateBalanceSheetSum();
    }
    else if (element.CSFLITEMVALUE2 == '') {
      element.CSFLITEMVALUE2 = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateBalanceSheetSum();
    }
    else {
      let templength = parseInt(element.CSFLITEMVALUE)
      let templenString = templength.toString();
      let length = templenString.length;

      let templength1 = parseInt(element.CSFLITEMVALUE1)
      let templenString1 = templength1.toString();
      let length1 = templenString1.length;

      let templength2 = parseInt(element.CSFLITEMVALUE2)
      let templenString2 = templength2.toString();
      let length2 = templenString2.length;


      if (length <= 13 && length1 <= 13 && length2 <= 13) {
        let tempId = parseInt(dtId) - 1;
        if (element.RowState != DataRowState.Added) {
          element.RowState = DataRowState.Updated;
        }
        this.AnnualFinancials.controls[tempId].patchValue(element);
        this.calculateBalanceSheetSum();
      }
      if (length > 13 || length1 > 13 || length2 > 13) {
        this.TotalNetBalanceYear1 = 0.00;
        this.TotalNetBalanceYear2 = 0.00;
        this.TotalNetBalanceYear3 = 0.00;
        this.calculateBalanceSheetSum();
      }
    }
  }

  TotalNetBalanceYear1 = 0;
  TotalNetBalanceYear2 = 0;
  TotalNetBalanceYear3 = 0;

  calculateBalanceSheetSum() {
    let tempsumYear1 = 0;
    let tempsumYear2 = 0;
    let tempsumYear3 = 0;

    for (let ele of this.BalanceSheet.data) {
      if (ele.CSFLITEMVALUE != undefined) {

        let tempLenYear1 = ((Math.floor(ele.CSFLITEMVALUE)).toString()).length;
        if (tempLenYear1 <= 13) {
          if (ele.CSFLTYP == CashflowType.Liability) {
            tempsumYear1 -= parseFloat(String(ele.CSFLITEMVALUE));
          }
          else {
            tempsumYear1 += parseFloat(String(ele.CSFLITEMVALUE));
          }
        }

        let tempLenYear2 = ((Math.floor(ele.CSFLITEMVALUE1)).toString()).length;
        if (tempLenYear2 <= 13) {
          if (ele.CSFLTYP == CashflowType.Liability) {
            tempsumYear2 -= parseFloat(String(ele.CSFLITEMVALUE1));
          }
          else {
            tempsumYear2 += parseFloat(String(ele.CSFLITEMVALUE1));
          }
        }
        let tempLenYear3 = ((Math.floor(ele.CSFLITEMVALUE2)).toString()).length;
        if (tempLenYear3 <= 13) {
          if (ele.CSFLTYP == CashflowType.Liability) {
            tempsumYear3 -= parseFloat(String(ele.CSFLITEMVALUE2));
          }
          else {
            tempsumYear3 += parseFloat(String(ele.CSFLITEMVALUE2));
          }
        }
      }
    }
    this.TotalNetBalanceYear1 = tempsumYear1;
    this.TotalNetBalanceYear2 = tempsumYear2;
    this.TotalNetBalanceYear3 = tempsumYear3;
  }

  calculateProfitnLossSum() {
    let tempsumYear1 = 0;
    let tempsumYear2 = 0;
    let tempsumYear3 = 0;

    for (let ele of this.ProfitnLoss.data) {
      if (ele.CSFLITEMVALUE != undefined) {
        let tempLenYear1 = ((Math.floor(ele.CSFLITEMVALUE)).toString()).length;
        if (tempLenYear1 <= 13) {
          if (ele.CSFLTYP == CashflowType.Expense) {
            tempsumYear1 -= parseFloat(String(ele.CSFLITEMVALUE));
          }
          else {
            tempsumYear1 += parseFloat(String(ele.CSFLITEMVALUE));
          }
        }
        let tempLenYear2 = ((Math.floor(ele.CSFLITEMVALUE1)).toString()).length;
        if (tempLenYear2 <= 13) {
          if (ele.CSFLTYP == CashflowType.Expense) {
            tempsumYear2 -= parseFloat(String(ele.CSFLITEMVALUE1));
          }
          else {
            tempsumYear2 += parseFloat(String(ele.CSFLITEMVALUE1));
          }
        }
        let tempLenYear3 = ((Math.floor(ele.CSFLITEMVALUE2)).toString()).length;
        if (tempLenYear3 <= 13) {
          if (ele.CSFLTYP == CashflowType.Expense) {
            tempsumYear3 -= parseFloat(String(ele.CSFLITEMVALUE2));
          }
          else {
            tempsumYear3 += parseFloat(String(ele.CSFLITEMVALUE2));
          }
        }
      }
    }

    this.TotalNetProfitnLossYear1 = tempsumYear1;
    this.TotalNetProfitnLossYear2 = tempsumYear2;
    this.TotalNetProfitnLossYear3 = tempsumYear3;
  }

  onProfitnLossUpdate(evnt: Event, element: any, index: any, dtId: any) {
    if (element.CSFLITEMVALUE == '') {
      element.CSFLITEMVALUE = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateProfitnLossSum();
    }
    else if (element.CSFLITEMVALUE1 == '') {
      element.CSFLITEMVALUE1 = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateProfitnLossSum();
    }
    else if (element.CSFLITEMVALUE2 == '') {
      element.CSFLITEMVALUE2 = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateProfitnLossSum();
    }
    else {
      let templength = parseInt(element.CSFLITEMVALUE)
      let templenString = templength.toString();
      let length = templenString.length;

      let templength1 = parseInt(element.CSFLITEMVALUE1)
      let templenString1 = templength1.toString();
      let length1 = templenString1.length;

      let templength2 = parseInt(element.CSFLITEMVALUE2)
      let templenString2 = templength2.toString();
      let length2 = templenString2.length;


      if (length <= 13 && length1 <= 13 && length2 <= 13) {
        let tempId = parseInt(dtId) - 1;
        if (element.RowState != DataRowState.Added) {
          element.RowState = DataRowState.Updated;
        }
        this.AnnualFinancials.controls[tempId].patchValue(element);
        this.calculateProfitnLossSum();
      }
      if (length > 13 || length1 > 13 || length2 > 13) {
        this.TotalNetProfitnLossYear1 = "0.00";
        this.TotalNetProfitnLossYear2 = "0.00";
        this.TotalNetProfitnLossYear3 = "0.00";
        this.calculateProfitnLossSum();
      }
    }
  }

  TotalNetProfitnLossYear1: any;
  TotalNetProfitnLossYear2: any;
  TotalNetProfitnLossYear3: any;

  CashFlowFilterSource: any

  inputYear1: any;
  inputYear2: any;
  inputYear3: any;

  onChangeYeareader(evnt: any) {
    let value = parseInt(evnt.target.value);
    this.inputYear1 = value;

    if (value - 2 > 0) {
      this.inputYear2 = value - 1;
      this.inputYear3 = value - 2;
    }
    else if (value - 1 < 0 || value - 2 < 0) {
      this.inputYear2 = 0;
      this.inputYear3 = 0;
    }
    else if (value - 1 == 0) {
      this.inputYear2 = 0;
      this.inputYear3 = 0;
    }
    this.AnnualFinancials.controls[0].controls.RECORDYEAR1.setValue(value);
    this.AnnualFinancials.controls[0].controls.RECORDYEAR2.setValue(this.inputYear2);
    this.AnnualFinancials.controls[0].controls.RECORDYEAR3.setValue(this.inputYear3);

    if (this.AnnualFinancials.controls[0].controls.RowState.value != DataRowState.Added) {
      this.AnnualFinancials.controls[0].controls.RowState.setValue(DataRowState.Updated)
    }

  }

  checkLength(val: any, i: any) {
    let temp = parseInt(val).toString();
    if (temp.length <= 13) {
      return false
    }
    else {
      return true
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

}
