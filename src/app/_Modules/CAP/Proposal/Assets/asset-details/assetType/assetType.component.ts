import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AddressMasterDataService } from '@NFS_Core/NFSServices/MasterData/Address-master-data.service';
import { AssetDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-details-masterdata.service';
// import { ThemeService } from 'ng2-charts';
import { AssetSearchMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-search-masterdata.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IProposalApplicantEntity, IProposalArticleEntity } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import {
  IIndividualApplicantEntity,
  IPRPL_APLT_ADDSInfo
} from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import {
  IOTO_PRPL_ASST_BPKB_DETLInfo,
  IPRPL_ASETInfo,
  IPRPL_BPKB_GRTR_DETLInfo,
  IPRPL_BPKB_RPRS_DETLInfo,
  IPRPL_VHCL_DETLInfo
} from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AddressTypeCode } from '@NFS_Enums/AdressTypeCode.enum';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { ApplicantType } from '@NFS_Enums/ApplicantType.enum';
import { AssetSelection } from '@NFS_Enums/AssetSelection.enum';
import {
  ApplicantCategory,
  AssetCondition,
  BPKBRecievedStatus,
  BPKBStatus
} from '@NFS_Enums/BPKBStatus.enum';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { InsuranceType } from '@NFS_Enums/InsuranceType.enum';
import { MaritalStatus } from '@NFS_Enums/MaritalStatus.enum';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { OTO_BPKBOwnerType } from '@NFS_Enums/OTOBPKBOwnerType.enum';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { IAssetInfoParams } from '@NFS_Interfaces/RequestInterfaces/asset-search-info-params';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormGroup } from 'src/Library';
import  moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { IBusinessPartnerInfoParm } from '@NFS_Interfaces/RequestInterfaces/BusinessPartnerInfoParm';
import { ProposalMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/proposalMasterDataRequests';

@Component({
    selector: 'app-asset-Type',
    templateUrl: './assetType.component.html',
    styleUrls: ['./assetType.component.css'],
    standalone: false
})
export class AssetTypeComponent implements OnInit, OnDestroy {
  @Output() assetTypeFlagEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  InInventoryVehicleDetailDiabled = true;
  isBPKBOWNERBORROWER = true;
  relationWithCustomerValues: any[] = [];
  panelOpenState = false;
  addressEnable = false;
  bpkbOwnerIDLabel: any;
  // disableBuyBackGuarantee : boolean = false;
  public assetTypeData: any;
  PRPLASSETINFO!: FormGroup<IPRPL_ASETInfo>;
  PRPLVHCLDTL!: FormGroup<IPRPL_VHCL_DETLInfo>;
  PRPLBPKBDETL!: FormGroup<IOTO_PRPL_ASST_BPKB_DETLInfo>;
  OTOPRPLASSTBPKBRPRSDETL: Array<any> = [];
  OTOPRPLASSTBPKBGRTRDETL: Array<any> = [];
  disabled: boolean = false;
  BPKBOWNERTYPESELECTION: any[] = [];
  public dataSourceRepresentative =
    new MatTableDataSource<IPRPL_BPKB_RPRS_DETLInfo>(
      this.OTOPRPLASSTBPKBRPRSDETL
    );
  public dataSourceGuarantor = new MatTableDataSource<IPRPL_BPKB_GRTR_DETLInfo>(
    this.OTOPRPLASSTBPKBGRTRDETL.filter(p => p.RowState != DataRowState.Removed)
  );
  displayedColumnsRepresentative: string[] = [
    'REPRESENTATIVEKTPID',
    'REPRESENTATIVENME',
    'REPRESENTATIVEDESIGNATION',
    'REPRESENTATIVEADDRESS',
    'delete',
  ];
  displayedColumnsGuarantor: string[] = [
    'GUARANTORKTPID',
    'GUARANTORNME',
    'GUARANTORADDRESS',
    'delete',
  ];
  public AllKotaByProvince: any = [];
  public AllKecamatanByKota: any = [];
  public AllKelurahanByKeca: any = [];
  public BPKBStatusDropdown: INFSDropDownData[] = [];
  public GoodServicesFund: INFSDropDownData[] = [];
  public GoodServicesFundDetails: INFSDropDownData[] = [];
  public BPKBPOSLocation: INFSDropDownData[] = [];
  NullVal: number | string = '';
  representativeDisable: boolean = true;
  guarantorDisable: boolean = true;
  CountryList: Array<INFSDropDownData> = [
    {
      id: 10,
      code: '00011',
      TextValue: 'Indonesia',
      OptionalData: { isDefault: true },
      ISMCOMDEALER: false,
      FINACETYPECODE: '',
      APPTYP: '',
      ISMCOMCAMPAIGN: false,
    },
  ];
  OTO_Country: Array<INFSDropDownData> = [
    {
      id: 10,
      code: '10',
      TextValue: 'Indonesia',
      OptionalData: { isDefault: true },
      ISMCOMDEALER: false,
      FINACETYPECODE: '',
      APPTYP: '',
      ISMCOMCAMPAIGN: false,
    },
  ];
  borrower = this._proposaldataService.PROPOSALAPPLICANT.controls.find(
    (x) => x.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == '00003'
  ) as FormGroup<IProposalApplicantEntity>;
  private m_oldbpkbownervalue: string | null = null;
  private subscription$ = new Subject();
  public isBPKBOwnerMarried = false;
  public _assetDetailsCondition: any;
  public _assetModelColor: any;
  public OwnerTypeIND: Boolean = false;
  private TotalPremiumAmnt: number = 0;
  showAssetFlaggingValidation: boolean = false;

  constructor(
    private _formatter: FormatterService,
    private _dataService: ProposalDataService,
    private storageService: ClientStoreService,
    // private dialog: MatDialog,
    public _proposaldataService: ProposalDataService,
    public _assetDetailsMasterdataService: AssetDetailsMasterdataService,
    private _masterDataService: MasterDataService,
    public _AddressMasterDataService: AddressMasterDataService,
    // public dialogRef: MatDialogRef<AssetTypeComponent>,
    private _toastr: ToastrService,
    private _storageService: ClientStoreService,
    public _assetSearchMasterDataService: AssetSearchMasterdataService,
    private _FormModeService: FormModeService,
    private _FormState: StateManagment,
    private _proposalManagerService: ProposalManagerService,
    private _calculationService: CalculationService,
    private _proposalService: ProposalService,
    private _messageService: MessageService,
    public _genericService: GeneralService
  ) { }


  get isDeleteNotEnabled(): Boolean {
    if (this._FormModeService.FormMode == FormMode.VIEW) {
      return true;
    }
    else {
      return false
    }
  }


  ngOnInit(): void {
    this.TotalPremiumAmnt = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM;

    if ((this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.Refinance) || (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.HirePurchase && this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value)) {

      this._assetDetailsCondition = this._masterDataService.AssetConditionTypes.filter((a) => a.code == AssetCondition.Used)
    }
    else {
      this._assetDetailsCondition = this._masterDataService.AssetConditionTypes;
    }
    if (this._masterDataService.AssetModelColour && this._masterDataService.AssetModelColour ?.length > 0) {
      this._assetModelColor = this._masterDataService.AssetModelColour;
    }
    this._proposalService.assetValidationData$.subscribe((data) => {
        this.showAssetFlaggingValidation = data;
    });
    this.BPKBStatusDropdown = this._assetDetailsMasterdataService.Bpkbstatus;
    this.PRPLASSETINFO = this._proposaldataService.PROPOSALASSET;
    this.PRPLVHCLDTL = this._proposaldataService.PROPOSALVEHICLEDETAIL;
    this.PRPLBPKBDETL = this._proposaldataService.OTOPRPLASSTBPKBDETL;
    this.OTOPRPLASSTBPKBRPRSDETL =
      this._proposaldataService.OTOPRPLASSTBPKBRPRSDETL.value;
    this.OTOPRPLASSTBPKBGRTRDETL =
      this._proposaldataService.OTOPRPLASSTBPKBGRTRDETL.value;
    this.dataSourceRepresentative =
      new MatTableDataSource<IPRPL_BPKB_RPRS_DETLInfo>(
        this.OTOPRPLASSTBPKBRPRSDETL.filter(p => p.RowState != DataRowState.Removed)
      );
    this.dataSourceGuarantor = new MatTableDataSource<IPRPL_BPKB_GRTR_DETLInfo>(
      this.OTOPRPLASSTBPKBGRTRDETL.filter(p => p.RowState != DataRowState.Removed)
    );

    if (this._proposaldataService.PROPOSALASSET.value.ASSETSELECTIONCDE == "00002") {
      this.PRPLASSETINFO.controls.CONDITION.setValue('00002');
      this.disabled = true;
      // this.PRPLASSETINFO.controls.CONDITION.disable();
    }

    if (this.PRPLASSETINFO.controls.CONDITION.value == null) {
      this.PRPLASSETINFO.controls.CONDITION.setValue('');
      this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.setValue(BPKBRecievedStatus.NotRecieved);
      this.PRPLBPKBDETL.controls.STATUSCHANGEDTE.setValue(this.storageService.GetUserInfo().ProcessingDate);
      this.PRPLBPKBDETL.controls.BPKBEXPECTEDDATE.setValue(new Date());
      this.ResetBPKBStatus();
    }

    if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease && this._proposaldataService.PROPOSALASSET.value.ASSETSELECTIONCDE == "00002") {
      this.ResetBPKBStatus();
      let assetInfoParam = {} as IAssetInfoParams;
      assetInfoParam.AssetTypeCode = this._dataService.PROPOSALASSET.value.ASSETTYPECDE;
      assetInfoParam.AssetConditionCode = this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.CONDITION.value;
      assetInfoParam.CompanyID = 5;
      this._calculationService.BPKBExpectedOverdueDays(assetInfoParam);
    }
    if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value !== "") {
      if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Company) {
        this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode.filter((a) => a.APPTYP == "C")
        this.relationWithCustomerValues = this._assetDetailsMasterdataService.RelationshipTypeListByCompanyId.filter((a) => a.APPTYP == "C")
      }
      else if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Individual) {
        this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode.filter((a) => a.APPTYP == "I")
        this.relationWithCustomerValues = this._assetDetailsMasterdataService.RelationshipTypeListByCompanyId.filter((a) => a.APPTYP == "I")
        this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.setValue(this._proposaldataService.PROPOSALAPPLICANT
          .controls[0].controls.INDIVIDUALAPPLICANT.value.PROPOSALAPPLICANTINDIVIDUAL.TITLECDE)
      }

      if (this._proposaldataService.PROPOSAL.value != null
        && this._proposaldataService.PROPOSAL.value.OTOAPLTCTGYCDE != null
        && this.PRPLBPKBDETL.controls.OTOBPKBOWNER.value == OTO_BPKBOwnerType.Borrower) {
        this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.setValue(this._proposaldataService.PROPOSAL.value.OTOAPLTCTGYCDE);
      }
    }
    else {
      this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode;
    }

    let articleEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    if (articleEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Borrower) {

      if (
        this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value ==
        'I'
      ) {
        this.ReadBorrowerDetailforIndividual();
        //this.DisableforIndividual()
        this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);
        this.isBPKBOwnerMarried = true;
      } else if (
        this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value ==
        'C'
      ) {
        this.ReadBorrowerDetailforCompany();
        this._proposalManagerService.UpdateBPKBRepresentatives();
        //this.LoadRepresentativeInfo()
        this.OTOPRPLASSTBPKBRPRSDETL = this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL.value;
        this.dataSourceRepresentative =
          new MatTableDataSource<IPRPL_BPKB_RPRS_DETLInfo>(
            this.OTOPRPLASSTBPKBRPRSDETL.filter(p => p.RowState != DataRowState.Removed)
          );
        //this.DisableforCompany();
        this.guarantorDisable = true;
        this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);
      }
    }


    // if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.OperatingLease && this._proposaldataService.PROPOSALASSET.value.ASSETSELECTIONCDE != "00002")
    // {
    //   if (this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value =='I') {
    //     this.ReadBorrowerDetailforIndividual();
    //   } else if (this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value =='C') {
    //     this.ReadBorrowerDetailforCompany();
    //   }
    // }

    if (
      this.borrower ?.value.INDIVIDUALAPPLICANT ?.PROPOSALAPPLICANTINDIVIDUAL &&
        this.borrower ?.value.INDIVIDUALAPPLICANT ?.PROPOSALAPPLICANTINDIVIDUAL
          ?.DATEOFBIRTH &&
          this.getMonths(this.PRPLBPKBDETL.controls.BPKBOWNERDOB.value)[0] < 18
    ) {
      this.guarantorDisable = false;
    } else {
      this.OTOPRPLASSTBPKBGRTRDETL.splice(
        0,
        this.OTOPRPLASSTBPKBGRTRDETL.length
      );
      this.dataSourceGuarantor = new MatTableDataSource<any>(
        this.OTOPRPLASSTBPKBGRTRDETL.filter(p => p.RowState != DataRowState.Removed)
      );
      this.guarantorDisable = true;
    }
    this.setDefaultFields();
    this.valueChangeSubscriptions();
    //this.CalculateBPKBOverdueDays();


    if (this.PRPLBPKBDETL.controls.BPKBSTATUS.value != null && this.PRPLBPKBDETL.controls.BPKBSTATUS.value == BPKBStatus.Expected) {
      let assetInfoParam = {} as IAssetInfoParams;
      assetInfoParam.AssetTypeCode = this._dataService.PROPOSALASSET.value.ASSETTYPECDE;
      assetInfoParam.AssetConditionCode = this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.CONDITION.value;
      assetInfoParam.CompanyID = 5;
      this._calculationService.BPKBExpectedOverdueDays(assetInfoParam);
    }
    // if (this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value != null)
    // {

    //     if (this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value==BPKBRecievedStatus.NotRecieved && this._FormModeService.FormMode!=FormMode.VIEW )
    //     {
    //         if (this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.value == null)
    //         {
    //           let tempStatusDate = this.storageService.GetUserInfo().ProcessingDate;
    //           // console.log(tempStatusDate);
    //           this.PRPLBPKBDETL.controls.STATUSCHANGEDTE.setValue(tempStatusDate);

    //         }
    //     }
    // }
    // console.log(this.PRPLASSETINFO.controls.CONDITION);

    if (this.PRPLBPKBDETL.controls.OTOBPKBOWNER.value == "") {
      this.OwnerTypeIND = true;
    }

    // if (this._FormModeService.FormMode == FormMode.VIEW) {
    //   this.disableBuyBackGuarantee = true;
    // }
    this.creditPurposeOnChange(false);
    this.getFPCampaginByFPId();

    this.PRPLASSETINFO.controls.CONDITION.valueChanges.subscribe((x: any) => {
      if (this.showAssetFlaggingValidation !== null) {
        let assetInfoParam = {} as IAssetInfoParams;
        assetInfoParam.AssetConditionCode = this._dataService.PROPOSALASSET.controls.CONDITION.value;
        assetInfoParam.AssetModelID = this._dataService.PROPOSALASSET.controls.ASSETMODELID.value;
        this._proposalService.ReadAssetConditionAndModel(assetInfoParam).subscribe((response: any) => {
            this._proposalService.getAndsetassetValidationData(response.ResultSet);
          });
      }
    });
  }
  assetTypeFlag() {
    this.UpdateFinancialDetailsOnInsuranceChange();
    this.assetTypeFlagEvent.emit(false);
  }

  isBPKBOwnerSelected() {
    if (this.PRPLBPKBDETL.controls.OTOBPKBOWNER.value == '00001') return true;
    else return false;
  }
  isBPKBSelected() {
    if (this.PRPLBPKBDETL.controls.OTOBPKBOWNER.value == "") return true;
    else return false;
  }
  isBPKBOWNERCATEGORY() {
    if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == "") return true;
    else return false;
  }
  public getSIUPIDLabel() {

    if (this.PRPLBPKBDETL.controls.OTOBPKBOWNER.value == '00002' && this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Company) {

      this.bpkbOwnerIDLabel = "SIUP ID of BPKB Owner"
      return this.bpkbOwnerIDLabel;
    }
    else {
      this.bpkbOwnerIDLabel = "KTP ID of BPKB Owner"
      return this.bpkbOwnerIDLabel;
    }
  }

  updateGuarantor(element: any) {
    if (element.RowState !== DataRowState.Added && element.RowState !== DataRowState.Removed)
      element.RowState = DataRowState.Updated;
  }
  isBPKBOWNERCOMPANYCATEGORY() {
    if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Company) return true;
    else return false;
  }
  private ResetforOther() {
    if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.OperatingLease && this._proposaldataService.PROPOSALASSET.value.ASSETSELECTIONCDE != "00002") {
      if (this.PRPLBPKBDETL != null && this.PRPLBPKBDETL.value.OTOBPKBOWNER == OTO_BPKBOwnerType.Other) {
        if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value != null && this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Individual) {
          this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.setValue(null);
          this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue("");
          this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue("");
          this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.setValue(null);
        }
        else if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value != null && this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Company) {
          this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue("");
          this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue("");
          this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue("");
          this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue("");
          this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue("");
          this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue("");
          this.PRPLBPKBDETL.controls.GENDER.setValue("");
          this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue("");
          this.PRPLBPKBDETL.controls.OTOBPKBHOLDERNME.setValue("");
          this.PRPLBPKBDETL.controls.BPKBHOLDERADDRESS.setValue("");
          this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(null);
          this.PRPLBPKBDETL.controls.BPKBOWNERDOB.setValue(null);
          this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.setValue(null);
        }

      }
    }
  }
  goodServicesDisable() {
    if (
      (this.PRPLVHCLDTL.controls.CRDTPURPCODEOTO.value == '00001' ||
        this.PRPLVHCLDTL.controls.CRDTPURPCODEOTO.value == '00002') &&
      this._proposaldataService.PROPOSAL.controls.FINANCETYP.value ==
      FinanceType.HirePurchase
    )
      return false;
    else return true;
  }
  bpkbRecStatusDisable() {
    if (this.PRPLASSETINFO.controls.CONDITION.value != '00002') return true;
    else return false;
  }
  bpkbRecievedDateDisable() {
    if (this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value == '00140')
      return false;
    else return true;
  }

  BPKBOwnerTypeSelectionChange() {
    if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Company) {
      this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode.filter((a) => a.APPTYP == "C")
      this.relationWithCustomerValues = this._assetDetailsMasterdataService.RelationshipTypeListByCompanyId.filter((a) => a.APPTYP == "C")
    }
    else if (this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.value == ApplicantType.Individual) {

      this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode.filter((a) => a.APPTYP == "I")
      this.relationWithCustomerValues = this._assetDetailsMasterdataService.RelationshipTypeListByCompanyId.filter((a) => a.APPTYP == "I")
    }
    else {
      this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode;
      this.relationWithCustomerValues = this._assetDetailsMasterdataService.RelationshipTypeListByCompanyId;
    }
  }

  setDefaultFields() {
    this.PRPLBPKBDETL.controls.OTOCOUNTRY.setValue(10);
    //this.PRPLBPKBDETL.controls.OTOCOUNTRY.disable();
    this.PRPLBPKBDETL.controls.OTOADDRESSCDE.setValue('00011');
    // this.PRPLBPKBDETL.controls.OTOADDRESSCDE.disable();
    // this.PRPLVHCLDTL.controls.FINANCINGTYPE.disable();
    // this.PRPLASSETINFO.controls.ASSETSUBTYPDSC.disable();
  }
  valueChangeSubscriptions() {

    this.PRPLBPKBDETL.controls.BPKBOWNERDOB.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.guarantorDisable = this.CalculateAge();
      })

    this.PRPLBPKBDETL.controls.OTOPROVINCE.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request = new mPOSMasterDataRequest();
        request.masterDataOperation = MasterData.kotamadyasByProvinceId;
        if (val === this.NullVal) {
          this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(0);
          this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(0);
          this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
          this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
        }
        request.DATAS.provinceId =
          this.PRPLBPKBDETL.controls.OTOPROVINCE ?.value;
        if (request.DATAS.provinceId > 0) {
          this._masterDataService
            .GetMasterData(request)
            .pipe(takeUntil(this.subscription$))
            .subscribe((response) => {
              this.AllKotaByProvince = response ?.ResultSet ?.DataCollection;
            });
        }
      });

    this.PRPLBPKBDETL.controls.OTOKOTAMADYA.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.AllKecamatanByKota = new Array<INFSDropDownData>();
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request1 = new mPOSMasterDataRequest();
        request1.masterDataOperation = MasterData.kecamatansListBykotamadyasId;
        if (this.PRPLBPKBDETL.controls.OTOKECAMATAN.value === this.NullVal) {
          this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(0);
          this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
          this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
        }
        request1.DATAS.kotamadyasId =
          this.PRPLBPKBDETL.controls.OTOKOTAMADYA.value;
        if (request1.DATAS.kotamadyasId > 0) {
          this._masterDataService
            .GetMasterData(request1)
            .pipe(takeUntil(this.subscription$))
            .subscribe((response) => {
              this.AllKecamatanByKota = response ?.ResultSet ?.DataCollection;
            });
        }
      });

    this.PRPLBPKBDETL.controls.OTOKECAMATAN.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        this.AllKelurahanByKeca = new Array<INFSDropDownData>();
        let request2 = new mPOSMasterDataRequest();
        request2.masterDataOperation = MasterData.kelurahanListBykecamatansId;
        if (this.PRPLBPKBDETL.controls.OTOKECAMATAN.value === this.NullVal) {
          this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
          this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
        }
        request2.DATAS.kecamatansId =
          this.PRPLBPKBDETL.controls.OTOKECAMATAN.value;
        if (request2.DATAS.kecamatansId > 0) {
          this._masterDataService
            .GetMasterData(request2)
            .pipe(takeUntil(this.subscription$))
            .subscribe((response) => {
              this.AllKelurahanByKeca = response ?.ResultSet ?.DataCollection;
            });
        }
      });

    this.PRPLBPKBDETL.controls.OTODESA.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {
        if (this.PRPLBPKBDETL.controls.OTODESA.value === this.NullVal) {
          this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
        }
      });

    // this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.valueChanges
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {
    //     this.ResetBPKBStatus();
    //     if (val == BPKBRecievedStatus.Recieved) {
    //       this.EnableSelectedInfoFields();
    //       this.PRPLBPKBDETL.controls.BPKBEXPECTEDDATE.setValue(
    //         new Date(Date.now())
    //       );
    //       this.PRPLBPKBDETL.controls.BPKBOVERDUEDAYS.setValue(0);
    //       if (!this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.value) {
    //         this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.setValue(
    //           this._storageService.GetUserInfo().ProcessingDate
    //         );
    //       }
    //     } else {
    //       //this.DisableSelectedInfoFields();
    //     }
    //   });



    // this.PRPLVHCLDTL.controls.CRDTPURPCODEOTO.valueChanges
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {
    //     if (
    //       this._proposaldataService.PROPOSAL.controls.FINANCETYP.value ==
    //       FinanceType.HirePurchase
    //     ) {
    //       this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.setValue('');
    //       if(this.PRPLVHCLDTL.controls.RowState.value !== DataRowState.Added && this.PRPLVHCLDTL.controls.RowState.value !== DataRowState.Removed)
    //       this.PRPLVHCLDTL.controls.RowState.setValue(DataRowState.Updated);
    //       if (val == '00001') {
    //         this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.enable();
    //         this.GoodServicesFund = this._assetDetailsMasterdataService.GoodsServicesFunds.filter(
    //           p => p.OptionalData == val);
    //         if (!this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value) {
    //           this.PRPLVHCLDTL.controls.FINANCINGTYPE.setValue('00001'); //investment
    //         }
    //         else {
    //           this.PRPLVHCLDTL.controls.FINANCINGTYPE.setValue('00003'); //Working Capital
    //         }
    //         ///set for mcom campaign
    //       } else if (val == '00002') {
    //         this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.enable();
    //         this.GoodServicesFund = this._assetDetailsMasterdataService.GoodsServicesFunds.filter(
    //           p => p.OptionalData == val);
    //         this.PRPLVHCLDTL.controls.FINANCINGTYPE.setValue('00002'); //multipurpose
    //       } else {
    //         this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.setValue('');
    //         //this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.disable();
    //       }
    //     }
    //   });



    // this.PRPLBPKBDETL.controls.OTOBPKBOWNER.valueChanges
    //   .pipe(distinctUntilChanged(), takeUntil(this.subscription$), pairwise())
    //   .subscribe(([oldValue, newValue]) => {
    // if (newValue == '00001' && oldValue != newValue) {
    //   ///00001 borrower , 00002 other
    //   this.setFieldsOnBorrowerChange();
    // } else if (oldValue == '00001') {
    //   this.resetFieldsOnBorrowerChange();
    // }
    // this.PRPLBPKBDETL.controls.OTOBPKBOWNER.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe((value) => {
    //   if (this._FormModeService.FormMode != FormMode.VIEW) {
    //     if (this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL.value != null) {
    //       this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL, DataRowState.Removed);
    //     }
    //     if (this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBGRTRDETL.value != null) {
    //       this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBGRTRDETL, DataRowState.Removed);
    //     }
    //     if (this.PRPLBPKBDETL.value != null
    //       && value != null
    //       && value == OTO_BPKBOwnerType.Borrower) {
    //       this.PRPLBPKBDETL.controls.RELATIONSHIPCDE.enable();
    //       // this.PRPLBPKBDETL.controls.RELATIONSHIPCDE.setValue('');

    //       if (this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value == "I") {
    //         this.ReadBorrowerDetailforIndividual()
    //         //this.DisableforIndividual()
    //         this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);
    //       }
    //       else if (this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value == "C") {
    //         this.ReadBorrowerDetailforCompany();
    //         this._proposalManagerService.UpdateBPKBRepresentatives();
    //         //this.LoadRepresentativeInfo()
    //         this.dataSourceRepresentative = new MatTableDataSource<IPRPL_BPKB_RPRS_DETLInfo>(this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL.value);
    //         //this.DisableforCompany();

    //         this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);
    //       }

    //       if (this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value != null && this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value != MaritalStatus.Married) {
    //         this.PRPLBPKBDETL.controls.OTOAGMTCDE.enable();
    //         this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.enable();
    //         this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.enable();

    //         this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue(null);
    //         this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
    //         this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue('');
    //       }
    //     }
    //     else {
    //       this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.enable();
    //       this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.setValue('');
    //       if (this.PRPLBPKBDETL.value != null
    //         && value != null
    //         && value == OTO_BPKBOwnerType.Other) {
    //         this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue('');
    //         this.PRPLBPKBDETL.controls.GENDER.setValue('');
    //         this.PRPLBPKBDETL.controls.BPKBOWNERDOB.setValue(null);
    //         this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue('');
    //         this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue('');
    //         this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(null);
    //         this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue('');
    //         this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue('');
    //         this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
    //         this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue('');
    //         this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.setValue('');
    //         this.SetDefaultAddress(OTO_BPKBOwnerType.Other);
    //       }

    //       this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.enable();
    //       this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.enable();
    //       this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.enable();
    //       this.PRPLBPKBDETL.controls.GENDER.enable();
    //       this.PRPLBPKBDETL.controls.BPKBOWNERDOB.enable();
    //       this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.enable();
    //       this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.enable();
    //       this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.enable();
    //       this.PRPLBPKBDETL.controls.OTOAGMTCDE.enable();
    //       this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.enable();
    //       this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.enable();
    //       this.PRPLBPKBDETL.controls.BPKBHOLDERADDRESS.enable();
    //       this.PRPLBPKBDETL.controls.OTOBPKBHOLDERNME.enable();

    //       if (this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value != null && this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value == MaritalStatus.Married) {
    //         this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.enable();
    //         this.PRPLBPKBDETL.controls.OTOAGMTCDE.enable();
    //       }
    //       else {
    //         this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
    //         this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue('');
    //         this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue('');

    //         // this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.disable();
    //         // this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.disable();
    //         // this.PRPLBPKBDETL.controls.OTOAGMTCDE.disable();
    //       }
    //     }
    //     this.m_oldbpkbownervalue = value;
    //   }
    // });

    this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.subscription$))
      .subscribe((val) => {
        if (val == ApplicantCategory.Company) {
          this.representativeDisable = false;
        } else {
          this.OTOPRPLASSTBPKBRPRSDETL.splice(
            0,
            this.OTOPRPLASSTBPKBRPRSDETL.length
          );
          this.dataSourceRepresentative = new MatTableDataSource<any>(
            this.OTOPRPLASSTBPKBRPRSDETL.filter(p => p.RowState != DataRowState.Removed)
          );
          this.representativeDisable = true;
        }
        //this.ResetforOther();
      });

    this.PRPLVHCLDTL.controls.RELEASEYEAR.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.subscription$))
      .subscribe((val) => {
        if (this._FormModeService.FormMode != FormMode.VIEW) {
          let manufacturingDate = new Date(val);
          let year = manufacturingDate.getFullYear();
          this.PRPLVHCLDTL.controls.VEHICLEAGE.setValue(
            Number(new Date(this._storageService.GetUserInfo().ProcessingDate).getFullYear() - year)
          );

          let param = {} as IProposalInfoParm;
          param.ApplicantId = this._proposaldataService.PRPLINSR ?.controls.INSURER.value;
          param.ASSETTYPECDE = this._proposaldataService.PROPOSALASSET.value.ASSETTYPECDE;
          param.ASSETSUBTYPECDE = this._proposaldataService.PROPOSALASSET.value.ASSETSUBTYPCDE;

          this._proposalService
            .ReadBPInsuranceDetailForInsurance(param)
            .subscribe((res) => {
              if (res.CODE == 1 && res.ResultSet != null) {
                if (
                  this._proposaldataService.PROPOSALVEHICLEDETAIL.controls
                    .VEHICLEAGE.value > 0 &&
                  this._proposaldataService.PROPOSALTEMPLATERENTALINT.controls
                    .VEHICLEAGE.value <
                  this._proposaldataService.PROPOSALVEHICLEDETAIL.controls
                    .VEHICLEAGE.value
                ) {
                  this._proposaldataService.PRPLINSR.controls.LOADINGRTE.setValue(
                    res.ResultSet.LOADINGRATEPCT
                  );
                  this._proposaldataService.STANDARDINSURANCE.controls.forEach(
                    (p) => {
                      p.controls.STANDARDINSURANCEDETAIL.controls.forEach(
                        (q) => {
                          if (
                            q.controls.PRPLSTNDINSRDETL.controls.INSRTYPECDE
                              .value != InsuranceType.VoluntaryInsurance
                          )
                            q.controls.PRPLSTNDINSRDETL.controls.LOADINGRTE.setValue(
                              res.ResultSet.LOADINGRATEPCT
                            );
                        }
                      );
                    }
                  );
                } else {
                  this._proposaldataService.PRPLINSR.controls.LOADINGRTE.setValue(
                    0
                  );
                  this._proposaldataService.STANDARDINSURANCE.controls.forEach(
                    (p) => {
                      p.controls.STANDARDINSURANCEDETAIL.controls.forEach(
                        (q) => {
                          if (
                            q.controls.PRPLSTNDINSRDETL.controls.INSRTYPECDE
                              .value != InsuranceType.VoluntaryInsurance
                          )
                            q.controls.PRPLSTNDINSRDETL.controls.LOADINGRTE.setValue(
                              0
                            );
                        }
                      );
                    }
                  );
                }
                this._proposalManagerService.ReCalculateInsurancePremiumRate();
                this._calculationService.ResetRentalDetail();
              }
            });
        }
      });

    this.PRPLBPKBDETL.controls.BPKBLOCATION.valueChanges.pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
      if ((val) != null && val!='') {
        let param = {} as IBusinessPartnerInfoParm;
        param.BusinessPartnerId = val
        param.BPCompanyID = 5;
        this._proposalService
          .GetPOSLocationByBranch(param)
          .subscribe((res) => {
            this.BPKBPOSLocation = res.ResultSet.DataCollection;
          })
      }else{
        this.BPKBPOSLocation=[];
      }

    });
    this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.valueChanges.pipe(takeUntil(this.subscription$)).subscribe((val: any) => {
      if ((val) != null && val!='') {
        let param = {} as IAssetInfoParams;
        param.GoodsServiceFunds = val
        this._proposalService
          .GetGoodsServiceFundsDetails(param)
          .subscribe((res) => {
            this.GoodServicesFundDetails = res.ResultSet.DataCollection;

          })
      }else{
        this.GoodServicesFundDetails=[];
      }

    });

    this.PRPLVHCLDTL.controls.CITYOFREGISTRATIONOTO.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.subscription$))
      .subscribe((val) => {
        if (String(val) == '') {
          this.PRPLVHCLDTL.controls.CITYOFREGISTRATIONOTO.setValue(0);
          this.PRPLBPKBDETL.controls.OTOCITYID.setValue(0);
        }
      });

    this.PRPLBPKBDETL.controls.BPKBPLCE.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.subscription$))
      .subscribe((val) => {
        if (String(val) == '')
          this.PRPLBPKBDETL.controls.BPKBPLCE.setValue(0);
      });

    //***********************************************************************************************************
    //***********************************************************************************************************
    this.PRPLBPKBDETL.controls.OTOCITYID.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.subscription$))
      .subscribe((val) => {
        if (String(val) == '')
          this.PRPLBPKBDETL.controls.OTOCITYID.setValue(0);
        // console.log(val);
        //this.PRPLVHCLDTL.controls.CITYOFREGISTRATIONOTO.setValue(val);
      });
    //***********************************************************************************************************
    //***********************************************************************************************************
    // this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$))
    // .subscribe(val=>{
    //   console.log(val);
    //   this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(val);
    //   // this.PRPLBPKBDETL.controls..setValue(val);
    // })//BPKBOWNERCATEGORY
    //***********************************************************************************************************
    //***********************************************************************************************************

    this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.subscription$))
      .subscribe((val) => {
        if (val != '00001' || val == this.NullVal) {
          this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
          this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue('');
          this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue('');
          this.isBPKBOwnerMarried = true;
        } else if (
          this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value == '00001'
        ) {
          this.isBPKBOwnerMarried = false;
        }
      });

    //***********************************************************************************************************
  }
  removeSpaces(event: any){
    if(event !=undefined){
      this.PRPLVHCLDTL.controls.CYLINDER.setValue(event);
      let tempReturn:any;
      tempReturn = this.PRPLVHCLDTL.controls.CYLINDER.value.toString();
      tempReturn = tempReturn.replaceAll(' ', '')  
      this.PRPLVHCLDTL.controls.CYLINDER.setValue(tempReturn)
  }

  }
  creditPurposeOnChange(resetIndicator: boolean = true) {

    if (
      this._proposaldataService.PROPOSAL.controls.FINANCETYP.value ==
      FinanceType.HirePurchase
    ) {
      if (resetIndicator != false)
        this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.setValue('');
      if (this.PRPLVHCLDTL.controls.RowState.value !== DataRowState.Added && this.PRPLVHCLDTL.controls.RowState.value !== DataRowState.Removed)
        this.PRPLVHCLDTL.controls.RowState.setValue(DataRowState.Updated);
      if (this.PRPLVHCLDTL.controls.CRDTPURPCODEOTO.value == '00001') {
        this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.enable();
        this.GoodServicesFund = this._assetDetailsMasterdataService.GoodsServicesFunds.filter(
          p => p.OptionalData == this.PRPLVHCLDTL.controls.CRDTPURPCODEOTO.value);
        if (!this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value) {

          this.PRPLVHCLDTL.controls.FINANCINGTYPE.setValue('00001'); //investment
        }
        else {
          this.PRPLVHCLDTL.controls.FINANCINGTYPE.setValue('00003'); //Working Capital
        }
        ///set for mcom campaign
      } else if (this.PRPLVHCLDTL.controls.CRDTPURPCODEOTO.value == '00002') {
        this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.enable();
        this.GoodServicesFund = this._assetDetailsMasterdataService.GoodsServicesFunds.filter(
          p => p.OptionalData == this.PRPLVHCLDTL.controls.CRDTPURPCODEOTO.value);
        this.PRPLVHCLDTL.controls.FINANCINGTYPE.setValue('00002'); //multipurpose
      } else {
        this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.setValue('');
        //this.PRPLVHCLDTL.controls.GOODSSERVICESFUND.disable();
      }
    }


  }
  get IsNotMarried() {
    return this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value != MaritalStatus.Married;
  }
  Validations() {
    if (this.PRPLASSETINFO.controls.CONDITION.value == "" || this.PRPLASSETINFO.controls.CONDITION.value == null) {
      this._toastr.clear();
      this._toastr.warning('Please Select Asset Condition.');
    }
    else {
      if (this.PRPLASSETINFO.controls.CONDITION.value == AssetCondition.Used) {
        if (!this.PRPLBPKBDETL.controls.OTOBPKBDTE.value) {
          this._toastr.clear();
          this._toastr.warning('Please Enter BPKB Date.');
        } else if (!this.PRPLBPKBDETL ?.controls.OTOBPKBNUMBER ?.value ?.trim()) {
          this._toastr.clear();
          this._toastr.warning('Please Enter BPKB Number.');
        } else {
          this.assetTypeFlag();
          this._genericService.FormMode = FormMode.EDIT;
        }
      } else {
        this.assetTypeFlag();
        this._genericService.FormMode = FormMode.EDIT;
      }
    }
  }
  resetFieldsOnBorrowerChange() {
    this.PRPLBPKBDETL.controls.ADDSDSC.setValue('');
    this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(0);
    this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(0);
    this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
    this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
    this.PRPLBPKBDETL.controls.OTORW.setValue('');
    this.PRPLBPKBDETL.controls.OTORT.setValue('');
    this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.enable();
    // this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.enable();
    // this.PRPLBPKBDETL.controls.GENDER.enable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERDOB.enable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.enable();
    // this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.enable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.enable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.enable();
    //this.addressEnable = false;
  }
  setFieldsOnBorrowerChange() {
    let defaultAddress = this.borrower ?.controls.ADDRESS.controls.find((x) =>
      x.controls.PROPOSALADDRESSTYPEDETAIL != undefined
        ? x.controls.PROPOSALADDRESSTYPEDETAIL ?.controls.find(
          (x) => x.controls.DEFAULTIND.value == true
        )
          : null
    ) ?.controls;
    let defaultIdTypeExist =
      this.borrower ?.controls.PROPOSALAPPLICANTIDDETAIL.controls.find(
        (x) => x.controls.DEFAULTIND.value == true
      );
    //if (defaultAddress) {
    this.PRPLBPKBDETL.controls.ADDSDSC.setValue(
      defaultAddress ?.PROPOSALAPPLICANTADDRESS ?.controls.ADDRESSOTO.value || ''
    );
    this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(
      defaultAddress ?.PROPOSALAPPLICANTADDRESS ?.controls.PROVINCEID.value || 0
    );
    this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(
      defaultAddress ?.PROPOSALAPPLICANTADDRESS ?.controls.KOTAMADYAIDOTO.value ||
        0
    );
    this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(
      defaultAddress ?.PROPOSALAPPLICANTADDRESS ?.controls.KECAMATANIDOTO.value ||
        0
    );
    this.PRPLBPKBDETL.controls.OTODESA.setValue(
      defaultAddress ?.PROPOSALAPPLICANTADDRESS ?.controls.KELURAHANIDOTO.value ||
        0
    );
    this.PRPLBPKBDETL.controls.OTORW.setValue(
      defaultAddress ?.PROPOSALAPPLICANTADDRESS ?.controls.RWOTO.value || ''
    );
    this.PRPLBPKBDETL.controls.OTORT.setValue(
      defaultAddress ?.PROPOSALAPPLICANTADDRESS ?.controls.RTOTO.value || ''
    );
    // }
    // else{
    //   this.PRPLBPKBDETL.controls.ADDSDSC.setValue('');
    //   this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(0);
    //   this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(0);
    //   this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
    //   this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
    //   this.PRPLBPKBDETL.controls.OTORW.setValue('');
    //   this.PRPLBPKBDETL.controls.OTORT.setValue('');
    // }
    // if (defaultIdTypeExist) {
    this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue(
      defaultIdTypeExist ?.controls.IDTYPENBR.value || ''
    );
    // this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(
    //   defaultIdTypeExist?.controls.EXPIRYDTE.value || new Date()
    // );
    // }
    this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(
      this.borrower ?.controls.PROPOSALAPPLICANT ?.controls.APPLICANTTYP.value ||
        ''
    );
    this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue(
      this.borrower ?.controls.INDIVIDUALAPPLICANT ?.value
        .PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME || ''
    );
    this.PRPLBPKBDETL.controls.GENDER.setValue(
      this.borrower ?.controls.INDIVIDUALAPPLICANT ?.value
        .PROPOSALAPPLICANTINDIVIDUAL.GENDER || ''
    );
    this.PRPLBPKBDETL.controls.BPKBOWNERDOB.setValue(
      this.borrower.controls.INDIVIDUALAPPLICANT.value
        .PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH
    );
    this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue(
      this.borrower ?.controls.INDIVIDUALAPPLICANT ?.value
        .PROPOSALAPPLICANTINDIVIDUAL.OTOPLACEOFBIRTH || ''
    );
    this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue(
      this.borrower ?.controls.INDIVIDUALAPPLICANT ?.value
        .PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE || ''
    );

    this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue(
      this.borrower ?.controls.INDIVIDUALAPPLICANT ?.value
        .PROPOSALAPPSPOUSEDETAIL[0] ?.FIRSTNME || ''
    );
    this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue(
      this.borrower ?.controls.INDIVIDUALAPPLICANT ?.value
        .PROPOSALAPPSPOUSEDETAIL[0] ?.SPOUSEADDRESS || ''
    );
    this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue(
      this.borrower ?.controls.INDIVIDUALAPPLICANT ?.value
        .PROPOSALAPPSPOUSEDETAIL[0] ?.OTOAGMTCDE || ''
    );

    // this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.disable();
    // // this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.disable();
    // this.PRPLBPKBDETL.controls.GENDER.disable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERDOB.disable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.disable();
    // this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.disable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.disable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.disable();
    // this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.disable();
    // this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.disable();
    // this.PRPLBPKBDETL.controls.OTOAGMTCDE.disable();

    //this.addressEnable = true;
  }
  selectionChange_BPKBRECEIVEDSTATUS(evnt: Event) {
    if (evnt != undefined) {
      if (this._FormModeService.FormMode != FormMode.VIEW) {
        if (this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value == BPKBRecievedStatus.Recieved) {
          this.EnableSelectedInfoFields();
          if (!this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.value) {
            this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.setValue(this._storageService.GetUserInfo().ProcessingDate);
          }
        }
        if (this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value == BPKBRecievedStatus.NotRecieved) {
          this.resetBPKB();
        }
        this.ResetBPKBStatus();
      }
    }
  }

  selectionChange_BPKBLOCATION(event: Event) {
    if (event != undefined) {
      if (this._FormModeService.FormMode != FormMode.VIEW) {
        this.PRPLBPKBDETL.controls.BPKBPOSLOCATION.setValue('');
      }
    }

  }
  ResetBPKBStatus() {
    if (
      this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value ==
      BPKBRecievedStatus.Recieved
    ) {
      this.BPKBStatusDropdown =
        this._assetDetailsMasterdataService.Bpkbstatus.filter(
          (p) => p.code == BPKBStatus.Accepted
        );
      this.PRPLBPKBDETL.controls.BPKBSTATUS.setValue(BPKBStatus.Accepted);
      this.PRPLBPKBDETL.controls.STATUSCHANGEDTE.setValue(this.storageService.GetUserInfo().ProcessingDate);
      this.PRPLBPKBDETL.controls.BPKBOVERDUEDAYS.setValue(0);
      this.PRPLBPKBDETL.controls.BPKBEXPECTEDDATE.reset();
    } else if (
      this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value ==
      BPKBRecievedStatus.NotRecieved
    ) {
      this.BPKBStatusDropdown =
        this._assetDetailsMasterdataService.Bpkbstatus.filter(
          (p) => p.code == BPKBStatus.Expected || p.code == BPKBStatus.Accepted
        );
      this.PRPLBPKBDETL.controls.BPKBSTATUS.setValue(BPKBStatus.Expected);
      if (this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.CONDITION.value !== "") {
        let assetInfoParam = {} as IAssetInfoParams;
        assetInfoParam.AssetTypeCode = this._dataService.PROPOSALASSET.value.ASSETTYPECDE;
        assetInfoParam.AssetConditionCode = this._proposaldataService.ASSETENTITY.controls.PROPOSALASSET.controls.CONDITION.value;
        assetInfoParam.CompanyID = 5;
        this._calculationService.BPKBExpectedOverdueDays(assetInfoParam);
      }
    }
  }

  private resetBPKB(): void {
    this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.reset();
    this.PRPLBPKBDETL.controls.OTOBPKBNUMBER.setValue('');
    this.PRPLBPKBDETL.controls.OTOBPKBDTE.reset();
    this.PRPLBPKBDETL.controls.BPKBPLCE.reset();
    this.PRPLBPKBDETL.controls.OTOCITYID.reset();
    this.PRPLBPKBDETL.controls.OTOBPKBOWNER.setValue('');
    this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue('');
    this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.setValue('');
    this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.setValue('');
    this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue('');
    this.PRPLBPKBDETL.controls.GENDER.setValue('');
    this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue('');
    this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(null);
    this.PRPLBPKBDETL.controls.BPKBOWNERDOB.setValue(null);
    this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue('');
    this.PRPLBPKBDETL.controls.RELATIONSHIPCDE.setValue('');
    this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue('');
    this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
    this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue('');
    this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue('');
    this.PRPLBPKBDETL.controls.OTOBPKBHOLDERNME.setValue('');
    this.PRPLBPKBDETL.controls.BPKBHOLDERADDRESS.setValue('');

    this.guarantorDisable = true;
    this.representativeDisable = true;
    this.isBPKBOWNERBORROWER = false;
    this.isBPKBOwnerMarried = false;

    this.PRPLBPKBDETL.controls.ADDSDSC.setValue(null);
    this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(0);
    this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(0);
    this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
    this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
    this.PRPLBPKBDETL.controls.OTORW.setValue('');
    this.PRPLBPKBDETL.controls.OTORT.setValue('');
  }

  DisableSelectedInfoFields() {
    this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.disable();
    this.PRPLBPKBDETL.controls.BPKBSTATUS.disable();
  }
  //use on need
  // EnableAllOtherInfoFields()
  //     {
  //         this.PRPLBPKBDETL.controls.OTOBPKBOWNER.enable();
  //         this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.enable();
  //         this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.enable();
  //         this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.enable();
  //         this.PRPLBPKBDETL.controls.GENDER.enable();
  //         this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.enable();
  //         this.PRPLBPKBDETL.controls.BPKBOWNERDOB.enable();
  //         this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.enable();
  //         this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.enable();
  //         this.PRPLBPKBDETL.controls.OTOBPKBHOLDERNME.enable();
  //         this.PRPLBPKBDETL.controls.BPKBHOLDERADDRESS.enable();
  //         this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.enable();
  //     }
  EnableSelectedInfoFields() {
    this.PRPLBPKBDETL.controls.BPKBRECEIVEDDATE.enable();
    this.PRPLBPKBDETL.controls.BPKBSTATUS.enable();
  }
  AddRepresentative($event: any) {
    const modal: IPRPL_BPKB_RPRS_DETLInfo = {
      PRPLBPKBRPRSSEQID: 0,
      PROPOSALID: 0,
      ASSETID: 0,
      REPRESENTATIVEKTPID: '',
      REPRESENTATIVENME: '',
      REPRESENTATIVEDESIGNATION: '',
      REPRESENTATIVEADDRESS: '',
      EXECUTIONDTE: null,
      EXECUTIONOFFSET: 0,
      ACTIVEIND: false,
      SESSIONID: 0,
      SESSIONCDE: '',
      // following properties are from helper class
      //BPDSGNCODE: [] as Array<IBP_DSGN_CODEInfo>,
      REPRESENTATIVEDESIGNATIONDSC: '',
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
    };
    this.OTOPRPLASSTBPKBRPRSDETL.push(modal);
    this.dataSourceRepresentative = new MatTableDataSource<any>(
      this.OTOPRPLASSTBPKBRPRSDETL.filter(p => p.RowState != DataRowState.Removed)
    );
  }
  AddGuarantor($event: any) {
    const modal: IPRPL_BPKB_GRTR_DETLInfo = {
      PRPLBPKBGRTRSEQID: 0,
      PROPOSALID: 0,
      ASSETID: 0,
      GUARANTORKTPID: '',
      GUARANTORNME: '',
      GUARANTORADDRESS: '',
      EXECUTIONDTE: null,
      EXECUTIONOFFSET: 0,
      ACTIVEIND: false,
      SESSIONID: 0,
      SESSIONCDE: '',
      RowState: DataRowState.Added,
      ISAUDITABLE: false,
    };
    this.OTOPRPLASSTBPKBGRTRDETL.push(modal);
    this.dataSourceGuarantor = new MatTableDataSource<any>(
      this.OTOPRPLASSTBPKBGRTRDETL.filter(p => p.RowState != DataRowState.Removed)
    );
  }
  RemoveRepresentative(obj: any) {

    let index = this.OTOPRPLASSTBPKBRPRSDETL.indexOf(obj);
    if (obj.RowState == DataRowState.Added) {
      this.OTOPRPLASSTBPKBRPRSDETL.splice(index, 1);
    } else {
      obj.RowState = DataRowState.Removed;
    }
    this.dataSourceRepresentative =
      new MatTableDataSource<IPRPL_BPKB_RPRS_DETLInfo>(
        this.OTOPRPLASSTBPKBRPRSDETL.filter(p => p.RowState != DataRowState.Removed)
      );
    // let array = [] as Array<any>;
    // array = this.dataSourceRepresentative?.data.filter(
    //   (obj) => obj.RowState !== DataRowState.Removed
    // );
    // this.dataSourceRepresentative = new MatTableDataSource<any>(array);
    this.dataSourceRepresentative._updateChangeSubscription();
  }
  RemoveGuarantor(obj: any) {
    let index = this.dataSourceGuarantor.data.indexOf(obj);
    if (obj.RowState == DataRowState.Added) {
      this.dataSourceGuarantor.data.splice(index, 1);
      this.OTOPRPLASSTBPKBGRTRDETL.splice(this.OTOPRPLASSTBPKBGRTRDETL.indexOf(obj), 1);
    } else {
      obj.RowState = DataRowState.Removed;
    }
    let array = [] as Array<any>;
    array = this.dataSourceGuarantor ?.data.filter(
      (obj) => obj.RowState !== DataRowState.Removed
    );
    this.dataSourceGuarantor = new MatTableDataSource<any>(array);
    this.dataSourceGuarantor._updateChangeSubscription();
  }

  onClose(): void {
    this.assetTypeData = this._proposaldataService.PROPOSALARTICLE.value;
  }

  // openSubmitPreviousBPKB() {
  //   const dialogRef = this.dialog.open(SubmitPreviousBPKBComponent, {
  //     width: '850px',
  //     height: '100%',
  //     position: { right: '1px', top: '1px' },
  //     panelClass: 'cdk-overlay-pane-custom',
  //     disableClose: true,
  //     data: { id: 123456 },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     //console.log("session closed");
  //     if (result != undefined) {
  //     }
  //   });
  // }

  public ReadBorrowerDetailforIndividual() {
    let individualApplicant = null;
    if (
      this._proposaldataService.PROPOSALAPPLICANT.value.length > 0 &&
      this._proposaldataService.PROPOSALAPPLICANT.value[0]
        .INDIVIDUALAPPLICANT != null
    ) {
      individualApplicant = this._proposaldataService.PROPOSALAPPLICANT
        .controls[0].controls
        .INDIVIDUALAPPLICANT as FormGroup<IIndividualApplicantEntity>;
    }
    if (
      individualApplicant != null &&
      individualApplicant.value != null &&
      individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL != null
    ) {
      if (
        individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.MIDDLENME != null
      ) {
        this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue(
          this._proposaldataService.concatenateNames(
            individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME,
            individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.MIDDLENME,
            individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.LASTNME
          )
        );
      } else {
        this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue(
          this._proposaldataService.concatenateNames(
            individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME,
            null,
            individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.LASTNME
          )
        );
      }

      if (
        this._proposaldataService.PROPOSALAPPLICANT.value != null &&
        this._proposaldataService.PROPOSALAPPLICANT.value.length > 0 &&
        this._proposaldataService.PROPOSALAPPLICANT.value[0]
          .PROPOSALAPPLICANTIDDETAIL != null &&
        this._proposaldataService.PROPOSALAPPLICANT.value[0]
          .PROPOSALAPPLICANTIDDETAIL.length > 0
      ) {
        this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue(
          this._proposaldataService.PROPOSALAPPLICANT.value[0]
            .PROPOSALAPPLICANTIDDETAIL[0].IDTYPENBR
        );
        this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.setValue(
          individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.TITLECDE
        );
        if (
          this._proposaldataService.PROPOSALAPPLICANT.value != null &&
          this._proposaldataService.PROPOSALAPPLICANT.value.length > 0 &&
          this._proposaldataService.PROPOSALAPPLICANT.value[0]
            .PROPOSALAPPLICANTIDDETAIL != null &&
          this._proposaldataService.PROPOSALAPPLICANT.value[0]
            .PROPOSALAPPLICANTIDDETAIL.length > 0 &&
          this._proposaldataService.PROPOSALAPPLICANT.value[0]
            .PROPOSALAPPLICANTIDDETAIL[0].EXPIRYDTE != null
        ) {
          this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(
            this._proposaldataService.PROPOSALAPPLICANT.value[0]
              .PROPOSALAPPLICANTIDDETAIL[0].EXPIRYDTE
          );
        }
        if (
          individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH !=
          null
        ) {
          this.PRPLBPKBDETL.controls.BPKBOWNERDOB.setValue(
            individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.DATEOFBIRTH
          );
        }
        this.PRPLBPKBDETL.controls.GENDER.setValue(
          individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.GENDER
        );
        this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue(
          individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL.OTOPLACEOFBIRTH
        );
        if (
          individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL
            .MARITALSTATUSCDE != null
        ) {
          this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue(
            individualApplicant.value.PROPOSALAPPLICANTINDIVIDUAL
              .MARITALSTATUSCDE
          );
        }
      }
    }

    if (
      this._proposaldataService.PROPOSALAPPLICANT.value != null &&
      this._proposaldataService.PROPOSALAPPLICANT.value.length > 0
    ) {
      if (
        this._proposaldataService.PROPOSALAPPLICANT.value[0]
          .PROPOSALAPPLICANTMAIN.APPLICANTTYP == 'I'
      ) {
        this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(
          ApplicantType.Individual
        );
        this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode.filter((a) => a.APPTYP == "I")
      } else if (
        this._proposaldataService.PROPOSALAPPLICANT.value[0]
          .PROPOSALAPPLICANTMAIN.APPLICANTTYP == 'C'
      ) {
        this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(
          ApplicantType.Company
        );
        this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode.filter((a) => a.APPTYP == "C")
      }
    }

    if (
      this._proposaldataService.PROPOSAL.value != null &&
      this._proposaldataService.PROPOSAL.value.OTOAPLTCTGYCDE != null
    ) {
      this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.setValue(
        this._proposaldataService.PROPOSAL.value.OTOAPLTCTGYCDE
      );
    }

    if (
      individualApplicant != null &&
        individualApplicant.value.PROPOSALAPPSPOUSEDETAIL ?.length > 0 &&
        this._proposaldataService.ASSETENTITY.value.OTOPRPLASSTBPKBDETL
          .OTOMARITALSTATUSCDE != null
    ) {
      this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue(
        this._proposaldataService.concatenateNames(
          individualApplicant.value.PROPOSALAPPSPOUSEDETAIL[0].FIRSTNME,
          individualApplicant.value.PROPOSALAPPSPOUSEDETAIL[0].MIDDLENME,
          individualApplicant.value.PROPOSALAPPSPOUSEDETAIL[0].LASTNME
        )
      );
      this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue(
        individualApplicant.value.PROPOSALAPPSPOUSEDETAIL[0].SPOUSEADDRESS
      );
    } else {
      this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue(null);
      this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue(null);
    }
    if (this.m_oldbpkbownervalue != null) {
      this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue('');
    }

    if (
      this.PRPLBPKBDETL.value.OTOMARITALSTATUSCDE == MaritalStatus.Married &&
      individualApplicant != null &&
      individualApplicant.value.PROPOSALAPPSPOUSEDETAIL.length > 0
    ) {
      this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue(
        individualApplicant.value.PROPOSALAPPSPOUSEDETAIL[0].OTOAGMTCDE
      );
    } else {
      this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue(null);
    }
    this.guarantorDisable = this.CalculateAge();
  }

  private SetDefaultAddress(indicatorOwnerType: string) {
    if (indicatorOwnerType == OTO_BPKBOwnerType.Borrower) {
      let isFirstLegal = true;
      let borrowerAddress = {} as IPRPL_APLT_ADDSInfo;
      this._proposaldataService.PROPOSALAPPLICANT.value[0].ADDRESS.forEach(
        (addressType) => {
          if (
            addressType.PROPOSALADDRESSTYPEDETAIL.filter(
              (p) => p.ADDRESSTYPECDE == AddressTypeCode.Legal
            ).length > 0 &&
            isFirstLegal
          ) {
            isFirstLegal = false;
            borrowerAddress =
              addressType.PROPOSALAPPLICANTADDRESS as IPRPL_APLT_ADDSInfo;
          }
        }
      );

      this.PRPLBPKBDETL.controls.ADDSDSC.setValue(null);
      this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(0);
      this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(0);
      this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
      this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
      this.PRPLBPKBDETL.controls.OTORW.setValue(null);
      this.PRPLBPKBDETL.controls.OTORT.setValue(null);

      this.PRPLBPKBDETL.controls.ADDSDSC.setValue(borrowerAddress.ADDRESSOTO);
      this.PRPLBPKBDETL.controls.OTOCOUNTRY.setValue(
        Number(borrowerAddress.COUNTRYID) || 10
      );
      this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(
        borrowerAddress.PROVINCEID
      );
      this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(
        borrowerAddress.KOTAMADYAIDOTO
      );
      this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(
        borrowerAddress.KECAMATANIDOTO
      );
      this.PRPLBPKBDETL.controls.OTODESA.setValue(
        borrowerAddress.KELURAHANIDOTO
      );
      this.PRPLBPKBDETL.controls.OTORW.setValue(borrowerAddress.RWOTO);
      this.PRPLBPKBDETL.controls.OTORT.setValue(borrowerAddress.RTOTO);
    } else if (indicatorOwnerType == OTO_BPKBOwnerType.Other) {
      this.PRPLBPKBDETL.controls.ADDSDSC.setValue('');
      this.PRPLBPKBDETL.controls.OTOPROVINCE.setValue(0);
      this.PRPLBPKBDETL.controls.OTOKOTAMADYA.setValue(0);
      this.PRPLBPKBDETL.controls.OTOKECAMATAN.setValue(0);
      this.PRPLBPKBDETL.controls.OTODESA.setValue(0);
      this.PRPLBPKBDETL.controls.OTORW.setValue('');
      this.PRPLBPKBDETL.controls.OTORT.setValue('');
      this.isBPKBOWNERBORROWER = false;
    }
  }

  public ReadBorrowerDetailforCompany() {
    let companyApplicant =
      this._proposaldataService.PROPOSALAPPLICANT.value[0].COMPANYAPPLICANT;

    if (
      this.PRPLBPKBDETL.value != null &&
      this._proposaldataService.PROPOSALAPPLICANT.value.length > 0 &&
      this._proposaldataService.PROPOSALAPPLICANT.value[0]
        .PROPOSALAPPLICANTIDDETAIL != null &&
      this._proposaldataService.PROPOSALAPPLICANT.value[0]
        .PROPOSALAPPLICANTIDDETAIL.length > 0
    ) {
      this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue(
        ApplicantType.Company
      );
      this.BPKBOWNERTYPESELECTION = this._assetDetailsMasterdataService.ApplicantCategoryCode.filter((a) => a.APPTYP == "C")
      this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue(
        companyApplicant.PROPOSALAPPLICANTCOMPANY.NAME
      );
      this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue(
        this._proposaldataService.PROPOSALAPPLICANT.value[0]
          .PROPOSALAPPLICANTIDDETAIL[0].IDTYPENBR
      );
      if (this._proposaldataService.PROPOSAL.value.OTOAPLTCTGYCDE != null) {
        this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.setValue(
          this._proposaldataService.PROPOSAL.value.OTOAPLTCTGYCDE
        );
      }
    }
  }

  onBPKBOWNERCategoryChange() {

    this.ResetforOther();
  }


  onBPKBOWNERChange(event: any) {
    {
      if (event != undefined) {

        if (this._FormModeService.FormMode != FormMode.VIEW) {
          if (
            this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL
              .value != null
          ) {
            this._FormState.ResetFormArrayState(
              this._proposaldataService.ASSETENTITY.controls
                .OTOPRPLASSTBPKBRPRSDETL,
              DataRowState.Removed
            );
          }
          if (
            this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBGRTRDETL
              .value != null
          ) {
            this._FormState.ResetFormArrayState(
              this._proposaldataService.ASSETENTITY.controls
                .OTOPRPLASSTBPKBGRTRDETL,
              DataRowState.Removed
            );
          }
          if (
            this.PRPLBPKBDETL.value != null &&
            event.value != null &&
            event.value == OTO_BPKBOwnerType.Borrower
          ) {
            this.PRPLBPKBDETL.controls.RELATIONSHIPCDE.enable();
            this.PRPLBPKBDETL.controls.RELATIONSHIPCDE.setValue('');
            this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.disable();

            if (
              this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value ==
              'I'
            ) {
              this.ReadBorrowerDetailforIndividual();
              //this.DisableforIndividual()
              this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);
              this.isBPKBOwnerMarried = true;
            } else if (
              this._proposaldataService.PROPOSAL.controls.APPLICANTIND.value ==
              'C'
            ) {
              this.ReadBorrowerDetailforCompany();
              this._proposalManagerService.UpdateBPKBRepresentatives();
              //this.LoadRepresentativeInfo()
              this.OTOPRPLASSTBPKBRPRSDETL = this._proposaldataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL.value;
              this.dataSourceRepresentative =
                new MatTableDataSource<IPRPL_BPKB_RPRS_DETLInfo>(
                  this.OTOPRPLASSTBPKBRPRSDETL.filter(p => p.RowState != DataRowState.Removed)
                );
              //this.DisableforCompany();
              this.guarantorDisable = true;
              this.SetDefaultAddress(OTO_BPKBOwnerType.Borrower);
            }

            if (
              this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value != null &&
              this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value !=
              MaritalStatus.Married
            ) {
              this.PRPLBPKBDETL.controls.OTOAGMTCDE.enable();
              this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.enable();
              this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.enable();

              this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue(null);
              this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
              this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue('');
            }
          } else {
            this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.enable();
            this.PRPLBPKBDETL.controls.BPKBOWNERTYPE.setValue('');
            if (
              this.PRPLBPKBDETL.value != null &&
              event.value != null &&
              event.value == OTO_BPKBOwnerType.Other
            ) {
              this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.setValue('');
              this.PRPLBPKBDETL.controls.GENDER.setValue('');
              this.PRPLBPKBDETL.controls.BPKBOWNERDOB.setValue(null);
              this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.setValue('');
              this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.setValue('');
              this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.setValue(null);
              this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.setValue('');
              this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue('');
              this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
              this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.setValue('');
              this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.setValue('');
              this.SetDefaultAddress(OTO_BPKBOwnerType.Other);
              this.guarantorDisable = true;
              //this.isBPKBOwnerMarried = false;
              this.isBPKBOWNERBORROWER = false;
            }

            this.PRPLBPKBDETL.controls.OTOBPKBOWNERNME.enable();
            this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.enable();
            this.PRPLBPKBDETL.controls.BPKBOWNERCATEGORY.enable();
            this.PRPLBPKBDETL.controls.GENDER.enable();
            this.PRPLBPKBDETL.controls.BPKBOWNERDOB.enable();
            this.PRPLBPKBDETL.controls.BPKBOWNERPLACEOFBIRTH.enable();
            this.PRPLBPKBDETL.controls.BPKBOWNERKTPID.enable();
            this.PRPLBPKBDETL.controls.BPKBOWNERKTPIDEXPIRY.enable();
            // this.PRPLBPKBDETL.controls.OTOAGMTCDE.enable();
            // this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.enable();
            this.PRPLBPKBDETL.controls.BPKBOWNERTITLE.enable();
            this.PRPLBPKBDETL.controls.BPKBHOLDERADDRESS.enable();
            this.PRPLBPKBDETL.controls.OTOBPKBHOLDERNME.enable();

            if (
              this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value != null &&
              this.PRPLBPKBDETL.controls.OTOMARITALSTATUSCDE.value ==
              MaritalStatus.Married
            ) {//***************** */
              this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.enable();
              this.PRPLBPKBDETL.controls.OTOAGMTCDE.enable();
            } else {
              this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.setValue('');
              this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.setValue('');
              this.PRPLBPKBDETL.controls.OTOAGMTCDE.setValue('');

              // this.PRPLBPKBDETL.controls.OTOBPKBOWNERSPOUSENME.disable();
              // this.PRPLBPKBDETL.controls.BPKBOWNERSPOUSEADDRESS.disable();
              // this.PRPLBPKBDETL.controls.OTOAGMTCDE.disable();
            }
          }
          this.m_oldbpkbownervalue = event.value;

          // this._FormState.ResetFormArrayState(this._proposaldataService.OTOPRPLASSTBPKBGRTRDETL, DataRowState.Removed);
          this.OTOPRPLASSTBPKBGRTRDETL = this._proposaldataService.OTOPRPLASSTBPKBGRTRDETL.value;

          this.dataSourceGuarantor = new MatTableDataSource<IPRPL_BPKB_GRTR_DETLInfo>(
            this.OTOPRPLASSTBPKBGRTRDETL.filter(p => p.RowState != DataRowState.Removed)
          );
          this.dataSourceRepresentative._updateChangeSubscription();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  get IsInventoryVehicleDetailDiabled(): boolean {
    // let status = false;
    // // console.log("HERE AT THE GET INVENTORY VEHICLE DETAIL DISABLED")
    // if (this.PRPLASSETINFO.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory){
    //   status = true;
    // }
    // else
    //   status = false;

    // // console.log(status);
    // return status;

    return this.PRPLASSETINFO.controls.ASSETSELECTIONCDE.value == AssetSelection.Inventory
  }

  get IsVehicleConditionSelected(): boolean {

    return this.PRPLASSETINFO.controls.CONDITION.value == null || this.PRPLASSETINFO.controls.CONDITION.value == "";
  }


  selectionChange_CONDITION(evnt: Event) {
    if (evnt != undefined) {
      //if (String(evnt) == AssetCondition.New) {
      if (this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.value ==
        BPKBRecievedStatus.Recieved) {
        this.resetBPKB();
      }
      this.PRPLBPKBDETL.controls.BPKBRECEIVEDSTATUS.setValue(
        BPKBRecievedStatus.NotRecieved
      );
      this.ResetBPKBStatus();
      // }

      this._calculationService.SetAdminFeeChartConfigurations();
      this._calculationService.ResetRentalDetail();
      //var processingDate = new Date(this.storageService.GetUserInfo().ProcessingDate)
      // processingDate.setHours(new Date().getHours());
      // processingDate.setMinutes(new Date().getMinutes());
      // processingDate.setSeconds(new Date().getSeconds());
      //this.PRPLBPKBDETL.controls.STATUSCHANGEDTE.setValue(processingDate);
      this._proposalManagerService.assetConditionChanged = true;

    }
  }

  cityOfRegistrationChange(event: Event) {
    if (event != undefined) {
      this.PRPLBPKBDETL.controls.OTOCITYID.setValue(this.PRPLVHCLDTL.controls.CITYOFREGISTRATIONOTO.value);
      this._calculationService.EnableInsuranceCalculateButton();
    }
  }
  private CalculateAge() {

    let applicants = this._proposaldataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
    let articalEntity = this._proposaldataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    let bpkbConfiguredAge = 0;
    if (articalEntity != null) {
      if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL != null
        && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB != null) {
        let years = 0;
        let months = 0;
        let days = 0;

        if (this.PRPLBPKBDETL.controls.BPKBOWNERDOB.value != undefined) {
          articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB = this.PRPLBPKBDETL.controls.BPKBOWNERDOB.value;
        }

        let temparr = this._proposaldataService.DateDiff(articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB, this._storageService.GetUserInfo().ProcessingDate, years, months, days);
        years = temparr[0];
        months = temparr[1];
        days = temparr[2];

        if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE != 0 && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Borrower) {
          bpkbConfiguredAge = articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE;
        }
        else if (articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBBORROWERAGE != 0 && articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Other) {
          bpkbConfiguredAge = articalEntity.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOTHERAGE;
        }

        if (years < bpkbConfiguredAge) {
          return false;
        }
      }
    }
    return true;
  }

  assetListPriceUpdate(evnt: any) {
    // let assetAmnt = this._formatter.FormatCurrencyToNumber(String(evnt));
    // this.PRPLASSETINFO.controls.ASSETAMT.setValue(assetAmnt);
    this._calculationService.assetAmountonChange(evnt);
  }


  onCloseDialog() {
    // let assetAmnt = this._formatter.FormatCurrencyToNumber(String(this.PRPLASSETINFO.controls.ASSETAMT.value));
    // this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.setValue(assetAmnt);
    // this._calculationService.AssetAmtValueChange();
    // if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.value > 0) {
    //   this._calculationService.CalculateDownPayment(this._proposaldataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
    //   if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.value < 100) {
    //     this._calculationService.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
    //     if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.Refinance) {
    //       this._calculationService.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
    //       if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND) {
    //         this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, null, null, 1, AmountClassification.Receivable, true);
    //         this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, null, null, 1, AmountClassification.Nettingoff, true);
    //       }
    //       else {
    //         this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, null, null, 1, AmountClassification.Receivable, false);
    //       }
    //     }
    //   }
    //   else {
    //     this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.setValue(0);
    //     this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.setValue(0);
    //     this._calculationService.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
    //     this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE);
    //   }

    // }
    // else if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.value > 0) {
    //   if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.value < 100) {
    //     this._calculationService.CalculateDownPaymentRF(this._proposaldataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
    //     this._calculationService.CalculateNetFinanceAmt();
    //     this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._proposaldataService.PROPOSAL.value.CURRENCYCDE);
    //   }
    //   else {
    //     this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(0);
    //     this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(0);
    //     this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._proposaldataService.PROPOSAL.value.CURRENCYCDE);
    //     if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT != 0)
    //       this._messageService.showMesssage("DiscAmLesAsetCost", MessageType.Warning);
    //   }
    // }
    // this._calculationService.ApplyAssetConfigurations(true, this._proposaldataService.PROPOSALARTICLE.controls[this._proposaldataService.PROPOSALARTICLE.value.length - 1], false);
    // this._calculationService.RemoveArticleComponent(AmountComponent.AssetCost);
    // this._calculationService.UpdateFinancialAgreementDetail(
    //   this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value,
    //   AmountComponent.AssetCost,
    //   this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value,
    //   AssetComponentsFinancialConfiguration.Finance,
    //   null
    // );
    // this._calculationService.EnableInsuranceCalculateButton();
  }

  getMonths(date: Date | null) {
    let monthsMoment, years, months = 0;
    let yearmonthlist = []
    monthsMoment = moment().diff(date, 'months');
    years = Math.floor(monthsMoment / 12);
    months = monthsMoment % 12;
    yearmonthlist.push(years);
    yearmonthlist.push(months)
    return yearmonthlist;
  }

  UpdateFinancialDetailsOnInsuranceChange() {
    if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM != this.TotalPremiumAmnt) {

      this._calculationService.RemoveArticleComponent(AmountComponent.InsuranceCommission);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEAMT.setValue(0);

      this._proposaldataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach((col, index) => {
        if (col.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.TLO) || col.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.Comprehensive) || col.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdditionalCoverage)) {
          if (col.value.RowState != DataRowState.Added)
            col.controls.RowState.setValue(DataRowState.Removed);
          else
            this._proposaldataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.removeAt(index)
        }
      })

      this._calculationService.RemoveArticleComponent(AmountComponent.FinancedInsurancePremium);
      this._calculationService.RemoveArticleComponent(AmountComponent.AROInsurancePremium);
      this._calculationService.RemoveArticleComponent(AmountComponent.InsuranceSubsidy);
      this._calculationService.RemoveArticleComponent(AmountComponent.UpfrontInsurancePremium);
      this._calculationService.RemoveArticleComponent(AmountComponent.B2BFee);
      this._calculationService.RemoveArticleComponent(AmountComponent.InsurancePremium);
      this._calculationService.RemoveArticleComponent(AmountComponent.DealerInsuranceCommission);

      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCECOMMISSIONAMOUNT.setValue(0);
      this._calculationService.SetDownpayment();
      this._calculationService.CreateFinlAgreementDetails();

      //INSURANCE COMMISSION FOR OTO
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMAMTOTO.setValue(0);
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.INSRCOMMPCTOTO > 0) {
        let amt = (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM * this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.INSRCOMMPCTOTO) / 100
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMAMTOTO.setValue(+amt.toFixed(2));
        this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.INSRCOMMAMTOTO, AmountComponent.InsuranceCommission, '00001', null, this._proposaldataService.ASSETENTITY.value.PROPOSALINSURANCEMAIN[0].PRPLINSR.INSURER, 1, AmountClassification.Payable);
        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMAMTOTO.value > 0) {

          this._calculationService.CalculateTaxByComponent(AmountComponent.GetStringValue(AmountComponent.InsuranceCommission), CommissionType.GetStringValue(CommissionType.InsuranceCommission))
        }
        this._calculationService.ReCalculateOJKCommission(AmountComponent.InsuranceCommission, CommissionType.InsuranceCommission);
      }
    }
  }

  BPKBNumberChanged(event: any) {
    this.PRPLBPKBDETL ?.controls.OTOBPKBNUMBER.setValue(event);
    if (this.PRPLBPKBDETL ?.controls.RowState.value != DataRowState.Added && this.PRPLBPKBDETL ?.controls.RowState.value != DataRowState.Removed)
      this.PRPLBPKBDETL ?.controls.RowState.setValue(DataRowState.Updated);
  }

  goodServicesDetilsDisable() {
      if (this._proposaldataService.PROPOSAL.controls.ENABLEGOODSDETAILS.value == true )
        return false;
      else return true;

  }
  goodServicesDetilsOnChange(event: any){
    if (event != undefined) {
      if (this._FormModeService.FormMode != FormMode.VIEW) {
        this.PRPLVHCLDTL.controls.GOODSSERVICESFUNDDETAILS.setValue('');
      }
      let param = {} as IAssetInfoParams;
        param.GoodsServiceFunds = event.value;
        this._proposalService
          .GetGoodsServiceFundsDetails(param)
          .subscribe((res) => {
            this.GoodServicesFundDetails = res.ResultSet.DataCollection;
          })
    }
  }

  getFPCampaginByFPId(){
    let request = new ProposalMasterDataRequest();
    request.financeProductId = this._proposaldataService.PROPOSAL.controls.FINANCIALPRODUCTID.value;    
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
