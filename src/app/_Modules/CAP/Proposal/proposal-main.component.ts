import { DatePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { DialogBoxService } from '@NFS_Core/NFSServices/DialogBox/dialog-box.service';
import { FilterService } from '@NFS_Core/NFSServices/Filter/filter.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { ProposalMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/proposalMasterDataRequests';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IProposalApplicantEntity, IProposalArticleEntity, IProposalEntity, IProposalTaxConfigEntity } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { ICompanyApplicantEntity, IIndividualApplicantEntity, IPRPL_APLT_ADDSInfo, IPRPL_APLT_RPRSInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { IProposalArticleComponentEntity, IPRPL_ARTE_AMNT_TRAN_TAXInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AddressTypeCode } from '@NFS_Enums/AdressTypeCode.enum';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { ApplicantRoleCode } from '@NFS_Enums/ApplicantRoleCode.enum';
import { ApplicantType } from '@NFS_Enums/ApplicantType.enum';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { AssetSelection } from '@NFS_Enums/AssetSelection.enum';
import { CommissionDivisionType } from '@NFS_Enums/CommissionDivisionType.enum';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { ComponentName } from '@NFS_Enums/Component.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { MaritalStatus } from '@NFS_Enums/MaritalStatus.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { OTO_BPKBOwnerType } from '@NFS_Enums/OTOBPKBOwnerType.enum';
import { ProposalHistoryAction } from '@NFS_Enums/ProposalHistoryAction.enum';
import { ProposalModuleCode } from '@NFS_Enums/ProposalModuleCode.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { StatusCode } from '@NFS_Enums/StatusCode.enum';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { QueueOperation } from '@NFS_Enums/WorkQueueOperation.enum';
import { IContextMenu } from '@NFS_Interfaces/OtherInterfaces/IContextMenu.interface';
import { IPRPLQUInfo } from '@NFS_Interfaces/OtherInterfaces/IPRPLQUInfo';
import { IWorkQueueResult } from '@NFS_Interfaces/OtherInterfaces/IWorkQueueResult';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IExistingBPInfoParm } from '@NFS_Interfaces/RequestInterfaces/iexisting-bpinfo-parm';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from "@NFS_Modules/CAP/CAPServices/proposal-data.service";
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProposalEntityMapperService } from '../CAPServices/proposal-entity-mapper.service';
import { ProposalManagerService } from '../_helpers/proposal-manager.service';
import { IdSearchComponent } from './Applicants/Id-Detail/id-search.component';
import { DealerSearchComponent } from './GeneralInfo/dealer-search.component';
import { CommissionService } from './GeneralInfo/commissionApplicable.Helper';
import { InsuranceCollectionTypes } from '@NFS_Enums/InsuranceCollectionTypes.enum';
import { IAssetInfoParams } from '@NFS_Interfaces/RequestInterfaces/asset-search-info-params';
@Component({
    selector: 'app-proposal-main',
    templateUrl: './proposal-main.component.html',
    styleUrls: ['./proposal-main.component.css'],
    standalone: false
})

export class ProposalMainComponent implements OnInit, OnDestroy {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  public container!: ViewContainerRef;
  ProposalEntity!: FormGroup<PROPOSALENTITY.IProposalEntity>;
  PROPOSAL!: FormGroup<PROPOSALENTITY.IPRPLInfo>;
  ApplicantEntity!: FormArray<PROPOSALENTITY.IProposalApplicantEntity>;

  public branchDropDown: INFSDropDownData[] = [];
  public ApplicantCategory: INFSDropDownData[] = this._masterDataService.ApplicantCategoryCode;

  isIndividualApplicant = true;
  checked = false;
  documentTrackingEnable = true;
  indeterminate = false;
  showMoreContent = false;
  applicantTab = true;
  financialTab = false;
  assetTab = false;
  documentTab = false;
  applicantEditPanel = false;
  documentViewPanel = false;
  workQueueResultSet = [] as Array<IWorkQueueResult>;
  public workQueueDataset: FormArray<IWorkQueueResult> = this._formBuilder.array<IWorkQueueResult>([]);
  public ContextMenu: Array<IContextMenu> = [];
  request!: mPOSMasterDataRequest;
  ProposalMode: string = 'New';
  IsProposalInReadonlyMode = false;
  public isSaveEnabled = false;
  public isSubmitEnabled = false;
  private _OTOInsuranceSubmitCounter: number = 0;
  private bpkbConfiguredAge = 0;
  private isResubmitted = false;
  isCommissionApplicable = false;
  //FinancialRatios:Array<IFINL_RATO_CALCInfo>=[];
  private subscription$ = new Subject();
  existingBPParams = {} as IExistingBPInfoParm;
  classApplied21: boolean = false;
  IsCommissionTaxCalculated: boolean = true;
  showAssetFlaggingValidation: boolean = false;

  constructor(private commissionService: CommissionService, private _FormModeService: FormModeService, private _FormState: StateManagment, private dialog: MatDialog, private router: Router, private _formBuilder: FormBuilder, public _masterDataService: MasterDataService, private route: ActivatedRoute,
    public _proposaldataService: ProposalDataService, private _ProposalForm: ProposalEntityFormService, private _storageService: ClientStoreService, public _generalService: GeneralService,
    private _proposalService: ProposalService, private _messageService: MessageService, private _cal: CalculationService, private _prplEntityMapper: ProposalEntityMapperService, private resolver: ComponentFactoryResolver, private _proposalmanagerservice: ProposalManagerService,
    private toastr: ToastrService, private _dialog: DialogBoxService, private _filterService: FilterService, private _calculationService: CalculationService, private _appConfig: AppConfigService, private _formatterservice: FormatterService) {

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    let proposal_Params = this.router?.getCurrentNavigation()?.extras?.state;
    if (proposal_Params?.QueueOperation)
      this.ProposalMode = proposal_Params?.QueueOperation;
    if (proposal_Params?.Proposal && proposal_Params.QueueOperation == QueueOperation.EDIT) {
      this._FormModeService.FormMode = FormMode.EDIT;
      proposal_Params.FORMMODE = FormMode.EDIT;
      this._proposalmanagerservice.isCalcButtonEnabled = false;
      this.UpdateReadInd(proposal_Params);
      this.IsProposalInReadonlyMode = false;
    }
    else if ((proposal_Params?.Proposal || proposal_Params?.isSubmit) && proposal_Params.QueueOperation == QueueOperation.VIEW) {
      this.IsProposalInReadonlyMode = true;
      this._FormModeService.FormMode = FormMode.VIEW;
      proposal_Params.FORMMODE = FormMode.VIEW;
      if (proposal_Params?.isSubmit === undefined) {
        this.UpdateReadInd(proposal_Params);
      }
    }
    else if (proposal_Params?.Proposal && proposal_Params.QueueOperation == QueueOperation.SUBMITFORAPPROVAL) {
      this.IsProposalInReadonlyMode = true;
      this._FormModeService.FormMode = FormMode.SUBMIT;
      proposal_Params.FORMMODE = FormMode.SUBMIT;
      this._proposalmanagerservice.isCalcButtonEnabled = false;
      this.UpdateReadInd(proposal_Params);
      this.IsProposalInReadonlyMode = false;
    }
    else if (proposal_Params?.Proposal && proposal_Params.QueueOperation == QueueOperation.COPY) {
      this.IsProposalInReadonlyMode = true;
      this._FormModeService.FormMode = FormMode.COPY;
      proposal_Params.FORMMODE = FormMode.COPY;
      this._proposalmanagerservice.isCalcButtonEnabled = false;
      this.UpdateReadInd(proposal_Params);
    }
    else if (proposal_Params?.Proposal && proposal_Params.QueueOperation == QueueOperation.RESUBMIT) {
      this._FormModeService.FormMode = FormMode.RESUBMIT;
      proposal_Params.FORMMODE = FormMode.RESUBMIT;
      this._proposalmanagerservice.isCalcButtonEnabled = false;
      this.UpdateReadInd(proposal_Params);
      this.isResubmitted = true;
      this.IsProposalInReadonlyMode = false;
    }
    else {
      this._FormModeService.FormMode = FormMode.NEW;
    }
  }

  get isViewMode() {
    return this._FormModeService.FormMode === FormMode.VIEW;
  }

  panelOpenState = false;

  ngOnInit(): void {
    const CapCollection: any = this.route.snapshot.data['CapCollection'];
    this._masterDataService.InitializeMasterData(CapCollection);
    this._generalService.FormMode = FormMode.NEW;
    this._proposaldataService.SetCurrentApplicant = this.ApplicantEntity
    this.ProposalEntity = this._proposaldataService.ProposalEntity;
    this.PROPOSAL = this._proposaldataService.PROPOSAL;
    this.ApplicantEntity = this._proposaldataService.PROPOSALAPPLICANT;
    this.branchDropDown = this._storageService.GetUserInfo().CompanySysUser.map((a: any) => { return { code: a.BPSECONDARYID, TextValue: a.BRANCHNME } });
    this.branchDropDown.forEach(v => v.code += '');
    this.LoadInitialData();
    this.valueChangeSubscriptions();
    this.initializeTabValidationIndex();
    this._proposalService.assetValidationData$.subscribe((value) => {
        this.showAssetFlaggingValidation = value;
    })
  }
  openMenu() {
    this.classApplied21 = !this.classApplied21;
  }
  LoadInitialData() {
    //this.PROPOSAL.controls.PROPOSALDTE.setValue(new Date(this._formatterservice.GetDateWithoutTime()));
    this.PROPOSAL.controls.PROPOSALTYPECDE.setValue(this._masterDataService.ApplicantCodeType[1].code);
    this.PROPOSAL.controls.PROPOSALTYPECDEOLD.setValue(this._masterDataService.ApplicantCodeType[1].code);
    var branches = this._storageService.GetUserInfo().CompanySysUser;

    if (this._FormModeService.FormMode === FormMode.NEW) {
      this.documentTrackingEnable = false;
    }

    if (this._FormModeService.FormMode == FormMode.NEW && branches) {
      let defaultBranches = branches.filter((fil: any) => fil.DEFAULTIND == true)
      if (defaultBranches.length > 0) {
        let defaultBranchId = defaultBranches[0].BPSECONDARYID;
        this.PROPOSAL.controls.BPCOMPANYBRANCHID.setValue(defaultBranchId);
      }
      else {
        this.PROPOSAL.controls.BPCOMPANYBRANCHID.setValue(0);
      }
    }

    this.PROPOSAL.controls.BPCOMPANYID.setValue(parseInt(this._masterDataService.AllCompanies[0]?.code));
    this.PROPOSAL.controls.APPLICANTIND.setValue('I');
    this.ApplicantEntity.controls[0]?.controls.PROPOSALAPPLICANT.controls.ROLECDE.setValue(ApplicantRoleCode.Borrower);
    this.ApplicantEntity.controls[0]?.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.setValue('I');
    this.ApplicantEntity.controls[0]?.controls.PROPOSALAPPLICANTMAIN.controls.ROLECDE.setValue(ApplicantRoleCode.Borrower);

    if (this._FormModeService.FormMode == FormMode.NEW) {
      this.PROPOSAL.controls.STATUSCDE.setValue(StatusCode.Draft);
      this.ApplicantCategory = this._masterDataService.ApplicantCategoryCode.filter(x => x.APPTYP == 'I');
    }
  }

  openShowMore() {
    this.showMoreContent = true;
  }

  hideShowMore() {
    this.showMoreContent = false;
  }

