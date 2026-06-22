import { Injectable } from '@angular/core';
import { IEGLE_SCREInfo, IQuotApplicantAddressEntity, IQuotApplicantEntity, IQuotEntity, IQUOTInfo, IQUOT_ADDL_INFOInfo, IQUOT_APLTInfo, IQUOT_APLT_ADDSInfo, IQUOT_APLT_ADDS_DETLInfo, IQUOT_APLT_ID_DETLInfo, IQUOT_APLT_PHNE_FAXInfo, IQUOT_DOCTInfo } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { IQUOTAPLTSPUSDETL } from '@NFS_Entity/Quot-Entity/QuotSubEntities/IQUOTAPLTSPUSDETL';
import { IQUOT_FINLInfo } from '@NFS_Entity/Quot-Entity/QuotSubEntities/IQUOT_FINLInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormBuilder, FormControl, FormGroup } from 'src/Library';
// import { arraysAreNotAllowedMsg } from '@ngrx/store/src/models';

@Injectable({
  providedIn: 'root'
})
export class QuotEntityFormService {

  constructor(private _formBuilder: FormBuilder) { }

  public QuotEntityForm(): FormGroup<IQuotEntity> {
    return this._formBuilder.group<IQuotEntity>({
      QUOT: this.QuotInfoForm() as FormGroup<IQUOTInfo>,
      QUOTADDLINFO: this.QuotAdditionalInfoForm() as FormGroup<IQUOT_ADDL_INFOInfo>,
      QUOTFINL: this.QuotFinancialInfoForm() as FormGroup<IQUOT_FINLInfo>,
      QUOTDOCT: this._formBuilder.array<IQUOT_DOCTInfo>([]),
      QUOTAPPLICANT: this._formBuilder.array<IQuotApplicantEntity>([this.QuotApplicantForm()]),
      EGLESCRE: this._formBuilder.array<IEGLE_SCREInfo>([]),
      RowState: DataRowState.Added,
      ////isDeserializing,
      ISAUDITABLE: false,
    });

  }

  public QuotAdditionalInfoForm(): FormGroup<IQUOT_ADDL_INFOInfo> {
    return this._formBuilder.group<IQUOT_ADDL_INFOInfo>({
      QUOTADDITIONALINFOID: 0,//new FormControl() as FormControl,
      QUOTATIONID: 0,
      CONTRACTNBR: '',
      ASSETMAKE: '',
      ASSETBRAND: '',
      ASSETMODEL: '',
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTEDOFFEST: 0,
      SESSIONID: 0,
      SESSIONCODE: '',
      RowState: DataRowState.Added,
      ////isDeserializing,
      ISAUDITABLE: false,
      ASSETCONDITION: '',
      ASSETUSAGECODE: '',
      ASSETDETAIL: '',
      ENGINENO: '',
      CHASSISNO: '',
      FPCAMPAIGNNAME: '',
      BRANCHNAME: ''

    });
  }
  public QuotFinancialInfoForm(): FormGroup<IQUOT_FINLInfo> {
    return this._formBuilder.group<IQUOT_FINLInfo>({
      QUOTFINANCIALID: 0,
      QUOTATIONID: 0,
      ASSETCOST: 0,
      CONTRACTTERMS: 0,
      DOWNPAYMENTAMNT: 0,
      DOWNPAYMENTPCT: 0,
      FLATINTERESTRTE: 0,
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTEDOFFEST: 0,
      SESSIONID: 0,
      SESSIONCODE: '',
      RowState: DataRowState.Added,
      //isDeserializing,
      ISAUDITABLE: false,
    });
  }
  public QuotApplicantAddressDetailInfoForm(): FormGroup<IQUOT_APLT_ADDS_DETLInfo> {
    return this._formBuilder.group<IQUOT_APLT_ADDS_DETLInfo>({
      QUOTAPPLICANTADDRESSDETAILID: 0,
      QUOTAPPLICANTID: 0,
      ADDRESSID: 0,
      ADDRESSTYPECDE: '',
      //CODE: '',
      DEFAULTIND: false,
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONCDE: '',
      SESSIONID: 0,
      RowState: DataRowState.Added,
      ////isDeserializing,
      ISAUDITABLE: false,
    });
  }

