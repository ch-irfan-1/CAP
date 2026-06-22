import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from 'src/Library';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { ToastrService } from 'ngx-toastr';
import  moment from 'moment';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-ekyc-info',
    templateUrl: './ekyc-info.component.html',
    styleUrls: ['./ekyc-info.component.css'],
    standalone: false
})
export class EkycInfoComponent implements OnInit, OnDestroy {
  EKYCBadCustomerData: FormArray<QUOTENTITY.IQUOT_EKYC_BAD_CUSTInfo> = this.fb.array<QUOTENTITY.IQUOT_EKYC_BAD_CUSTInfo>([]);
  EKYCProPData: FormArray<QUOTENTITY.IQUOT_EKYC_PROF_PLUS> = this.fb.array<QUOTENTITY.IQUOT_EKYC_PROF_PLUS>([]);
  NPWPTaxData: FormArray<QUOTENTITY.IQUOT_EKYC_NPWP_TAXInfo> = this.fb.array<QUOTENTITY.IQUOT_EKYC_NPWP_TAXInfo>([]);
  @Input() EagleScoreData!: FormArray<QUOTENTITY.IEGLE_SCREInfo>;
  @Input() MainQuotEntity!: FormGroup<QUOTENTITY.IQuotEntity>

  @Input() Mode: string = FormMode.NEW;
  public toDate = new Date(Date.now());

  public BCcolumns = ['CustomerStatus', 'SpouseStatus', 'evaluationDte'];
  public BClabels = ['Default Bad Customer Indicator', 'Spouse Bad Customer Indicator', 'Evaluation Date'];
  public ESRcolumns = ['RESRESULTSCORE', 'RESRESULTRISKRANGE', 'RESMSG', 'RESCOLLECTABILITY', 'RESCOLLECTABILITYDATE', 'RESNUMBEROFREPORT', 'EVALUATIONDTE'];
  public ESpipes = [null, null, null, null, 'formatDate', null, 'formatDate'];
  public ESRlabels = ['Obtained Score', 'Risk Category', 'Message', 'Collectability', 'Collectability Date', 'Number of PEFINDO Report', 'Evaluation Date'];
  public PPcolumns = ['nik', 'Name', 'BirthDate', 'BirthPlace', 'Mother_Name', 'Phone', 'Address', 'evaluationDte'];
  public PPlabels = ['NIK', 'Name', 'Date of Birth', 'Place of Birth', 'Mother Middle Name', 'Phone', 'Address', 'Evaluation Date'];
  public NPWPcolumns = ['npwp', 'matchResult', 'income', 'evaluationDte'];
  public NPWPlabels = ['NPWP Validity', 'NPWP Match Result', 'Income Range', 'Evaluation Date'];
  public ApplicantDOB!: Date;
  public QuotNbr!: string;
  public RecalcESR2: boolean = true;
  private subscription$ = new Subject();

  initializeLeadForm() {
    this.setMode();
  }

  constructor(private fb: FormBuilder,
    private _QuotationService: QuotationService,
    private _QuotForm: QuotEntityFormService,
    private _storageService: ClientStoreService,
    private _appTypeService: ApplicationTypeService,
    private toastr: ToastrService,
    private _formatter: FormatterService) {

  }