  ResetFinancialDetails() {
    this.applicantTab = true;
    this.financialTab = false;
    this.assetTab = false;
    this.documentTab = false;
  }
  proposalActive() {
    this.applicantTab = true;
    this.financialTab = false;
    this.assetTab = false;
    this.documentTab = false;
  }
  financialActive() {
    this.financialTab = !this.financialTab;
    this.applicantTab = false;
    this.assetTab = false;
    this.documentTab = false;
  }
  AssetsActive() {
    this.assetTab = true
    this.financialTab = false;
    this.applicantTab = false;
    this.documentTab = false;
    this.container.clear();
    import('./Assets/asset.module').then(({ AssetModule }) => {
      if (this.PROPOSAL.controls.FINANCIALPRODUCTID.value !== 0) {
        const MyComponent = AssetModule.getMyComponent();
        const factory = this.resolver.resolveComponentFactory(MyComponent);
        const ref = this.container.createComponent(factory);
      }
    });
  }
  documentActive() {
    this.documentTab = !this.documentTab;
    this.applicantTab = false;
    this.financialTab = false;
    this.assetTab = false;
  }
  openDealerSearch() {

    const dialogRef = this.dialog.open(DealerSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      disableClose: true,
      panelClass: 'cdk-overlay-pane-custom',
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
      }
    });
  }

  openIdSearch() {

    const dialogRef = this.dialog.open(IdSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      disableClose: true,
      panelClass: 'cdk-overlay-pane-custom',
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
      }
    });
  }

  addApplicant(roleCode: string, applicantType: string) {
    let applicant: FormGroup<PROPOSALENTITY.IProposalApplicantEntity> = this._ProposalForm.ProposalApplicantForm();
    //applicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTID.setValue(this.ApplicantEntity.controls[this.ApplicantEntity.controls.length - 1].controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTID.value + 1);
    applicant.controls.PROPOSALAPPLICANT.controls.ROLECDE.setValue(roleCode);
    applicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.setValue(applicantType);
    if (roleCode == RoleCode.CoBorrower || roleCode == RoleCode.Guarantor) {
      if (applicantType == 'I') {
        //this.Applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT
        applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT.clear();
        applicant.controls.PROPOSALAPPLICANTBANK.clear();
        applicant.controls.PROPOSALAPPLICANTPERSONNALREFERENCE.clear();
      }
      else if (applicantType == 'C') {
        applicant.controls.PROPOSALAPPLICANTBUSINESS.clear();
        applicant.controls.PROPOSALAPPLICANTBANK.clear();
        applicant.controls.PROPOSALAPPLICANTPERSONNALREFERENCE.clear();
      }
    }
    this.ApplicantEntity.push(applicant);
  }

  getTabName(element: any, applicantindex: number): any {
    let role = element.controls.PROPOSALAPPLICANT?.value.ROLECDE;
    let applicantType = element.controls.PROPOSALAPPLICANTMAIN?.value.APPLICANTTYP;
    let CurrentCount = -1; //this.ApplicantEntity.controls.filter(x => x.value.PROPOSALAPPLICANT.ROLECDE == role && x.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP == applicantType && x.value.PROPOSALAPPLICANT.RowState != DataRowState.Removed).length
    let index = 0
    let Applicants = this.ApplicantEntity.value.filter(x => x.RowState != DataRowState.Removed);
    while (index <= applicantindex) {
      //if (Applicants[index].PROPOSALAPPLICANT.ROLECDE == role && Applicants[index].PROPOSALAPPLICANTMAIN.APPLICANTTYP == applicantType)
      CurrentCount++;
      index++;
    }
    //if Company || individual=> index updated => 1ST TIME
    //if same condition then current count updates

    if (role == ApplicantRoleCode.Borrower) {
      return 'Borrower';
    }
    else if (role == ApplicantRoleCode.CoBorrower && applicantType == 'I') {
      return "Co-Borrower Individual-" + CurrentCount;
    }
    else if (role == ApplicantRoleCode.CoBorrower && applicantType == 'C') {
      return "Co-Borrower Company-" + CurrentCount;
    }
    else if (role == ApplicantRoleCode.Guarantor && applicantType == 'I') {
      return "Guarantor Individual-" + CurrentCount;
    }
    else if (role == ApplicantRoleCode.Guarantor && applicantType == 'C') {
      return "Guarantor Company-" + CurrentCount;
    }
  }
  IsBorrowerRole(element: any): boolean {
    return element.controls.PROPOSALAPPLICANT?.value.ROLECDE == ApplicantRoleCode.Borrower;
  }
  getComponentName(element: any): any {
    let role = element.controls.PROPOSALAPPLICANT?.value.ROLECDE;
    let applicantType = element.controls.PROPOSALAPPLICANTMAIN?.value.APPLICANTTYP;
    if (role == ApplicantRoleCode.Borrower) {
      if (applicantType == 'I')
        return ComponentName.IndividualBorrower;
      else if (applicantType == 'C')
        return ComponentName.CompanyBorrower;
    }
    else if (role == ApplicantRoleCode.CoBorrower && applicantType == 'I') {
      return ComponentName.CoBorrowerIndividual;
    }
    else if (role == ApplicantRoleCode.CoBorrower && applicantType == 'C') {
      return ComponentName.CoBorrowerCompany;
    }
    else if (role == ApplicantRoleCode.Guarantor && applicantType == 'I') {
      return ComponentName.GuarantorIndividual;
    }
    else if (role == ApplicantRoleCode.Guarantor && applicantType == 'C') {
      return ComponentName.GuarantorCompany;
    }
  }

  IsIndividualApplicant(element: any): boolean {
    return element.controls.PROPOSALAPPLICANTMAIN.value.APPLICANTTYP == 'I';
  }

  removeTab() {

  }
  updateKPKBedails() {
    let borrower = this._proposaldataService.PROPOSALAPPLICANT.controls.find(x => x.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == "00003");
    let defaultAddress = borrower?.controls.ADDRESS.controls.
      find(x => (x.controls.PROPOSALADDRESSTYPEDETAIL != undefined) ? x.controls.PROPOSALADDRESSTYPEDETAIL
        ?.controls.find(x => x.controls.DEFAULTIND.value == true) : null)?.controls;
    let defaultIdTypeExist = borrower?.value.PROPOSALAPPLICANTIDDETAIL.find(x => x.DEFAULTIND == true);
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.ADDSDSC.setValue(defaultAddress?.PROPOSALAPPLICANTADDRESS?.controls.ADDRESSOTO.value || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOPROVINCE.setValue(defaultAddress?.PROPOSALAPPLICANTADDRESS?.controls.PROVINCEID.value || 0);
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOKOTAMADYA.setValue(defaultAddress?.PROPOSALAPPLICANTADDRESS?.controls.KOTAMADYAIDOTO.value || 0);
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOKECAMATAN.setValue(defaultAddress?.PROPOSALAPPLICANTADDRESS?.controls.KECAMATANIDOTO.value || 0);
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTODESA.setValue(defaultAddress?.PROPOSALAPPLICANTADDRESS?.controls.KELURAHANIDOTO.value || 0);
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTORW.setValue(defaultAddress?.PROPOSALAPPLICANTADDRESS?.controls.RWOTO.value || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTORT.setValue(defaultAddress?.PROPOSALAPPLICANTADDRESS?.controls.RTOTO.value || '');

    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERKTPID.setValue(defaultIdTypeExist?.IDTYPENBR || '');
    //this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(defaultIdTypeExist?.EXPIRYDTE || new Date(Date.now()));

    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(borrower?.controls.PROPOSALAPPLICANT?.controls.APPLICANTTYP.value || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOBPKBOWNERNME.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.GENDER.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPLICANTINDIVIDUAL.GENDER || '');
    //this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERDOB.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH || new Date(Date.now()));
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPLICANTINDIVIDUAL.OTOPLACEOFBIRTH || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPSPOUSEDETAIL[0]?.FIRSTNME || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPSPOUSEDETAIL[0]?.SPOUSEADDRESS || '');
    this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOAGMTCDE.setValue(borrower?.controls.INDIVIDUALAPPLICANT?.value.PROPOSALAPPSPOUSEDETAIL[0]?.OTOAGMTCDE || '');
  }

  mandatoryControlsValidity(): boolean {

    // let knownError = ['pattern', 'max', 'min', 'email', 'matDatepickerParse']
    // let errors: IValidationErrors[];
    // errors = getFormValidationErrors(this._proposaldataService.ProposalEntity.controls);
    // let errorString: string[] = [];
    // errors.forEach((error: IValidationErrors) => {
    //   let lableName = MandatoryControlsEnum.GetStringValue(error.control_name);

    //   if (knownError.includes(error.error_name))
    //     errorString.push(lableName + " is not valid");
    //   else
    //     errorString.push(lableName + " is required")
    // });


    if (this._messageService.ErrorMessages.size > 0) {
      this._messageService.ErrorMessages.forEach((error: string | undefined) => {
        this.toastr.warning(error);
      })
      return false;
    }

    return true;
  }

  submitProposal() {

    this._proposalService.SubmitProposal(this.ProposalEntity.value).pipe(takeUntil(this.subscription$)).subscribe(res => {
      if (res?.CODE == 1) {
        this._messageService.showCustomMesssage('Application Submitted Successfully');
        this.router.navigateByUrl('/ProposalQueue');
      }
      else {
        this._messageService.showCustomMesssage('Something went wrong', MessageType.Error);
      }
    })
  }

  valueChangeSubscriptions() {

    this.PROPOSAL.controls.BPCOMPANYBRANCHID.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val != 0) {
        //if (oldValue != val) {
        this.PROPOSAL.controls.BPINTRODUCERNME.setValue('');
        this.PROPOSAL.controls.FPGROUPID.setValue(0);
        this.PROPOSAL.controls.FINANCIALPRODUCTID.setValue(0);
        this.PROPOSAL.controls.MARKETINGOFFICERID.setValue(0);
        this.PROPOSAL.controls.BPINTRODUCERID.setValue(0);

        //}
        this.request = new mPOSMasterDataRequest();
        this.request.masterDataOperation = MasterData.MarketingOfficerByBranch;
        this.request.DATAS.companyId = this.PROPOSAL.controls.BPCOMPANYID.value;
        this.request.DATAS.branchId = this.PROPOSAL.controls.BPCOMPANYBRANCHID.value;

        if (this._masterDataService.MarketingOfficerByBranch[this.request.DATAS.branchId] === undefined) {
          this._masterDataService.GetMasterData(this.request).pipe(takeUntil(this.subscription$)).subscribe((response) => {
            this._masterDataService.MarketingOfficerByBranch[this.request.DATAS.branchId] = response?.ResultSet?.DataCollection;
            this._masterDataService.MarketingOfficeSubject.next(true);
          });
        }
      }

    });

    this.PROPOSAL.controls.PROPOSALTYPECDE.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val == '00001') {
        this.ApplicantCategory = this._masterDataService.ApplicantCategoryCode.filter(x => x.APPTYP == 'I');
      }
      else {
        this.ApplicantCategory = this._masterDataService.ApplicantCategoryCode.filter(x => x.APPTYP == 'C');
      }
    });
  }

  readProposal(params: any) {
    let workQueueParams = {} as IPRPLQUInfo;
    workQueueParams.PROPOSALID = params.Proposal.PROPOSALID
    workQueueParams.FORMMODE = params.FORMMODE;
    this._proposalService.ReadProposal(workQueueParams).pipe(takeUntil(this.subscription$)).subscribe(response => {
      let data: IProposalEntity = response.ResultSet as IProposalEntity;
      data.PROPOSALAPPLICANT.forEach((applicant, index) => {
        applicant.PROPOSALAPPLICANTMAIN.ROLECDE = applicant.PROPOSALAPPLICANT.ROLECDE
      });
      this._prplEntityMapper.ProposalEntityMapper(this.ProposalEntity, data);
      // this._FormState.ResetFormState(this._proposaldataService.ASSETENTITY.controls.TRUCKDETAILS, DataRowState.Removed);
      if (this._FormModeService.FormMode != FormMode.COPY) {
        this._FormState.ResetFormState(this.ProposalEntity, DataRowState.Pristine);
        this.ProposalEntity.markAsPristine();
      }
      else {
        this._FormState.ResetFormState(this.ProposalEntity, DataRowState.Added);
      }
      this.subscribeValueChange(this._FormModeService.FormMode);
      if (this._FormModeService.FormMode == FormMode.COPY) {
        this.CopyProposal(data);
      }
      if (this._proposaldataService.PROPOSALCOMMISSIONENTITY !== null && this._proposaldataService.PROPOSALCOMMISSIONENTITY.length > 0 && this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].value.PRPLCOMM !== null)
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.UNALLOCATEDEXPENSEAMT.setValue(this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.UNALLOCATEDEXPENSEAMT.value);
      this.loadDealer(data.PROPOSAL.BPCOMPANYBRANCHID);
      this._calculationService.GetRentalFrequency(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.FREQUENCYCDE.value);
      this._messageService.ClearValidatorMessages();
      if (this._storageService.GetUserInfo()?.IsOTO && this._proposaldataService.PROPOSAL.value.FINANCETYP==FinanceType.HirePurchase && !this._proposaldataService.PROPOSAL.value.MCOMDEALER)
            {
              this.PROPOSAL.controls.COMMAPPLICABLECDE.setValue(this._proposaldataService.PROPOSAL.value.COMMAPPLICABLECDE);
              this.commissionService.setCommissionApplicable(false);
            }else{
              this.PROPOSAL.controls.COMMAPPLICABLECDE.setValue('');
              this.commissionService.setCommissionApplicable(true);
            }
            this.getFPCampaginByFPId(data);
    });
  }

  UpdateReadInd(queue_params: any) {
    if (!queue_params.Proposal.READIND) {
      let params = {} as IProposalInfoParm;
      params.ProposalId = queue_params.Proposal.PROPOSALID;
      params.AssgineeUserId = Number(queue_params.Proposal.ASSNTO);
      params.StatusCode = queue_params.Proposal.STATUSCDE;
      params.Action = ProposalHistoryAction.GetDescriptionStringValue(ProposalHistoryAction.Open);
      this._proposalService.SaveProposalHistory(params).pipe(takeUntil(this.subscription$)).subscribe(result => {
        this.readProposal(queue_params);
      });
    }
    else {
      this.readProposal(queue_params);
    }
  }

  subscribeValueChange(operation: any = '') {
    if (operation == QueueOperation.EDIT) {
      this.ProposalEntity.markAsPristine();
      // this.ProposalEntity.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      //   this._FormState.SetFormState(this.ProposalEntity, FormMode.EDIT, DataRowState.Updated, true);
      // })
    }
    if (operation == QueueOperation.RESUBMIT) {
      this.ProposalEntity.markAsPristine();
      this.ProposalEntity.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
        this._FormState.SetFormState(this.ProposalEntity, FormMode.RESUBMIT, DataRowState.Updated, true);
      })
    }
  }

  RemoveApplicant(Applicant: any) {
    const index: number = this._proposaldataService.PROPOSALAPPLICANT.value.indexOf(Applicant.value);
    // this._proposaldataService.PROPOSALAPPLICANT.controls[index].controls.RowState.setValue(DataRowState.Removed);
    // this._proposaldataService.ProposalEntity.controls.RowState.setValue(DataRowState.Updated);
    if (this._proposaldataService.PROPOSALAPPLICANT.controls[index].value.RowState !== DataRowState.Added)
      this._FormState.ResetFormState(this._proposaldataService.PROPOSALAPPLICANT.controls[index], DataRowState.Removed);
    else
      this._proposaldataService.PROPOSALAPPLICANT.removeAt(index);
    this._proposaldataService.ProposalEntity.controls.RowState.setValue(DataRowState.Updated);
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
    this._proposalService.getAndsetassetValidationData(null);
  }
  openDocumentView() {
    if (this.documentTrackingEnable) {
      this.applicantEditPanel = !this.applicantEditPanel;
      this.documentViewPanel = !this.documentViewPanel;
    }
  }

  CopyProposal(data: IProposalEntity) {

    this._proposaldataService.PROPOSAL.controls.ISUREAPPLICATIONNBR.setValue('');
    this._proposaldataService.PROPOSAL.controls.CONTRACTNBR.setValue('');
    //this.PROPOSAL.controls.ROWVERSION.setValue('');
    this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.ADDRESS.controls.forEach(x => x.controls.PROPOSALAPPLICANTADDRESS.controls.ISFROMISURE.setValue(false));
    // let appcoll: FormArray<IProposalApplicantEntity> = this._formBuilder.array<IProposalApplicantEntity>([]);
    data.PROPOSALAPPLICANT.forEach((applicant, index) => {
      if (applicant.PROPOSALAPPLICANTMAIN.BUSINESSPARTNERID > 0 && (applicant.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I" || applicant.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "C")) {
        let params = {} as IProposalInfoParm;
        params.ModuleType = "Contract";
        params.ApplicantId = applicant.PROPOSALAPPLICANTMAIN.BUSINESSPARTNERID;
        this._proposalService.LoadApplicantEntity(params).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res && res.ResultSet.length > 0) {
            let proposalApplicant: FormGroup<IProposalApplicantEntity> = this._ProposalForm.ProposalApplicantForm();
            // this._FormState.ResetFormArrayState(this._proposaldataService.PROPOSALAPPLICANT, DataRowState.Removed);
            this._proposaldataService.PROPOSALAPPLICANT.removeAt(index);
            this._proposaldataService.PROPOSALAPPLICANT.insert(index, this._prplEntityMapper.ProposalApplicantEntityMapper(proposalApplicant, res.ResultSet[0]));
            //this._proposaldataService.PROPOSALAPPLICANT.push(this._prplEntityMapper.ProposalApplicantEntityMapper(proposalApplicant, res.ResultSet[0]));
            proposalApplicant.controls.PrposalcashflowDetail.patchValue(applicant.PrposalcashflowDetail);
            proposalApplicant.controls.PROPOSALAPPLICANT.controls.ROLECDE.setValue(applicant.PROPOSALAPPLICANT.ROLECDE);
            proposalApplicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.setValue(applicant.PROPOSALAPPLICANTMAIN.APPLICANTTYP);

            if (applicant.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I") {
              proposalApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTENTERPRENUER.controls.BUSINESSNME.setValue(applicant.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTENTERPRENUER.BUSINESSNME);
              proposalApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTENTERPRENUER.controls.BUSINESSSTATUSLOCATION.setValue(applicant.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTENTERPRENUER.BUSINESSSTATUSLOCATION);
              proposalApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTENTERPRENUER.controls.ESTABLISHMENTMONTH.setValue(applicant.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTENTERPRENUER.ESTABLISHMENTMONTH);
              proposalApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTENTERPRENUER.controls.ESTABLISHMENTYEAR.setValue(applicant.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTENTERPRENUER.ESTABLISHMENTYEAR);
              proposalApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTENTERPRENUER.controls.MONTHLYPROFIT.setValue(applicant.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTENTERPRENUER.MONTHLYPROFIT);
              proposalApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTENTERPRENUER.controls.TOTALEMPLOYEE.setValue(applicant.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTENTERPRENUER.TOTALEMPLOYEE);
            }
            else if (applicant.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "C") {
              if (proposalApplicant.controls.PROPOSALAPPLICANTREPRESENTATIVE != null)
                proposalApplicant.controls.PROPOSALAPPLICANTREPRESENTATIVE.clear();
              else
                proposalApplicant.controls.PROPOSALAPPLICANTREPRESENTATIVE = this._formBuilder.array<IPRPL_APLT_RPRSInfo>([]);
              applicant.PROPOSALAPPLICANTREPRESENTATIVE.forEach(val => {
                proposalApplicant.controls.PROPOSALAPPLICANTREPRESENTATIVE.controls.push(this._prplEntityMapper.ProposalApplicantRepresentativeMapper(this._ProposalForm.ProposalApplicantRepresentativeForm(), val, FormMode.COPY))
              })
              //proposalApplicant.controls.PROPOSALAPPLICANTREPRESENTATIVE.AddRange(applicant.PROPOSALAPPLICANTREPRESENTATIVE);
            }
          }
          // if (this._proposaldataService.PROPOSALAPPLICANT != null && this._proposaldataService.PROPOSALAPPLICANT.length > 0
          //   && this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.PROPOSALAPPLICANT != null
          //   && this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.PROPOSALAPPLICANTBANK != null
          //   && this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.PROPOSALAPPLICANTBANK.length == 0) {
          //   let obj = this._ProposalForm.ProposalBankComponentForm();
          //   obj.controls.APPLICANTID.setValue(this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.PROPOSALAPPLICANT.APPLICANTID);
          //   obj.controls.BANKID.setValue(1);
          //   this._proposaldataService.PROPOSALAPPLICANT.controls[0]?.controls?.PROPOSALAPPLICANTBANK.push(obj);
          // }
          if (this._proposaldataService.PROPOSALAPPLICANT != null && this._proposaldataService.PROPOSALAPPLICANT.length > 0
            && this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.PROPOSALAPPLICANTMAIN != null
            && this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I"
            && this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.INDIVIDUALAPPLICANT != null
            && this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT != null
            && this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.length == 0) {
            let objEmp = this._ProposalForm.ProposalEmploymentComponentForm();
            objEmp.controls.APPLICANTID.setValue(this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.PROPOSALAPPLICANT.APPLICANTID);
            objEmp.controls.EMPLOYMENTID.setValue(1);
            this._proposaldataService.PROPOSALAPPLICANT.controls[0]?.controls?.INDIVIDUALAPPLICANT?.controls.PROPOSALAPPLICANTEMPLOYMENT.push(objEmp);
          }
          if (this._proposaldataService.PROPOSAL.value.ISFROMMPOS) {
            this._proposaldataService.PROPOSAL.controls.ISFROMMPOS.setValue(false);
            this._proposaldataService.PROPOSAL.controls.MPOSAPPLICATIONNBR.setValue("");
            this._proposaldataService.PROPOSALAPPLICANT.controls[0]?.controls?.MPOSDOCUMENTS.reset();
          }

          // this._proposaldataService.ProposalEntity.setControl("PROPOSALAPPLICANT", appcoll);
          // this._prplEntityMapper.ProposalApplicantEntityMapper(this._proposaldataService.PROPOSALAPPLICANT,appcoll);
        });

      }
      if (this._proposaldataService.PROPOSALAPPLICANT != null && this._proposaldataService.PROPOSALAPPLICANT.length > 0
        && this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.PROPOSALAPPLICANT != null
        && this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.PROPOSALAPPLICANTBANK != null
        && this._proposaldataService.PROPOSALAPPLICANT.controls[0].controls.PROPOSALAPPLICANTBANK.length == 0) {
        let obj = this._ProposalForm.ProposalBankComponentForm();
        obj.controls.APPLICANTID.setValue(this._proposaldataService.PROPOSALAPPLICANT.controls[0].value.PROPOSALAPPLICANT.APPLICANTID);
        obj.controls.BANKID.setValue(1);
        this._proposaldataService.PROPOSALAPPLICANT.controls[0]?.controls?.PROPOSALAPPLICANTBANK.push(obj);
      }
    });
    // for(var i=0; i<appcoll.length; i++){
    //   let mappedApplicant: FormGroup<IProposalApplicantEntity> = appcoll.controls[i]
    //   this._prplEntityMapper.ProposalApplicantEntityMapper(this._proposaldataService.PROPOSALAPPLICANT.controls[i],mappedApplicant);
    // }
    // appcoll.controls.forEach((item,index)=>{

    // })
    //this._prplEntityMapper.ProposalApplicantEntityMapper(appcoll,this._proposaldataService.PROPOSALAPPLICANT);
    // let appcoll1=[] as Array<IProposalApplicantEntity>;
    //appcoll1.

  }


  loadDealer(branchId: any) {
    let request = new ProposalMasterDataRequest();
    request.dealercde = null;
    request.branchId = branchId;

    this._proposalService.SearchDealer(request).pipe(takeUntil(this.subscription$)).subscribe(res => {
      this._masterDataService.AllDealerByBranch = res.ResultSet?.map((p: any) => ({ code: p.BUSINESSPARTNERID.toString(), TextValue: p.BUSINESSPARTNERNME }));
      this.PROPOSAL.controls.BPINTRODUCERNME.setValue(this._masterDataService.AllDealerByBranch.filter(x => x.code == this.PROPOSAL.controls.BPINTRODUCERID.value.toString())[0].TextValue);
      if (this._FormModeService.FormMode == FormMode.SUBMIT) {
        this.SubmitClicked();
      }
    })
  }
  doesUserBelongsToEApprovalGroup(): boolean {
    if (this._storageService.GetWorkflowUser().USERGROUPASSOCIATION.filter((x: any) => this._appConfig.EApprovalGroups.includes(x.USERGRUPCDE)).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }
  public SubmitClicked() {

    this.IsCommissionTaxCalculated = true;

    this.ValidateCommissionTax();

    if (!this.IsCommissionTaxCalculated) {
      return;
    }
    if (this.showAssetFlaggingValidation) {
      this.EnableSaveSubmit();
      this._messageService.showCustomMesssage("Asset Model and Asset condition is not matched", MessageType.Warning);
      return;
    }

    this._proposalmanagerservice.loadSupplier();
    // let otherThanRemovedApplicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    // let applicants = this._formBuilder.array<IProposalApplicantEntity>([])
    // otherThanRemovedApplicants.forEach(item => {
    //   applicants.push(this._prplEntityMapper.ProposalApplicantEntityMapper(this._ProposalForm.ProposalApplicantForm(), item));
    // })

    //let applicants = this._filterService.FilterFormArray(this._proposaldataService.PROPOSALAPPLICANT.value) as FormArray<IProposalApplicantEntity>;
    if (this._FormModeService.FormMode == FormMode.EDIT || this._FormModeService.FormMode == FormMode.SUBMIT
      || this._FormModeService.FormMode == FormMode.COPY || this._FormModeService.FormMode == FormMode.RESUBMIT) {
      this._FormState.SetFormState(this.ProposalEntity, FormMode.EDIT, DataRowState.Updated, true);
    }
    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;

    // let otherThanRemovedArticleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    // let articleEntity = this._ProposalForm.ProposalArticleForm();
    // this._prplEntityMapper.ProposalArticleMapper(articleEntity, otherThanRemovedArticleEntity)

    // Check if all mandatory controls are valid
    // if (!this.mandatoryControlsValidity()) {
    //   return;
    // }

    this._proposaldataService.PROPOSAL.value.SCORECARDEVALUATIONIND = false;
    /// SOCD-17544
    this.DisableSaveSubmit();

    if (this._proposaldataService.PROPOSAL.value.FINANCETYP==FinanceType.HirePurchase && this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN &&
      this._proposaldataService.PROPOSALASSET.value.ROLECDE==null && this._proposaldataService.PROPOSALASSET.value.BPINTRODUCERID>0){
      this._proposaldataService.PROPOSALASSET.controls.ROLECDE.setValue(RoleCode.Supplier);
    }

    //moved the check up because nothing should happen in this case.
    if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {
      // if (this._proposaldataService.PROPOSAL.value != null && !this._proposaldataService.PROPOSAL.value.OVPPRINTIND) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showMesssage("msgPrintOVPStationaryFirst", MessageType.Warning);
      //   return;
      // }
      if (this._proposaldataService.PROPOSAL.value != null && !this._proposaldataService.PROPOSAL.value.EAPPROVALIND) {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("EApprovalSubmit", MessageType.Warning);
        return;
      }
    }

    if (this.doesUserBelongsToEApprovalGroup() === false) {
      this._messageService.showMesssage('forwardTakeControlNotAllowed',  MessageType.Warning);
      return;
    }

    if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase &&
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT > 0 &&
      this._proposaldataService.PROPOSAL.value.BPINTRODUCERID != this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].value.PRPLCOMM.DEALERID) {
      this.EnableSaveSubmit();
      this._messageService.showCustomMesssage("Commission recipient is not updated. Please re-select Dealer / FP Group or Campaign", MessageType.Warning);
      return;
    }
    if (this.PROPOSAL.controls.SALESMANMANDATORY.value && (!this._masterDataService.SalesmanByDealer.some(salesman => salesman.id == this.PROPOSAL.controls.SALESMANID.value))) {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgSalesmanMissing", MessageType.Warning);
        return;
      }
    //  const TotalAdminFees = Number(this._proposaldataService?.PRPLARTICLECOMPONENTENTITYCOL?.controls?.find(x => x.value?.PRPLARTEAMNTTRAN?.AMTCMPTCDE === AmountComponent.GetStringValue(AmountComponent.AdminFee))?.value?.PRPLARTEAMNTTRAN?.INPUTAMT ?? 0);
      const financialAgreementFee = this._proposaldataService?.PROPOSALFINANCIALAGREEMENT?.value?.TOTALADMINFEE ?? 0;
      const adminFeeDetail = this._proposaldataService?.PROPOSALADMINFEEDETAIL?.value?.TOTALADMINFEE ?? 0;
      //if (financialAgreementFee !== adminFeeDetail ||  financialAgreementFee !== TotalAdminFees ||  adminFeeDetail !== TotalAdminFees) {
      if (financialAgreementFee !== adminFeeDetail) {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Admin Fee mismatch detected.", MessageType.Warning);
        return;
      }
      const financialAgreementAPLRTE = this._proposaldataService?.PROPOSALFINANCIALAGREEMENT?.value?.APPLIEDCUSTOMERRTE;
      const prplBaseRTE = this._proposaldataService?.PROPOSALARTICLEBASERATE.controls[0].value.APPLIEDCUSTOMERRTE
      if (financialAgreementAPLRTE !== prplBaseRTE && this._appConfig.ShowInterestRateValidation == true) {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Interest Rate mismatch detected.", MessageType.Warning);
        return;
      }

      const totalPRVFee = this._proposaldataService?.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value;
      const PRVFeePCT = this._proposaldataService?.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.value;
      if (totalPRVFee > 10000 && PRVFeePCT === 0 && this._appConfig.ShowProvisionFeeValidation == true) {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Provision Rate mismatch detected.", MessageType.Warning);
        return;
      }

       const hasProvisionFeeComponent = this._proposaldataService.PRPLARTICLECOMPONENTENTITYCOL.value.some(x => x.PRPLARTEAMNTTRAN.AMTCMPTCDE === "00120"
        && (x.RowState !== DataRowState.Removed)
      );
      if(totalPRVFee > 0 && !hasProvisionFeeComponent)
      {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Provision Rate mismatch detected.", MessageType.Warning);
        return;
      }

    if (this._proposaldataService.PROPOSALAPPLICANT.value != null
      && (this._proposaldataService.PROPOSAL.value.MCOMDEALER || this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN)
      && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) != null
      && applicants.find(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)?.PROPOSALAPPLICANTBANK != null
      && applicants.find(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)?.PROPOSALAPPLICANTBANK.length == 0
      && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
      this.EnableSaveSubmit();
      this._messageService.showMesssage("AddBankDetailRF", MessageType.Warning);
      return;
    }
    if(applicants != null &&
      applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) != null &&
      applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT != null){
      let flag = false;
      if(applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.filter((p:any)=>p.ECNMSCTRCODEOTO==null).length>0){
        //message
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgEconomicSectorEmpty", MessageType.Warning);
        flag=true;
      }
      if(applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.filter((p:any)=>p.INDUSTRYTYPECDE==null).length>0){
        //message
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgIndustryTypeEmpty", MessageType.Warning);
        flag=true;
      }
      if(applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.filter((p:any)=>p.INDUSTRYSUBTYPECDE==null).length>0){
        //message
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgIndustryLineEmpty", MessageType.Warning);
        flag=true;
      }
      if(flag){
        return;
      }
    }

    this.UpdateBPKBDetail();
 	if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBHOLDERNME==null || articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBHOLDERNME=='') {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgBPKBHolderNameEmpty", MessageType.Warning);
        return;
      }
      if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBHOLDERADDRESS==null || articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBHOLDERADDRESS=='') {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgBPKBholderAddressEmpty", MessageType.Warning);
        return;
      }
    this._cal.CalculateFirstPayment();
    if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT != null)
      this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalmanagerservice.DealerPOAmount())


    let validationMessages: Array<String> = [];
    if (this.Validate()) {

      if (!this.CalculateAge()) {
        this.EnableSaveSubmit();

        this._messageService.showMesssage("AddGuarantorDetl", MessageType.Warning);
        return;
      }
      //if (Controller.DataContext.PROPOSAL.FINANCETYP == FinanceType.PACMAS.GetStringValue())
      if (this._proposaldataService.PROPOSAL.value.ISPACKAGE) {
        let rntlAmountCalculated = this._proposalmanagerservice.RepaymentPlan[0].PRPLRPMTPLAN.RENTALAMT;
        if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.PCMSRNTLAMT != rntlAmountCalculated) {
          this.EnableSaveSubmit();
          this._messageService.showMesssage("msgPcmsRntlAmount", MessageType.Warning);
          return;

        }
      }
      // SOCD-17194

      let msg: any[] = [];
      let idDetail = null;
      let roleCode = "";
      let result: any;
      let count = 0;
      applicants.forEach(aplt => {
        if (this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDE.value == ApplicantType.Individual) {
          if (aplt.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.length < 1) {
            idDetail = aplt.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.KTP);
            if (idDetail != null) {
              this.existingBPParams.IdCardNumber = idDetail[0]?.IDTYPENBR;
              this.existingBPParams.IdCardTyp = idDetail[0]?.IDTYPECDE;
              this.existingBPParams.ProposalId = this._proposaldataService.PROPOSAL.value.PROPOSALID;
              this._proposalService.ReadExistingBPandApplicant(this.existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
                result = res;
              })
              if (result != null && result.ResultSet != null && result.ResultSet.length > 0) {
                this.EnableSaveSubmit();
                roleCode = aplt.PROPOSALAPPLICANT.ROLECDE;
                msg.push("msgEmploymentGuarantorCoBorrowerMissing");
              }
            }
          }

          else {
            aplt.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.forEach(empt => {
              if (empt.ECNMSCTRCODEOTO == null || empt.ECNMSCTRCODEOTO == "") {
                idDetail = aplt.PROPOSALAPPLICANTIDDETAIL.filter(x => x.IDTYPECDE == IDTypeCode.KTP);
                if (idDetail != null) {
                  this.existingBPParams.IdCardNumber = idDetail[0]?.IDTYPENBR;
                  this.existingBPParams.IdCardTyp = idDetail[0]?.IDTYPECDE;
                  this.existingBPParams.ProposalId = this._proposaldataService.PROPOSAL.value.PROPOSALID;
                  this._proposalService.ReadExistingBPandApplicant(this.existingBPParams).pipe(takeUntil(this.subscription$)).subscribe(res => {
                    result = res;
                  })
                  if (result != null && result.ResultSet != null && result.ResultSet.length > 0) {
                    this.EnableSaveSubmit();
                    count++;
                    return;
                  }
                }
              }
            })
          }

          if (count > 0) {
            msg.push("msgEconomicSectorEmpty");
            return;
          }


          if (aplt.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL != null && aplt.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH != null && aplt.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH > new Date()) {
            this.EnableSaveSubmit();
            this._messageService.showMesssage("WrongDateOfBirthApplicant", MessageType.Warning);
            return;
          }
          if (aplt.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL != null && aplt.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL[0] != null && aplt.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL[0].BIRTHDATE > new Date()) {
            this.EnableSaveSubmit();
            this._messageService.showMesssage("WrongDateOfBirthSpouse", MessageType.Warning);
            return;
          }
          aplt.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.forEach(member => {
            if (member != null && member.DATEOFBIRTH > new Date()) {
              this.EnableSaveSubmit();
              this._messageService.showMesssage("WrongDateOfBirthFamilyMember", MessageType.Warning);
              return;
            }
          })
          if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB != null) {
            if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB > new Date()) {
              this.EnableSaveSubmit();
              this._messageService.showMesssage("WrongDateOfBirthBPKB", MessageType.Warning);
              return;
            }
          }

        }
      });

      if (roleCode == ApplicantRoleCode.Borrower) {
        roleCode = "Borrower";
      }
      else if (roleCode == ApplicantRoleCode.CoBorrower) {
        roleCode = "CoBorrower";
      }
      else if (roleCode == ApplicantRoleCode.Dealer) {
        roleCode = "Dealer";
      }
      else {
        roleCode = "Guarantor";
      }

      if (msg.length > 0) {
        this._messageService.showNewMesssage(msg, roleCode, MessageType.Warning);
        return;
      }

      if (
        this._proposaldataService.PROPOSAL != null &&
        this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.OperatingLease) {

        if (this._proposaldataService.PROPOSALARTICLE != null &&
          this._proposaldataService.PROPOSALARTICLE.length > 0 &&
          this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY != null &&
          this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT != null &&
          this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.INSRCOMMAMTOTO > 0) {

          let PRPLARTEAMNTTRANTAXCollection: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = [];
          let PRPLARTICLECOMPONENTENTITYCollection: Array<IProposalArticleComponentEntity> = [];

          if (this._proposaldataService.PROPOSALARTICLE != null &&
            this._proposaldataService.PROPOSALARTICLE.length > 0 &&
            this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY != null &&
            this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT != null &&
            this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.TAXINCEXCL != null &&
            this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.INSRCOMMAMTOTO > 0 &&
            this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PRPLARTICLECOMPONENTENTITYCOL != null &&
            this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PRPLARTICLECOMPONENTENTITYCOL.length > 0 &&
            this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PRPLARTICLECOMPONENTENTITYCOL.filter((p: any) => p.PRPLARTEAMNTTRAN != null && p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.InsuranceCommission).length > 0) {
            PRPLARTICLECOMPONENTENTITYCollection = this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.value.PRPLARTICLECOMPONENTENTITYCOL.filter((p: any) => p.PRPLARTEAMNTTRAN != null && p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.InsuranceCommission) as Array<IProposalArticleComponentEntity>;

            if (PRPLARTICLECOMPONENTENTITYCollection != null &&
              PRPLARTICLECOMPONENTENTITYCollection.length > 0) {
              if (PRPLARTICLECOMPONENTENTITYCollection[0]?.PRPLARTEAMNTTRAN.AMTCMPTCDE ==  AmountComponent.GetStringValue(AmountComponent.InsuranceCommission))
              // .PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.InsuranceCommission)
              {
                PRPLARTEAMNTTRANTAXCollection = PRPLARTICLECOMPONENTENTITYCollection[0]?.PRPLARTEAMNTTRANTAX;

                /// SOCD-17388
                if (this.GetOTOInsuranceCommissionTaxAmount(PRPLARTEAMNTTRANTAXCollection, TaxType.VAT_GST) <= 0) {
                  if (this._OTOInsuranceSubmitCounter < 5) {
                    this._OTOInsuranceSubmitCounter = this._OTOInsuranceSubmitCounter + 1;
                    this.EnableSaveSubmit();
                    this._messageService.showMesssage("msgOTOInsrCommTaxMissing", MessageType.Info);
                    return;
                  }
                }

                /// SOCD-17388
                if (this.GetOTOInsuranceCommissionTaxAmount(PRPLARTEAMNTTRANTAXCollection, TaxType.WHT) <= 0) {
                  if (this._OTOInsuranceSubmitCounter < 5) {
                    this._OTOInsuranceSubmitCounter = this._OTOInsuranceSubmitCounter + 1;
                    this.EnableSaveSubmit();
                    this._messageService.showMesssage("msgOTOInsrCommTaxMissing", MessageType.Info);
                    return;
                  }
                }
              }

            }
            else {
              if (this._OTOInsuranceSubmitCounter < 5) {
                this._OTOInsuranceSubmitCounter = this._OTOInsuranceSubmitCounter + 1;
                this.EnableSaveSubmit();
                this._messageService.showMesssage("msgOTOInsrCommTaxMissing", MessageType.Info);
                return;
              }
            }
          }
          else {
            if (this._OTOInsuranceSubmitCounter < 5) {
              this._OTOInsuranceSubmitCounter = this._OTOInsuranceSubmitCounter + 1;
              this.EnableSaveSubmit();
              this._messageService.showMesssage("msgOTOInsrCommTaxMissing", MessageType.Info);
              return;
            }
          }

        }
      }

      if (this._proposaldataService.PROPOSAL.value.STATUSCDE == StatusCode.New) {
        this._messageService.showMesssage("ApplicationAlreadySubmitted", MessageType.Warning);
        return;
      }

      if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
        this._proposaldataService.PROPOSAL.controls.INTRODUCERROLECDE.setValue(RoleCode.Dealer);
      }

      if (this._proposaldataService.PROPOSAL.value.FINANCETYP === FinanceType.OperatingLease
        && this._proposaldataService.PROPOSALASSET.value.ASSETSELECTIONCDE === AssetSelection.Inventory) {
        let bpkbparam = {} as IProposalInfoParm;
        bpkbparam.ProposalId = this._proposaldataService.PROPOSAL.value.PROPOSALID;
        bpkbparam.OTOBPKBNumber = articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBNUMBER;
        this._proposalService.ValidateBPKBAlreadyExists(bpkbparam).pipe(takeUntil(this.subscription$)).subscribe(resp => {
          if (resp?.CODE == ReturnCode.Success.Code) {
            if (resp?.ResultSet)
              this._messageService.showMesssage("BPKBNumberalreadyexists", MessageType.Info);
          }
        });
      }

      let param = {} as IProposalInfoParm;
      param.EngineNbr = articleEntity.ASSETENTITY.PROPOSALVEHICLEDETAIL.ENGINENUMBER;
      param.ChasisNbr = articleEntity.ASSETENTITY.PROPOSALVEHICLEDETAIL.CHASSISNBROTO;
      param.ProposalId = this._proposaldataService.PROPOSAL.value.PROPOSALID;
      param.OTOBPKBNumber = articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBNUMBER;
      param.IntroducerID = this._proposaldataService.PROPOSAL.value.BPINTRODUCERID;
      param.FinanceType = this._proposaldataService.PROPOSAL.value.FINANCETYP;
      param.AssetCondition = articleEntity.ASSETENTITY.PROPOSALASSET.CONDITION;
      param.InsuranceCompanyId = this._proposalmanagerservice.MainInsuranceEntity.value.PRPLINSR.INSURER;
      param.OTOInsuranceCommisionPct = articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.INSRCOMMPCTOTO;
      param.InsurancePremium = articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.INSURANCEPREMIUM;
      param.OTOInsuranceCommision = articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.INSRCOMMAMTOTO;
      //OL Merging
      param.AssetSelectionCode = articleEntity.ASSETENTITY.PROPOSALASSET.ASSETSELECTIONCDE;
      param.ContractID = articleEntity.ASSETENTITY.PROPOSALASSET.CONTRACTID;
      param.RegisterID = articleEntity.ASSETENTITY.PROPOSALASSET.REGISTERID;
      param.PrevAssetID = articleEntity.ASSETENTITY.PROPOSALASSET.PREVASSETID;
      /// OL Migration GAP 5.1
      /// 29-March-2018
      param.IsMigrated = articleEntity.ASSETENTITY.PROPOSALASSET.MIGRATIONIND;
      param.OldContNumber = this._proposaldataService.PROPOSAL.value.ORIGINALCONTRACTNBR;
      param.TaxIncExcl = articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.TAXINCEXCL;
      param.IsMcomCampaign = this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN;


      this._proposalService.SubmitValidations(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
        if (res?.CODE == ReturnCode.ValidationFailed.Code) {
          this.EnableSaveSubmit();
          if (res?.MESSAGE.includes("EngineChasisNo") || res?.MESSAGE.includes("msgBPKBNumberDuplicate")) {
            let msg = '';
            var splittedString = res?.MESSAGE.split(",");
            if (splittedString != null && splittedString.length > 0) {
              if (splittedString.length > 1) {
                msg = this._messageService.GetMessage(splittedString[0]) + splittedString[1];
              }
              else { msg = this._messageService.GetMessage(splittedString[0]); }

              this._messageService.showCustomMesssage(msg, MessageType.Warning);
            }
          }
          else {
            this._messageService.showMesssage(res?.MESSAGE, MessageType.Warning);
          }
          return;
        }
        // mCOM Validations
        if (this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN && res.ResultSet != null) {
          if (res?.ResultSet.ENGINENO?.toString().toUpperCase() == this._proposaldataService.PROPOSALVEHICLEDETAIL.controls.ENGINENUMBER.value.toUpperCase() &&
            res.ResultSet.CHASISNO?.toString().toUpperCase() == this._proposaldataService.PROPOSALVEHICLEDETAIL.controls.CHASSISNBROTO.value.toUpperCase() &&
            res.ResultSet.BPKBNO?.toString().toUpperCase() == this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOBPKBNUMBER.value.toUpperCase()) {
            let idNmbr = "";
            if (this._proposaldataService.PROPOSALAPPLICANT != null) {
              let Borrower = this._proposaldataService.PROPOSALAPPLICANT.controls.filter(p => p.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == RoleCode.Borrower);
              if (Borrower != null) {
                if (Borrower[0].value.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I")
                  idNmbr = Borrower[0].value.PROPOSALAPPLICANTIDDETAIL.filter(p => p.IDTYPECDE == IDTypeCode.KTP)[0].IDTYPENBR;
                else if (Borrower[0].value.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "C")
                  idNmbr = Borrower[0].value.PROPOSALAPPLICANTIDDETAIL.filter(p => p.IDTYPECDE == IDTypeCode.SIUP)[0].IDTYPENBR;
              }
            }
            if (res.ResultSet.IDTYPENBR != idNmbr) {
              this.EnableSaveSubmit();
              let Wmsg = this._messageService.GetMessage("mComIDNbrMisMatch") + res?.ResultSet.EXTERNALCONTRACTNBR + " Borrower ID Number i.e " + res.ResultSet.IDTYPENBR;
              this._messageService.showCustomMesssage(Wmsg, MessageType.Warning);
              return;
            }
            else {
              this._proposaldataService.PROPOSALASSET.controls.MCOMREFERENCENBR.setValue(res.ResultSet.EXTERNALCONTRACTNBR);
              this._proposaldataService.PROPOSALASSET.controls.CONTRACTID.setValue(res.ResultSet.CONTRACTID);
              this._proposaldataService.PROPOSALASSET.controls.MCOMETQUOTEID.setValue(res.ResultSet.ETQUOTATIONID);
              this._proposaldataService.PROPOSALASSET.controls.MCOMASSETID.setValue(res.ResultSet.ASSETID);
              this._proposaldataService.PROPOSALASSET.controls.ARTICLEID.setValue(res.ResultSet.ARTICLEID);
              if (this._proposaldataService.PROPOSALASSET.controls.RowState.value != DataRowState.Added)
                this._proposaldataService.PROPOSALASSET.controls.RowState.setValue(DataRowState.Updated);
              if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value == 0) {
                this._calculationService.RemoveArticleComponent(AmountComponent.ETFromSOLOs);
                this._calculationService.UpdateFinancialAgreementDetailforMCOM(0, AmountComponent.ETFromSOLOs, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._proposaldataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Nettingoff);
              }
            }
          }
          else if (res?.ResultSet.ENGINENO?.toString().toUpperCase() == this._proposaldataService.PROPOSALVEHICLEDETAIL.controls.ENGINENUMBER.value.toUpperCase() ||
            res.ResultSet.CHASISNO?.toString().toUpperCase() == this._proposaldataService.PROPOSALVEHICLEDETAIL.controls.CHASSISNBROTO.value.toUpperCase() ||
            res.ResultSet.BPKBNO?.toString().toUpperCase() == this._proposaldataService.OTOPRPLASSTBPKBDETL.controls.OTOBPKBNUMBER.value.toUpperCase()) {
            this.EnableSaveSubmit();
            let Wmsg = this._messageService.GetMessage("mComEngChasBPKBNotMatched") + res?.ResultSet.EXTERNALCONTRACTNBR;
            this._messageService.showCustomMesssage(Wmsg, MessageType.Warning);
            return;
          }
          else {
            this._proposaldataService.PROPOSALASSET.controls.MCOMREFERENCENBR.setValue("");
            this._proposaldataService.PROPOSALASSET.controls.CONTRACTID.setValue(0);
            this._proposaldataService.PROPOSALASSET.controls.MCOMETQUOTEID.setValue(0);
            this._proposaldataService.PROPOSALASSET.controls.MCOMASSETID.setValue(0);
            this._proposaldataService.PROPOSALASSET.controls.ARTICLEID.setValue(0);
          }
        }
        if (!this.checkAdditionalPremiumAmount()){
          this.EnableSaveSubmit();
          return;
        }
        this._proposalmanagerservice.MainInsuranceEntity.controls.STANDARDINSURANCE.controls.forEach((StndInsr,index) => {
          if (StndInsr.value.RowState != DataRowState.Added && StndInsr.value.RowState != DataRowState.Removed) {
            this._FormState.ResetFormState(this._proposaldataService.STANDARDINSURANCE.controls[index], DataRowState.Updated);
          }
        });
        if (this._proposaldataService.PROPOSALARTICLE.value != null && this._proposaldataService.PROPOSALARTICLE.value.filter(p => p.ASSETENTITY.PROPOSALRENTALDETAIL != null && p.ASSETENTITY.PROPOSALRENTALDETAIL.length > 0).length == this._proposaldataService.PROPOSALARTICLE.value.length) {
          if (!this.mandatoryControlsValidity()) {
            this.EnableSaveSubmit();
            return;
          }
          this._proposalService.SubmitProposal(this._proposaldataService.ProposalEntity.value).pipe(takeUntil(this.subscription$)).subscribe(res => {
            if (res?.CODE == ReturnCode.Success.Code && res?.ResultSet != null) {
              this._proposaldataService.PROPOSAL.controls.PROPOSALID.setValue(res?.ResultSet?.PROPOSALID);
              this._proposaldataService.PROPOSAL.controls.PROPOSALNBR.setValue(res?.ResultSet?.PROPOSALNBR);
              // this.DataContext = Controller.DataContext;
              // ucFinancialPlanClub.DataContext = this.Controller;
              // this.Mode = FormMode.View;
              // SetMode(this.Mode, this.ParentContainer);
              this._FormModeService.FormMode = FormMode.VIEW;
              this._FormState.AcceptChanges(this.ProposalEntity);
              this._FormState.ResetFormState(this.ProposalEntity, DataRowState.Pristine);


              // this._prplEntityMapper.ProposalEntityMapper(this.ProposalEntity, this.ProposalEntity.value as IProposalEntity);
              // this._FormState.ResetFormState(this.ProposalEntity, DataRowState.Pristine);

              // let currentUrl = this.router.url;
              // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              // this.router.onSameUrlNavigation = 'reload';
              // this.router.navigate([currentUrl], { state: { isSubmit: true, QueueOperation: QueueOperation.VIEW } });


              if (this.isResubmitted) {
                this._messageService.showMesssage("ApplicationResubmitSuccess", MessageType.Success);
              }
              else {

                this._messageService.showMesssage("aplcSbmtSucc", MessageType.Success);

              }
            }
            else if (res?.CODE == ReturnCode.ConflictDetected.Code) {
              this._messageService.showMesssage("msgDBConflictDetected", MessageType.Info);
            }
            else if (res?.CODE == ReturnCode.ValidationFailed.Code) {
              // this.Mode = FormMode.View;
              // SetMode(this.Mode, this.ParentContainer);
            }
            else if (res?.MESSAGE?.includes("UQ_PAAT_ACP")) {
              let codes = res?.MESSAGE?.substring(res?.MESSAGE?.lastIndexOf("(") + 1, 5).split(',');
              let comcode = "";
              if (codes.length > 0) {
                comcode = codes[0].trim();
              }
              this.EnableSaveSubmit();
              let mesg = "";
              //AmountComponent cmpt = (AmountComponent)System.Enum.Parse(typeof(AmountComponent), comcode, true);
              mesg = "Please Re-Calculate " + comcode + " Component";
              this._messageService.showMesssage(mesg, MessageType.Warning);
            }
            else {
              this._messageService.showMesssage("aplcSbmtExcpt", MessageType.Error);
            }

          })
        }
        else {
          this._messageService.showMesssage("RentalsGenerateForAllAssets", MessageType.Error);
          // if (this.Mode == FormMode.Submit)
          //   SetMode(FormMode.Edit, this);
          // else
          //   SetMode(this.Mode, this.ParentContainer);
        }

          });
    }
    else {
      this.EnableSaveSubmit();
    }

  }


  public Validate(): boolean {
    this._proposalmanagerservice.isProposalRequestValid = true;
    let msg: Array<string> = this._proposalmanagerservice.isProposalFieldsEmpty(this._calculationService.btnInsCalculateIsEnabled);
    var validationMessages: Array<String> = [];

    // let otherThanRemovedApplicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    // let applicants = this._formBuilder.array<IProposalApplicantEntity>([])
    // otherThanRemovedApplicants.forEach(item => {
    //   applicants.push(this._prplEntityMapper.ProposalApplicantEntityMapper(this._ProposalForm.ProposalApplicantForm(), item));
    // })
    // let otherThanRemovedArticleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    // let articalEntity = this._ProposalForm.ProposalArticleForm();
    // this._prplEntityMapper.ProposalArticleMapper(articalEntity, otherThanRemovedArticleEntity);
    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    if (msg.length > 0) {
      let lstStr = msg
      let message: any;
      let flag = true;
      for (let i = 0; i < lstStr.length; i++) {
        message = this._appConfig.Messages[lstStr[i]]?.Message;
        if (message.includes('{')) {
          this._messageService.showNewMesssage(lstStr[i], applicants[i].PROPOSALAPPLICANT.ROLECDE + "-" + i, MessageType.Info);
        }
        else {
          this._messageService.showMesssage(lstStr[i], MessageType.Info);
        }
        flag = false;
      }
      return flag;
    }
    else if (!this._proposalmanagerservice.isProposalRequestValid) {
      return false;
    }
    const regex = /^[a-zA-Z0-9 &_,.'-]*$/;
    const hasInvalidAddressNotes = applicants.some((applicant) => applicant.ADDRESS.filter(x =>x.PROPOSALAPPLICANTADDRESS.RowState !== DataRowState.Removed).some((address) =>!regex.test(address.PROPOSALAPPLICANTADDRESS.ADDSNOTES || '')))
    if (hasInvalidAddressNotes) {
      this._messageService.showMesssage('msgAdressNotesInvalid', MessageType.Warning);
      return false;
    }

    // if (Controller != null && Controller.DataContext != null && Controller.DataContext.PROPOSAL != null && Controller.DataContext.PROPOSAL.PROPOSALTYPECDE != null)
    // {
    //     if (!ValidateMandatory(Controller.DataContext.PROPOSAL.PROPOSALTYPECDE, out msg, this.Controller.DataContext))
    //     {
    //         List<String> lstStr = msg.ToString().Split(new string[] { System.Environment.NewLine }, StringSplitOptions.None).ToList();

    //         for (int i = 0; i < lstStr.Count - 1; i++)
    //         {
    //             validationMessages.Add(new Controls.ValidationMessage() { Type = MessageType.Warning, Description = lstStr[i] });
    //         }

    //         this.validator.ShowWarningMessages(validationMessages);
    //         return false;
    //     }
    // }

    if (this._proposaldataService.PROPOSAL.value != null && articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT != null && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease && articleEntity.ASSETENTITY.PROPOSALASSET.ASSETSELECTIONCDE == AssetSelection.Inventory) {
      if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALAMT > articleEntity.ASSETENTITY.PROPOSALASSET.NETBOOKVALUE) {
        this._messageService.showMesssage("msgRVgrtrthanNBV", MessageType.Info);
        return false;
      }
    }
    if (this._proposaldataService.PROPOSAL.value != null && this._proposaldataService.PROPOSAL.value.OLRCPTNGBNK == null && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
      this._messageService.showMesssage("msgOLReceiptingBank", MessageType.Info);
      return false;
    }
    if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL != null && (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBLOCATION == null || articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBLOCATION == 0)) {
      if (!(this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease &&
        articleEntity.ASSETENTITY.PROPOSALASSET.ASSETSELECTIONCDE == AssetSelection.Inventory)) {
        this._messageService.showMesssage("BPKBLocation", MessageType.Info);
        return false;

      }

    }
    /// OL Migration GAP 5.1
    /// Validations only of Migrated Contracts

    // if (this._proposaldataService.PROPOSAL.value != null && articleEntity.ASSETENTITY.PROPOSALASSET != null &&
    //   this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease &&
    //   articleEntity.ASSETENTITY.PROPOSALASSET.MIGRATIONIND == true) {
    //   if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ORIGINALSTARTDTE == null) {
    //     this._messageService.showMesssage("msgActualStartDateMissing", MessageType.Info);
    //     return false;
    //   }
    //   if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ORIGINALSTARTDTE != null && articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ORIGINALSTARTDTE > this._storageService.GetUserInfo().ProcessingDate) {
    //     this._messageService.showMesssage("msgGreatercurrentprocessingDate", MessageType.Info);
    //     return false;
    //   }

    //   if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ORIGINALTRM <= 0) {
    //     this._messageService.showMesssage("msgOriginalTermsMissing", MessageType.Info);
    //     return false;
    //   }
    //   if (articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ORIGINALTRM <= this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM) {
    //     this._messageService.showMesssage("msgOriginalTermsShouldBeGreater", MessageType.Info);
    //     return false;
    //   }

    //   if (this._proposaldataService.PROPOSAL.value.ORIGINALCONTRACTNBR) {
    //     this._messageService.showMesssage("msgOldContNumberMissing", MessageType.Info);
    //     return false;
    //   }
    // }
    // if (!this.VerifyContractTerms()) {
    //   return false;
    // }
    return true;
  }



  public VerifyContractTerms(): boolean {

    let articalEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;

    let originalstartdte = new Date(articalEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ORIGINALSTARTDTE);
    let contractstartdte = new Date(articalEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTSTARTDTE);
    let starteDate, orignalEndDate, contractEndDate;

    let lastdayofcontstartdte = new Date(this.GetLastDateOfMonth(contractstartdte));
    let lastdayofcontstartdteday = lastdayofcontstartdte.getDate();
    let contractstartdteday = contractstartdte.getDate()
    if (lastdayofcontstartdteday < contractstartdteday) {
      starteDate = new Date(contractstartdte.getFullYear(), contractstartdte.getMonth(), lastdayofcontstartdte.getDate());
    }
    else {
      starteDate = new Date(contractstartdte.getFullYear(), contractstartdte.getMonth(), originalstartdte.getDate());
    }
    originalstartdte.setMonth(originalstartdte.getMonth() + articalEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ORIGINALTRM);
    orignalEndDate = originalstartdte;
    starteDate.setMonth(starteDate.getMonth() + articalEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTTRM);
    contractEndDate = starteDate;

    let monthDiff = this.monthDifference(orignalEndDate, articalEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTSTARTDTE)
    if ((originalstartdte.getDate() == 1 && (articalEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTTRM != (monthDiff - 1))) || (originalstartdte.getDate() != 1 && (monthDiff != (articalEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTTRM)))) {
      this._messageService.showMesssage("msgOrignalOrContractTermsIncorrect", MessageType.Info);
      return false;
    }

    return true;
  }

  public GetLastDateOfMonth(date: Date) {
    let dt = new Date(date);
    let y = dt.getFullYear();
    let m = dt.getMonth();
    let _date: Date = new Date(y, m + 1, 0)
    return _date;
  }

  public monthDifference(startDate: Date, endDate: Date) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let monthsApart = 12 * (startDate.getFullYear() - endDate.getFullYear()) + startDate.getMonth() - endDate.getMonth();
    return Math.abs(monthsApart);
  }
  private DisableSaveSubmit() {
    this.isSaveEnabled = true;
    this.isSubmitEnabled = true;
  }
  private EnableSaveSubmit() {
    this.isSaveEnabled = false;
    this.isSubmitEnabled = false;
  }

  private UpdateBPKBDetail() {

    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articalEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;


    if (articalEntity.ASSETENTITY != null && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL != null
      && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Borrower) {
      if (this._proposaldataService.PROPOSAL.value.APPLICANTIND == "I") {
        let individualApplicant = applicants[0].INDIVIDUALAPPLICANT as IIndividualApplicantEntity;
        if (individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.MIDDLENME != null) {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOBPKBOWNERNME.setValue(this._proposaldataService.concatenateNames(individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME, individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.MIDDLENME, individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.LASTNME))
        }
        else {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOBPKBOWNERNME.setValue(this._proposaldataService.concatenateNames(individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME, null, individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.LASTNME))
        }
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERKTPID.setValue(individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.IDCARDNBR);
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(applicants[0].PROPOSALAPPLICANTIDDETAIL[0].EXPIRYDTE);
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERDOB.setValue(individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH);
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.GENDER.setValue(individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.GENDER);
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue(individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.OTOPLACEOFBIRTH);
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue(individualApplicant.PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE);
        if (this._proposaldataService.PROPOSAL.controls.OTOAPLTCTGYCDE.value != null) {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERTYPE.setValue(this._proposaldataService.PROPOSAL.controls.OTOAPLTCTGYCDE.value);
        }
        if (applicants[0].PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I") {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(ApplicantType.Individual);
        }
        else if (applicants[0].PROPOSALAPPLICANTMAIN.APPLICANTTYP == "C") {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(ApplicantType.Company);
        }

        if (individualApplicant.PROPOSALAPPSPOUSEDETAIL.length > 0 && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE != null) {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue(this._proposaldataService.concatenateNames(individualApplicant.PROPOSALAPPSPOUSEDETAIL[0].FIRSTNME, individualApplicant.PROPOSALAPPSPOUSEDETAIL[0].MIDDLENME, individualApplicant.PROPOSALAPPSPOUSEDETAIL[0].LASTNME))
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue(individualApplicant.PROPOSALAPPSPOUSEDETAIL[0].SPOUSEADDRESS);
        }
        else {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue(null);
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue(null);
        }
        if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE == MaritalStatus.Married && individualApplicant.PROPOSALAPPSPOUSEDETAIL.length > 0) {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOAGMTCDE.setValue(individualApplicant.PROPOSALAPPSPOUSEDETAIL[0].OTOAGMTCDE)
        }
        if(this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.RowState.value!=DataRowState.Added){
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.RowState.setValue(DataRowState.Updated);
        }
        else {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOAGMTCDE.setValue(null);
        }
        this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);

      }
      else if (this._proposaldataService.PROPOSAL.value.APPLICANTIND == "C") {
        let companyApplicant = applicants[0].COMPANYAPPLICANT as ICompanyApplicantEntity;
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(ApplicantType.Company);
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOBPKBOWNERNME.setValue(companyApplicant.PROPOSALAPPLICANTCOMPANY.NAME);
        this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERKTPID.setValue(applicants[0].PROPOSALAPPLICANTIDDETAIL[0].IDTYPENBR);
        if (this._proposaldataService.PROPOSAL.value.OTOAPLTCTGYCDE != null) {
          this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOWNERTYPE.setValue(this._proposaldataService.PROPOSAL.controls.OTOAPLTCTGYCDE.value);
        }
        this._proposalmanagerservice.UpdateBPKBRepresentatives();
        this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);
      }
    }
  }

  private SetDefaultAddress(indicatorOwnerType: string) {

    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articalEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    let isFirstLegal = true;
    let borrowerAddress = {} as IPRPL_APLT_ADDSInfo;
    applicants[0].ADDRESS.forEach(addressType => {
      if (addressType.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.Legal).length > 0 && isFirstLegal) {
        isFirstLegal = false;
        borrowerAddress = addressType.PROPOSALAPPLICANTADDRESS as IPRPL_APLT_ADDSInfo;
      }
    })
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.ADDSDSC.setValue(borrowerAddress.ADDRESSOTO);
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOCOUNTRY.setValue(Number(borrowerAddress.COUNTRYID));
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOPROVINCE.setValue(borrowerAddress.PROVINCEID);
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOKOTAMADYA.setValue(borrowerAddress.KOTAMADYAIDOTO);
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOKECAMATAN.setValue(borrowerAddress.KECAMATANIDOTO);
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTODESA.setValue(borrowerAddress.KELURAHANIDOTO);
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTORW.setValue(borrowerAddress.RWOTO);
    this._proposaldataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTORT.setValue(borrowerAddress.RTOTO);


  }
  private CalculateAge() {
    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articalEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    if (articalEntity != null) {
      if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL != null
        && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB != null) {
        let years = 0;
        let months = 0;
        let days = 0;
        let temparr = this._proposaldataService.DateDiff(articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB, this._storageService.GetUserInfo().ProcessingDate, years, months, days);
        if (temparr[0] == 18){
          let result = this._proposaldataService.BirthdayNotReached(articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB, this._storageService.GetUserInfo().ProcessingDate, years, months, days);
          temparr[0] = result[0];
        }
        years = temparr[0];
        months = temparr[1];
        days = temparr[2];

        if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE != 0 && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Borrower) {
          this.bpkbConfiguredAge = articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE;
        }
        else if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE != 0 && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Other) {
          this.bpkbConfiguredAge = articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOTHERAGE;
        }

        if (years < this.bpkbConfiguredAge && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBGRTRDETL.filter(p => p.RowState != DataRowState.Removed).length == 0) {
          if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE != null) {
            if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE != MaritalStatus.Married) {
              return false;
            }
          }
        }
        else {
          return true;
        }
      }
      return true;
    }
    return true;
  }

  public SaveClicked() {

    if (this._FormModeService.FormMode == FormMode.EDIT || this._FormModeService.FormMode == FormMode.RESUBMIT) {
      this._FormState.SetFormState(this.ProposalEntity, FormMode.EDIT, DataRowState.Updated, true);
    }


    this.IsCommissionTaxCalculated = true;

    this.ValidateCommissionTax();

    if (!this.IsCommissionTaxCalculated) {
      return;
    }

    // Check if all mandatory controls are valid
    if (!this.mandatoryControlsValidity()) {
      return;
    }

    let applicant = this._proposaldataService.PROPOSALAPPLICANT.controls.filter(x => x.value.PROPOSALAPPLICANTMAIN.ROLECDE == RoleCode.Borrower && x.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I");
    if (applicant.length > 0) {
      if (applicant[0].controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT.length == 0) {
        this._messageService.showCustomMesssage('Select atleast one Employement at Borrower', MessageType.Warning);
        return;
      }
    }

      if(this._proposaldataService.PROPOSAL.value.STATUSCDE != StatusCode.Draft && this._proposaldataService.PROPOSAL.value.STATUSCDE != StatusCode.InProcessWithDealer ){
          this.DisableSaveSubmit();
          this._messageService.showMesssage("msgDBConflictDetected", MessageType.Info);
          return;
      }

    if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase
      && this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN == false
      && (this._FormModeService.FormMode == FormMode.EDIT || this._FormModeService.FormMode == FormMode.NEW || this._FormModeService.FormMode == FormMode.COPY || this._FormModeService.FormMode == FormMode.SUBMIT || this._FormModeService.FormMode == FormMode.RESUBMIT)
      && this._proposaldataService.PROPOSAL.value.APPLICANTIND == "I"
      && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.REALDOWNPAYMENTAMT <= 0) {
      var dialog = this._dialog.openDialog("Confirmation", "Real Downpayment value is 0. Do you want to save application with RDP equal to 0 ?", false, "Yes", "No");
      dialog.afterClosed().subscribe(
        result => {
          if (result === "ok") {

            if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase
              || this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance
              //&& Controller.DataContext.PROPOSAL.ISMCOMCAMPAIGN == false
              && this._FormModeService.FormMode == FormMode.EDIT
              && this._proposaldataService.PROPOSAL.value.APPLICANTIND == "I"
              && this._proposaldataService.PROPOSAL.value.STATUSCDE != StatusCode.InProcessWithDealer) {
              var dialog = this._dialog.openDialog("Confirmation", "Are you sure to perform Re-Scoring?", false, "Yes", "No");
              dialog.afterClosed().subscribe(
                result => {
                  if (result === "ok") {
                    this._proposaldataService.PROPOSAL.value.SCORECARDEVALUATIONIND = true;
                    this.saveProposalCode();
                  }
                  else {

                    this._proposaldataService.PROPOSAL.value.SCORECARDEVALUATIONIND = false;
                    this.saveProposalCode();
                  }
                });
            }

            else if (FormMode.COPY || this._FormModeService.FormMode == FormMode.NEW || this._FormModeService.FormMode == FormMode.SUBMIT || this._FormModeService.FormMode == FormMode.RESUBMIT) {
              this.saveProposalCode();
            }
          }

          else {
            return;
          }
        });

    }



    //TO BE DONE FOR COMMISSION VALIDATIONS
    // let isCommissionDistributedToRecepient = this.checkCommissionDistrubtionToRecipent();
    // if (!isCommissionDistributedToRecepient) {
    //   this._messageService.showMesssage("msgReCalculateMrktComm", MessageType.Warning);
    //   return;
    // }

    else {
      if ((this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase
        || this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance)
        && (this._FormModeService.FormMode == FormMode.EDIT || this._FormModeService.FormMode == FormMode.RESUBMIT)
        && this._proposaldataService.PROPOSAL.value.APPLICANTIND == "I"
        && this._proposaldataService.PROPOSAL.value.STATUSCDE != StatusCode.InProcessWithDealer) {
        var dialog = this._dialog.openDialog("Confirmation", "Are you sure to perform Re-Scoring?", false, "Yes", "No");
        dialog.afterClosed().subscribe(
          result => {
            if (result === "ok") {
              this._proposaldataService.PROPOSAL.controls.SCORECARDEVALUATIONIND.setValue(true);
              this.saveProposalCode();
            }
            else {
              this._proposaldataService.PROPOSAL.controls.SCORECARDEVALUATIONIND.setValue(false);
              this.saveProposalCode();
            }
          }
        );
      }
      else {
        this.saveProposalCode();
      }
    }
  }

  public saveProposalCode() {

    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;

    if (this.showAssetFlaggingValidation) {
      this.EnableSaveSubmit();
      this._messageService.showCustomMesssage("Asset Model and Asset condition is not matched", MessageType.Warning);
      return;
    }

    //this.DisableSaveSubmit();
    let isvalidate = true;;
    let isSlikValidate = true;

    if (this._proposalmanagerservice.PRPLMODULECODE == ProposalModuleCode.Template)
      isvalidate = true;
    else {
      isvalidate = this.Validate();
      if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
        //to be done for CF Application
        isSlikValidate = this._proposalmanagerservice.SlikValidation();
      }
    }
    if (isvalidate && isSlikValidate) {
      let isRevisedMsg = false;
      if (this._FormModeService.FormMode == FormMode.REVISION) {
        let param = {} as IProposalInfoParm;
        param.ProposalId = this._proposaldataService.PROPOSAL.value.PROPOSALID;
        param.StatusCode = StatusCode.Revised;
        this._proposalService.ReviseProposal(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res?.CODE == ReturnCode.Success.Code) {
            isRevisedMsg = true;
          }
        })
      }
      // Finanical Ratios are assigned to Applicants
      // if (FinancialRatios != null)
      //     Controller.addFinancialRatio(Controller.DataContext.PROPOSALAPPLICANT, FinancialRatios);

      if (this._proposaldataService.PROPOSAL.value != null && this._proposaldataService.PROPOSAL.value.FINANCETYP != null) {
        let param = {} as IProposalInfoParm;
        param.FinanceType = this._proposaldataService.PROPOSAL.value.FINANCETYP;
        param.CountryId = 10;
        this._proposalService.ReadProposalTaxConfigEntity(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
          if (res?.ResultSet != null && res?.CODE == ReturnCode.Success.Code) {
            if (this._FormModeService.FormMode == FormMode.COPY) {
              this._proposaldataService.ProposalEntity.controls.PROPOSALTAXCONFIG = this._formBuilder.array<IProposalTaxConfigEntity>([])
            }
            else {
              this._FormState.ResetFormArrayState(this._proposaldataService.ProposalEntity.controls.PROPOSALTAXCONFIG, DataRowState.Removed);
              this._proposaldataService.ProposalEntity.controls.PROPOSALTAXCONFIG.controls.push(this._formBuilder.group<IProposalTaxConfigEntity>(res?.ResultSet));
            }
          }
        })
      }
      if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
        this._proposaldataService.PROPOSAL.controls.INTRODUCERROLECDE.setValue(RoleCode.Dealer);
      }

      // if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      // if (!this.NPWPValidation()) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showCustomMesssage("Please Input NPWP ID", MessageType.Warning);
      //   return;
      // }

      // if (!this.fromToDateValidation()) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showCustomMesssage("From Date and To Date is missing at Employment Details", MessageType.Warning);
      //   return;
      // }

      // if (!this.ChassisNoValidation()) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showCustomMesssage("Chassis No is Missing at Vehicle Detail", MessageType.Warning);
      //   return;
      // }

      // if (!this.EngineNoValidation()) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showCustomMesssage("Engine No is Missing at Vehicle Detail", MessageType.Warning);
      //   return;
      // }

      // if (!this.LicPlateNoValidation()) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showCustomMesssage("Lic Plate No is Missing at Vehicle Detail", MessageType.Warning);
      //   return;
      // }

      // if (!this.vehicleColorValidation()) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showCustomMesssage("Vehicle Color is not given at Vehicle Detail", MessageType.Warning);
      //   return;
      // }

      // if (!this.totalApplicationChargesValidation()) {
      //   this.EnableSaveSubmit();
      //   this._messageService.showCustomMesssage("Total Application Charges should be greater than zero", MessageType.Warning);
      //   return;
      // }

      // }
      if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase &&
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT > 0 &&
        this._proposaldataService.PROPOSAL.value.BPINTRODUCERID != this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].value.PRPLCOMM.DEALERID) {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Commission recipient is not updated. Please re-select Dealer / FP Group or Campaign", MessageType.Warning);
        return;
      }

      if (!this.standardInsuranceValidation()) {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Please Select atleast one Standard Insurance", MessageType.Warning);
        return;
      }
      // if (this.doesUserBelongsToEApprovalGroup() === false) {
      //   this._messageService.showMesssage("forwardTakeControlNotAllowed",  MessageType.Warning);
      //   this.DisableSaveSubmit();
      //   return;
      // }



      if (!this.ApplicantGuarantorCheck()) {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgGrndrmissing", MessageType.Warning);
        return;
      }
      this.UpdateBPKBDetail();
      if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBHOLDERNME==null || articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBHOLDERNME=='') {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgBPKBHolderNameEmpty", MessageType.Warning);
        return;
      }
      if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBHOLDERADDRESS==null || articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBHOLDERADDRESS=='') {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgBPKBholderAddressEmpty", MessageType.Warning);
        return;
      }
      if (!this.CalculateAge()) {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("AddGuarantorDetl", MessageType.Info);
        return;
      }
      if (this.PROPOSAL.controls.SALESMANMANDATORY.value && (this.PROPOSAL.controls.SALESMANID.value == null ||  this.PROPOSAL.controls.SALESMANID.value < 1)) {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("msgSalesmanMissing", MessageType.Warning);
        return;
      }
      const totalPRVFee = this._proposaldataService?.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value;
      const PRVFeePCT = this._proposaldataService?.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.value;
      if (totalPRVFee > 10000 && PRVFeePCT === 0 && this._appConfig.ShowProvisionFeeValidation == true) {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Provision Rate mismatch detected.", MessageType.Warning);
        return;
      }
      const hasProvisionFeeComponent = this._proposaldataService.PRPLARTICLECOMPONENTENTITYCOL.value.some(x => x.PRPLARTEAMNTTRAN.AMTCMPTCDE === "00120"
        && (x.RowState !== DataRowState.Removed)
      );
      if(totalPRVFee > 0 && !hasProvisionFeeComponent)
      {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Provision Rate mismatch detected.", MessageType.Warning);
        return;
      }

      const financialAgreementAPLRTE = this._proposaldataService?.PROPOSALFINANCIALAGREEMENT?.value?.APPLIEDCUSTOMERRTE;
      const prplBaseRTE = this._proposaldataService?.PROPOSALARTICLEBASERATE.controls[0].value.APPLIEDCUSTOMERRTE
      if (financialAgreementAPLRTE !== prplBaseRTE && this._appConfig.ShowInterestRateValidation == true) {
        this.EnableSaveSubmit();
        this._messageService.showCustomMesssage("Interest Rate mismatch detected.", MessageType.Warning);
        return;
      }



      // if (Controller != null &&
      //     Controller.DataContext != null &&
      //     Controller.PROPOSAL_SOF_COMMISSION_DETAIL != null &&
      //     Controller.DataContext.PROPOSALARTICLE != null &&
      //     Controller.PROPOSAL_SOF_COMMISSION_DETAIL.TOTALSOFCOMMISSION > 0 &&
      //     Controller.DataContext.PROPOSALARTICLE.Count > 0 &&
      //     Controller.DataContext.PROPOSALARTICLE.FirstOrDefault().ASSETENTITY != null &&
      //     Controller.DataContext.PROPOSALARTICLE.FirstOrDefault().ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL != null &&
      //     Controller.DataContext.PROPOSALARTICLE.FirstOrDefault().ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.Count > 0
      //     )
      // {
      //     if (!Controller.DataContext.PROPOSALARTICLE.FirstOrDefault().ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.Any(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.Commission.GetStringValue()))
      //     {
      //         this.EnableSaveSubmit();
      //         Utilities.ShowMessage("msgplzreinputSOFCommissionAmnt", MessageType.Information, ref validator);
      //         return;
      //     }
      // }
      if(applicants != null &&
        applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) != null &&
        applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT != null){
        let flag = false;
        if(applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.filter((p:any)=>p.ECNMSCTRCODEOTO==null && p.RowState != DataRowState.Removed).length>0){
          //message
          this.EnableSaveSubmit();
          this._messageService.showMesssage("msgEconomicSectorEmpty", MessageType.Warning);
          flag=true;
        }
        if(applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.filter((p:any)=>p.INDUSTRYTYPECDE==null && p.RowState != DataRowState.Removed).length>0){
          //message
          this.EnableSaveSubmit();
          this._messageService.showMesssage("msgIndustryTypeEmpty", MessageType.Warning);
          flag=true;
        }
        if(applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.filter((p:any)=>p.INDUSTRYSUBTYPECDE==null && p.RowState != DataRowState.Removed).length>0){
          //message
          this.EnableSaveSubmit();
          this._messageService.showMesssage("msgIndustryLineEmpty", MessageType.Warning);
          flag=true;
        }
        if(flag){
          return;
        }
      }


      if (applicants != null
        && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) != null
        && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].PROPOSALAPPLICANTBANK != null
        && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
        if (applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].PROPOSALAPPLICANTBANK.length == 0) {
          this.EnableSaveSubmit();
          this._messageService.showMesssage("AddBankDetailRF", MessageType.Warning);
          return;
        }
        else {
          let flag = false;
          applicants.find(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)?.PROPOSALAPPLICANTBANK.forEach(bank => {
            if (bank.RowState != DataRowState.Removed) {
              flag = true;
            }
          });

          if (flag == false) {
            this.EnableSaveSubmit();
            this._messageService.showMesssage("AddBankDetailRF", MessageType.Warning);
            return;
          }
        }
      }
      if (applicants != null
        && (this._proposaldataService.PROPOSAL.value.MCOMDEALER || this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN)
        && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) != null
        && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].PROPOSALAPPLICANTBANK != null
        && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0].PROPOSALAPPLICANTBANK.length == 0
        && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
        this.EnableSaveSubmit();
        this._messageService.showMesssage("AddBankDetailRF", MessageType.Warning);
        return;
      }
      if(this._appConfig.CompanyCode  == "001"
        && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase
        && !this._proposaldataService.PROPOSAL.value.COMMAPPLICABLECDE && !this._proposaldataService.PROPOSAL.value.MCOMDEALER
        )
        {
          this._messageService.showCustomMesssage("Commission Applicable is not selected",MessageType.Warning);
          return;
        }
      if (applicants != null && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower && p.PROPOSALAPPLICANT.RowState !== DataRowState.Removed)[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE == MaritalStatus.Married) {
        let flag = false;
        this.EnableSaveSubmit();
        applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower && p.PROPOSALAPPLICANT.RowState !== DataRowState.Removed)[0].INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.forEach(family => {
          if (family.RowState != DataRowState.Removed && (family.FAMCRDNUM == null || family.FAMCRDNUM == '')) {
            this._messageService.showMesssage("msgFamilyCardNumberNotProvided", MessageType.Warning);
            flag = true;
          }
          if (family.RowState != DataRowState.Removed && (family.GENDER == null || family.GENDER == '')) {
            this._messageService.showMesssage("msgFamilyMemberGenderNotProvided", MessageType.Warning);
            flag = true;
          }
          if (family.RowState != DataRowState.Removed && (family.RELATIONSHIPCDE == null || family.RELATIONSHIPCDE == '')) {
            this._messageService.showMesssage("msgFamilyMemberRelationNotProvided", MessageType.Warning);
            flag = true;
          }
          if (family.RowState != DataRowState.Removed && (family.OCCUPATIONCDE == null || family.OCCUPATIONCDE == '')) {
            this._messageService.showMesssage("msgFamilyMemberOccupationNotProvided", MessageType.Warning);
            flag = true;
          }
        });

        if (flag)
          return;
      }
      if (applicants != null
        && this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANTBANK.length > 0) {
        this.EnableSaveSubmit();
        let flag = false;
        this._proposaldataService.CurrentApplicant.value.PROPOSALAPPLICANTBANK.forEach(bank => {
          if (bank.RowState != DataRowState.Removed && (bank.ACCOUNTNME == null || bank.ACCOUNTNME == '')) {
            this._messageService.showMesssage("msgBankAccountNameNotProvided", MessageType.Warning);
            flag = true;
          }
          if (bank.RowState != DataRowState.Removed && (bank.ACCOUNTNBR == null || bank.ACCOUNTNBR == '')) {
            this._messageService.showMesssage("msgBankAccountNumberNotProvided", MessageType.Warning);
            flag = true;
          }
        })

        if (flag)
          return;
      }
      if (articleEntity.ASSETENTITY != null &&
        articleEntity.ASSETENTITY.PROPOSALASSET != null &&
        articleEntity.ASSETENTITY.PROPOSALASSET.ASSETSELECTIONCDE == null) {
        articleEntity.ASSETENTITY.PROPOSALASSET.ASSETSELECTIONCDE = AssetSelection.Purchase;
      }
      if (this._FormModeService.FormMode === FormMode.NEW) {
        this._proposaldataService.PROPOSAL.controls.CREATEDBY.setValue(this._storageService.GetUserInfo()?.UserId);
        this._proposaldataService.PROPOSAL.controls.ASSNTO.setValue(this._storageService.GetUserInfo()?.UserId);
        // this.ProposalEntity.controls.PROPOSAL.controls.CREATEDBY.setValue(this._storageService.GetUserInfo()?.UserId);
        // this.ProposalEntity.controls.PROPOSAL.controls.ASSNTO.setValue(this._storageService.GetUserInfo()?.UserId);
      }

      var datePipe = new DatePipe("en-US");
      let value = datePipe.transform(this._proposaldataService.ASSETENTITY.value.PROPOSALVEHICLEDETAIL.RELEASEYEAR, 'd/M/yyyy h:mm:ss a');
      this._proposaldataService.ASSETENTITY.controls.PROPOSALVEHICLEDETAIL.controls.RELEASEYEAR.setValue(String(value));
      if (this._proposaldataService.ASSETENTITY.controls.PROPOSALVEHICLEDETAIL.controls.RowState.value !== DataRowState.Added)
        this._proposaldataService.ASSETENTITY.controls.PROPOSALVEHICLEDETAIL.controls.RowState.setValue(DataRowState.Updated);
      // to do ROWVERSION not available in info in angular
      //this._proposaldataService.PROPOSAL.controls.ROWVERSION = Controller.RowVersion;

      /********************************SOCD-29222***************************************/

      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.TOTALFIRSTPAYMENT == 0)
        this._calculationService.CalculateFirstPayment();

      /********************************************************************************/

      this._proposalmanagerservice.MainInsuranceEntity.controls.STANDARDINSURANCE.controls.forEach((StndInsr,index) => {
        if (StndInsr.value.RowState != DataRowState.Added && StndInsr.value.RowState != DataRowState.Removed) {
          this._FormState.ResetFormState(this._proposaldataService.STANDARDINSURANCE.controls[index], DataRowState.Updated);
        }
      });

      let request = this.ProposalEntity.value as any;
      // if (request.PROPOSAL.APPLICANTIND == 'C' && request.PROPOSALAPPLICANT[0]?.INDIVIDUALAPPLICANT?.RowState == DataRowState.Added) {
      //   request.PROPOSALAPPLICANT[0].INDIVIDUALAPPLICANT = null
      // }
      // else if (request.PROPOSAL.APPLICANTIND == 'I' && request.PROPOSALAPPLICANT[0]?.COMPANYAPPLICANT?.RowState == DataRowState.Added) {
      //   request.PROPOSALAPPLICANT[0].COMPANYAPPLICANT = null
      // }

      request.PROPOSALAPPLICANT.forEach((item: any) => {
        if (item.PROPOSALAPPLICANTMAIN.APPLICANTTYP == 'C' && item.COMPANYAPPLICANT?.RowState == DataRowState.Added) {
          item.INDIVIDUALAPPLICANT = null;
        }
        else if (item.PROPOSALAPPLICANTMAIN.APPLICANTTYP == 'I' && item.COMPANYAPPLICANT?.RowState == DataRowState.Added) {

          item.COMPANYAPPLICANT = null;
        }
      });
      if(this._proposaldataService.ASSETENTITY.value.OTOPRPLASSTBPKBDETL.BPKBPOSLOCATION=='' || this._proposaldataService.ASSETENTITY.value.OTOPRPLASSTBPKBDETL.BPKBPOSLOCATION==null){
        this._messageService.showCustomMesssage("BPKB POS Location is not selected",MessageType.Info);
      }

      this._proposalService.SaveProposal(request).pipe(takeUntil(this.subscription$)).subscribe(res => {
        if (res?.CODE == ReturnCode.Success.Code) {

          let data: IProposalEntity = res.ResultSet as IProposalEntity;
          this._prplEntityMapper.ProposalEntityMapper(this.ProposalEntity, data);
          this._FormState.ResetFormState(this.ProposalEntity, DataRowState.Pristine);
          this._FormModeService.FormMode = FormMode.EDIT;
          //this._messageService.showCustomMesssage('Application ' + res.ResultSet.PROPOSAL.PROPOSALNBR + ' Saved Successfully');
          this.subscribeValueChange(this._FormModeService.FormMode);
          //this.PROPOSAL.controls.PROPOSALID.setValue(this._proposaldataService.PROPOSAL.controls.PROPOSALID.value);
          //this._proposaldataService.PROPOSAL.controls.ROWVERSION.setValue(res?.ResultSet.PROPOSAL.ROWVERSION);
          this.EnableSaveSubmit();
          if (this._proposaldataService.PROPOSALCOMMISSIONENTITY !== null && this._proposaldataService.PROPOSALCOMMISSIONENTITY.length > 0 && this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].value.PRPLCOMM !== null)
            this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.UNALLOCATEDEXPENSEAMT.setValue(this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.UNALLOCATEDEXPENSEAMT.value);
          if (isRevisedMsg) {
            this._messageService.showMesssage("ApplctnReviseSuccess", MessageType.Success);
          }
          else {
            if (this._proposalmanagerservice.PRPLMODULECODE == ProposalModuleCode.Template) {
              this._messageService.showMesssage("TmpltSaveSuccess", MessageType.Success);
            }
            else {
              this._messageService.showMesssage("AplcSaveSuccess", MessageType.Success);
            }
          }
        }
        else if (res?.CODE == ReturnCode.ConflictDetected.Code) {
          this.EnableSaveSubmit();
          this._messageService.showMesssage("msgDBConflictDetected", MessageType.Info);
        }
        else if (res?.MESSAGE?.includes("FK_PAE__IDSC")) {
          this.EnableSaveSubmit();
          this._messageService.showMesssage("msgSelectIndustrySubType", MessageType.Warning);
        }
        //   else if (result.MESSAGE.Contains("UNIQUE_PJJRT"))
        // {
        //     string[] codes = (result.MESSAGE.Substring(result.MESSAGE.LastIndexOf("("), 30)).Split(',');
        //     string comcode = "";
        //     if (codes.Length > 1)
        //         comcode = codes[1].Trim();
        //     EnableSaveSubmit();
        //     string mesg = string.Empty;
        //     switch (comcode)
        //     {
        //         case "00001"://	Marketing Commission
        //             mesg = "Please Re-Distribute Marketing Commission";
        //             break;
        //         case "00002"://	Com Sys JP2 Commission
        //             mesg = "Please Re-Distribute Com Sys JP2  Commission";
        //             break;
        //         case "00003"://	Insurance Commission
        //             mesg = "Please Re-Distribute Insurance Commission";
        //             break;
        //         case "00004"://	Provision Fee Commission
        //             mesg = "Please Re-Distribute Provision Fee Commission";
        //             break;
        //         case "00005"://	Admin Fee Commission
        //             mesg = "Please Re-Distribute Admin Fee Commission";
        //             break;
        //         default:
        //             mesg = Utilities.GetMessageDescfrmCode("msgCommissionReload");
        //             break;
        //     }

        //     if (Controller.DataContext.PROPOSALARTICLE[0].ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT != null)
        //         Controller.DataContext.PROPOSALARTICLE[0].ASSETENTITY.PROPOSALCOMMISSIONENTITY[0].JP1JP2RECIPIENT.ForEach(x =>
        //         {
        //             if (x.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == comcode)
        //                 x.PRPLJP1JP2RPNTTAX.ForEach(y => { if (y.BUSINESSPARTNERID != x.PRPLJP1JP2RPNT.RECIPIENTID && y.COMMISSIONTYPECDE == comcode) { y.RowState = DataRowState.Removed; } });
        //         });

        //     List<MessageInfo> validationMessages = new List<MessageInfo>() { new MessageInfo(){
        // Message=mesg,Type= MessageType.Warning}};
        //     Utilities.ShowMessages(validationMessages, ref validator);
        // }
        else if (res?.MESSAGE?.includes("Please_Eat")) {
          this._FormModeService.FormMode = FormMode.VIEW;
        }
        else if (res?.MESSAGE?.includes("APPID_RLDCDE_BORROWER_ALREADYEXIST")) {
          this.EnableSaveSubmit();
          this._messageService.showMesssage("msgBorrowerRoleCodeAlreadyExists", MessageType.Warning);
        }
        else if (res?.MESSAGE?.includes("PK_PROPOSAL_PAYMENT_PLAN")) {
          this.EnableSaveSubmit();
          this._calculationService.ResetRentalDetail();
          this._messageService.showMesssage("RentalsNotCalculated", MessageType.Warning);
        }
        else if (res?.MESSAGE?.includes("UQ_PAAT_ACP")) {
          let codes = res?.MESSAGE?.substring(res?.MESSAGE?.lastIndexOf("(") + 1, 5).split(',');
          let comcode = "";
          if (codes.length > 0) {
            comcode = codes[0].trim();
          }
          this.EnableSaveSubmit();
          let mesg = "";
          //AmountComponent cmpt = (AmountComponent)System.Enum.Parse(typeof(AmountComponent), comcode, true);
          mesg = "Please Re-Calculate " + comcode + " Component";
          this._messageService.showMesssage(mesg, MessageType.Warning);
        }
        else {
          this.EnableSaveSubmit();
          this._messageService.showMesssage("ExcpOccrSaving", MessageType.Warning);
        }

      })
    }
    else {
      this.EnableSaveSubmit();
    }

  }


  private NPWPValidation() {
    let userInfo = this._storageService.GetUserInfo();
    let IdType = this.ApplicantEntity.value[0].PROPOSALAPPLICANTIDDETAIL[0].IDTYPECDE;
    if ((this.ApplicantEntity.controls[0].controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.value == "I")) {
      if (userInfo !== null && userInfo.IsOTO) {
        if (IdType == IDTypeCode.NPWP && this.ApplicantEntity.value[0].PROPOSALAPPLICANTIDDETAIL[0].IDTYPENBR !== null) {
          return false;
        }

        else {
          return true;
        }
      }

      else {
        return true;
      }
    }
    else {
      return true;
    }
  }


  private fromToDateValidation() {

    let fromToDate = this.ApplicantEntity.controls[0].controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT.value;
    if (fromToDate) {
      return true;
    }
    else {
      return false;
    }
  }

  private ChassisNoValidation() {
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    let ChasisNbr = articleEntity.ASSETENTITY.PROPOSALVEHICLEDETAIL.CHASSISNBROTO;
    if (ChasisNbr !== null) {
      return true;
    }
    else {
      return false;
    }
  }

  private EngineNoValidation() {
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    let EngineNbr = articleEntity.ASSETENTITY.PROPOSALVEHICLEDETAIL.ENGINENUMBER;
    if (EngineNbr !== null) {
      return true;
    }
    else {
      return false;
    }
  }

  private LicPlateNoValidation() {
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    let LicPlateNbr = articleEntity.ASSETENTITY.PROPOSALVEHICLEDETAIL.TRAILERREGISTRATIONNUMBER;
    if (LicPlateNbr !== null) {
      return true;
    }
    else {
      return false;
    }
  }

  private vehicleColorValidation() {
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    let vehicleColor = articleEntity.ASSETENTITY.PROPOSALVEHICLEDETAIL.COLOR;
    if (vehicleColor !== null) {
      return true;
    }
    else {
      return false;
    }
  }

  private totalApplicationChargesValidation() {
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    let ProposalCharges = articleEntity.ASSETENTITY.PROPOSALCHARGE;
    let chargeAmount = articleEntity.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CHARGEAMT;
    if (ProposalCharges.length > 0) {
      if (chargeAmount > 0) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
  }


  private standardInsuranceValidation() {

    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {

      if (articleEntity.ASSETENTITY.PROPOSALINSURANCEMAIN.length > 0 && articleEntity.ASSETENTITY.PROPOSALINSURANCEMAIN[0].STANDARDINSURANCE.length == 0) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }
  }


  private ApplicantGuarantorCheck() {
    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    if (applicants != null
      && this._proposaldataService.PROPOSAL.value != null
      && this._proposaldataService.PROPOSAL.value.APPLICANTIND == "I"
      && applicants[0].INDIVIDUALAPPLICANT != null
      && applicants[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL != null) {
      let years = 0, months = 0, days = 0;
      let temparr = [];
      if (applicants[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH != null) {
        temparr = this._proposaldataService.DateDiff(applicants[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH, new Date(), years, months, days);
        if (temparr[0] == 18){
          let result = this._proposaldataService.BirthdayNotReached(applicants[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH, new Date(), years, months, days);
          temparr[0] = result[0];
        }
        years = temparr[0];
        months = temparr[1];
        days = temparr[2];
        if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE != 0 && articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Borrower) {
          this.bpkbConfiguredAge = articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE;
        }

        if (years < this.bpkbConfiguredAge
          && applicants[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE == MaritalStatus.Single
          && applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == "00005").length == 0) {
          return false;
        }
        else {
          return true;
        }
      }
    }
    return true;
  }

  GetOTOInsuranceCommissionTaxAmount(_taxCollection: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>, _enumTaxType: TaxType) {
    let _taxAmount = 0;

    try {
      if (_taxCollection.filter((p: any) => p.TAXTYPECDE == _enumTaxType).length > 0)
        _taxAmount = _taxCollection.filter((p: any) => p.TAXTYPECDE == _enumTaxType)[0].TAXAMT;

    }
    catch (Exception) {
    }

    return _taxAmount;
  }

  onApplicantTypeChange(event: any) {
    if (event != undefined) {
      if (this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDEOLD.value == "")
        this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDEOLD.setValue(this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDE.value);
      //this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDE.setValue(event.value);
      var customDialog = this._dialog.openDialog("Confirmation", "Applicant and Financial information will be lost, Do you want to continue?", false, "Yes", "No");
      customDialog.afterClosed().subscribe(
        result => {
          if (result === "ok") {
            this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDEOLD.setValue(this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDE.value);
            this.resetArticleEntity();
            this._FormState.ResetFormArrayState(this.ApplicantEntity, DataRowState.Removed);
            let applicant: FormGroup<PROPOSALENTITY.IProposalApplicantEntity> = this._ProposalForm.ProposalApplicantForm();
            this._proposaldataService.PROPOSAL.controls.FINANCIALPRODUCTID.setValue(0);
            this._proposalmanagerservice.SetFPCampaignArray();
            if (event.value == '00001') { //Individual
              this.ApplicantCategory = this._masterDataService.ApplicantCategoryCode.filter(x => x.APPTYP == 'I');
              applicant.controls.PROPOSALAPPLICANT.controls.ROLECDE.setValue(ApplicantRoleCode.Borrower);
              applicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.setValue('I');
              applicant.controls.PROPOSALAPPLICANTMAIN.controls.ROLECDE.setValue(ApplicantRoleCode.Borrower);
              this._proposaldataService.PROPOSAL.controls.APPLICANTIND.setValue('I');
              this.isIndividualApplicant = true;
              this._FormState.ClearValidators(this.ApplicantEntity.controls[0]?.controls.COMPANYAPPLICANT);
              this._messageService.ClearValidatorMessages('Company');
            }

            else { // company or SME
              applicant.controls.ADDRESS.clear();
              this.ApplicantCategory = this._masterDataService.ApplicantCategoryCode.filter(x => x.APPTYP == 'C');
              applicant.controls.PROPOSALAPPLICANT.controls.ROLECDE.setValue(ApplicantRoleCode.Borrower); 65230
              applicant.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.setValue('C');
              applicant.controls.PROPOSALAPPLICANTMAIN.controls.ROLECDE.setValue(ApplicantRoleCode.Borrower);
              this._proposaldataService.PROPOSAL.controls.APPLICANTIND.setValue('C');
              this.isIndividualApplicant = false;
              this._FormState.ClearValidators(this.ApplicantEntity.controls[0]?.controls.INDIVIDUALAPPLICANT);
              this._messageService.ClearValidatorMessages('Individual');
            }

            this.ApplicantEntity.push(applicant);
          }
          else
            this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDE.setValue(this._proposaldataService.PROPOSAL.controls.PROPOSALTYPECDEOLD.value);
        })
    }

  }

  BranchOnChange(event: Event) {
    if (event != undefined) {
      this.resetArticleEntity();
    }
  }

  resetArticleEntity() {
    this._calculationService.ResetCampaignAndAssetData();
    this.ResetFinancialDetails();
  }

  ResetClicked() {
    var dialog = this._dialog.openDialog("Confirmation", "Are you sure you want to reset?", false, "Yes", "No");

    dialog.afterClosed().subscribe(result => {
      if (result !== undefined && result === "ok") {
        this._prplEntityMapper.ProposalEntityMapper(this.ProposalEntity, this._ProposalForm.ProposalEntity().value as IProposalEntity);
        this.ProposalEntity.markAsPristine();
        this._FormModeService.FormMode = FormMode.NEW;
        this.LoadInitialData();
        this.ProposalEntity.controls.PROPOSAL.controls.CURRENCYCDE.setValue(this._masterDataService.CurrencyType[0].code);
      }
    });
  }

  initializeTabValidationIndex() {

    if(this._proposaldataService.CurrentApplicant)
    {
      this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT.controls.forEach((emp: any, i) => {
        emp.control.VLDMSGIND.setValue(i)
      })

      this._proposaldataService.CurrentApplicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls.forEach((fam: any, i) => {
        fam.control.VLDMSGIND.setValue(i)
      })

      this._proposaldataService.CurrentApplicant.controls.PROPOSALAPPLICANTBANK.controls.forEach((bank: any, i) => {
        bank.control.VLDMSGIND.setValue(i)
      })
    }
  }

  ValidateCommissionTax() {
    if (this._proposalmanagerservice.ISCFNONMCOMIND || (this._proposalmanagerservice.ISCFMCOMIND && !this._proposaldataService.PROPOSAL.value.MCOMDEALER)) {
      this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.value.filter(recepient => recepient.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission)).forEach(recepient => {
        if (recepient.PRPLJP1JP2RPNT.JP1COMMISSIONAMT > 0) {
          let JP1CommissionTax = recepient.PRPLJP1JP2RPNTTAX.filter(tax => tax.RowState != DataRowState.Removed && tax.DIVISIONTYPECDE == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1));
          if (JP1CommissionTax.length == 0) {
            this.IsCommissionTaxCalculated = false;
            this._messageService.showCustomMesssage("JP1 Commission Tax is not calculated for recepient " + recepient.PRPLJP1JP2RPNT.RECIPIENTNME + "." + " Please recalculate.", MessageType.Warning);
          }
          else if (JP1CommissionTax.length == 1 && JP1CommissionTax[0].TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            && recepient.PRPLJP1JP2RPNT.JP1COMMISSIONAMT != recepient.PRPLJP1JP2RPNT.JP1TAXINCLUSIVEAMT
            && recepient.PRPLJP1JP2RPNT.JP1COMMISSIONAMT != recepient.PRPLJP1JP2RPNT.JP1TAXEXCLUSIVEAMT) {
            this.IsCommissionTaxCalculated = false;
            this._messageService.showCustomMesssage("JP1 Commission Tax is not calculated for recepient " + recepient.PRPLJP1JP2RPNT.RECIPIENTNME + "." + " Please recalculate.", MessageType.Warning);
          }

          // else if (JP1CommissionTax.length == 2) {
          //   let VAT = JP1CommissionTax.filter(tax => tax.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST));
          //   if (VAT.length > 0) {
          //     if ((VAT[0].BASEAMOUNT + VAT[0].TAXAMT) != recepient.PRPLJP1JP2RPNT.JP1COMMISSIONAMT) {
          //       this.IsCommissionTaxCalculated = false;
          //     }
          //   }
          // }
        }
      });


      this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.value.filter(recepient => recepient.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission)).forEach(recepient => {
        if (recepient.PRPLJP1JP2RPNT.JP2COMMISSIONAMT > 0) {
          let JP2CommissionTax = recepient.PRPLJP1JP2RPNTTAX.filter(tax => tax.RowState != DataRowState.Removed && tax.DIVISIONTYPECDE == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2));
          if (JP2CommissionTax.length == 0) {
            this.IsCommissionTaxCalculated = false;
            this._messageService.showCustomMesssage("JP2 Commission Tax is not calculated for recepient " + recepient.PRPLJP1JP2RPNT.RECIPIENTNME + "." + " Please recalculate.", MessageType.Warning);
          }
          else if (JP2CommissionTax.length == 1 && JP2CommissionTax[0].TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            && recepient.PRPLJP1JP2RPNT.JP2COMMISSIONAMT != recepient.PRPLJP1JP2RPNT.JP2TAXINCLUSIVEAMT
            && recepient.PRPLJP1JP2RPNT.JP2COMMISSIONAMT != recepient.PRPLJP1JP2RPNT.JP2TAXEXCLUSIVEAMT) {
            this.IsCommissionTaxCalculated = false;
            this._messageService.showCustomMesssage("JP2 Commission Tax is not calculated for recepient " + recepient.PRPLJP1JP2RPNT.RECIPIENTNME + "." + " Please recalculate.", MessageType.Warning);
          }

          // else if (JP2CommissionTax.length == 2) {
          //   let VAT = JP2CommissionTax.filter(tax => tax.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST));
          //   if (VAT.length > 0) {
          //     if ((VAT[0].BASEAMOUNT + VAT[0].TAXAMT) != recepient.PRPLJP1JP2RPNT.JP2COMMISSIONAMT) {
          //       this.IsCommissionTaxCalculated = false;
          //     }
          //   }
          // }
        }
      });


      this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP2RECIPIENT.value.filter(recepient => recepient.PRPLJP2RPNT.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission)).forEach(recepient => {
        if (recepient.PRPLJP2RPNT.JP2SCHEMECOMMISSIONAMT > 0) {
          let JP2CommissionSchemeTax = recepient.PRPLJP2RPNTTAX.filter(tax => tax.RowState != DataRowState.Removed && tax.DIVISIONTYPECDE == CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2Scheme));
          if (JP2CommissionSchemeTax.length == 0) {
            this.IsCommissionTaxCalculated = false;
            this._messageService.showCustomMesssage("JP2 Commission Scheme Tax is not calculated. Please re-input commission amount.", MessageType.Warning);
          }
          else if (JP2CommissionSchemeTax.length == 1 && JP2CommissionSchemeTax[0].TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            && recepient.PRPLJP2RPNT.JP2SCHEMECOMMISSIONAMT != recepient.PRPLJP2RPNT.TAXINCLUSIVEAMT
            && recepient.PRPLJP2RPNT.JP2SCHEMECOMMISSIONAMT != recepient.PRPLJP2RPNT.TAXEXCLUSIVEAMT) {
            this.IsCommissionTaxCalculated = false;
            this._messageService.showCustomMesssage("JP2 Commission Scheme Tax is not calculated. Please re-input commission amount.", MessageType.Warning);
          }

          // else if (JP2CommissionTax.length == 2) {
          //   let VAT = JP2CommissionTax.filter(tax => tax.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST));
          //   if (VAT.length > 0) {
          //     if ((VAT[0].BASEAMOUNT + VAT[0].TAXAMT) != recepient.PRPLJP1JP2RPNT.JP2COMMISSIONAMT) {
          //       this.IsCommissionTaxCalculated = false;
          //     }
          //   }
          // }
        }
      });


      let recipients = this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.value.filter(recepient => recepient.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission)
        && recepient.PRPLJP1JP2RPNT.RowState != DataRowState.Removed);

      //Jp1  + jp2 + jp2 scheme amount != com fix amount then system will not allow to save the application
      let JP1CommissionSum = recipients.reduce((accumulator, obj) => {
        return accumulator + obj.PRPLJP1JP2RPNT.JP1COMMISSIONAMT;
      }, 0);
      console.log(JP1CommissionSum);

      let JP2CommissionSum = recipients.reduce((accumulator, obj) => {
        return accumulator + obj.PRPLJP1JP2RPNT.JP2COMMISSIONAMT;
      }, 0);
      console.log(JP2CommissionSum);


      let JP2SchemeRecipients = this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP2RECIPIENT.value.filter(recepient => recepient.PRPLJP2RPNT.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission)
        && recepient.PRPLJP2RPNT.RowState != DataRowState.Removed);

      //Jp1  + jp2 + jp2 scheme amount != com fix amount then system will not allow to save the application
      let JP2SchemeCommissionSum = JP2SchemeRecipients.reduce((accumulator, obj) => {
        return accumulator + obj.PRPLJP2RPNT.JP2SCHEMECOMMISSIONAMT;
      }, 0);
      console.log(JP2SchemeCommissionSum);

      if (+(JP1CommissionSum + JP2CommissionSum + JP2SchemeCommissionSum).toFixed(2) != this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.value) {
        this.IsCommissionTaxCalculated = false;
        this._messageService.showCustomMesssage("Sum of JP1 JP2 Recipients Commissions & JP2 Commission Scheme Recipients is not equal to Commission Fix Amount", MessageType.Warning);
        return;
      }

      let PRPLCOMMSCHM = this._proposaldataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMMSCHM.value.find(recepient => recepient.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission)
        && recepient.RowState != DataRowState.Removed);
      let JP1PRPLCOMMSCHM = PRPLCOMMSCHM?.JP1COMMISSIONAMT;
      console.log(JP1PRPLCOMMSCHM);

      let JP2PRPLCOMMSCHM = PRPLCOMMSCHM?.JP2COMMISSIONAMT;
      console.log(JP2PRPLCOMMSCHM);

      let JP2SchemePRPLCOMMSCHM = PRPLCOMMSCHM?.JP2SCHEMECOMMISSIONAMT;
      console.log(JP2SchemePRPLCOMMSCHM);

      if (JP1PRPLCOMMSCHM != +JP1CommissionSum.toFixed(2)) {
        this.IsCommissionTaxCalculated = false;
        this._messageService.showCustomMesssage("JP1 commission amount is not equal to sum of recipients of Jp1 Commission Amount", MessageType.Warning);
        return;
      }

      if (JP2PRPLCOMMSCHM != +JP2CommissionSum.toFixed(2)) {
        this.IsCommissionTaxCalculated = false;
        this._messageService.showCustomMesssage("JP2 commission amount is not equal to sum of recipients of Jp2 Commission Amount", MessageType.Warning);
        return;
      }

      if (JP2SchemePRPLCOMMSCHM != +JP2SchemeCommissionSum.toFixed(2)) {
        this.IsCommissionTaxCalculated = false;
        this._messageService.showCustomMesssage("JP2 Scheme commission amount is not equal to sum of recipients of Jp2 Scheme Commission Amount", MessageType.Warning);
        return;
      }


    }


  }

  checkAdditionalPremiumAmount()
  {
    if (this._proposaldataService.PROPOSAL.value.FINANCETYP !== FinanceType.OperatingLease) {
      if (this._proposaldataService.PROPOSALINSURANCEMAIN != null
        && this._proposaldataService.STANDARDINSURANCE != null
        && this._proposaldataService.STANDARDINSURANCE.length > 0) {

          let sumAddlPremiumAmount = 0;
          let sumAddlDetailPremiumAmount = 0;
          let sumStndPremiumAmount = 0;
          let sumStndDetailPremiumAmount = 0;

          this._proposaldataService.STANDARDINSURANCE.controls.forEach(Stnd => {
            if (Stnd.controls.PRPLSTNDINSR.value.COLLECTIONMETHODCDE != InsuranceCollectionTypes.LeaseClause) {
              if(Stnd.value.RowState != DataRowState.Removed){
                sumStndPremiumAmount +=Stnd.controls.PRPLSTNDINSR.value.TOTALPREMIUMAMNT;

                Stnd.controls.PRPLADDLINSR.controls.forEach(AddInsr => {
                  sumAddlPremiumAmount +=AddInsr.value.TOTALPREMIUMAMNT;
                });

                Stnd.controls.STANDARDINSURANCEDETAIL.controls.forEach(StndDetail => {
                  sumStndDetailPremiumAmount +=StndDetail.controls.PRPLSTNDINSRDETL.value.PREMIUMAMNT;

                  StndDetail.controls.PRPLADDLINSRDETL.controls.forEach(AddlInsrDetl => {
                    sumAddlDetailPremiumAmount += AddlInsrDetl.value.PREMIUMAMNT;
                  });
                });
              }
            }
          });

          sumAddlPremiumAmount=Math.ceil(sumAddlPremiumAmount);
          sumAddlDetailPremiumAmount=Math.ceil(sumAddlDetailPremiumAmount);
          sumStndPremiumAmount=Math.ceil(sumStndPremiumAmount);
          sumStndDetailPremiumAmount=Math.ceil(sumStndDetailPremiumAmount);

          if(sumAddlPremiumAmount - sumAddlDetailPremiumAmount > 5 || sumStndPremiumAmount - sumStndDetailPremiumAmount > 5){
            //this._calculationService.btnInsCalculateIsEnabled = true;
            //this._proposalmanagerservice.ReCalculateInsurancePremiumRate();
            this._calculationService.EnableInsuranceCalculateButton();
            this._messageService.showMesssage("msgInsurancePremiumReCalculate", MessageType.Warning);
            return false;
          }
        return true;
      }
    }
    return true;
  }
  getFPCampaginByFPId(data: IProposalEntity){
    let request = new ProposalMasterDataRequest();
    request.financeProductId = data.PROPOSAL.FINANCIALPRODUCTID;
    this._proposalService.FPCampainByFPId(request).pipe(takeUntil(this.subscription$)).subscribe(data => {
      if (data && data.ResultSet.length > 0) {
        data.ResultSet.map((x: any) => {
            this._proposaldataService.PROPOSAL.controls.ENABLEGOODSDETAILS.setValue(x.ENABLEGOODSDETAILS);
            this._proposaldataService.PROPOSAL.controls.ISGOODSDETAILSMANDATORY.setValue(x.ISGOODSDETAILSMANDATORY);
            this._proposaldataService.PROPOSAL.controls.SALESMANENABLE.setValue(x.SALESMANENABLE);
            this._proposaldataService.PROPOSAL.controls.SALESMANMANDATORY.setValue(x.SALESMANMANDATORY);
        })
      }
    });
  }

}
