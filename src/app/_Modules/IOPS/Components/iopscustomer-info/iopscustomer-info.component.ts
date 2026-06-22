import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
// import { QuotationEntity, QUOTInfo, AssetEntity, QUOT_ASETInfo } from '../../Entities/QuotationEntity.Form';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { IQuotEntity } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { LoadExistingBPResultSet } from '@NFS_Interfaces/ResponseInterfaces/iload-bp';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



@Component({
    selector: 'app-iopscustomer-info',
    templateUrl: './iopscustomer-info.component.html',
    styleUrls: ['./iopscustomer-info.component.css'],
    standalone: false
})
export class IOPSCustomerInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() QuotApplicants!: FormGroup<QUOTENTITY.IQuotApplicantEntity>;
  @Input() MainQuotEntity: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();
  @Input() Mode: string = FormMode.NEW;
  @Output() LoadExistingBPtData = new EventEmitter;
  public toDate = new Date(Date.now());
  panelOpenState = false;
  LeadEntityMainForm: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();
  QUOT: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();
  public columns = ['TYPE', 'IDTYPENBR', 'ISSUEDTE', 'EXPIRYDTE', 'DEFAULTIND'];
  public pipes = [null, null, 'formatDate', 'formatDate', null];
  public labels = ['ID Type', 'ID Number', 'Issue Date', 'Expiry Date', 'Default'];
  public ContractInfocolumns = ['CONTRACTNBR', 'ASSETDETAIL', 'BRANCHNAME', 'FPCAMPAIGNNAME', 'ENGINENO', 'CHASSISNO'];
  public ContractInfolabels = ['Contract Number', 'Asset Detail', 'Branch', 'FP Campaign', 'Engine No.', 'Chassis No.'];
  IdDetailForm: FormGroup<QUOTENTITY.IQUOT_APLT_ID_DETLInfo> = this._QuotForm.QuotApplicantIdDetailInfoForm();
  idTypeDropdownData!: Array<INFSDropDownData>;
  request!: mPOSMasterDataRequest;
  existingBPParams = {} as IExistingBPInfoParm;
  existingBPResultSet = [] as Array<LoadExistingBPResultSet>;
  isBPSearched: boolean = false;
  contractInfoDataset: FormArray<QUOTENTITY.IQUOT_ADDL_INFOInfo> = new FormArray<QUOTENTITY.IQUOT_ADDL_INFOInfo>([]);
  contractInfoArray = [] as Array<QUOTENTITY.IQUOT_ADDL_INFOInfo>;
  public existingBPDataset: FormArray<LoadExistingBPResultSet> = this.fb.array<LoadExistingBPResultSet>([]);
  isIndividualSelected: boolean = true;
  isAssetCondData: boolean = false;
  IsAPCuserLoggedin: boolean = true;
  subscription$ = new Subject();

  NullVal: number | string = '';
  constructor(private fb: FormBuilder, private _dialog: DialogBoxService, private _QuotForm: QuotEntityFormService, public _masterDataService: MasterDataService, private _QuotationService: QuotationService, private _appTypeService: ApplicationTypeService,
    private _storageService: ClientStoreService, private _toastr: ToastrService, private _formatter: FormatterService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setMode();
  }

  ngOnInit(): void {

    this.contractInfoDataset.push(this._QuotForm.QuotAdditionalInfoForm());

    this.MainQuotEntity.controls.QUOT.controls.ISSEARCHED.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      this.isBPSearched = val;
    })
    this.MainQuotEntity.controls.QUOTADDLINFO.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val.CONTRACTNBR != '' && val.CONTRACTNBR != undefined) {
        this.contractInfoDataset.controls[0].patchValue(val);
      }
    })
    this.MainQuotEntity.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.MARITALSTATUSCDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val != '00001' || this.Mode == FormMode.VIEW) {
        this.QuotApplicants.controls.QUOTAPLTSPUSDETL.disable();
      }
      else {
        this.QuotApplicants.controls.QUOTAPLTSPUSDETL.enable();
      }
    })
    this.MainQuotEntity.controls.QUOT.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val.FINANCETYP == '00014' || val.ISMCOMCAMPAIGN) {
        this.isAssetCondData = true;
      }
      else {
        this.isAssetCondData = false;
      }
    });

    this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETMAKE.valueChanges
    .subscribe((val: any) => {

      this._masterDataService.AssetBrandTypes = new Array<INFSDropDownData>();
      this._masterDataService.AssetModelTypes = new Array<INFSDropDownData>();
      let request1 = new mPOSMasterDataRequest();
      request1.masterDataOperation = MasterData.IOPsAssetBrand;
      if (val === this.NullVal) {
        this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETBRAND.setValue('');
        this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETMODEL.setValue('');
      }

      request1.DATAS.AssetMakeCode = val;//this.MainQuotEntity.value.QUOTADDLINFO.ASSETMAKE;
      if (request1.DATAS.AssetMakeCode) {

        if ( this._masterDataService.AssetBrandTypes == undefined ||
          this._masterDataService.AssetBrandTypes.length == 0) {
            this._masterDataService.GetMasterData(request1).subscribe((response) => {
               this._masterDataService.AssetBrandTypes = response?.ResultSet?.DataCollection;
             });
        }
      }
    })
    this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETBRAND.valueChanges
    .subscribe((val: any) => {

      this._masterDataService.AssetModelTypes = new Array<INFSDropDownData>();
      let request1 = new mPOSMasterDataRequest();
      request1.masterDataOperation = MasterData.IOPsAssetModel;
      if (val === this.NullVal) {
        this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETMODEL.setValue('');
      }

      request1.DATAS.AssetBrandCode = val;//this.MainQuotEntity.value.QUOTADDLINFO.ASSETBRAND;
      if (request1.DATAS.AssetBrandCode) {

        if ( this._masterDataService.AssetModelTypes == undefined ||
          this._masterDataService.AssetModelTypes.length == 0) {
            this._masterDataService.GetMasterData(request1).subscribe((response) => {
               this._masterDataService.AssetModelTypes = response?.ResultSet?.DataCollection;
             });
        }
      }
    });

    //this.contractInfoDataset.push(this.MainQuotEntity.controls.QUOTADDLINFO);
    if (this._appTypeService.getApplicationType() == 'Individual') {
      this.isIndividualSelected = true;
    }
    else {
      this.isIndividualSelected = false;
    }
    if (this._storageService.GetUserGroupCode() == '00107') {
      this.IsAPCuserLoggedin = true;
    }
    else {
      this.IsAPCuserLoggedin = false;
    }
    this.initializeQuotForm();
  }

  initializeQuotForm() {
    this.geIdTypeData();
    this.setMode();

    this.IdDetailForm.controls.EXPIRYDTE.reset();
    this.IdDetailForm.controls.ISSUEDTE.reset();
  }

  ResetSpouseDetail() {
    this.QuotApplicants.controls.QUOTAPLTSPUSDETL.patchValue({
      FIRSTNME: '',
      MIDDLENME: '',
      LASTNME: '',
      IDTYPENBR: ''
    });

    if (this.QuotApplicants.controls.QUOTAPLTSPUSDETL.controls.QUOTAPPLICANTID.value > 0) {
      this.QuotApplicants.controls.QUOTAPLTSPUSDETL.controls.RowState.setValue(DataRowState.Updated);
    }
    else {
      this.QuotApplicants.controls.QUOTAPLTSPUSDETL.controls.RowState.setValue(DataRowState.Added);
    }
  }

  addIdDetail() {
    let IdTypeBothDates: string[] = [IDTypeCode.KTP, IDTypeCode.Passport, IDTypeCode.KITAS_KIMS, IDTypeCode.TDPPT, IDTypeCode.EmployeeId]

    if (!this.IdDetailForm.valid) {
      this._toastr.info("Selected dates are not allowed or invalid");
      return;
    }
    else if (!this.IdDetailForm.controls.IDTYPECDE.value) {
      this._toastr.warning('ID Type is Required.')
      return;
    }
    else if (!this.IdDetailForm.controls.IDTYPENBR.value.trim()) {
      this._toastr.warning('ID Number is Required.')
      return;
    }
    else if (IdTypeBothDates.includes(this.IdDetailForm.controls.IDTYPECDE.value) && (!this.IdDetailForm.controls.ISSUEDTE.value || !this.IdDetailForm.controls.EXPIRYDTE.value)) {
      this._toastr.warning(!this.IdDetailForm.controls.ISSUEDTE.value ? 'Issue Dates is required.' : 'Expiry Date is required.')
      return;
    }
    this.IdDetailForm.controls.IDTYPENBR.setValue(this.IdDetailForm.controls.IDTYPENBR.value.trim())
    var isDefaultExisting = this.QuotApplicants.controls.QUOTAPLTIDDETL.value.find(x => x.DEFAULTIND == true && x.RowState !== DataRowState.Removed);
    var element: FormGroup<QUOTENTITY.IQUOT_APLT_ID_DETLInfo> = this._QuotForm.QuotApplicantIdDetailInfoForm();
    let idDetail = this._masterDataService.ApplicantIdTypesSetup?.find(t => t.code === this.IdDetailForm.controls.IDTYPECDE.value);
    let removedIndex = this.QuotApplicants.controls.QUOTAPLTIDDETL.value.findIndex(a => a.IDTYPECDE === this.IdDetailForm.controls.IDTYPECDE.value && a.RowState == DataRowState.Removed);
    if (removedIndex > 0) {
      let formGroup: FormGroup<QUOTENTITY.IQUOT_APLT_ID_DETLInfo> = this.QuotApplicants.controls.QUOTAPLTIDDETL.controls[removedIndex] as FormGroup<QUOTENTITY.IQUOT_APLT_ID_DETLInfo>;
      formGroup.patchValue(this.IdDetailForm.value);
      formGroup.controls.TYPE.setValue(idDetail?.TextValue || '');
      formGroup.controls.RowState.setValue(DataRowState.Updated);
      formGroup.controls.QUOTAPPLICANTID.setValue(this.QuotApplicants.controls.QUOTAPLT.controls.QUOTAPPLICANTID.value);
      formGroup.controls.DEFAULTIND.setValue(false);
      if (!isDefaultExisting) {
        formGroup.controls.DEFAULTIND.setValue(true);
      }
    }

    else {
      element.patchValue(this.IdDetailForm.value);
      element.controls.TYPE.setValue(idDetail?.TextValue || '');
      element.controls.QUOTAPPLICANTID.setValue(this.QuotApplicants.controls.QUOTAPLT.controls.QUOTAPPLICANTID.value);
      if (!isDefaultExisting) {
        element.controls.DEFAULTIND.setValue(true);
      }
      else
        element.controls.DEFAULTIND.setValue(this.IdDetailForm.controls.DEFAULTIND.value);
    }
    var data = this.QuotApplicants.controls.QUOTAPLTIDDETL.value.filter(a => a.IDTYPECDE === element.controls.IDTYPECDE.value && a.RowState != DataRowState.Removed);

    if (data.length > 0) {
      this._toastr.warning('Id Type Should Not Be Duplicate.')
      return;
    }

    if (removedIndex <= 0) {
      this.QuotApplicants.controls.QUOTAPLTIDDETL.push(element);
    }
    this.resetIdDetailValues();
  }

  resetIdDetailValues() {
    this.IdDetailForm.controls.IDTYPECDE.setValue('');
    this.IdDetailForm.controls.IDTYPENBR.setValue('');
    this.IdDetailForm.controls.TYPE.setValue('');
    this.IdDetailForm.controls.EXECUTIONDTE.setValue(new Date());
    this.IdDetailForm.controls.EXPIRYDTE.setValue(new Date());
    this.IdDetailForm.controls.ISSUEDTE.setValue(new Date());
    this.IdDetailForm.controls.EXPIRYDTE.reset();
    this.IdDetailForm.controls.ISSUEDTE.reset();
  }
  openBPSearchDialog() {
    const validIDTypes: string[] = [IDTypeCode.KTP, IDTypeCode.SIUP];
    if (!this.IdDetailForm.controls.IDTYPECDE.value || !this.IdDetailForm.controls.IDTYPENBR.value) {
      this._toastr.clear();
      this._toastr.warning('Please Select ID Type and ID Number to search Applicant.')
      return;
    }
    else if (!validIDTypes.includes(this.IdDetailForm.controls.IDTYPECDE.value)) {
      this._toastr.clear();
      this._toastr.warning('Please select valid ID type.')
      return;
    }
    this.existingBPParams.IdCardNumber = this.IdDetailForm.controls.IDTYPENBR?.value;
    this.existingBPParams.IdCardTyp = this.IdDetailForm.controls.IDTYPECDE?.value;

    this._QuotationService.LoadExistingBP(this.existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res.ResultSet.BPIDDETL != null && res.ResultSet.CONT != null) {
        this.existingBPResultSet = res.ResultSet;
        let dialogRef = this._dialog.openExistingBPSearchComponent(this.existingBPResultSet);
        this.resetIdDetailValues();
        const subscribeDialog = dialogRef.componentInstance.notifyIopsCust.subscribe((data) => {
          this.LoadExistingBPtData.emit({ Quotdata: data });
          this.isBPSearched = true;
          //reset asset conditions
          this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETCONDITION.enable();
          let QuoteData: IQuotEntity = data.data as IQuotEntity;
          this.contractInfoArray = [];
          this.contractInfoArray.push(QuoteData.QUOTADDLINFO);
          this.contractInfoDataset = this.fb.array(this.contractInfoArray.map(r => this.fb.group(r)));
        });
      }
      else {
        this._toastr.warning('No record found');
      }


    });
  }
  childOutput(event: any) {

  }

  geIdTypeData() {
    //this.idTypeDropdownData = this._masterDataService.ApplicantIdTypesSetup.filter(x => x.APPTYP === this.QUOT.controls.QUOT.controls.QUOTATIONTYPECDE.value);
  }

  setMode() {
    if (this.Mode === FormMode.NEW) {
      this.IdDetailForm.controls.IDTYPECDE.enable();
      this.IdDetailForm.controls.IDTYPENBR.enable();
      this.IdDetailForm.controls.EXECUTIONDTE.enable();
      this.IdDetailForm.controls.EXPIRYDTE.enable();
      this.IdDetailForm.controls.ISSUEDTE.enable();

      this.QuotApplicants.controls.QUOTAPLT.controls.FIRSTNME.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.MIDDLENME.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.COMPANYNAME.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.LASTNME.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.CONTACTNME.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.DATEOFBIRTH.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.EMAILADDRESS.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.PLACEOFBIRTH.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.MOTHERMDNNME.enable();
      this.QuotApplicants.controls.QUOTAPLT.controls.SALARY.enable();
      if (this.QuotApplicants.controls.QUOTAPLTIDDETL.value.length > 0 && this.QuotApplicants.controls.QUOTAPLTIDDETL.value[0].IDTYPECDE == ''
        && this.QuotApplicants.controls.QUOTAPLTIDDETL.value[0].IDTYPENBR == '') {
        //this.QuotApplicants.controls.QUOTAPLTIDDETL.removeAt(0);
      }

      this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETBRAND.enable();
      this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETMODEL.enable();
      this.MainQuotEntity.controls.QUOTFINL.controls.ASSETCOST.enable();
      this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.enable();
      this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.enable();
      this.MainQuotEntity.controls.QUOTFINL.controls.FLATINTERESTRTE.enable();
      this.MainQuotEntity.controls.QUOTFINL.controls.CONTRACTTERMS.enable();
    }
    else if (this.Mode === FormMode.VIEW) {
      this.IdDetailForm.controls.IDTYPECDE.disable();
      this.IdDetailForm.controls.IDTYPENBR.disable();
      this.IdDetailForm.controls.EXECUTIONDTE.disable();
      this.IdDetailForm.controls.EXPIRYDTE.disable();
      this.IdDetailForm.controls.ISSUEDTE.disable();
      this.IdDetailForm.controls.DEFAULTIND.disable();

      this.QuotApplicants.controls.QUOTAPLT.controls.FIRSTNME.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.MIDDLENME.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.COMPANYNAME.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.LASTNME.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.CONTACTNME.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.DATEOFBIRTH.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.EMAILADDRESS.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.PLACEOFBIRTH.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.MOTHERMDNNME.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.SALARY.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.MONTHLYINSTALLMENT.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.OCCUPATIONCDE.disable();
      this.QuotApplicants.controls.QUOTAPLT.controls.MARITALSTATUSCDE.disable();
      this.QuotApplicants.controls.QUOTAPLTSPUSDETL.controls.FIRSTNME.disable();
      this.QuotApplicants.controls.QUOTAPLTSPUSDETL.controls.MIDDLENME.disable();
      this.QuotApplicants.controls.QUOTAPLTSPUSDETL.controls.LASTNME.disable();
      this.QuotApplicants.controls.QUOTAPLTSPUSDETL.controls.IDTYPENBR.disable();
      this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETCONDITION.disable();
      this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETUSAGECODE.disable();
      this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETMAKE.disable();
      this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETBRAND.disable();
      this.MainQuotEntity.controls.QUOTADDLINFO.controls.ASSETMODEL.disable();
      this.MainQuotEntity.controls.QUOTFINL.controls.ASSETCOST.disable();
      this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.disable();
      this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.disable();
      this.MainQuotEntity.controls.QUOTFINL.controls.FLATINTERESTRTE.disable();
      this.MainQuotEntity.controls.QUOTFINL.controls.CONTRACTTERMS.disable();
    }
  }

  calculateDownPayment(event: Event, action: string) {
    if (action == 'Amount') {
      if (Number(event) == 0 || this.MainQuotEntity.controls.QUOTFINL.controls.ASSETCOST.value == 0)
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.setValue(0, { emitEvent: false, onlySelf: true });
      else {
        let percent: number = 0;
        percent = (Number(event) / this.MainQuotEntity.controls.QUOTFINL.controls.ASSETCOST.value) * 100;
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.setValue(+percent.toFixed(2), { emitEvent: false, onlySelf: true });
      }
    }
    else if (action == 'Percentage') {
      if (Number(event) == 0 || this.MainQuotEntity.controls.QUOTFINL.controls.ASSETCOST.value == 0)
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.setValue(0, { emitEvent: false, onlySelf: true });
      else {
        let tot: number = Number(event)! * this.MainQuotEntity.controls.QUOTFINL.controls.ASSETCOST.value;
        let amnt = tot > 0 ? tot / 100 : 0;
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.setValue(+amnt.toFixed(2), { emitEvent: false, onlySelf: true });
      }
    } else if (action == 'AssetCost') {
      if (this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.value == 0 || Number(event) == 0)
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.setValue(0, { emitEvent: false, onlySelf: true });
      else {
        let percent: number = 0;
        percent = (this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.value / Number(event)) * 100;
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.setValue(+percent.toFixed(2), { emitEvent: false, onlySelf: true });
      }
      if (this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.value == 0 || Number(event) == 0)
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.setValue(0, { emitEvent: false, onlySelf: true });
      else {
        let tot: number = this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.value! * Number(event);
        let amnt = tot > 0 ? tot / 100 : 0;
        this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.setValue(+amnt.toFixed(2), { emitEvent: false, onlySelf: true });
      }
    }
    if (this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.value > this.MainQuotEntity.controls.QUOTFINL.controls.ASSETCOST.value
      || this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.value! > 100) {
      this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTAMNT.setValue(0, { emitEvent: false, onlySelf: true });
      this.MainQuotEntity.controls.QUOTFINL.controls.DOWNPAYMENTPCT.setValue(0, { emitEvent: false, onlySelf: true });
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }
}