  ngOnInit(): void {
    this.initializeLeadForm();
    this.EagleScoreData = this.MainQuotEntity.controls.EGLESCRE;
    this.MainQuotEntity.controls.EGLESCRE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if(this.EagleScoreData.value.length > 0){
        this.RecalcESR2 = false;
      }
    })
    
     this.MainQuotEntity.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.DATEOFBIRTH.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      this.ApplicantDOB = val;
    })
    this.MainQuotEntity.controls.QUOT.controls.QUOTATIONNBR.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      this.QuotNbr = val;
    })
  }

  setMode() {
    if (this.Mode === FormMode.NEW) {

    }
    else if (this.Mode === FormMode.VIEW) {

    }
  }

  GetEKYCBadCustomer(): void {

  }
  GetEagleScore2(): void {
    let QuotApplicants = this.MainQuotEntity.value.QUOTAPPLICANT[0];
    let ApplicantKTPId = QuotApplicants.QUOTAPLTIDDETL?.find(x => x.IDTYPECDE = "00001")?.IDTYPENBR.trim();
    let ApplicantName = QuotApplicants.QUOTAPLT.CUSTOMERNME.trim();
    let ApplicantDOB =  this.ApplicantDOB ? moment(new Date(this.ApplicantDOB)).format('yyyy-MM-DD') : '';
    let LeadProductType;
    if (this.MainQuotEntity.value.QUOT.FINANCETYP === '00005' && this.MainQuotEntity.value.QUOT.ISMCOMCAMPAIGN == true)
    {
      LeadProductType = 1 //For MCOM
    }
    if (this.MainQuotEntity.value.QUOT.FINANCETYP === '00005' && this.MainQuotEntity.value.QUOT.ISMCOMCAMPAIGN == false)
    {
      LeadProductType = 0 //For CF
    }
    if (this.MainQuotEntity.value.QUOT.FINANCETYP === '00014')
    {
      LeadProductType = 2 //For KAB
    }
    let UserObj = this._storageService.GetUserInfo();
    let username = UserObj.UserName;
    let CompanyCode
    if (UserObj.IsOTO) {
      CompanyCode = '0'; //For OTO
    }
    else {
      CompanyCode = '1'; //For SOF
    }
    let UserId = UserObj.UserId.toString();
    let ApplicantType = this._appTypeService.getApplicationType() == 'Individual' ? 'I' : 'C';
    let leadNumber = this.QuotNbr; //this.MainQuotEntity.value.QUOT.QUOTATIONNBR;
    let quotationId = this.MainQuotEntity.value.QUOT.QUOTATIONID

    let SubmitLeadObject: any = {
      "IdNo": ApplicantKTPId, "Name": ApplicantName, "BirthDate": ApplicantDOB, "Category": "Individu", "ProductType": LeadProductType,
      "CompanyName": CompanyCode, "UserAccessInfo": username, "userId": UserId, companyId: 5, ApplicantType: ApplicantType,
      "leadGenertorNumber": leadNumber, QuotationId: quotationId
    };

    this._QuotationService.SaveEagleScore(SubmitLeadObject).pipe(takeUntil(this.subscription$)).subscribe((response) => {
      if (response.CODE == 1 && response.MESSAGE == 'Success.' && response.ResultSet != null) {
        var result = this.fb.group<QUOTENTITY.IEGLE_SCREInfo>(response.ResultSet);
        // this._formatter.FormateDate(result.controls.EVALUATIONDTE);
        // this._formatter.FormateDate(result.controls.RESCOLLECTABILITYDATE);
        this.EagleScoreData.push(result);
        if(this.EagleScoreData.length > 0)
          this.RecalcESR2 = false      
      }
      else {
        this.toastr.error(response.MESSAGE);
      }
    });
  }

  GetEKYCProP(): void {

  }
  GetNPWPTax(): void {

  }
  childOutput(event: any) {

  }
  public getEKYCBadCustomerData(): FormGroup<QUOTENTITY.IQUOT_EKYC_BAD_CUSTInfo> {
    return this.fb.group<QUOTENTITY.IQUOT_EKYC_BAD_CUSTInfo>({
      Answer: 'asfa',
      CustomerStatus: 'abc',
      SpouseStatus: 'xyz',
      evaluationDte: new Date(Date.now()),
      requestType: 'sfas',
      RowState: 3,
      //isDeserializing: false,
      ISAUDITABLE: false,
    });
  }
  public getEagleScoreData(): FormGroup<QUOTENTITY.IEGLE_SCREInfo> {
    return this.fb.group<QUOTENTITY.IEGLE_SCREInfo>({
      EAGLESCOREID: 0,
      REQBIRTHDTE: '06-05-2021',
      REQCUSTOMERTYP: "I",
      REQCOMPANYNAM: "0",
      REQIDNO: 'sa',
      REQNAM: 'abc',
      REQPRODUCTTYP: '',
      REQUSERACCESSINFO: '',
      COMPANYID: 5,
      LEADNUMBER: '',
      USERID: 0,
      EVALUATIONDTE: '06-05-2021',
      RESMSG: 'test',
      RESRESULTPD: 0,
      RESRESULTRISKRANGE: 'fds',
      RESRESULTSCORE: 10,
      RESRESULTSCORINGTIME: '',
      SESSIONCDE: '',
      SESSIONID: 0,
      RESSUCCESS: '',
      RESCOLLECTABILITYDATE: '06-05-2021',
      RESCOLLECTABILITY: 1,
      RESNUMBEROFREPORT: 5,
      EXECUTIONDTE: new Date(Date.now()),
      QUOTATIONID: 0,
      RowState: DataRowState.Added,
      ISAUDITABLE: false
    });
  }
  public getEKYCProPData(): FormGroup<QUOTENTITY.IQUOT_EKYC_PROF_PLUS> {
    return this.fb.group<QUOTENTITY.IQUOT_EKYC_PROF_PLUS>({
      nik: '',
      Name: 'abc',
      BirthPlace: 'test',
      BirthDate: '06-05-2021',
      evaluationDte: '06-05-2021',
      Address: 'test',
      Identity_Photo: '',
      Selfie_Photo: '',
      Phone: '0306565651',
      Mother: '',
      Mother_Name: 'xyz',
      Message: '',
      RowState: 3,
      //isDeserializing: false,
      ISAUDITABLE: false,
    });
  }
  
  public getNPWPTaxData(): FormGroup<QUOTENTITY.IQUOT_EKYC_NPWP_TAXInfo> {
    return this.fb.group<QUOTENTITY.IQUOT_EKYC_NPWP_TAXInfo>({
      npwp: '31231',
      nik: 'e312323',
      match_result: 'test',
      matchResult: 'test',
      income: '9000000',
      evaluationDte: '06-05-2021',
      RowState: 3,
      //isDeserializing: false,
      ISAUDITABLE: false,
    });
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
