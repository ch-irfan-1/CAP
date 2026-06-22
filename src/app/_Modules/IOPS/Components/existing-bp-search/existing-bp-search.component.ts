import { Component, OnInit, Input, Inject, Output, OnDestroy } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ExistingContractData,ExistingApplicantData } from '@NFS_Interfaces/ResponseInterfaces/iload-bp';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorsModel } from 'src/Library';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { BPIDDETL, CONT, LoadExistingBPResultSet } from '@NFS_Interfaces/ResponseInterfaces/iload-bp';
import { IContractForIopsInfoParams } from '@NFS_Interfaces/RequestInterfaces/icontract-for-iops-info-params';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { IQuotEntity } from '@NFS_Entity/Quot-Entity/QuotEntity.model';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { EventEmitter } from '@angular/core';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
    selector: 'app-existing-bp-search',
    templateUrl: './existing-bp-search.component.html',
    styleUrls: ['./existing-bp-search.component.css'],
    standalone: false
})
export class ExistingBpSearchComponent implements OnInit, OnDestroy {
  @Input() Mode: string = FormMode.NEW;
  //public event: EventEmitter<any> = new EventEmitter();
  @Output() notifyIopsCust: EventEmitter<any> = new EventEmitter<any>();
  existingBPResultSet = [] as Array<LoadExistingBPResultSet>;
  public displayedColumnsForApplicant = ['BUSINESSPARTNERNME', 'IDTYPENBR', 'DOBFORASCENT', 'EXPIRYDTE'];
  public Applicantlabels = ['Applicant Name', 'ID Number', 'DOB', 'Expiry Date'];
  ApplicantData: FormArray<BPIDDETL> = new FormArray<BPIDDETL>([]);
  ContractData: FormArray<CONT> = new FormArray<CONT>([]);
  loadContractResultset = {} as IQuotEntity;
  QUOT: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();
  public displayedColumnsForContract = ['ETCONTRACTNBR', 'ASSETDSC', 'BPCOMYBRANCHNAME', 'FINANCIALPRODUCTDSC', 'ENGINENBR', 'CHASSISNBR'];
  public ContractLabels = ['Contract number', 'Asset Detail', 'Branch', 'FP Campaign', 'Engine No.', 'Chassis No.'];
  loadContractInfoParams = {} as IContractForIopsInfoParams;
  subscription$ = new Subject();

  constructor(public dialogRef: MatDialogRef<ExistingBpSearchComponent>, private _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private _QuotationService: QuotationService, private _QuotForm: QuotEntityFormService, private _formatter: FormatterService, private datePipe: DatePipe) {

  }

  cancel() {
    this.dialogRef.close(false);
  }

  childOutput(event: any) {

  }
  
  BPLoadchildOutput(event: any): void {
    this.loadContractInfoParams.borrowerid = event.BUSINESSPARTNERID;
    this.loadContractInfoParams.OldContNumber = event.ETCONTRACTNBR;
    this._QuotationService.LoadContract(this.loadContractInfoParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this.loadContractResultset = res.ResultSet;
      this.notifyIopsCust.emit({ data: res.ResultSet });
      this.dialogRef.close(false);
    })
  }
  ngOnInit(): void {
    this.ApplicantData = this._formBuilder.array(this.data.existingBPData.BPIDDETL);
    this.ContractData = this._formBuilder.array(this.data.existingBPData.CONT);
    let dte = this.ApplicantData.controls[0].value.EXPIRYDTE;
    let dob = this.ApplicantData.controls[0].value.DOBFORASCENT;
    this.ApplicantData.controls[0].value.EXPIRYDTE=this.formatDate(dte);
    this.ApplicantData.controls[0].value.DOBFORASCENT=this.formatDate(dob);
    
  }

  public formatDate(date: string, format: string ='dd-MM-yyyy'):string{

    let temp=this.datePipe.transform(date,format);
    if(temp!=null)
    {
      return temp?.toString();
    }
    return "";
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}