import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { FormModeService } from "@NFS_Core/NFSServices/FormMode/form-mode.service";
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { mPOSMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/mPOSMasterDataRequest';
import { ProposalMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/proposalMasterDataRequests';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from "@NFS_Core/NFSServices/Proposal/proposal.service";
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import * as PROPOSALENTITY from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IFINE_TYPE_INCM_CNFGInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { INFSDropDownData } from '@NFS_Interfaces/OtherInterfaces/nfs-dropdown-data-interface';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from "@NFS_Modules/CAP/CAPServices/proposal-data.service";
import { ProposalEntityMapperService } from "@NFS_Modules/CAP/CAPServices/proposal-entity-mapper.service";
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { Control,FormArray,FormBuilder, FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { distinctUntilChanged, pairwise, takeUntil } from 'rxjs/operators';
import { DealerSearchComponent } from './dealer-search.component';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import { AppConfigService } from '@NFS_Core/NFSServices/ApplicationConfig/app-config.service';
import { CommissionService } from './commissionApplicable.Helper';
import { MasterData } from '@NFS_Enums/MasterData.enum';
import { IPRPL_DVTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DVTN_TRCK.model';

@Component({
    selector: 'app-general-header-info',
    templateUrl: './general-header-info.component.html',
    styleUrls: ['./general-header-info.component.css'],
    standalone: false
})
export class GeneralHeaderInfoComponent implements OnInit, OnDestroy, OnChanges {
  @Input() ApplicantCategory !: INFSDropDownData[];
  @Output() ResetFinancialDetails = new EventEmitter;
  PROPOSALUSER!: FormGroup<PROPOSALENTITY.IPRPL_IOPS_USERInfo>;
  PROPOSALINFO!: FormGroup<PROPOSALENTITY.IPRPLInfo>;
  PROPOSALTEMPLATERENTALINT!: FormGroup<PROPOSALENTITY.IPRPL_TPLE_RNTL_INTInfo>;
  PROPOSALADMINFEE = this._proposaldataService.PROPOSALADMINFEEDETAIL;
  formMode = this._formService.FormMode;
  request!: ProposalMasterDataRequest;
  mPOSrequest!: mPOSMasterDataRequest;
  configRequest!: ProposalMasterDataRequest;
  companyCode = this._appConfig.CompanyCode;
  public FPCampaignArray: any = [];
  public FPGroupArray !: INFSDropDownData[];
  private subscription$ = new Subject();
  public dealerLabel = "Introducer";
  public lblApplicantCategory = "Applicant Type";
  public LabelsDeviationInfo = ['Deviation Summary', 'Deviation Comments']
  public columnsDeviationInfo  = ['DeviationSummary', 'DeviationComment'];
  public EnableTooltip = [true, true];
  isCommissionApplicable :boolean;
  OVPStatusList:Array<any>=[ 
    {id: 0,
      code: "false",
      TextValue: "No",
    },
    {id: 1,
      code: "true",
      TextValue: "Yes",
    },
  ];

  CommissionApplicableList:Array<any>=[ 
    {id: 0,
      code: "00002",
      TextValue: "New Scheme",
    },
    {id: 1,
      code: "00001",
      TextValue: "Old Scheme",
    },
    {id: 2,
      code: "00003",
      TextValue: "Special TAC",
    }
  ];

  fpGroupId: number = 0;
  fpCampaignId: number = 0;
  public DvtnTrckInformation: FormArray<IPRPL_DVTN_TRCK> = this._formBuilder.array<IPRPL_DVTN_TRCK>([]);
  constructor(private commissionService: CommissionService, private _formBuilder: FormBuilder, private dialog: MatDialog, public _masterDataService: MasterDataService, public _proposaldataService: ProposalDataService, public _generalService : GeneralService,
    private _proposalService: ProposalService, private storageService: ClientStoreService, private _formService: FormModeService,
    public _FCMasterDataService: FinancialClubMasterDataService, private _ProposalEntityFormService: ProposalEntityFormService,
    private _proposalMapperService: ProposalEntityMapperService, private _calculationService: CalculationService,
    private _FormState: StateManagment, private _messageService: MessageService, public _proposalmanagerService: ProposalManagerService,
    public appTypeService: ApplicationTypeService, private _formatterService: FormatterService, private _appConfig: AppConfigService, ) {
    this.isCommissionApplicable = false;}

  ngOnChanges(changes: SimpleChanges): void {
  const comm = this.commissionService.getCommissionApplicable(); Boolean
  this.isCommissionApplicable = comm;
  this.commissionService.setCommissionApplicable(false);
  
  if (this._proposaldataService.PROPOSAL.value.PROPOSALID > 0 && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase && !this._proposaldataService.PROPOSAL.value.MCOMDEALER) {
    this.isCommissionApplicable = false;
    }
    else{
      this.isCommissionApplicable = true;
    }
    // if(this._masterDataService.ApplicantCategoryCode){
    //   if(this._proposaldataService.PROPOSAL.value.PROPOSALTYPECDE == '00001'){
    //     this.ApplicantCategory = this._masterDataService.ApplicantCategoryCode.filter(x => x.APPTYP == 'I');
    //   }
    //   else{
    //     this.ApplicantCategory = this._masterDataService.ApplicantCategoryCode.filter(x => x.APPTYP == 'C');
    //   }
    // }
      this.ReadDeviationTracking();
  }

  ngOnInit(): void {
    this.PROPOSALINFO = this._proposaldataService.PROPOSAL;
    this.PROPOSALINFO.controls.CURRENCYCDE.setValue(this._masterDataService.CurrencyType[0].code);
    this.PROPOSALUSER = this._proposaldataService.PROPOSALUSER;
    this.PROPOSALTEMPLATERENTALINT = this._proposaldataService.PROPOSALTEMPLATERENTALINT;
    //this.FPCampaignArray = this._proposalmanagerService.GetFPCampaignArray();
    this.valueChangeSubscriptions();
    this.getFPCampaginByFPId();
    this.PROPOSALINFO.controls.BPINTRODUCERNME.valueChanges.subscribe((value) => {
      const bpIntroderId = this.PROPOSALINFO.controls.BPINTRODUCERID.value;
      this.mPOSrequest = new mPOSMasterDataRequest();
      this.mPOSrequest.masterDataOperation = MasterData.GetSalesmanByDealer;
      this.mPOSrequest.DATAS.businessPartnerId = bpIntroderId;

      this._masterDataService.GetMasterData(this.mPOSrequest).subscribe((response: any) => {
        this._masterDataService.SalesmanByDealer = response?.ResultSet?.DataCollection.map((item: any) => ({
          ...item,
          id: item.id?.toString()
        }));
      })
    })
  }
  ReadDeviationTracking(): void{
    if (this._proposaldataService.PRPLDVTNTRCK !== null && this._proposaldataService.PRPLDVTNTRCK?.value.length > 0) {
      const formattedData = this._proposaldataService.PRPLDVTNTRCK.value.map((x: any) => {
        return this._formBuilder.group({
          DeviationSummary: [x.DVTNSMRY],
          DeviationComment: [x.DVTNCMNT]
        });
      });
      this.DvtnTrckInformation.clear();
      formattedData.forEach((group: FormGroup) => this.DvtnTrckInformation.push(group));
    }
  }
  public getDealerName() {
    if (this._proposaldataService.PROPOSAL?.controls.FINANCETYP.value == FinanceType.OperatingLease || this._proposaldataService.PROPOSAL?.controls.FINANCETYP.value == FinanceType.HirePurchase) {
      this.dealerLabel = "Dealer"
      return this.dealerLabel;
    }
    else {
      this.dealerLabel = "Introducer"
      return this.dealerLabel;
    }
  }
  public ApplicantCategoryLabel() {
    if (this._proposaldataService.PROPOSAL?.controls.FINANCETYP.value == FinanceType.OperatingLease || this._proposaldataService.PROPOSAL?.controls.FINANCETYP.value == FinanceType.HirePurchase) {
      this.lblApplicantCategory = "Customer Type"
      return this.lblApplicantCategory;
    }
    else {
      this.lblApplicantCategory = "Applicant Category"
      return this.lblApplicantCategory;
    }
  }
  openDealerSearch() {

    const dialogRef = this.dialog.open(DealerSearchComponent, {
      width: '1228px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
      if (result?.isDealerChanged) {
        if (this.PROPOSALINFO.controls.FINANCIALPRODUCTID.value != 0 && this._formService.FormMode != FormMode.NEW) {
          this._messageService.showMesssage("CmpgnAsstnRmvd", MessageType.Error);
          this.PROPOSALINFO.controls.FPGROUPID.setValue(0);
          this.PROPOSALINFO.controls.FINANCIALPRODUCTID.setValue(0);
          this.fpCampaignId = 0;
          this.fpGroupId = 0;
        }
        this.getFPCampaign();
        this.resetArticleEntity();
      }
    });
  }

  openPackageSearch() {
    const dialogRef = this.dialog.open(DealerSearchComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 123456 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  SetFinancialGroupCampaignConfigurations() {
    let fpGroup = this.FPGroupArray?.filter(x => x.code === this.PROPOSALINFO.controls.FPGROUPID.value.toString())[0];
    if (fpGroup != undefined) {
      this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.setValue(fpGroup?.ISMCOMCAMPAIGN);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT?.controls.FINANCETYP.setValue(fpGroup.FINACETYPECODE);
      this._proposaldataService.PROPOSALTEMPLATERENTALINT?.controls.FINANCETYP.setValue(fpGroup.FINACETYPECODE);
      this._proposaldataService.PROPOSAL?.controls.FINANCETYP.setValue(fpGroup.FINACETYPECODE);
      this._proposalmanagerService.SetFPCampaignArray();
      //this.FPCampaignArray = this._FCMasterDataService.FPCampaignCol[this.PROPOSALINFO.controls.BPINTRODUCERID.value]?.filter((f: any) => f.FPGROUPID == this.PROPOSALINFO.controls.FPGROUPID.value && f.BRANCHID == this.PROPOSALINFO.controls.BPCOMPANYBRANCHID.value);
      //No need to set here. max and min terms will set on FP selection
      //   this._proposalmanagerService.ContractMinTerms = this.FPCampaignArray[0].MINTERMS;
      //   this._proposalmanagerService.ContractMaxTerms = this.FPCampaignArray[0].MAXTERMS;

      if (fpGroup.FINACETYPECODE === FinanceType.OperatingLease) {
        this._messageService.ClearValidatorMessages('OTOAPLTCTGYCDEAC');
      }
      else {
        this._messageService.ClearValidatorMessages('OTOAPLTCTGYCDECT');
      }

      // this.FPCampaignArray = this.FPCampaignArray?.map((p: any) => ({ code: p.FINANCIALPRODUCTID.toString(), TextValue: p.FINANCIALPRODUCTNME }));
    }
  }

  SetPOSLocation() {
    let res: any = this._masterDataService.MarketingOfficerByBranch[this.PROPOSALINFO.controls.BPCOMPANYBRANCHID.value]?.filter((obj: any) => obj.code == this.PROPOSALINFO.controls.MARKETINGOFFICERID.value);
    if (res?.length > 0 && res[0].POSLCTNCODE !== undefined && res[0].POSLCTNCODE !== null && res[0].POSLCTNCODE !== '') {
      let posLoc = this._masterDataService.POSLocationCode.filter((p: any) => p.OptionalData.CODE == res[0].POSLCTNCODE);
      if (posLoc?.length > 0) {
        this.PROPOSALINFO.controls.POSLOCATION.setValue(posLoc[0].TextValue);
        this.PROPOSALINFO.controls.POINTOFSALELOCATIONCDE.setValue(res[0].POSLCTNCODE);
      }
      else {
        let value = this.storageService.GetUserInfo().CompanySysUser.find((b: any) => b.BPSECONDARYID == this.PROPOSALINFO.controls.BPCOMPANYBRANCHID.value);
        this.PROPOSALINFO.controls.POSLOCATION.setValue(value.BRANCHNME);
        this.PROPOSALINFO.controls.POINTOFSALELOCATIONCDE.setValue('');
      }
    }
    else {
      let value = this.storageService.GetUserInfo().CompanySysUser.find((b: any) => b.BPSECONDARYID == this.PROPOSALINFO.controls.BPCOMPANYBRANCHID.value);
      this.PROPOSALINFO.controls.POSLOCATION.setValue(value.BRANCHNME);
      this.PROPOSALINFO.controls.POINTOFSALELOCATIONCDE.setValue('');
    }
  }

  valueChangeSubscriptions() {

    this._masterDataService.MarketingOfficeSubject.subscribe(val => {
      if (val && this.PROPOSALINFO.controls.MARKETINGOFFICERID.value > 0) {
        this.SetPOSLocation();
      }
    })

    this.PROPOSALINFO.controls.BPINTRODUCERNME.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$), pairwise()).subscribe(([oldValue, data]) => {
      if (oldValue != data) {
        this.getFPCampaign();
      }
    });

    this.PROPOSALINFO.controls.FPGROUPID.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$), pairwise()).subscribe(([oldValue, data]) => {
      if (data != 0 && oldValue != data && data != undefined) {
        this.PROPOSALINFO.controls.FINANCIALPRODUCTID.patchValue(0);
        this.SetFinancialGroupCampaignConfigurations();
      }
    });

    this.PROPOSALINFO.controls.MARKETINGOFFICERID.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (val != 0) {
        window.setTimeout(() => {
          this.SetPOSLocation();
        });
      }
    });

    //fpCompain value changes
    this.PROPOSALINFO.controls.FINANCIALPRODUCTID.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(val => {

      this.request = new ProposalMasterDataRequest();
      this.request.financeProductId = this.PROPOSALINFO.controls.FINANCIALPRODUCTID.value;
      this.PROPOSALINFO.controls.OLRCPTNGBNK.setValue(null);
      if (this.request.financeProductId > 0) {

        this.configRequest = new ProposalMasterDataRequest();
        this.configRequest.financeProductId = this.PROPOSALINFO.controls.FINANCIALPRODUCTID.value;
        this._proposalService.ReadRentalModesFromTemplate(this.configRequest).pipe(takeUntil(this.subscription$)).subscribe(result => {
          this._FCMasterDataService.RentalModes = result?.ResultSet?.DataCollection;
        });

        this._proposalService.ReadFrequenciesFromTemplate(this.configRequest).pipe(takeUntil(this.subscription$)).subscribe(result => {
          this._FCMasterDataService.Frequencies = result?.ResultSet?.DataCollection;
        });

        this._proposalService.ReadAssetModlTpleSeqID(this.configRequest).pipe(takeUntil(this.subscription$)).subscribe(result => {
          this._proposaldataService.TPLEASETMODLSEQID = result?.ResultSet;
        });
        // if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease)
        //   this.PROPOSALINFO.controls.OLRCPTNGBNK.enable();
        //else
        //this.PROPOSALINFO.controls.OLRCPTNGBNK.disable();

        //PropsalCommissionForm
        if (this._proposaldataService.PROPOSAL.value.FINANCETYP == '00005' && this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN == false) {
          this._proposaldataService.ProposalEntity.controls.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._ProposalEntityFormService.PropsalCommissionForm());
        }
      }
      else if (this.request.financeProductId == 0) {
        this.resetArticleEntity();
      }

      let FPCampaignArray = this._FCMasterDataService.FPCampaignCol[this.PROPOSALINFO.controls.BPINTRODUCERID.value]?.find((f: any) => f.FPGROUPID == this.PROPOSALINFO.controls.FPGROUPID.value && f.BRANCHID == this.PROPOSALINFO.controls.BPCOMPANYBRANCHID.value && f.FINANCIALPRODUCTID == val);
      if (FPCampaignArray && FPCampaignArray != undefined) {
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT?.controls.FINANCETYP.setValue(FPCampaignArray.FINACETYPECODE);
        this._proposaldataService.PROPOSALTEMPLATERENTALINT?.controls.FINANCETYP.setValue(FPCampaignArray.FINACETYPECODE);
        this._proposaldataService.PROPOSAL?.controls.FINANCETYP.setValue(FPCampaignArray.FINACETYPECODE);
        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT?.controls.FINANCETYP.value == FinanceType.Refinance)
          this._proposaldataService.PROPOSAL.controls.INTRODUCERROLECDE.setValue(RoleCode.Introducer);
        else
          this._proposaldataService.PROPOSAL.controls.INTRODUCERROLECDE.setValue(RoleCode.Dealer);
      }
    });
    this.PROPOSALINFO.controls.OLRCPTNGBNK.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(val => {
      if (String(val) == "") {
        this.PROPOSALINFO.controls.OLRCPTNGBNK.setValue(null);
      }
    })
  }

  getFPCampaign() {
    this.request = new ProposalMasterDataRequest();
    this.request.BusinessPartnerId = this.PROPOSALINFO.controls.BPINTRODUCERID.value;
    this.request.BPRole = this.PROPOSALINFO.controls.INTRODUCERROLECDE.value;
    this.request.companyId = this.PROPOSALINFO.controls.BPCOMPANYID.value;
    this.request.PROPOSALTYPECDE = this.PROPOSALINFO.controls.PROPOSALTYPECDE.value;

    if (this.request.BusinessPartnerId > 0 && this._FCMasterDataService.FPCampaignCol[this.request.BusinessPartnerId] === undefined) {
      this._proposalService.FPCampaign(this.request).pipe(takeUntil(this.subscription$)).subscribe(data => {
        if (data && data.ResultSet.length > 0) {
          let processingDate: any | null;
          processingDate = this._formatterService.FormateDateToString(this.storageService.GetUserInfo().ProcessingDate.toString(), 'YYYY-MM-dd');
          data.ResultSet.map((x: any) => {
            x.VALIDTODTE = this._formatterService.FormateDateToString((x.VALIDTODTE).toString(), 'YYYY-MM-dd');
            x.VALIDFROMDTE = this._formatterService.FormateDateToString((x.VALIDFROMDTE).toString(), 'YYYY-MM-dd');
          })
          this._FCMasterDataService.FPCampaignCol[this.PROPOSALINFO.controls.BPINTRODUCERID.value] = data.ResultSet.filter((p: any) => p.VALIDFROMDTE <= processingDate && p?.VALIDTODTE >= processingDate);
          this._proposalmanagerService.SetFPCampaignArray();
          this.PopulateFPGroupArray();
        }
      });
    }
    else {
      this._proposalmanagerService.SetFPCampaignArray();
      this.PopulateFPGroupArray();
    }
  }
  PopulateFPGroupArray(): void {
    let result = [] as Array<INFSDropDownData>;
    this._FCMasterDataService.FPCampaignCol[this.PROPOSALINFO.controls.BPINTRODUCERID.value]?.forEach((item: any) => {
      let object = this._masterDataService.FinancialProductGroupbyCompany.filter((p: any) => p.code == item?.FPGROUPID)[0];
      let temp = result.filter((p: any) => p.code == object?.code);
      if (temp.length == 0) {
        result.push(object);
      }
    })
    this.FPGroupArray = result;
    if (this.PROPOSALINFO.controls.FPGROUPID.value > 0) {
      this.SetFinancialGroupCampaignConfigurations();
    }

  }

  FPGroupOnChange(event: any) {
    if (event != undefined && event.value != "") {
      if (this.fpCampaignId != 0 && this._formService.FormMode != FormMode.NEW) {
        // this.fpGroupId=this.PROPOSALINFO.controls.FPGROUPID.value;
        this.fpCampaignId = 0;
        this._messageService.showMesssage("CmpgnAsstnRmvd", MessageType.Error);
      }
      this.resetArticleEntity();
    }
  }

  FPCampaignChange(event: Event) {
    if (event != undefined) {
      if (this.fpCampaignId != 0 && this._formService.FormMode != FormMode.NEW) {
        this._messageService.showMesssage("CmpgnAsstnRmvd", MessageType.Error);
      }
      this.fpCampaignId = this.PROPOSALINFO.controls.FINANCIALPRODUCTID.value;
      this.getFPCampaginByFPId();

      this.resetArticleEntity();
      if (this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN == false && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
        this._proposaldataService.PROPOSALASSET.controls.ROLECDE.setValue(RoleCode.Dealer);
        this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(this._proposaldataService.PROPOSAL.value.BPINTRODUCERID);
        this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(this._proposaldataService.PROPOSAL.value.BPINTRODUCERNME);
      }
      else if (this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN == true && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
        this._proposaldataService.PROPOSALASSET.controls.ROLECDE.setValue(RoleCode.Supplier);
        //this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(this._proposaldataService.PROPOSAL.value.BPINTRODUCERID);
        // this._proposaldataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(this._proposaldataService.PROPOSAL.value.BPINTRODUCERNME);
      }
      else if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
        this._proposaldataService.PROPOSALASSET.controls.ROLECDE.setValue(null);
        this._proposaldataService.PROPOSALASSET.controls.BPINTRODUCERID.setValue(-1);
      }

      this._proposalService.ReadConfigurationTemplate(this.request).subscribe(result => {
        if (result.ResultSet != null && result.ResultSet != undefined)
          this._calculationService.SetProposalRentalTemplateConfiguration(this._proposaldataService.ProposalEntity, result?.ResultSet);

        // let request: PROPOSALENTITY.IProposalCommissionEntity = {} as PROPOSALENTITY.IProposalCommissionEntity;
        // request.PRPLCOMM = {} as IPRPL_COMMInfo;
        // request.PRPLCOMM.DEALERID = this._proposaldataService.PROPOSAL.value.BPINTRODUCERID;
        if ((this._proposaldataService.PROPOSAL?.controls.FINANCETYP.value == FinanceType.HirePurchase && (!this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value)) || (this._proposaldataService.PROPOSAL?.controls.FINANCETYP.value == FinanceType.HirePurchase && this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value && !(this._proposaldataService.PROPOSAL.controls.MCOMDEALER.value))) {

          let request = this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0];
          this._proposalService.ReadCommissionConfiguration(request).subscribe(response => {
            // console.log(response);
            //this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY, DataRowState.Removed);
            let commission = this._ProposalEntityFormService.PropsalCommissionForm();
            if (this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0) {
              this._proposalMapperService.ProposalCommissionEntityMapper(commission, response.ResultSet)
              this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(commission);
              this._FormState.ResetFormState(this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0], DataRowState.Added);
            }
            else {
              let OJKEFFECTIVEDATE = this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].value.PRPLCOMM.OJKCOMMISSIONEFFECTIVEDTE;
              this._proposalMapperService.ProposalCommissionEntityMapper(this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0], response.ResultSet);
              this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.OJKCOMMISSIONEFFECTIVEDTE.setValue(OJKEFFECTIVEDATE);
              this._FormState.ResetFormState(this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0], DataRowState.Added);
            }
            this._proposalService.GetSubsidaryCompanyLookupByCompanyID().subscribe(response => {
              if (response) {
                if (this._proposaldataService.ASSETENTITY.value != null
                  && this._proposaldataService.ASSETENTITY.value.PROPOSALASSET != null
                  && this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
                  && this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
                  && this._proposaldataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null) {
                  let dte = new Date(response.ResultSet[0].OJKCOMMEFFECTIVEDTE) as Control<Date>;
                  this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.OJKCOMMISSIONEFFECTIVEDTE.patchValue(dte);
                  //Controller.ISCOMMINCLUDETOPO = result1.ResultSet.FirstOrDefault().COMMRECEIVEDBYDEALER;
                }
              }
            });

          })
        }
      });


      this._proposalService.GetIncomeConfiguration(this.configRequest).pipe(takeUntil(this.subscription$)).subscribe(result => {
        this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.FINEYPECNFG, DataRowState.Removed);
        this._proposalMapperService.FINEYPECNFGMapper(this._proposaldataService.ASSETENTITY.controls.FINEYPECNFG, result?.ResultSet as Array<IFINE_TYPE_INCM_CNFGInfo>);
      });
      // set financial max and min terms on FP selection
      let temp = this._FCMasterDataService.FPCampaignCol[this.PROPOSALINFO.controls.BPINTRODUCERID.value]?.filter((f: any) => f.FPGROUPID == this.PROPOSALINFO.controls.FPGROUPID.value
        && f.BRANCHID == this.PROPOSALINFO.controls.BPCOMPANYBRANCHID.value && f.FINANCIALPRODUCTID == this.PROPOSALINFO.controls.FINANCIALPRODUCTID.value);
      if (temp != null && temp.length > 0) {
        this._proposalmanagerService.ContractMinTerms = temp[0].MINTERMS;
        this._proposalmanagerService.ContractMaxTerms = temp[0].MAXTERMS;
      }
      // let request: PROPOSALENTITY.IProposalCommissionEntity = {} as PROPOSALENTITY.IProposalCommissionEntity;
      // request.PRPLCOMM = {} as IPRPL_COMMInfo;
      // request.PRPLCOMM.DEALERID = this._proposaldataService.PROPOSAL.value.BPINTRODUCERID;
      // this._proposalService.ReadCommissionConfiguration(request).subscribe(response => {
      //   console.log(response);
      //   this._FormState.ResetFormArrayState(this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY, DataRowState.Removed);
      //   let commission = this._ProposalEntityFormService.PropsalCommissionForm();
      //   this._proposalMapperService.ProposalCommissionEntityMapper(commission, response.ResultSet)
      //   this._proposaldataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(commission)
      // })


      /*Old Cap=> ProposalManager => CreateAssetObject() => Line# 7427*/
      if (this.storageService.GetUserInfo()?.IsOTO && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase && !this._proposaldataService.PROPOSAL.value.MCOMDEALER)
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(true);
      else
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(false);

      //#region DealerPercentage
      if (this.PROPOSALINFO.value.BPINTRODUCERID > 0 && this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
        this._calculationService.MAXDEALERCOMMPCT();
      }
    }
    //If Lead Type Refinance Or OL 
    if (this.storageService.GetUserInfo()?.IsOTO && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase && !this._proposaldataService.PROPOSAL.value.MCOMDEALER)
      {
        this.PROPOSALINFO.controls.COMMAPPLICABLECDE.setValue("00001");
        this.isCommissionApplicable = false;        
      }else{
        this.PROPOSALINFO.controls.COMMAPPLICABLECDE.setValue('');
        this.isCommissionApplicable = true;
      }
  }

  DealerOnChange(event: Event) {
    // console.log("event on Dealer Change: ");
    // console.log(event);
    if (event != undefined) {
      this.resetArticleEntity();
    }
  }

  BranchOnChange(event: Event) {
    if (event != undefined) {
      this.resetArticleEntity();
    }
  }

  resetArticleEntity() {
    this._calculationService.ResetCampaignAndAssetData();
    this.ResetFinancialDetails.emit();
  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
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
