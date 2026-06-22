import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlFinder } from '@NFS_Core/NFSControls/nfs-control-helper/Localization';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { QuotationService } from '@NFS_Core/NFSServices/Quotation/quotation.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { HeaderTitleService } from '@NFS_Core/NFSServices/_helper/header-title-service.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as QUOTENTITY from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { IQuotEntity } from '@NFS_Entity/Quot-Entity/Quot.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { QueueOperation } from '@NFS_Enums/WorkQueueOperation.enum';
import { IValidationErrors } from '@NFS_Interfaces/OtherInterfaces/IValidationErrors.interface';
import { IWorkQueueResult } from '@NFS_Interfaces/OtherInterfaces/IWorkQueueResult';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IQuotationInfoParm } from '@NFS_Interfaces/RequestInterfaces/IQuotationInfoParm';
// import { ExistingBpMapperService } from '@NFS_Modules/IOPS/IOPSServices/existing-bp-mapper.service';
import { QuotEntityMapperService } from '@NFS_Modules/IOPS/IOPSServices/quot-entity-mapper.service';
import { QuotEntityFormService } from '@NFS_Modules/IOPS/IOPSServices/QuotEntityForm.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getFormValidationErrors } from 'src/app/Helpers/ErrorValidators';

//import { v4 as uuid } from 'uuid';

@Component({
    selector: 'app-iopsmain',
    templateUrl: './iopsmain.component.html',
    styleUrls: ['./iopsmain.component.css'],
    standalone: false
})
export class IOPSMainComponent implements OnInit, OnDestroy {
  @Input() Mode: string = FormMode.NEW;
  RowState = DataRowState;
  tabs = ['Applicant Information', 'Address Details', 'General Information', 'Documents'];
  selected = new FormControl();
  step = 0;
  QUOT: FormGroup<QUOTENTITY.IQuotEntity> = this._QuotForm.QuotEntityForm();
  QUOTINFO!: FormGroup<QUOTENTITY.IQUOTInfo>;
  QUOTAPPLICANTADDRESS!: FormGroup<QUOTENTITY.IQuotApplicantAddressEntity>;
  QUOTDOCUMENTSINFO!: FormArray<QUOTENTITY.IQUOT_DOCTInfo>;
  QUOTAPPLICANTS!: FormArray<QUOTENTITY.IQuotApplicantEntity>;
  QUOTAPPLICANTINFO!: FormGroup<QUOTENTITY.IQUOT_APLTInfo>;
  QUOTAPPLICANTPHONEFAXINFO!: FormGroup<QUOTENTITY.IQUOT_APLT_PHNE_FAXInfo>;
  QUOTAPPLICANTIDDETAILINFO!: FormGroup<QUOTENTITY.IQUOT_APLT_ID_DETLInfo>;
  QUOTAPPLICANTADDRESSINFO!: FormGroup<QUOTENTITY.IQUOT_APLT_ADDSInfo>;
  QUOTAPPLICANTADDRESSDETAILINFO!: FormGroup<QUOTENTITY.IQUOT_APLT_ADDS_DETLInfo>;
  QUOTADDITIONALINFO!: FormGroup<QUOTENTITY.IQUOT_ADDL_INFOInfo>;
  QuotMode: string = 'New';
  isIndividualChecked: boolean = true;
  type: any = '';
  leadTypeData: Array<INFSDropDownData> = [];
  request!: mPOSMasterDataRequest;
  collection: Array<Observable<any>> = [];

  applicantEditPanel = false;
  documentViewPanel = false;
  IsLeadInReadonlyMode = false
  isSubmitclicked = false;
  LoggedinUserRole: string = '';
  LeadStatus: string = '';
  subscription$ = new Subject();

  applicantTab = true;
  assetTab = false;

