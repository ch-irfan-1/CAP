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
import { FormArray,FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-incomeExpanse',
    templateUrl: './income-expanse.component.html',
    standalone: false
})
export class incomeExpanseComponent implements OnInit , OnDestroy{

  @Input() ApplicantIncomeExpanse !: FormArray<IPRPL_CSFL_DETLInfo>;
  @Input() ComponentName!: string;
  public IncomeColumns = ['CSFLDSC', 'Value', 'RELIABLEIND'];
  public IncomeLabel = ['Income Description', 'Value', 'Reliable'];
  public ExpenseColumns = ['CSFLDSC', 'Value'];
  public ExpenseLabel = ['Expense Description', 'Value'];
  private subscription$ = new Subject();

  Pipes = ['formatCurrency'];
  mask: string = "separator.2";
  incomeDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
  expenseDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
  isControlDisable = false;

  constructor(private _ProposalService : ProposalService, public _masterDataService: MasterDataService, private _proposaldataService: ProposalDataService, private fb: FormBuilder
    ,private _ProposalForm: ProposalEntityFormService, private _formModeService: FormModeService) { }

  ngOnInit(): void {

    if (this._formModeService.FormMode == FormMode.VIEW) {
      this.isControlDisable = true;
    }
    if (this.ApplicantIncomeExpanse.length == 0) {
      this._ProposalService.ReadCashFlowIdentifier({}).pipe(takeUntil(this.subscription$))
      .subscribe(response => {
        this._masterDataService.CashFlowIdentifier = response.ResultSet;
        this._masterDataService.CashFlowIdentifier.forEach((element: any) => {
            let tempIncomeItem : FormGroup<IPRPL_CSFL_DETLInfo> = this._ProposalForm.proposalCSFDetailInfoForm();

            tempIncomeItem.controls.CSFLITEMCDE.setValue(element.CSFLITEMCDE);
            tempIncomeItem.controls.CSFLITEMVALUE.setValue(element.Value);
            tempIncomeItem.controls.EXECUTIONDTE.setValue(element.EXECUTIONDTE);
            tempIncomeItem.controls.EXECUTIONOFFSET.setValue(element.EXECUTIONOFFSET);
            tempIncomeItem.controls.SESSIONID.setValue(element.SESSIONID);
            tempIncomeItem.controls.SESSIONCDE.setValue(element.SESSIONCDE);
            tempIncomeItem.controls.RATOGRUPCODE.setValue(element.RATOGRUPCDE);
            tempIncomeItem.controls.CSFLTYP.setValue(element.CSFLTYP);
            tempIncomeItem.controls.RECORDYEAR1.setValue(element.Year1);
            tempIncomeItem.controls.IDENTIFIER.setValue(element.IDENTIFIER);
            tempIncomeItem.controls.RELIABLEIND.setValue(element.ISAUDITABLE);
            tempIncomeItem.controls.RECORDYEAR2.setValue(element.Year2);
            tempIncomeItem.controls.RECORDYEAR3.setValue(element.Year3);
            tempIncomeItem.controls.CSFLDSC.setValue(element.CSFLDSC);
            tempIncomeItem.controls.CSFLPRIORITY.setValue(element.PRIORITY);

            this.ApplicantIncomeExpanse.push(tempIncomeItem);
            this.updateTableData();
        });
      })
    }

    else{
      this.updateTableData();
    }
  }

  newIncome: any;
  newExpense: any;

  updateTableData(){
    this.incomeDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
    this.expenseDataSource = new MatTableDataSource<IPRPL_CSFL_DETLInfo>();
    this.ApplicantIncomeExpanse.value.map((c: any) => {

      if (c.CSFLTYP == CashflowType.Income) {
          this.incomeDataSource.data.push(c);
        }
      if (c.CSFLTYP == CashflowType.Expense) {
        this.expenseDataSource.data.push(c);
      }

      if (c.CSFLITEMVALUE == undefined) {
        c.CSFLITEMVALUE = "0.00"
      }

    });

    this.calculateIncomeSum();
    this.calculateExpenseSum();
    this.calculateQuote();
  }

  TotalNetIncome = 0.00;

  onIncomeUpdate(evnt: Event, element: any, index: any, dtId: any) {
    if (element.CSFLITEMVALUE == '') {
      element.CSFLITEMVALUE = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateIncomeSum();
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
        this.ApplicantIncomeExpanse.controls[tempId].patchValue(element);
        this.calculateIncomeSum();
        this.calculateQuote();
      }
      else {
        this.calculateIncomeSum();
        this.calculateQuote();
      }
    }
  }

  onReliableChecked(evnt: any, element: any, index: any, dtId: any) {
    let tempId = parseInt(dtId) - 1;
    if (evnt != undefined) {
      if (evnt.checked == true) {
        element.RELIABLEIND = true;
        if (element.RowState != DataRowState.Added) {
          element.RowState = DataRowState.Updated;
        }
        this.ApplicantIncomeExpanse.controls[tempId].patchValue(element);
      }
      else {
        element.RELIABLEIND = false;
        if (element.RowState != DataRowState.Added) {
          element.RowState = DataRowState.Updated;
        }
        this.ApplicantIncomeExpanse.controls[tempId].patchValue(element);
      }
    }
  }


  calculateIncomeSum() {
    let tempSum = 0.00;
    for (let ele of this.incomeDataSource.data) {
      if (ele.CSFLITEMVALUE != undefined) {
        let tempLen = ((Math.floor(ele.CSFLITEMVALUE)).toString()).length;
        if (tempLen <= 13) {
          tempSum += parseFloat(String(ele.CSFLITEMVALUE));
        }
      }
    }
    this.TotalNetIncome = tempSum;
  }

  TotalNetExpense = 0.00;

  onExpenseUpdate(evnt: Event, element: any, index: any, dtId: any) {

    if (element.CSFLITEMVALUE == '') {
      element.CSFLITEMVALUE = "0.00";
      if (element.RowState != DataRowState.Added) {
        element.RowState = DataRowState.Updated;
      }
      this.calculateExpenseSum();
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
        this.ApplicantIncomeExpanse.controls[tempId].patchValue(element);
        this.calculateExpenseSum();
        this.calculateQuote()
      }
      else {
        this.calculateExpenseSum();
        this.calculateQuote()
      }
    }
  }

  calculateExpenseSum() {
    let tempSum = 0;
    for (let ele of this.expenseDataSource.data) {
      if (ele.CSFLITEMVALUE != undefined) {
        let tempLen = ((Math.floor(ele.CSFLITEMVALUE)).toString()).length;
        if (tempLen <= 13) {
          tempSum += parseFloat(String(ele.CSFLITEMVALUE));
        }
      }
    }
    this.TotalNetExpense = tempSum;
  }

  comment = "";
  IncomeExpenseDiff = 0.00;

  calculateQuote() {

    let tempIncome = parseFloat(String(this.TotalNetIncome));
    let tempExpense = parseFloat(String(this.TotalNetExpense));
    let tempDifference = 0.00;

    if(tempIncome > tempExpense) {
      this.comment = "SurPlus";
      tempDifference = tempIncome - tempExpense;
      this.IncomeExpenseDiff = tempDifference;
    }
    else if(tempIncome < tempExpense){
        this.comment = "Deficit";
        tempDifference = tempExpense - tempIncome;
        this.IncomeExpenseDiff = tempDifference;
    }
    else{
      this.comment = "";
      this.IncomeExpenseDiff = 0.00
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
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
