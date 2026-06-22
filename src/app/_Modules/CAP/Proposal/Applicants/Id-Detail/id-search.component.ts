import { formatDate } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { IPRPL_APLT_ID_DETLInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_ID_DETLInfo.model';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { IActionList } from '@NFS_Interfaces/OtherInterfaces/IActionList.interface';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityMapperService } from '@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-id-search',
    templateUrl: './id-search.component.html',
    standalone: false
})
export class IdSearchComponent implements OnInit, OnDestroy {
  @Input() Mode: string = FormMode.NEW;
  panelOpenState = false;
  isLoad = false;
  public IdTypesbyAppTyp: INFSDropDownData[] = [];
  public toDate = new Date(Date.now());
  public columns = ['TYPE', 'IDTYPENBR', 'ISSUEDTE', 'EXPIRYDTE', 'DEFAULTIND'];
  public pipes = [null, null, 'formatDate', 'formatDate', null];
  public labels = ['ID Type', 'ID Number', 'Issue Date', 'Expiry Date', 'Default'];
  public loadIDddetailColumns = ['IDTYPENBR', 'NAME', 'DATEOFBIRTH', 'APPLICANTTYPE'];
  public loadIDddetailLabels = ['ID No.', 'Name', 'Date of Birth', 'Source'];
  public loadIDddetailPipes = [null, null, 'formatDate', null];

  public isIdNumberDisabled: boolean = false;