  initializeLeadForm() {
    this.QUOTINFO = this.QUOT.get("QUOT") as FormGroup<QUOTENTITY.IQUOTInfo>;
    this.QUOTADDITIONALINFO = this.QUOT.get("QUOTADDLINFO") as FormGroup<QUOTENTITY.IQUOT_ADDL_INFOInfo>;
    this.QUOTDOCUMENTSINFO = this.QUOT.get("QUOTDOCT") as FormArray<QUOTENTITY.IQUOT_DOCTInfo>;
    this.QUOTAPPLICANTS = this.QUOT.get("QUOTAPPLICANT") as FormArray<QUOTENTITY.IQuotApplicantEntity>;
    this.QUOTINFO.controls.QSTOKEN.setValue(this.randomString(25));
    this.LoggedinUserRole = this._store.GetUserGroupCode();
    this.setMode();
  }

  constructor(private _FormState: StateManagment, private _QuotForm: QuotEntityFormService, public _masterDataService: MasterDataService, private _FormModeService: FormModeService,
    private router: Router, private route: ActivatedRoute, private _QuotationService: QuotationService, private toastr: ToastrService,
    public appConfig: AppConfigService,
    private _store: ClientStoreService, private _QuotEntityMapperService: QuotEntityMapperService, private _appTypeService: ApplicationTypeService,
    private _formBuilder: FormBuilder, private _formatter: FormatterService, private _dialog: DialogBoxService, private headerTitleService: HeaderTitleService) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let quot_Params = this.router?.getCurrentNavigation()?.extras?.state;
    if (quot_Params?.QueueOperation)
      this.QuotMode = quot_Params?.QueueOperation;
    if (quot_Params?.Quot && quot_Params.QueueOperation == QueueOperation.EDIT) {
      this.Mode = FormMode.EDIT;
      this._FormModeService.FormMode = FormMode.EDIT;
      this.readQuotation(quot_Params);
      this.IsLeadInReadonlyMode = false;
    }
    else if (quot_Params?.Quot && quot_Params.QueueOperation == QueueOperation.VIEW) {
      this.IsLeadInReadonlyMode = true;
      this.Mode = FormMode.VIEW;
      this._FormModeService.FormMode = FormMode.VIEW;
      this.readQuotation(quot_Params);
    }
    else {
      //this.subscribeValueChange();
    }
  }

  ngOnInit(): void {

    // this.QUOT.valueChanges.subscribe(val => {
    //   console.log("Lead Main Entity: ", val)
    // })
    // if (this.appConfig.LocalData != null && this.appConfig.ValidationsData != null)
    //   this.appConfig.loadData().subscribe(data => {
    //     this.appConfig.LocalData = data.LocalData;
    //     this.appConfig.ValidationsData = data.ValidationsData
    //   })
    this.initializeLeadForm();
    const data: any = this.route.snapshot.data['collection'];
    this._masterDataService.InitializeMasterData(data);
    this.leadTypeData = this._masterDataService.ApplicantTypeSetup;
    if (this._appTypeService.getApplicationType() == 'Individual') {
      this.isIndividualChecked = true;
      this._masterDataService.ApplicantIdTypesSetup = this._masterDataService.ApplicantIdTypesSetup.filter(x => x.APPTYP != 'C');
      this.QUOT.controls.QUOT.controls.QUOTATIONTYPECDE.setValue('00001');
    }
    else {
      this.isIndividualChecked = false;
      this._masterDataService.ApplicantIdTypesSetup = this._masterDataService.ApplicantIdTypesSetup.filter(x => x.APPTYP != 'I');
      this.QUOT.controls.QUOT.controls.QUOTATIONTYPECDE.setValue('00002');
    }
  }

  SaveIOPS() {
    if (this.QUOT.dirty) { }
  }

  RemoveTest() {

  }

  addTab(selectAfterAdding: boolean) {
    this.tabs.push('New');

    if (selectAfterAdding) {
      //this.selected.setValue(this.tabs.length - 1);
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  nextTab() {
    this.selected.setValue(this.selected.value + 1);
  }

  prevTab() {
    this.selected.setValue(this.selected.value - 1);
  }

  tabChange() {
    if (this.selected.value == 3 && !this.QUOT.controls.QUOT.controls.QUOTATIONNBR.value) {
      this.prevTab();
      this.toastr.clear();
      this.toastr.warning('Please Save Lead Before Opening Document Tab.')
    }
  }

  geLeadTypeData() {
    this.request = new mPOSMasterDataRequest();
    this.request.masterDataOperation = MasterData.ApplicationTypeCode;
  }

  btnCancel() {
    var dialog;
    if (this.LeadStatus != 'canceled') {
      // if (this._store.GetUserGroupCode() == '00105') {
      //   dialog = this._dialog.openDialog("Application Cancellation", "Are you sure you want to cancel the application?", false, "Yes", "No");
      //   dialog.afterClosed().subscribe((result: any) => {
      //     if (result === "ok") {
      //       let workQueueParams = {} as IQuotationInfoParm;
      //       workQueueParams.QuotationId = this.QUOTINFO.value.QUOTATIONID;
      //       workQueueParams.USERID = this._store.GetUserInfo()?.UserId
      //       workQueueParams.UserGroup = this._store.GetUserGroupCode()
      //       this._QuotationService.CancelQuotation(workQueueParams).subscribe(response => {
      //         this.LeadStatus = 'canceled'
      //         this.toastr.success('Lead canceled successfully');
      //         this.QUOT.markAsPristine();
      //         this.router.navigateByUrl('/WorkQueue');
      //         this.headerTitleService.setTitle("Work Queue");
      //       });
      //     }
      //   });
      // }
      // else {
      dialog = this._dialog.openCancellationDialog();
      dialog.afterClosed().subscribe((result: any) => {
        if (result) {
          let workQueueParams = {} as IQuotationInfoParm;
          workQueueParams.QuotationId = this.QUOTINFO.value.QUOTATIONID; //event.Quot.QUOTATIONID;
          workQueueParams.USERID = this._store.GetUserInfo()?.UserId; //event.Quot.USERID;
          workQueueParams.CancellationReason = result.RejectionReason;
          workQueueParams.CancellationComments = result.Comments;
          workQueueParams.UserGroup = this._store.GetUserGroupCode()
          this._QuotationService.CancelQuotation(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(response => {
            this.LeadStatus = 'canceled'
            this.toastr.success('Lead canceled successfully');
            this.QUOT.markAsPristine();
            this.router.navigateByUrl('/WorkQueue');
            this.headerTitleService.setTitle("Work Queue");
          });
        }
      });
    }
    // }
    else {
      this.toastr.warning('Lead is already canceled!');
    }
  }

  btnAssign() {
    if (this.LeadStatus != 'canceled') {
      let quotinfo = {} as IWorkQueueResult
      quotinfo.QUOTATIONID = this.QUOTINFO.value.QUOTATIONID;
      quotinfo.QUOTATIONNBR = this.QUOTINFO.value.QUOTATIONNBR;
      quotinfo.BRANCHID = this.QUOTINFO.controls?.BPBRANCHID.value;
      quotinfo.CREATEDBYMVOIND = this.QUOTINFO.controls?.CREATEDBYMVOIND.value;
      quotinfo.CREATEDBY = this.QUOTINFO.controls?.CREATEDBY.value;
      let dialogRef = this._dialog.openAssignToVOComponent(quotinfo, false);
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.QUOT.markAsPristine();
          this.router.navigateByUrl('/WorkQueue');
          this.headerTitleService.setTitle("Work Queue");
        }
      });
    }
    else {
      this.toastr.warning('Lead is canceled!');
    }
  }

  btnSave(SubmitForm: boolean = false) {
    if (!this.throwValidations()) {
      return;
    }
    if (this._FormModeService.FormMode == FormMode.EDIT) {
      this._FormState.SetFormState(this.QUOT, FormMode.EDIT, DataRowState.Updated, true);
    }
    this.preSave();

    this._QuotationService.SaveQuotation(this.QUOT.value).pipe(takeUntil(this.subscription$)).subscribe(response => {
      if (response.error || response.MESSAGE == "Error." || response.ResultSet == null) {
        this.toastr.error("Something went wrong. Lead did not saved");
        return;
      }
      let data: IQuotEntity = response.ResultSet as IQuotEntity;
      this._QuotEntityMapperService.QuotEntityMapper(this.QUOT, data);
      this._FormState.ResetFormState(this.QUOT, DataRowState.Pristine);
      this.QUOT.markAsPristine();
      this.subscribeValueChange(FormMode.EDIT);
      this.Mode = FormMode.EDIT;

      if (response.MESSAGE == "Success.") {
        if (SubmitForm === false) {
          this.toastr.success("Lead Saved Successfully");
        }
        else if (SubmitForm === true) {
          this.btnSubmit();
        }
      }
    });
  }

  preSave() {
    this.QUOT.controls.QUOT.controls.BPCOMPANYID.patchValue(this._store.GetUserInfo()?.CompanyId);
    this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.ROLECDE.patchValue("00003");
    this.QUOT.controls.QUOT.controls.STATUSCDE.patchValue("00001");
    this.QUOT.controls.QUOT.controls.STATUSDSC.patchValue("Draft");
    this.QUOT.controls.QUOT.controls.CREATEDBY.patchValue(this._store.GetUserInfo()?.UserId);
    this.QUOT.controls.QUOT.controls.ASSIGNEDTO.patchValue(this._store.GetUserInfo()?.UserId);

    if (this.QUOT.controls.QUOT.controls.QUOTATIONTYPECDE.value == "00001") {
      if (this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.FIRSTNME) {
        this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.setValue(this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.FIRSTNME.value);
        if (this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.MIDDLENME) {
          this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.setValue(this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.value + " " + this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.MIDDLENME.value);
        }
        if (this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.LASTNME) {
          this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.setValue(this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.value + " " + this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.LASTNME.value);
        }
      }
      this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.setValue(this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.value.trim());
      this.QUOT.controls.QUOT.controls.CUSTOMERTYPE.setValue('I');
    }
    if (this.QUOT.controls.QUOT.controls.QUOTATIONTYPECDE.value == "00002") {
      if (this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.COMPANYNAME) {
        this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.CUSTOMERNME.setValue(this.QUOT.controls.QUOTAPPLICANT.controls[0].controls.QUOTAPLT.controls.COMPANYNAME.value.trim());
      }
      this.QUOT.controls.QUOT.controls.CUSTOMERTYPE.setValue('C');
    }
    if (this._store.MVOUserGroupCodeExist()) {
      this.QUOT.controls.QUOT.controls.CREATEDBYMVOIND.setValue(true);
    }
    else {
      this.QUOT.controls.QUOT.controls.CREATEDBYMVOIND.setValue(false);
    }

  }

  throwValidations(): boolean {
    if (this.QUOT.controls.QUOTAPPLICANT.value[0].QUOTAPLTIDDETL?.filter(x => x.RowState != DataRowState.Removed).length == 0) {
      this.toastr.clear();
      this.toastr.warning('Please add atleast one ID Type.');
      return false
    }
    else {
      let isDefaultExist = this.QUOT.controls.QUOTAPPLICANT.value[0].QUOTAPLTIDDETL.find(x => x.DEFAULTIND === true && x.RowState != DataRowState.Removed);
      if (isDefaultExist == null) {
        this.toastr.clear();
        this.toastr.warning('Please add atleast one default ID Type.');
        return false;
      }
    }
    let contactAddressCount = 0;
    let emergencyAddressCount = 0;
    let IsEmergencyAddresswithOther = false;
    let HasLegalAddress = false;
    let HasDefaultAddress = false;
    let IsemergencyDefault = false;
    let IsMobileAvailableWithLegal = false;
    let IsEmergencyPhone = false;
    let IsEmptyAddress = false;
    let filteredAddresses = this.QUOT.controls.QUOTAPPLICANT.value[0].QUOTAPPLICANTADDRESS?.filter(x => x.RowState != DataRowState.Removed);
    for (var addressIndex in filteredAddresses) {

      // Shifted to address type change event
      // if (filteredAddresses[addressIndex].QUOTAPLTADDS) {
      //   if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00001" && addrType.RowState != DataRowState.Removed)) {
      //     contactAddressCount = contactAddressCount + 1;
      //   }
      // }

      // if (filteredAddresses[addressIndex].QUOTAPLTADDS) {
      //   if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00007" && addrType.RowState != DataRowState.Removed)) {
      //     emergencyAddressCount = emergencyAddressCount + 1;
      //   }
      // }

      // let addressDetailObj = filteredAddresses[addressIndex].QUOTAPLTADDSDETL;
      // if (addressDetailObj) {
      //   if (addressDetailObj.find(addrType => addrType.ADDRESSTYPECDE == "00007" && addrType.RowState != DataRowState.Removed) != null && addressDetailObj.filter(x => x.RowState != DataRowState.Removed).length > 1) {
      //     IsEmergencyAddresswithOther = true;
      //   }
      // }

      if (filteredAddresses[addressIndex].QUOTAPLTADDS) {
        if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00006" && addrType.RowState != DataRowState.Removed)) {
          HasLegalAddress = true;
        }
      }

      if (filteredAddresses[addressIndex].QUOTAPLTADDS.ADDRESSTYPE.length == 0 &&
        filteredAddresses[addressIndex].QUOTAPLTADDS.RowState != DataRowState.Removed) {
        IsEmptyAddress = true;
      }

      filteredAddresses[addressIndex].QUOTAPLTADDSDETL
        .filter(addrType => {
          if (addrType.DEFAULTIND == true && addrType.RowState != DataRowState.Removed) {
            HasDefaultAddress = true;
          }
        });

      // Shifted to address type change event
      // if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL) {
      //   if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00007" && addrType.DEFAULTIND === true && addrType.RowState != DataRowState.Removed)) {
      //     IsemergencyDefault = true;
      //   }
      // }

      /***************************************** START: Adress Mobile Validation ********************************************************/
      /***** Check Mobile Validation against Legal Address ******/
      if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL) {
        if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00006" && addrType.RowState != DataRowState.Removed)) {
          if (filteredAddresses[addressIndex].QUOTAPLTPHNEFAX.length > 0) {
            if (filteredAddresses[addressIndex].QUOTAPLTPHNEFAX.find(phonType => phonType.PHONETYPECDE === "00003" && phonType.RowState != DataRowState.Removed)) {
              IsMobileAvailableWithLegal = true;
            }
          }
        }
      }
      if (filteredAddresses[addressIndex].QUOTAPLTPHNEFAX && filteredAddresses[addressIndex].QUOTAPLTPHNEFAX?.filter(x => x.RowState != DataRowState.Removed).length > 0) {

        let isDefaultPhoneExist = filteredAddresses[addressIndex].QUOTAPLTPHNEFAX.find(x => x.DEFAULTIND === true && x.RowState != DataRowState.Removed);
        if (isDefaultPhoneExist == null) {
          this.toastr.clear();
          let addressDetailTab = Number(addressIndex) + 1;
          this.toastr.warning('Please mark default Phone Type against Address ' + addressDetailTab);
          return false;
        }

      }
      /***** Mandatory Phone check against emegency address ******/
      if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL) {
        if (filteredAddresses[addressIndex].QUOTAPLTADDSDETL.find(addrType => addrType.ADDRESSTYPECDE === "00007" && addrType.RowState != DataRowState.Removed)) {
          if (filteredAddresses[addressIndex].QUOTAPLTPHNEFAX.filter(x => x.RowState != DataRowState.Removed).length > 0) {
            IsEmergencyPhone = true;
          }
        }
        else {

          IsEmergencyPhone = true; // No emergency address so condition is true
        }
      }

      /***************************************** END: Adress Mobile Validation ********************************************************/

    }
    // Shifted to address type change event
    // if (contactAddressCount > 1) {
    //   this.toastr.clear();
    //   this.toastr.warning('only one contact Address Allowed, you have selected more than one contact address.');
    //   contactAddressCount = 0;
    //   return false;
    // }
    // if (emergencyAddressCount > 1) {
    //   this.toastr.clear();
    //   this.toastr.warning('Emergency address can not be duplicate.');
    //   emergencyAddressCount = 0;
    //   return false;
    // }
    // if (IsEmergencyAddresswithOther) {
    //   this.toastr.clear();
    //   this.toastr.warning('Selection of Emergency Address with other Addresses is not allowed.');
    //   IsEmergencyAddresswithOther = false;
    //   return false;
    // }
    // if (IsemergencyDefault) {
    //   this.toastr.clear();
    //   this.toastr.warning('Emergency address can not be default.');
    //   IsemergencyDefault = false;
    //   return false;
    // }

    if (!HasLegalAddress) {
      this.toastr.clear();
      this.toastr.warning('Atleast one Legal address should be added.');
      HasLegalAddress = false;
      return false;
    }
    if (!HasDefaultAddress) {
      this.toastr.clear();
      this.toastr.warning('One address should be marked as default.');
      HasDefaultAddress = false;
      return false;
    }
    if (!IsMobileAvailableWithLegal) {
      this.toastr.clear();
      this.toastr.warning('Legal Address Must have atleast one Mobile Number.');
      IsMobileAvailableWithLegal = false;
      return false;
    }
    if (!IsEmergencyPhone) {
      this.toastr.clear();
      this.toastr.warning('Emegency Address Must have atleast one Phone Number.');
      IsEmergencyPhone = false;
      return false;
    }
    if (IsEmptyAddress) {
      this.toastr.clear();
      this.toastr.warning('Please Select any Address Type.');
      return false;
    }
    let errorString: string[] = [];
    if (this.QUOT.value.QUOTFINL.ASSETCOST <= 0)
      errorString.push('Asset Cost is required.');
    if (this.QUOT.value.QUOTFINL.CONTRACTTERMS <= 0)
      errorString.push('Tenor is required.');
    if (this.QUOT.value.QUOT.FINANCETYP == '00005' && this.QUOT.value.QUOT.ISMCOMCAMPAIGN == false) {
      if (!this.QUOT.value.QUOTFINL.DOWNPAYMENTAMNT)
        errorString.push('DP Amount is required.');
      if (!this.QUOT.value.QUOTFINL.DOWNPAYMENTPCT)
        errorString.push('DP % is required.');
    }

    let knownError = ['pattern', 'max', 'min', 'email', 'matDatepickerParse']
    let errors: IValidationErrors[];
    errors = getFormValidationErrors(this.QUOT.controls);

    errors.forEach((error: IValidationErrors) => {
      let control: any = ControlFinder(this._store.GetLocalData(), error.control_name);

      if (knownError.includes(error.error_name))
        errorString.push(control[0]?.LocalValue + " is not valid");
      else
        errorString.push(control[0]?.LocalValue + " is required")
    })

    if (errorString.length > 0) {
      errorString.forEach((error: string) => {
        this.toastr.warning(error.replace('*', ''));
      })
      //this.toastr.warning(errorString.join('</br>'));
      return false;
    }
    return true;
  }

  setMode() {
    if (this.Mode === FormMode.NEW) {
      this.QUOTINFO.controls.QUOTATIONTYPECDE.enable();
    }
    else if (this.Mode === FormMode.VIEW) {
      this.QUOTINFO.controls.QUOTATIONTYPECDE.disable();
    }
  }

  readQuotation(params: any) {
    let workQueueParams = {} as IQuotationInfoParm;
    workQueueParams.QuotationId = params.Quot.QUOTATIONID;
    this._QuotationService.ReadQuotation(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(response => {
      let data: IQuotEntity = response.ResultSet as IQuotEntity;
      this._QuotEntityMapperService.QuotEntityMapper(this.QUOT, data);

      //this.QUOT.patchValue(data);
      this._FormState.ResetFormState(this.QUOT, DataRowState.Pristine);

      //this.resetState(response.ResultSet);
      // this.QUOT.markAsPristine();
      // this._FormState.SetFormState(this.QUOT, FormMode.EDIT, DataRowState.None);
      this.QUOT.markAsPristine();
      //this.subscribeValueChange(this.Mode);

      //this.QUOT.markAsPristine();
      //this.Mode = FormMode.EDIT;

      if (this.QUOT.controls.QUOTDOCT.value) {
        this._QuotationService.setQuotObs(this.QUOT.controls.QUOTDOCT.value);
      }
      if (response.CODE != 1)
        this.toastr.error(response.MESSAGE);

    });
  }

  LoadExistingBPchildOutput(BPdata: any): void {

    if (BPdata.Quotdata != null) {

      let data: IQuotEntity = BPdata.Quotdata.data as IQuotEntity;
      data.QUOT.ISSEARCHED = true;
      data.QUOT.QSTOKEN = this.randomString(25)
      if (this._appTypeService.getApplicationType() == 'Individual') {
        this.isIndividualChecked = true;
        this._masterDataService.ApplicantIdTypesSetup = this._masterDataService.ApplicantIdTypesSetup.filter(x => x.APPTYP != 'C');
        data.QUOT.QUOTATIONTYPECDE = '00001';
      }
      else {
        this.isIndividualChecked = false;
        this._masterDataService.ApplicantIdTypesSetup = this._masterDataService.ApplicantIdTypesSetup.filter(x => x.APPTYP != 'I');
        data.QUOT.QUOTATIONTYPECDE = '00002';
      }
      for (let i = 0; i < data.QUOTAPPLICANT[0].QUOTAPPLICANTADDRESS.length; i++) {
        for (let j = 0; j < data.QUOTAPPLICANT[0].QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX.length; j++) {
          data.QUOTAPPLICANT[0].QUOTAPPLICANTADDRESS[i].QUOTAPLTPHNEFAX[j].COUNTRYCODE = '62';
        }
      }

      this._QuotEntityMapperService.QuotEntityMapper(this.QUOT, data, FormMode.NEW);
      this._FormState.ResetFormState(this.QUOT, DataRowState.Added);
      this.QUOT.markAsPristine();
    }
    //this.subscribeValueChange(FormMode.NEW);
    this.Mode = FormMode.NEW;
  }
  private randomString(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * (charactersLength - 1)));
    }
    return result;
  }

  subscribeValueChange(operation: any = '') {
    if (operation == QueueOperation.EDIT) {
      this.QUOT.markAsPristine();
      this.QUOT.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
        if (this.QUOT.dirty)
          this._FormState.SetFormState(this.QUOT, FormMode.EDIT, DataRowState.Updated, true);
      })
    }
  }

  btnSubmit() {
    this.isSubmitclicked = true;
    let request = {} as QUOTENTITY.IQUOTInfo;
    request.QUOTATIONNBR = this.QUOT.controls.QUOT.controls.QUOTATIONNBR.value;
    request.QUOTATIONID = this.QUOT.controls.QUOT.controls.QUOTATIONID.value;

    this._QuotationService.SubmitQuotation(request).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res.MESSAGE == "Success") {
        this.toastr.success("Lead Submitted Successfully. Lead Number: " + this.QUOT.controls.QUOT.controls.QUOTATIONNBR.value);
        this.QUOT.markAsPristine();
        this.router.navigateByUrl('/WorkQueue');
        this.headerTitleService.setTitle("Work Queue");
      }
      else {
        this.isSubmitclicked = false;
        this.toastr.error("Something went wrong");
      }
    })
  }

  isDisabled(isDisabled: boolean) {
    return isDisabled;
  }

  resetState(obj: any) {
    for (let k in obj) {
      if (typeof obj[k] === "object") {
        this.resetState(obj[k])
      } else {
        // base case, stop recurring
        if (obj['RowState']) {
          obj['RowState'] = 1;
        }
      }
    }
  }

  onChange(val: any) {
    this.type = val;
  }

  openDocumentView() {
    this.applicantEditPanel = !this.applicantEditPanel;
    this.documentViewPanel = !this.documentViewPanel;
  }

  goBack() {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  AssetsActive() {
    this.assetTab = !this.assetTab;
    this.applicantTab = false;
  }

  proposalActive() {
    this.applicantTab = !this.applicantTab;
    this.assetTab = false;
  }


}