  public QuotApplicantAddressInfoForm(): FormGroup<IQUOT_APLT_ADDSInfo> {
    return this._formBuilder.group<IQUOT_APLT_ADDSInfo>({
      QUOTAPPLICANTID: 0,
      ADDRESSID: 0,
      RESIDENCETYPECDE: '',
      // CODE: '',
      ADDRESSTYPECDE: [],
      ADDRESSSTATUSCDE: '',
      POSTALCODE: '',
      TIMEINYEAR: 0,
      TIMEINMONTH: 0,
      COUNTRYID: 0,
      PROVINCEID: 0,
      KOTAMADYAID: 0,
      KECAMATANID: 0,
      KELURAHANID: 0,
      RWNBR: '',
      RTNBR: '',
      AREACDE: '',
      ADDRESSDETAIL: '',
      HOUSINGOWNERSHIPCDE: '',
      PROPERTYLOCATIONCDE: '',
      CONTACTPERSON: '',
      RLSPWITHCONTACTPERSON: '',
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ////isDeserializing,
      ISAUDITABLE: false,
      ADDRESSTYPE: [],
      DEFAULTADDRESS: ''
    });
  }

  public QuotApplicantIdDetailInfoForm(): FormGroup<IQUOT_APLT_ID_DETLInfo> {
    return this._formBuilder.group<IQUOT_APLT_ID_DETLInfo>({
      QUOTAPPLICANTID: 0,
      IDTYPECDE: new FormControl(''),
      IDTYPENBR: new FormControl(''),
      DEFAULTIND: false,
      ISSUEDTE: new Date(Date.now()),
      EXPIRYDTE: new Date(Date.now()),
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
      TYPE: '',
      CODE: '',
      ISROWDISABLED: false
    });
  }

  public QuotApplicantPhoneInfoForm(): FormGroup<IQUOT_APLT_PHNE_FAXInfo> {
    return this._formBuilder.group<IQUOT_APLT_PHNE_FAXInfo>({
      PHONESEQID: 0,
      QUOTAPPLICANTID: 0,
      ADDRESSID: 0,
      COUNTRYCODE: '',
      PHONETYPECDE: '',
      //CODE: '',
      AREACODE: '',
      NUMBER: '',
      DEFAULTIND: false,
      EXTENSIONNBR: '',
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ////isDeserializing,
      ISAUDITABLE: false,
      TYPE: '',
    });
  }

  public QuotApplicantInfoForm(): FormGroup<IQUOT_APLTInfo> {
    return this._formBuilder.group<IQUOT_APLTInfo>({
      QUOTAPPLICANTID: 0,
      QUOTATIONID: 0,
      ROLECDE: '',
      //CODE: '',
      FIRSTNME: '',
      MIDDLENME: '',
      LASTNME: '',
      DATEOFBIRTH: new Date(''),
      EMAILADDRESS: '',
      SALARY: null,
      MOTHERMDNNME: '',
      PLACEOFBIRTH: '',
      COMPANYNAME: '',
      CONTACTNME: '',
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ////isDeserializing,
      ISAUDITABLE: false,
      CUSTOMERNME: '',
      MARITALSTATUSCDE: '',
      MONTHLYINSTALLMENT: null,
      OCCUPATIONCDE: ''

    });
  }