  public ActionList: Array<IActionList> = [{ 'icon': 'edit', 'label': 'Update', 'action': 'update' }];
  existingBPParams = {} as IExistingBPInfoParm;
  public IdDetailForm: FormGroup<IPRPL_APLT_ID_DETLInfo> = this._proposalForm.proposalIndvidualIdtypeForm();
  public iddetailArray: FormArray<IPRPL_APLT_ID_DETLInfo> = this._formBuilder.array<IPRPL_APLT_ID_DETLInfo>([]);
  private subscription$ = new Subject();
  public msg: Array<string> = [];
  public addUpdateLabel: string = 'Add';
  public updateMode: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private _proposalmanagerservice: ProposalManagerService,
    public dialogRef: MatDialogRef<IdSearchComponent>, private _proposaldataService: ProposalDataService,
    public _masterDataService: MasterDataService, private _proposalForm: ProposalEntityFormService, private _toastr: ToastrService, private _proposalService: ProposalService,
    @Inject(MAT_DIALOG_DATA) public data: any, private _proposalMapperService: ProposalEntityMapperService, private _formModeService: FormModeService, private _messageService: MessageService
  ) { }

  public loadIDddetailArray: FormArray<IPRPL_APLT_ID_DETLInfo> = this._formBuilder.array<IPRPL_APLT_ID_DETLInfo>([]);

  ngOnInit(): void {
    if (this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.value == "I")
      this.IdTypesbyAppTyp = this._masterDataService.ApplicantIdTypesSetup.filter(x => x.APPTYP != 'C');
    else {
      this.IdTypesbyAppTyp = this._masterDataService.ApplicantIdTypesSetup.filter(x => x.APPTYP == 'C' || x.APPTYP == 'A');
      this.loadIDddetailColumns = ['IDTYPENBR', 'NAME', 'ESTABLISHEDSINCE', 'APPLICANTTYPE'];
      this.loadIDddetailLabels = ['ID No.', 'Name', 'Established Since', 'Source'];

    }
    this.iddetailArray = this.data.IDTypeArray;
    this.FillGridDescriptions();
  }

  childOutput(event: any) {

  }

  addIdDetail() {
    let IdTypeBothDates: string[] = [IDTypeCode.KTP, IDTypeCode.Passport, IDTypeCode.KITAS_KIMS, IDTypeCode.TDPPT, IDTypeCode.EmployeeId]
    if (!this.IdDetailForm.controls.IDTYPECDE.value) {
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
    if (!IdTypeBothDates.includes(this.IdDetailForm.controls.IDTYPECDE.value) && !this.IdDetailForm.controls.ISSUEDTE.value) {
      this._toastr.warning('Issue Dates is required.');
      return;
    }
    if (this.IdDetailForm.controls.EXPIRYDTE.value != null && this.IdDetailForm.value.ISSUEDTE != null && new Date(this.IdDetailForm.value.ISSUEDTE) >= new Date(this.IdDetailForm.controls.EXPIRYDTE.value)) {
      this._messageService.showMesssage('ExpirayDateGreaterThanIssuedDate', MessageType.Warning);
      return;
    }
    if (this.updateMode) {

      let updatedIndex = this.iddetailArray.value.findIndex(a => a.IDTYPECDE === this.IdDetailForm.controls.IDTYPECDE.value);
      if (this.IdDetailForm.controls.RowState.value != DataRowState.Added) {
        this.IdDetailForm.controls.RowState.setValue(DataRowState.Updated);
      }
      this.IdDetailForm.controls.DEFAULTIND.setValue(this.iddetailArray.controls[updatedIndex].value.DEFAULTIND);
      this.iddetailArray.controls[updatedIndex].patchValue(this.IdDetailForm.value);
      this.resetIdDetailValues();
      this.updateMode = false;
      this.addUpdateLabel = "Add";
      return;
    }
    if (this._proposalmanagerservice.isBPalreadyLoaded(this.IdDetailForm.value.IDTYPENBR, this.IdDetailForm.value.IDTYPECDE) == true) {
      this._messageService.showMesssage("msgIDAlreadyAdded", MessageType.Warning);
      return;
    }
    this.IdDetailForm.controls.IDTYPENBR.setValue(this.IdDetailForm.controls.IDTYPENBR.value.trim())
    var isDefaultExisting = this.iddetailArray.value.find(x => x.DEFAULTIND == true && x.RowState !== DataRowState.Removed);
    var element: FormGroup<IPRPL_APLT_ID_DETLInfo> = this._proposalForm.proposalIndvidualIdtypeForm();
    let idDetail = this._masterDataService.ApplicantIdTypesSetup?.find(t => t.code === this.IdDetailForm.controls.IDTYPECDE.value);
    let removedIndex = this.iddetailArray.value.findIndex(a => a.IDTYPECDE === this.IdDetailForm.controls.IDTYPECDE.value && a.RowState == DataRowState.Removed);
    if (removedIndex > 0) {
      let formGroup: FormGroup<IPRPL_APLT_ID_DETLInfo> = this.iddetailArray.controls[removedIndex] as FormGroup<IPRPL_APLT_ID_DETLInfo>;
      formGroup.patchValue(this.IdDetailForm.value);
      formGroup.controls.TYPE.setValue(idDetail?.TextValue || '');
      formGroup.controls.RowState.setValue(DataRowState.Updated);
      formGroup.controls.PRPLIDSEQ.setValue(this.data.ProposalId);
      formGroup.controls.DEFAULTIND.setValue(false);
      if (!isDefaultExisting) {
        formGroup.controls.DEFAULTIND.setValue(true);
      }
    }

    else {
      element.patchValue(this.IdDetailForm.value);
      element.controls.TYPE.setValue(idDetail?.TextValue || '');
      element.controls.PRPLIDSEQ.setValue(this.data.ProposalId);
      if (!isDefaultExisting) {
        element.controls.DEFAULTIND.setValue(true);
      }
      else
        element.controls.DEFAULTIND.setValue(false);
    }
    var data = this.iddetailArray.value.filter(a => a.IDTYPECDE === element.controls.IDTYPECDE.value && a.RowState != DataRowState.Removed);

    if (data.length > 0 && !this.isLoad) {

      this._toastr.warning('Id Type Should Not Be Duplicate.')
      return;
    }

    if (removedIndex <= 0) {
      this.iddetailArray.push(element);
    }
    this.resetIdDetailValues();
    this.isLoad = false;
    this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.BLACKLISTIND.setValue(false)
  }

  searchExistingBP() {
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

    if (this._proposalmanagerservice.isBPalreadyLoaded(this.IdDetailForm.value.IDTYPENBR, this.IdDetailForm.value.IDTYPECDE) == true) {
      this._messageService.showMesssage("msgIDAlreadyAdded", MessageType.Warning);
      return;
    }
    this.existingBPParams.IdCardNumber = this.IdDetailForm.controls.IDTYPENBR?.value;
    this.existingBPParams.IdCardTyp = this.IdDetailForm.controls.IDTYPECDE?.value;
    if (this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.value == "I") {
      this._proposalService.ReadExistingBPandApplicant(this.existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
        this.LoadIDDetail(res);
      });
    }
    else {
      this._proposalService.ReadExistingBPCompany(this.existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
        this.LoadIDDetail(res);
      });
    }
  }

  LoadIDDetail(res: any) {
    if (res && res.ResultSet && res.ResultSet.length > 0) {
      this.isLoad = true;
      this.loadIDddetailArray = this._formBuilder.array<IPRPL_APLT_ID_DETLInfo>([]);
      var filteredData;
      if (res.ResultSet.filter((r: any) => r.APPLICANTTYPE === "Contract").length > 0) {
        filteredData = this._formBuilder.group<IPRPL_APLT_ID_DETLInfo>(res.ResultSet.filter((r: any) => r.APPLICANTTYPE === "Contract")[0]);
      }
      else {
        filteredData = this._formBuilder.group<IPRPL_APLT_ID_DETLInfo>(res.ResultSet.filter((r: any) => r.APPLICANTTYPE === "Application")[0]);
      }
      this.loadIDddetailArray.push(filteredData);
    } else {
      this._messageService.showMesssage("NoRecordFound", MessageType.Info);
    }
  }

  LoadExistingBP(): void {

    if (this._proposalmanagerservice.isBPalreadyLoaded(this.IdDetailForm.value.IDTYPENBR, this.IdDetailForm.value.IDTYPECDE) == true) {
      this._messageService.showMesssage("msgIDAlreadyAdded", MessageType.Warning);
      return;
    }

    let params = {} as IProposalInfoParm;
    params.ModuleType = this.loadIDddetailArray.value[0].APPLICANTTYPE;
    params.ApplicantId = this.loadIDddetailArray.value[0].APPLICANTID;

    this._proposalService.LoadApplicantEntity(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res && res.ResultSet) {
        res.ResultSet[0].IdNumber = this.IdDetailForm.value.IDTYPENBR;
        res.ResultSet[0].APPLICANTTYPE = this.loadIDddetailArray.value[0].APPLICANTTYPE;
        this.dialogRef.close(res.ResultSet[0]);
        this.resetIdDetailValues()
      }
    });

    this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL?.controls.BLACKLISTIND.setValue(false)
  }

  Validations() {
    if (this._formModeService.FormMode != FormMode.VIEW) {
      this.PostBackDefaultCustomer();

      let isMandatoryIdTypeExist = this.iddetailArray.controls.filter(x => (x.controls.IDTYPECDE.value == IDTypeCode.KTP && x.value.RowState != DataRowState.Removed) || (x.controls.IDTYPECDE.value == IDTypeCode.SIUP && x.value.RowState != DataRowState.Removed));
      if (!this.isLoad) {
        if (!isMandatoryIdTypeExist || !(isMandatoryIdTypeExist.length > 0)) {
          this._toastr.clear();
          this._toastr.warning('Please Enter KTP or SIUP.');
          return;
        }
      }
      else {
        this._toastr.clear();
        this._toastr.warning('Please load the applicant');
        return;
      }

      let isIDTypeIssExpDte = this.iddetailArray.controls.filter(x => (x.controls.IDTYPECDE.value != IDTypeCode.SIUP && x.controls.IDTYPECDE.value != IDTypeCode.NPWP && x.value.RowState != DataRowState.Removed && x.controls.ISSUEDTE.value == null && x.controls.EXPIRYDTE.value == null));
      if (isIDTypeIssExpDte.length > 0) {
        this._toastr.clear();
        this._toastr.warning('Please enter Issue Date and Expiry Date of Default ID Type.');
        return;
      }
      let msgs: Array<string> = this.msg;
      if (msgs.length > 0) {
        let lstStr = msgs

        for (let i = 0; i < lstStr.length; i++) {
          this._messageService.showMesssage(lstStr[i], MessageType.Info);
          return;
        }
      }
      else {
        this.dialogRef.close();
      }
    }
    else {
      this.dialogRef.close();
    }
  }

  resetIdDetailValues() {
    this.IdDetailForm.controls.IDTYPECDE.setValue('');
    this.IdDetailForm.controls.IDTYPENBR.setValue('');
    this.IdDetailForm.controls.TYPE.setValue('');
    this.IdDetailForm.controls.EXECUTIONDTE.setValue(new Date());
    this.IdDetailForm.controls.EXPIRYDTE.setValue(null);
    this.IdDetailForm.controls.ISSUEDTE.setValue(null);
    this.IdDetailForm.controls.RowState.setValue(DataRowState.Added);
  }

  FillGridDescriptions() {
    if (this.iddetailArray) {
      this.iddetailArray.controls.filter(x => x.value.RowState != DataRowState.Removed).forEach((item, index) => {
        if (this.data.ismPOS && (item.controls.IDTYPECDE.value == IDTypeCode.KTP || item.controls.IDTYPECDE.value == IDTypeCode.NPWP)) {
          item.controls.isDeleteDisabled.setValue(true);
        }
        if (!item.value.TYPE) {
          let Type = this._masterDataService.ApplicantIdTypesSetup?.find(t => t.code === item.value.IDTYPECDE);
          this.iddetailArray.controls[index].controls.TYPE.setValue(Type?.TextValue || '')
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  MarkDefaultOnRemove() {
    var isDefaultExisting = this.iddetailArray.value.find(x => x.DEFAULTIND == true && x.RowState !== DataRowState.Removed);
    if (!isDefaultExisting) {
      let idDetail = this.iddetailArray.controls.filter(x => x.value.DEFAULTIND == false && x.value.RowState !== DataRowState.Removed)[0];
      idDetail.controls.DEFAULTIND.setValue(true);
      if (idDetail.controls.RowState.value !== DataRowState.Added) {
        idDetail.controls.RowState.setValue(DataRowState.Updated);
      }
    }
  }

  UpdateSelectedID(obj: any) {
    var selectedIDDetail = obj.Data;
    this.addUpdateLabel = 'Update';
    this.updateMode = true;
    if (selectedIDDetail.isDeleteDisabled) {
      this.isIdNumberDisabled = true;
    } else {
      this.isIdNumberDisabled = false;
    }
    this.IdDetailForm.setValue(selectedIDDetail);
  }

  private PostBackDefaultCustomer() {
    this.msg = [];
    this.iddetailArray.value.forEach(item => {
      if (item.EXPIRYDTE != null) {
        let expDate = formatDate(item.EXPIRYDTE, 'YYYY-MM-dd', 'en_US');
        let prplDate = formatDate(this._proposaldataService.PROPOSAL.value.PROPOSALDTE, 'YYYY-MM-dd', 'en_US');
        if (item.ISSUEDTE != null && expDate < prplDate && item.RowState != DataRowState.Removed) {
          this.msg.push("ExpiryDateGreaterThanApplicationCreationDate", MessageType.Warning);
        }
      }
    });
  }
}