  public QuotDocumentForm(): FormGroup<IQUOT_DOCTInfo> {
    return this._formBuilder.group<IQUOT_DOCTInfo>({
      QUOTDOCTUMENTID: 0,
      QUOTATIONID: 0,
      DOCUMENTCDE: '',
      //CODE: '',
      CREATIONDTE: new Date(Date.now()),
      LONGITUDE: 0,
      LATITUDE: 0,
      DOCUMENTNAME: '',
      IMAGETYPE: '',
      DOCUMENTPATH: '',
      TIMESTAMP: new Date(Date.now()),
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      //isDeserializing,
      ISAUDITABLE: false,
      ARRAYOFBYTES: '',
      Leadnbr: '',
      Role: '00003',
      Applicantnme: '',
      DOCUMENTTYPDSC: '',
      FILESIZE: 0
    });
  }

  public QuotInfoForm(): FormGroup<IQUOTInfo> {
    return this._formBuilder.group<IQUOTInfo>({
      QUOTATIONID: 0,
      QUOTATIONNBR: '',
      QUOTATIONTYPECDE: '',
      QUOTATIONDTE: new Date(Date.now()),
      STATUSCDE: '',
      BPCOMPANYID: 0,
      BPBRANCHID: 0,
      BPINTRODUCERID: 0,
      FPGROUPID: 0,
      FINANCIALPRODUCTID: 0,
      FINANCETYP: '',
      CREATEDBY: 0,
      ISMCOMCAMPAIGN: false,
      MCOMDEALER: false,
      ISSEARCHED: false,
      APPLICATIONCENTERCOMMENTS: '',
      COMMENTS: '',
      ASSIGNEDTO: 0,
      EXECUTIONDTE: new Date(Date.now()),
      EXECUTIONOFFSET: 0,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
      FPGROUPNAME: '',
      FPCAMPAIGNNAME: '',
      CUSTOMERTYPE: '',
      DEALERNAME: '',
      BRANCHNAME: '',
      APCSTATUSCDE: '',
      STATUSDSC: '',
      APCSTATUSDSC: '',
      APPROVALTYPE: '',
      QSTOKEN: '',
      CANCELLATIONREASON: '',
      CANCELLATIONCOMMENTS: '',
      VOID: 0,
      CREATEDBYMVOIND: false
    });
  }

  public QuotApplicantForm(): FormGroup<IQuotApplicantEntity> {
    return this._formBuilder.group<IQuotApplicantEntity>({
      QUOTAPLT: this.QuotApplicantInfoForm() as FormGroup<IQUOT_APLTInfo>,
      QUOTAPLTIDDETL: this._formBuilder.array<IQUOT_APLT_ID_DETLInfo>([]),
      QUOTAPPLICANTADDRESS: this._formBuilder.array<IQuotApplicantAddressEntity>([this.QuotApplicantAddressForm()]),
      QUOTAPLTSPUSDETL: this.ApplicantSpouseForm() as FormGroup<IQUOTAPLTSPUSDETL>,
      RowState: DataRowState.Added,
      //isDeserializing,
      ISAUDITABLE: false,
    });

  }

  public QuotApplicantAddressForm(): FormGroup<IQuotApplicantAddressEntity> {
    return this._formBuilder.group<IQuotApplicantAddressEntity>({
      QUOTAPLTADDS: this.QuotApplicantAddressInfoForm() as FormGroup<IQUOT_APLT_ADDSInfo>,
      QUOTAPLTADDSDETL: this._formBuilder.array<IQUOT_APLT_ADDS_DETLInfo>([]),
      QUOTAPLTPHNEFAX: this._formBuilder.array<IQUOT_APLT_PHNE_FAXInfo>([]),
      RowState: DataRowState.Added,
      //isDeserializing,
      ISAUDITABLE: false,
    });

  }

  public ApplicantSpouseForm(): FormGroup<IQUOTAPLTSPUSDETL> {
    return this._formBuilder.group<IQUOTAPLTSPUSDETL>({
      QUOTAPPLICANTSPOUSDETAILID: 0,
      QUOTAPPLICANTID: 0,
      FIRSTNME: '',
      MIDDLENME: '',
      LASTNME: '',
      IDTYPENBR: '',
      CODE: '',
      RowState: 0,
      ISAUDITABLE: false,
    });

  }
}



