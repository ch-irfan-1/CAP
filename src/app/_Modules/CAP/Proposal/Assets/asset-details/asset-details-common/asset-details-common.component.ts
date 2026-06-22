import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { InsuranceMasterDataService } from '@NFS_Core/NFSServices/MasterData/insurance-master-data.service';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { ApplicationTypeService } from '@NFS_Core/NFSServices/_helper/application-type.service';
import { GeneralService } from '@NFS_Core/NFSServices/_helper/general.service';
import {
  IProposalRoundingTemplateEntity,
  IPRPL_FINL_AGRMInfo,
  IPRPL_TPLE_COMM_CNFGInfo,
  IPRPL_TPLE_RNTL_INTInfo
} from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import {
  IPRPL_APLT_ADDSInfo
} from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import {
  IAssetEntity,
  IPRPL_ASETInfo
} from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { AssetCondition } from '@NFS_Enums/BPKBStatus.enum';
import { CalculateRVBasedOn } from '@NFS_Enums/CalculateRVBasedOn.enum';
import { ChargeTypes } from '@NFS_Enums/ChargeTypes.enum';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FinancialComponentsOperations } from '@NFS_Enums/FinancialComponentsOperations';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { RentalMode } from '@NFS_Enums/RentalMode';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { ICalculationInfoParam } from '@NFS_Interfaces/RequestInterfaces/ICalculationInfoParam';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { CalculationService } from '@NFS_Modules/CAP/CAPServices/calculation.service';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { AccessoriesComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/accessories/accessories.component';
import { ApplicationChangesComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/application-changes/application-changes.component';
import { ArticleComponentConfigurationComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/article-component-configuration/article-component-configuration.component';
import { BBNChargesComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/bbn-charges/bbn-charges.component';
import { CommissionSchemeConfigurationsComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/commission-scheme-configurations/commission-scheme-configurations.component';
import { DealerPOAmountComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/dealer-po-amount/dealer-po-amount.component';
import { FiduciaFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/fiducia-fee/fiducia-fee.component';
import { InsuranceCommissionOTOComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/insurance-commission-oto/insurance-commission-oto.component';
import { InsurancePremiumComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/insurance-premium/insurance-premium.component';
import { InterestRateComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/interest-rate/interest-rate.component';
import { NetFinancedAmountComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/net-financed-amount/net-financed-amount.component';
import { NMSIRComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/nmsir/nmsir.component';
import { OJKInsuranceCommissionComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/ojk-insurance-commission/ojk-insurance-commission.component';
import { PolicyFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/policy-fee/policy-fee.component';
import { ProvisionFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/provision-fee/provision-fee.component';
import { StructuredComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/structured/structured.component';
import { TotalAcquisitionIncomeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-acquisition-income/total-acquisition-income.component';
import { TotalAdminFeeComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-admin-fee/total-admin-fee.component';
import { TotalFirstPaymentComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-first-payment/total-first-payment.component';
import { TotalGPInterestAmountComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-gp-interest-amount/total-gp-interest-amount.component';
import { TotalSecurityDepositComponent } from '@NFS_Modules/CAP/Proposal/Assets/asset-details/total-security-deposit/total-security-deposit.component';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormGroup } from 'src/Library';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { RepaymentPlanComponent } from '../repayment-plan/repayment-plan.component';
import { TotalSubsidyAmountComponent } from '../total-subsidy-amount/total-subsidy-amount.component';
import { OldContractComponent } from '../old-contract/old-contract.component';

@Component({
    selector: 'asset-details-common',
    templateUrl: './asset-details-common.component.html',
    styleUrls: ['./asset-details-common.component.css'],
    standalone: false
})
export class AssetDetailsCommonComponent implements OnInit, OnDestroy {
  @Input() ComponentName!: string;
  @Output() assetDetailsFlagEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  noOfMonthDelay: any = [
    { code: '1', TextValue: '1' },
    { code: '2', TextValue: '2' },
    { code: '3', TextValue: '3' },
  ];
  PROPOSALFINANCIALAGREEMENT!: FormGroup<IPRPL_FINL_AGRMInfo>;
  commissionFlag: Boolean = false;
  commissionDistributionFlag: Boolean = false;
  PROPOSALASSET!: FormGroup<IPRPL_ASETInfo>;
  BKBPOwbershipFilter: boolean = true;
  CalculationParam = {} as ICalculationInfoParam;
  private subscription$ = new Subject();
  EnabledForCF = false;
  isRealDownPaymentDisabled: boolean = true;
  isCF: boolean = true;
  isRF: boolean = this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance ? true : false;
  isAdvanceMode: boolean = true;
  isInterestRateEffEnable: boolean = this._proposaldataService.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.value;
  isInterestRateFlatEnable: boolean = false;
  isOTO: boolean = this._storageService.GetUserInfo()?.IsOTO;
  isStructureRentalsEnabled:boolean=this._proposaldataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.STRUCTUREDRENTALIND.value;

  get isViewBPKPOwnershipEnabled() {
    if (this._formModeService.FormMode == FormMode.VIEW) {
      return true
    }
    else
      return false
  }

  constructor(
    private dialog: MatDialog,
    public _proposaldataService: ProposalDataService,
    private _proposalService: ProposalService,
    public _masterDataService: MasterDataService,
    public _proposalManagerService: ProposalManagerService,
    public _calculationService: CalculationService,
    public _financialClubMasterDataService: FinancialClubMasterDataService,
    private _messageService: MessageService,
    private _formatter: FormatterService,
    private _formService: FormModeService,
    private appTypeService: ApplicationTypeService,
    private _storageService: ClientStoreService,
    private _formModeService: FormModeService,
    private _insMasterData: InsuranceMasterDataService,
    public _generalService: GeneralService
  ) { }

  ngOnInit(): void {

    this.PROPOSALFINANCIALAGREEMENT =
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT;
    this._calculationService.setHelperValues();
    this.PROPOSALASSET = this._proposaldataService.PROPOSALASSET;

    this.valueChangeSubscriptions();

    if (this._storageService.GetUserInfo()?.IsOTO == true) {

      if (this._formService.FormMode !== FormMode.VIEW &&
        this._proposaldataService.PROPOSAL.controls.FINANCETYP.value === FinanceType.HirePurchase &&
        this._proposaldataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value === false) {
        this.isRealDownPaymentDisabled = false;
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(true);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPOACTIVEIND.setValue(false);
      }
    }
    else {
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPOACTIVEIND.setValue(true);
    }
    if (this._formService.FormMode !== FormMode.VIEW &&
      this._proposaldataService.PROPOSAL.value != null &&
      this._proposaldataService.PROPOSAL.value.ISMCOMCAMPAIGN == true) {
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(false);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPOACTIVEIND.setValue(false);
    }
    if (this._proposaldataService.PROPOSAL.value.FINANCETYP != null && this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      this._calculationService.DisableForRF(false);
    }

    if (this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._proposaldataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease)
      this.EnabledForCF = true;

    if (this.PROPOSALASSET.controls.BBNCHARGES.value != 0) {
      this.BKBPOwbershipFilter = false
    }

    if (this._proposalManagerService.ISCFNONMCOMIND) {
      this.isCF = false;
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.PROPOSALID == 0 || this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.PROPOSALID == null) {
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSTALMENTPAYTOINTRODUCER.setValue(false);
        if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTINDVALUECHANGED.value == false)
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.setValue(true);
      }
      else {
        if (this._proposalManagerService.ISCFNONMCOMIND && this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP !== RentalMode.ADVANCE)
          this.isAdvanceMode = false;
      }
      //this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.setValue(true);
    }
    else {
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.setValue(false);
    }
    // if (this.PROPOSALASSET.controls.BBNAGENTID.value > 0){
    //   this.isBBNChargesDisabled = false;
    // }
    // else{
    //   this.isBBNChargesDisabled = true;
    // }

    if (this.PROPOSALASSET.controls.BPKBCHANGEOWNERSHIPIND.value) {
      this.BKBPOwbershipFilter = false;
    }

    if (this._formModeService.FormMode != FormMode.VIEW && this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.Refinance) {
      if (this._proposalManagerService.isFlat && this._proposaldataService.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.value) {
        this.isInterestRateEffEnable = false;
        this.isInterestRateFlatEnable = true;
      }
      else if (this._proposalManagerService.isEffective && this._proposaldataService.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.value) {
        this.isInterestRateEffEnable = true;
        this.isInterestRateFlatEnable = false;
      }
    }

    if (this._proposaldataService.PROPOSAL.controls.MCOMTOPUPIND.value) {
      this.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.setValue(0);
    }
    if (this._proposalManagerService.assetConditionChanged && this.PROPOSALASSET.controls.CONDITION.value === AssetCondition.New) {
      this.PROPOSALASSET.controls.BPKBCHANGEOWNERSHIPIND.setValue(false);
      this.BPKBOwnershipCheckChange();
      this._proposalManagerService.assetConditionChanged = false;
    }

    this.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(value => {
      this.downPaymentChange(value, 'CASHDEPOSITPCT');
    });

    this.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(value => {
      this.downPaymentChange(value, 'CASHDEPOSITAMT');
    });

  }

  ngOnDestroy(): void {
    this.subscription$.next(true);
    this.subscription$.complete();
  }

  get isBBNChargesDisabled() {
    if (this.PROPOSALASSET.controls.BBNAGENTID.value > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  closeCommissionType() {
    this.commissionFlag = true;
  }

  onClickChangeBKBPownership() {
    this.BPKBOwnershipCheckChange();
  }

  BPKBOwnershipCheckChange() {
    if (this.PROPOSALASSET.controls.BPKBCHANGEOWNERSHIPIND.value) {
      this.BKBPOwbershipFilter = false;
    }
    else {
      this.BKBPOwbershipFilter = true;
      this.PROPOSALASSET.controls.BBNAGENTID.setValue(0);
      this.PROPOSALASSET.controls.BBNCHARGES.setValue(0);
      this._calculationService.RemoveArticleComponent(AmountComponent.BBNCharge);
      this._calculationService.ResetRentalDetail();
    }
  }

  get ArticleComponentInd() {
    if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.Refinance && this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.OperatingLease)
      return false;
    return true;
  }

  openInterestRate() {
    const dialogRef = this.dialog.open(InterestRateComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 1234567 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openApplicationCharges() {
    const dialogRef = this.dialog.open(ApplicationChangesComponent, {
      width: '90%',
      height: '90%',
      // position: { right: '1px', top: '1px' },
      disableClose: true,
      data: { id: 1112 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }

      let isDisburseAmountValid = false;
      isDisburseAmountValid = this._calculationService.CalculateDisburseAmountOTO();
      if (isDisburseAmountValid == false)
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.setValue(0);
      this.CreateChargesAgreementDetail();
      this._calculationService.UpdateCalculatedFields();

    });
  }

  public CreateChargesAgreementDetail() {
    this._calculationService.RemoveArticleComponent(AmountComponent.ContractFinancedCharges);
    let TotalFinancedCharges = 0;
    let upfrontCharges = 0;
    this._proposaldataService.PROPOSALCHARGE.controls.forEach(p => {
      if (p.controls.PRPLCHRG.controls.FINANCEDIND.value == "T" && p.controls.PRPLCHRG.controls.RowState.value !== DataRowState.Removed)
        TotalFinancedCharges += p.controls.TAXINCULSIVEAMT.value;
      else if(p.controls.PRPLCHRG.controls.FINANCEDIND.value != "T" && p.controls.PRPLCHRG.controls.RowState.value !== DataRowState.Removed)
        upfrontCharges += p.controls.TAXINCULSIVEAMT.value;
    });
    this._calculationService.UpdateFinancialAgreementDetail(TotalFinancedCharges, AmountComponent.ContractFinancedCharges, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, AssetComponentsFinancialConfiguration.Finance, null);

    //await FillArticleTranTax(AmountComponent.ContractFinancedCharges, FinancedChargesVATAmt, FinancedChargesWHTAmt);

    this._calculationService.RemoveArticleComponent(AmountComponent.ApplicationUpfrontCharges);
    this._calculationService.UpdateFinancialAgreementDetail(upfrontCharges, AmountComponent.ApplicationUpfrontCharges, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, null, null);

    //await FillArticleTranTax(AmountComponent.ApplicationUpfrontCharges, NonFinancedChargesVATAmt, NonFinancedChargesWHTAmt);

    return true;
  }

  openInsurancePremium() {
    if (this._formService.FormMode != FormMode.VIEW && this._proposaldataService.PROPOSALVEHICLEDETAIL.controls.CITYOFREGISTRATIONOTO.value <= 0) {
      this._messageService.showMesssage("msgCityofRegisteration", MessageType.Info);
    }
    else {
      const dialogRef = this.dialog.open(InsurancePremiumComponent, {
        width: '90%',
        height: '90%',
        // position: { right: '1px', top: '1px' },
        disableClose: true,
        data: { id: 1112 },
      });

      dialogRef.afterClosed().subscribe((result) => {
        //console.log("session closed");
        if (result != undefined) {
        }
      });
    }
  }

  openCommission() {
    this.commissionFlag = true;
    this._generalService.FormMode = FormMode.VIEW;
    //this.assetDetailsFlagEvent.emit(true);


    // const dialogRef = this.dialog.open(CommissionComponent, {
    //   width: '850px',
    //   height: '100%',
    //   position: { right: '1px', top: '1px' },
    //   panelClass: 'cdk-overlay-pane-custom',
    //   disableClose: true,
    //   data: { id: 113 },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   //console.log("session closed");
    //   if (result != undefined) {
    //   }
    // });
  }

  childOutput(event: any) {
    this.commissionFlag = false;
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
  }

  assetCommonOutput(event: any) {
    this.commissionDistributionFlag = false;
  }

  openNetFinancedAmount() {
    const dialogRef = this.dialog.open(NetFinancedAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 1234 ,isOldContract:false},
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  openOldContractBreakupComonent() {
    const dialogRef = this.dialog.open(OldContractComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,

    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  openRepaymentPlan() {
    const dialogRef = this.dialog.open(RepaymentPlanComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  // added by Qasim
  openFiduciaFee() {
    if (this.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value == 0) {
      return
    }
    else {
      const dialogRef = this.dialog.open(FiduciaFeeComponent, {
        width: '850px',
        height: '100%',
        position: { right: '1px', top: '1px' },
        panelClass: 'cdk-overlay-pane-custom',
        disableClose: true,
        data: { id: 201 },
      });
      dialogRef.afterClosed().subscribe((result) => {
        //console.log("session closed");
        if (result != undefined) {
        }
      });
    }
  }

  openBBNChanges() {
    if (this.PROPOSALASSET.controls.BBNCHARGES.value == 0) {
      return
    }
    else {
      const dialogRef = this.dialog.open(BBNChargesComponent, {
        width: '850px',
        height: '100%',
        position: { right: '1px', top: '1px' },
        panelClass: 'cdk-overlay-pane-custom',
        disableClose: true,
        data: { id: 202 },
      });

      dialogRef.afterClosed().subscribe((result) => {
        //console.log("session closed");
        if (result != undefined) {
        }
      });
    }
  }

  openInsuranceCommissionOTO() {
    const dialogRef = this.dialog.open(InsuranceCommissionOTOComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 203 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalFirstPayment() {
    const dialogRef = this.dialog.open(TotalFirstPaymentComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 205 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openStructured() {
    if (!this._calculationService.IsProposalDataValid(false, false))
      return;

    const dialogRef = this.dialog.open(StructuredComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 204 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._calculationService.CalculateFirstPayment();
      if (result != undefined) {


      }
    });
  }

  openArticleComponentConfiguration() {
    this._insMasterData.getarticleComponentLookups().pipe(takeUntil(this.subscription$)).subscribe(a => {
      this._insMasterData.InitializeAssetDetailMasterData(a);
      const dialogRef = this.dialog.open(ArticleComponentConfigurationComponent, {
        width: '850px',
        height: '100%',
        position: { right: '1px', top: '1px' },
        panelClass: 'cdk-overlay-pane-custom',
        disableClose: true,
        data: { id: 205 },
      });

      dialogRef.afterClosed().subscribe((result) => {
        //console.log("session closed");
        if (result != undefined) {
        }
      });
    });

  }

  openNMSIR() {
    const dialogRef = this.dialog.open(NMSIRComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 206 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalAcquisitionAmount() {
    const dialogRef = this.dialog.open(TotalAcquisitionIncomeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 207 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalAdminFee() {
    const dialogRef = this.dialog.open(TotalAdminFeeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 208 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._calculationService.UpdateAdminFeeFields()
      if (result != undefined) {
      }
    });
  }

  openDealerPOAmount() {
    const dialogRef = this.dialog.open(DealerPOAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 209 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openProvisionFee() {
    if (this.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT > 0) {
      const dialogRef = this.dialog.open(ProvisionFeeComponent, {
        width: '850px',
        height: '100%',
        position: { right: '1px', top: '1px' },
        panelClass: 'cdk-overlay-pane-custom',
        disableClose: true,
        data: { id: 210 },
      });

      dialogRef.afterClosed().subscribe((result) => {
        //console.log("session closed");
        if (result != undefined) {
        }
      });
    }
    else {
      this._messageService.showMesssage("totCostGretZero", MessageType.Error)
    }
  }

  openTotalGPAmount() {
    const dialogRef = this.dialog.open(TotalGPInterestAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 210 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openTotalSecurityDeposit() {
    const dialogRef = this.dialog.open(TotalSecurityDepositComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 211 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openCommissionSchemeConfigurations() {
    const dialogRef = this.dialog.open(
      CommissionSchemeConfigurationsComponent,
      {
        width: '850px',
        height: '100%',
        position: { right: '1px', top: '1px' },
        panelClass: 'cdk-overlay-pane-custom',
        disableClose: true,
        data: { id: 212 },
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openCommissionDistribution() {
    this._generalService.IsMarketingCommission = false;
    this._generalService.FormMode = FormMode.VIEW;
    this.commissionDistributionFlag = true;
    //     const dialogRef = this.dialog.open(CommissionDistributionComponent, {
    //       width: '95vw',
    //       height: '92%',
    //       maxWidth: '95vw',
    //       position: { right: '2vw', top: '3vh' },
    // panelClass: 'cdk-overlay-pane-custom',
    //       disableClose: true,
    //       data: { id: 213, isSOFComm: true },
    //     });

    //     dialogRef.afterClosed().subscribe((result) => {
    //       //console.log("session closed");
    //       if (result != undefined) {
    //       }
    //     });
  }

  openPolicyFee() {
    const dialogRef = this.dialog.open(PolicyFeeComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 214 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  openOJKInsuranceCommission() {
    const dialogRef = this.dialog.open(OJKInsuranceCommissionComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { id: 215 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }
  openAccessories() {
    const dialogRef = this.dialog.open(AccessoriesComponent, {
      width: '90%',
      height: '90%',
      // position: { right: '1px', top: '1px' },
      disableClose: true,
      data: { id: 1112 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      let SumOfAccyWithoutVAT = 0;
      //console.log("session closed");
      if (
        result != undefined &&
        typeof result == 'object' &&
        result.OptionalAccessories &&
        result.OptionalAccessories.length > 0
      ) {
        this._proposaldataService.PROPOSALACCESSORY.clear();
        result.OptionalAccessories.controls.forEach((ele: any) => {
          this._proposaldataService.PROPOSALACCESSORY.push(ele);
        });

        result.OptionalAccessories.value.filter((p: any) => p.RowState !== DataRowState.Removed).forEach((ele: any) => {
          SumOfAccyWithoutVAT += ele.EXCLUSIVEAMT;
        });

        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ACCYWITHOUTVAT.setValue(SumOfAccyWithoutVAT);
        if (result.TotalAmount) {
          this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ACCESSORYAMT.setValue(
            result.TotalAmount
          );
        }
        this.UpdateFincialAgreementAccessoryInfo();
      }
    });
  }

  UpdateFincialAgreementAccessoryInfo() {

    this._calculationService.RemoveArticleComponent(
      AmountComponent.AccessoriesCost
    );
    let totalAccessoriesAmount = this._proposaldataService.PROPOSALACCESSORY.value.filter(p => p.RowState !== DataRowState.Removed).reduce(function (tot, record) {
      return tot + record.ACCESSORYAMT;
    }, 0);
    let vatAmount = this._proposaldataService.PROPOSALACCESSORY.value.filter(p => p.RowState !== DataRowState.Removed).reduce(function (tot, record) {
      return tot + record.VATAMT;
    }, 0);
    this._calculationService.UpdateFinancialAgreementDetail(
      totalAccessoriesAmount,
      AmountComponent.AccessoriesCost,
      this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value,
      AssetComponentsFinancialConfiguration.Finance,
      null
    );
    this._calculationService.FillArticleTranTax2(AmountComponent.AccessoriesCost, vatAmount);
  }

  valueChangeSubscriptions() {

    // this.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.valueChanges
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {

    //     this.assetAmountonChange(val);
    //   })

    // this.PROPOSALASSET.controls.BBNAGENTID.valueChanges.pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {
    //     if (val != 0) {
    //       this.isBBNChargesDisabled = false
    //     }
    //     else {
    //       this.isBBNChargesDisabled = true
    //       this.PROPOSALASSET.controls.BBNCHARGES.setValue(0);
    //     }
    //   })

    // this.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.valueChanges
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {

    //   })
    //******************************************************************* */

    // this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.valueChanges
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {
    //     //this._calculationService.UpdateFinancialAgreementDetail(this._proposalManagerService.TotalFinancedCharges, AmountComponent.ContractFinancedCharges, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, AssetComponentsFinancialConfiguration.Finance, null);
    //   });

    // this.PROPOSALFINANCIALAGREEMENT.controls.ACCESSORYAMT.valueChanges
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {
    //     this._calculationService.RemoveArticleComponent(
    //       AmountComponent.AccessoriesCost
    //     );
    //     let totalAccessoriesAmount = this._proposaldataService.PROPOSALACCESSORY.value.reduce(function (tot, record) {
    //       return tot + record.EXCLUSIVEAMT;
    //     }, 0);
    //     let vatAmount = this._proposaldataService.PROPOSALACCESSORY.value.reduce(function (tot, record) {
    //       return tot + record.VATAMT;
    //     }, 0);
    //     this._calculationService.UpdateFinancialAgreementDetail(
    //       totalAccessoriesAmount,
    //       AmountComponent.AccessoriesCost,
    //       this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value,
    //       AssetComponentsFinancialConfiguration.Finance,
    //       null
    //     );
    //     this._calculationService.FillArticleTranTax2(AmountComponent.AccessoriesCost, vatAmount);
    //   });

    // this.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.valueChanges
    //   .pipe(takeUntil(this.subscription$))
    //   .subscribe((val) => {
    //     this._calculationService.RemoveArticleComponent(
    //       AmountComponent.ChargesAmort
    //     );
    //     this._calculationService.UpdateFinancialAgreementDetail(
    //       this._proposalManagerService.TotalFinancedCharges,
    //       AmountComponent.ChargesAmort,
    //       this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value,
    //       AssetComponentsFinancialConfiguration.Finance,
    //       null
    //     );
    //   });

    this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.valueChanges
      .pipe(takeUntil(this.subscription$))
      .subscribe((val) => {

        if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
          if ((this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.value + this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.value) > this.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value) {
            //this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.setValue(0);
            // Message.InfoMessage("msgSumOfDiscAndVATOnAssetCostCanntGrtrMessage");
          }
          this._calculationService.RemoveArticleComponent(AmountComponent.Discount);
          this._calculationService.UpdateFinancialAgreementDetail(this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.value, AmountComponent.Discount, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, null, null);
          //this._calculationService.ResetRentalDetail(); // this line is moved to discountOnChange()
          // EnableCalculateButton();
        }
      });

    // this.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
    //   //if(val <= this._calculationService.Configurations.controls.RESIDUALAMT.value)
    //   this._calculationService.CalculateResidualValue(this.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Fixed);
    //   // else
    //   //this._messageService.showCustomMesssage('RV amount cannot be greater than '+ this._calculationService.Configurations.controls.RESIDUALAMT.value)
    // });

    // this.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.valueChanges.pipe(distinctUntilChanged()).subscribe(val => {
    //   if (val <= this._calculationService.Configurations.controls.MAXRESIDUALPCT.value && val >= this._calculationService.Configurations.controls.MINRESIDUALPCT.value)
    //     this._calculationService.CalculateResidualValue(this.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
    //   else {
    //     this.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(0);
    //     this._calculationService.CalculateResidualValue(this.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
    //   }
    //   //this._messageService.showCustomMesssage('RV % should be in between '+ this._calculationService.Configurations.controls.MINRESIDUALPCT.value + ' & ' + this._calculationService.Configurations.controls.MAXRESIDUALPCT.value)
    // });

    this.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.subscription$)).subscribe(val => {
      this._calculationService.FirstPaymentConfig();
      if (this.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value > 0) {
        this._calculationService.CalculateReceiveableTax(AmountComponent.PolicyFee, this.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value, ChargeTypes.GetStringValue(ChargeTypes.PolicyFee));
      }
    });

    this.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.valueChanges
      .pipe(takeUntil(this.subscription$)).subscribe((val) => {
        this._calculationService.FirstPaymentConfig();
        this._calculationService.ResetRentalDetail();

        if (this.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value > 0) {
          this._calculationService.CalculateReceiveableTax(AmountComponent.FiduciaFee, this.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value, ChargeTypes.GetStringValue(ChargeTypes.FiduciaFee));
        }
      });

    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      let isDisburseAmountValid = false;
      if (value == 0) {
        isDisburseAmountValid = this._calculationService.CalculateDisburseAmountOTO(0, 0, true);
      }
      else {
        isDisburseAmountValid = this._calculationService.CalculateDisburseAmountOTO();
      }
      if (isDisburseAmountValid == false)
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.setValue(0);
      this._calculationService.UpdateCalculatedFields();
    });


    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALMODETYP.valueChanges.pipe(takeUntil(this.subscription$)).subscribe(value => {
      if (this._proposalManagerService.ISCFNONMCOMIND && value !== RentalMode.ADVANCE)
        this.isAdvanceMode = false;
      else
        this.isAdvanceMode = true;
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INSTALMENTPAYTOINTRODUCER.setValue(false);
    });

  }

  CalculateRV(event: any, field: string) {
    this._calculationService.ResetRentalDetail();
    if (field == 'RESIDUALAMT') {
      this.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.setValue(this._formatter.FormatCurrencyToNumber(String(event)))
      this._calculationService.CalculateResidualValue(this.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Fixed);
    }
    else if (field == 'RESIDUALPCT') {
      this.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(this._formatter.FormatCurrencyToNumber(String(event)))
      this._calculationService.CalculateResidualValue(this.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
    }
  }

  RepaymentPlanTrigger() {
    let msg: string = '';

    if (
      !(
        this._proposaldataService.PROPOSALARTICLE != null &&
        this._proposaldataService.PROPOSALARTICLE.length > 0 &&
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT != null
      )
    )
      return;

    if (!this._calculationService.IsProposalDataValid(false, true)) {
      return;
    }

    //evt = new System.Threading.ManualResetEvent[Controller.DataContext.PROPOSALARTICLE.m_current.Count];

    //evt[0] = new System.Threading.ManualResetEvent(false);

    if (
      (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value
        .STRUCTUREDRENTALIND != null &&
        //Controller.DataContext.PROPOSALARTICLE.m_current[Controller.Helper.AssetIndex].ASSETENTITY.PROPOSALFINANCIALAGREEMENT.STRUCTUREDRENTALIND != null &&
        (this._proposaldataService.ASSETENTITY.value.PROPOSALRENTALDETAIL ==
          null ||
          this._proposaldataService.ASSETENTITY.value.PROPOSALRENTALDETAIL
            .length == 0)) ||
      this._proposalManagerService.AllowCalculationAgainstNewRental()
    ) {
      //if (Mode != FormMode.View) {
      // PRPL_APLT_ADDSInfo address = null;
      // if (Controller.SubsidiaryAddressTypeCode == BPAddressConfiguration.PayerRegisterAddress.GetStringValue())
      //   address = Controller.SubsidiaryAddress.PROPOSALAPPLICANTADDRESS;
      // else if (this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.GetStringValue()).ADDRESS.Count > 0
      //   && this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.GetStringValue()).ADDRESS.All(j => j.PROPOSALADDRESSTYPEDETAIL != null)
      //   && this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.GetStringValue()).ADDRESS.First(x => x.PROPOSALADDRESSTYPEDETAIL.Any(j => j.DEFAULTIND)) != null)
      //   address = this.Controller.DataContext.PROPOSALAPPLICANT.First(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.GetStringValue()).ADDRESS.First(x => x.PROPOSALADDRESSTYPEDETAIL.Any(j => j.DEFAULTIND)).PROPOSALAPPLICANTADDRESS;

      //-- Invoke Calculation service
      this.CalculationParam.AssetEntity = this._proposaldataService.ASSETENTITY
        .value as IAssetEntity;
      var proposalInfoParam = {} as IProposalInfoParm;
      proposalInfoParam.ApplicantType =
        this._proposaldataService.PROPOSAL.value.PROPOSALTYPECDE == '00001'
          ? 'I'
          : 'C';
      this.CalculationParam.proposalInfoParam = proposalInfoParam;
      this.CalculationParam.roundingEntity = this._proposaldataService
        .PROPOSALROUNDINGTEMPLATE.value as IProposalRoundingTemplateEntity;
      this.CalculationParam.RentalTemplateEntity = this._proposaldataService
        .PROPOSALTEMPLATERENTALINT.value as IPRPL_TPLE_RNTL_INTInfo;
      this.CalculationParam.InsuranceContractIncl =
        this._proposalManagerService.InsuranceContractInclusiveSum;
      this.CalculationParam.applicantAddress = {} as IPRPL_APLT_ADDSInfo;
      this.CalculationParam.ProposalTempCommCongfig =
        [] as Array<IPRPL_TPLE_COMM_CNFGInfo>;
      this.CalculationParam.rentalFrequency =
        this._calculationService.rentalFrequency;
      this._proposalService
        .Calculate(this.CalculationParam)
        .subscribe((result) => {
          if (
            result.CODE == ReturnCode.Success.Code &&
            result.ResultSet != null
          ) {
            this.UpdateGridView();

            this._calculationService.UpdateCalculatedFields();
            if (
              this._proposaldataService.ASSETENTITY.value
                .PROPOSALRENTALDETAIL != null &&
              this._proposaldataService.ASSETENTITY.value.PROPOSALRENTALDETAIL
                .length > 0
            ) {
              this.openRepaymentPlan();
            }
          }
        });
      //}
    } else {
      //evt[0].Set();
    }

    if (
      this._proposaldataService.ASSETENTITY.value.PROPOSALRENTALDETAIL !=
      null &&
      this._proposaldataService.ASSETENTITY.value.PROPOSALRENTALDETAIL.length >
      0
    ) {
      this.openRepaymentPlan();
    }
  }

  private UpdateGridView() {
    // dgRentalDetail.ItemsSource = null;
    // dgRentalDetail.ItemsSource = Controller.CurrentAssetRentalDetailNew;
    // txtFiduciaFee.IsEnabled = Controller.EnabledForCF;
  }

  assetAmountonChange(eventt: Event | any) {
    //this._calculationService.ResetRentalDetail();
    this._calculationService.assetAmountonChange(eventt);
  }

  downPaymentChange(event: any, field: string) {
    this._calculationService.downPaymentChange(event, field);
  }

  SetDownpayment() {
    if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.Refinance) {
      this._calculationService.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.value) {
        this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, null, null, 1, AmountClassification.Receivable, true);
        this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, null, null, 1, AmountClassification.Nettingoff, true);
      }
      else {
        this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, null, null, 1, AmountClassification.Receivable, false);
      }
    }
  }
  public discountOnChange(event: Event) {
    this._calculationService.ResetRentalDetail();
    if (this._formatter.FormatCurrencyToNumber(String(event)) == null || String(event) == "")
      this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.setValue(0);

    this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.setValue(this._formatter.FormatCurrencyToNumber(String(event)));

    if (this._proposaldataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
      if (this._formatter.FormatCurrencyToNumber(String(event)) + this.PROPOSALFINANCIALAGREEMENT.value.VATONASSETCOST > this.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT) {
        this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.setValue(0);
        this._messageService.showMesssage('msgSumOfDiscAndVATOnAssetCostCanntGrtrMessage', MessageType.Error)
      }
    }
    this._calculationService.RemoveArticleComponent(AmountComponent.Discount);
    this._calculationService.UpdateFinancialAgreementDetail(
      this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.value,
      AmountComponent.Discount,
      this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value,
      AssetComponentsFinancialConfiguration.Finance,
      null
    );
    this.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
  }
  // public maintenanceCostOnChange(event:Event){
  //   this._calculationService.ResetRentalDetail();
  // }
  public interestRateOnChange(event: Event) {

    let interestRate = this._formatter.FormatCurrencyToNumber(String(event));

    this.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(interestRate);

    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INTERESTOVERRIDEIND.setValue(true);
    this._calculationService.ResetRentalDetail();
    if (!this._proposalManagerService.isFlatAppliedCustomerSet)
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.INTERESTOVERRIDEIND.setValue(true);

    if (this._proposaldataService.ASSETENTITY.value.PROPOSALARTICLEBASERATE != null && this._proposaldataService.ASSETENTITY.value.PROPOSALARTICLEBASERATE.length > 0) {

      //PRPL_ARTE_BASE_RATEInfo prplartebaserate = Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PROPOSALARTICLEBASERATE.Last(p => p.EFFECTIVEDATE == Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PROPOSALARTICLEBASERATE.Max(q => q.EFFECTIVEDATE));

      let index = 0;
      let maxEffectiveDate = null as any;
      this._proposaldataService.ASSETENTITY.value.PROPOSALARTICLEBASERATE.forEach((item, i) => {

        if (item.RowState != DataRowState.Removed) {
          if (maxEffectiveDate == undefined || maxEffectiveDate == null) {
            maxEffectiveDate = new Date(item.EFFECTIVEDATE);
            index = i;
          }
          else {
            if (maxEffectiveDate < new Date(item.EFFECTIVEDATE)) {
              maxEffectiveDate = new Date(item.EFFECTIVEDATE);
              index = i;
            }
          }
        }
      })

      if (this._proposaldataService.ASSETENTITY.value.PROPOSALARTICLEBASERATE != null) {
        //Controller.DataContext.PROPOSAL.FINANCETYP == FinanceType.Refinance.GetStringValue() &&
        if (this._proposaldataService.ASSETENTITY.value.PROPOSALARTICLEBASERATE[index].APPLIEDCUSTOMERRTE != this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTE) {
          if (this._proposalManagerService.isFlat) {
            this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.APPLIEDCUSTOMERRTE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTECALCULATED);
            this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.INTERESTRTE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTECALCULATED);
          }
          else {
            this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.APPLIEDCUSTOMERRTE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTE);
            this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.INTERESTRTE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTE);
          }
          if (this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.RowState.value != DataRowState.Added)
            this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.RowState.setValue(DataRowState.Updated);
          //property change will be notified and margin will be recalculated
          //prplartebaserate.OVERDUEINTERESTRTE = CalcODIRate(DataContext.FINANCIALAGREEMENT.FINLAGRM.APPLIEDCUSTOMERRTE);

        }
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CUSTOMERMARGINRTE.setValue(this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.INTERESTRTE.value - this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.BASERATE.value);
        this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.CUSTOMERMARGINRTE.setValue(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CUSTOMERMARGINRTE.value);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CUSTOMERMARGINPCT.setValue(this._proposaldataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[index].controls.CUSTOMERMARGINPCT.value);
      }
    }
  }
  public tradeinAmountOnChange(event: Event) {
    if (event != undefined) {
      let _tradeInAmount = Number(event);
      if (_tradeInAmount >= this.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT) {
        this.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.setValue(0);
        this.PROPOSALFINANCIALAGREEMENT.controls.TOTALCOST.setValue((this.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT - this.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.value) + this.PROPOSALFINANCIALAGREEMENT.controls.ONROADCOSTAMT.value);
        this._calculationService.RemoveArticleComponent(AmountComponent.TradeinAmount);
        this._calculationService.CalculateNetFinanceAmt();
        this._messageService.showMesssage("TradeInAmountLessThanAssetCost", MessageType.Warning);
        return;
      }
      this._calculationService.ResetRentalDetail();
      this.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.setValue(_tradeInAmount);
      this.PROPOSALFINANCIALAGREEMENT.controls.TOTALCOST.setValue((this.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT - this.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.value) + this.PROPOSALFINANCIALAGREEMENT.controls.ONROADCOSTAMT.value);
      this._calculationService.RemoveArticleComponent(AmountComponent.TradeinAmount);
      this._calculationService.UpdateFinancialAgreementDetail(this.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.value, AmountComponent.TradeinAmount, this._proposaldataService.PROPOSAL.controls.CURRENCYCDE.value, null, null);
      this._calculationService.CalculateNetFinanceAmt();
    }
  }
  public onChangeVATOnAssetCost(event: Event) {

    this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.setValue(this._formatter.FormatCurrencyToNumber(String(event)));
    if (this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.value == null) {
      this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.setValue(0);
    }
    if (this._proposaldataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
      if ((Number(this.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.value) + Number(this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.value)) > this.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value) {
        this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.setValue(0);
        this._messageService.showMesssage("msgSumOfDiscAndVATOnAssetCostCanntGrtrMessage", MessageType.Error)//Message.InfoMessage("msgSumOfDiscAndVATOnAssetCostCanntGrtrMessage");

      }

      this._calculationService.RemoveArticleComponent(AmountComponent.AssetCost);
      this._calculationService.CreateFinlAgreementDetails();
      if (this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.value > 0) {
        this._calculationService.FillArticleTranTax2(AmountComponent.AssetCost, this.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.value);
      }
      this._calculationService.ResetRentalDetail();
      //EnableCalculateButton();
    }
  }

  openTotalSubsidyAmount() {
    const dialogRef = this.dialog.open(TotalSubsidyAmountComponent, {
      width: '850px',
      height: '100%',
      position: { right: '1px', top: '1px' },
      panelClass: 'cdk-overlay-pane-custom',
      disableClose: true,
      data: { "id": 121 },
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log("session closed");
      if (result != undefined) {
      }
    });
  }

  btnInsuranceCommissionTaxDetail_Click() {

  }

  isControlDisable(controlName: string) {
    return this.appTypeService.isControlDisable(controlName)
  }

  selectionChange_INSRCOMMAMTOTO(evnt: Event) {
    if (evnt !== undefined) {
      let amnt = Number(evnt);
      if (amnt > 0) {
        this._calculationService.CalculateTaxByComponent(AmountComponent.GetStringValue(AmountComponent.InsuranceCommission), CommissionType.GetStringValue(CommissionType.InsuranceCommission))
      }
      this._calculationService.ReCalculateOJKCommission(AmountComponent.InsuranceCommission, CommissionType.InsuranceCommission);
    }
  }

  NoOfMonthsOnChange(event: Event) {
    if (event != undefined) {
      this._calculationService.ResetRentalDetail();
    }
  }

  onChangeBBNValue(evnt: any) {
    if (evnt != undefined) {
      this.PROPOSALASSET.controls.BBNCHARGES.setValue(evnt);
      this._calculationService.UpdateFinancialAgreementDetail(this.PROPOSALASSET.controls.BBNCHARGES.value, AmountComponent.BBNCharge, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, FinancialComponentsOperations.None.toString(), this.PROPOSALASSET.controls.BBNAGENTID.value, 1, AmountClassification.Receivable);
      this._calculationService.ResetRentalDetail();

      if (this.PROPOSALASSET.controls.BBNCHARGES.value > 0) {
        this._calculationService.CalculateReceiveableTax(AmountComponent.BBNCharge, this.PROPOSALASSET.controls.BBNCHARGES.value, ChargeTypes.GetStringValue(ChargeTypes.BBNCharge));
      }
    }
    this._calculationService.CalculateDisburseAmountOTO();
  }

  onBBNAgentIdChange(evnt: any) {
    if (evnt != undefined) {
      if (evnt != undefined && evnt != null && evnt.value != 0 && evnt.value != '' && evnt.value != undefined) {
        // this.isBBNChargesDisabled = false
      }
      else {
        // this.isBBNChargesDisabled = true;
        this.PROPOSALASSET.controls.BBNAGENTID.setValue(0);
        this.PROPOSALASSET.controls.BBNCHARGES.setValue(0);
      }
    }
  }

  isInstallmentPayToDealerValuechanged(event: any) {
    if (event != undefined) {
      this._calculationService.ResetRentalDetail();
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
      this.chkDealerFirstInstalmentind_Click();
    }
  }

  chkDealerFirstInstalmentind_Click() {
    this._calculationService.RemoveArticleComponent(AmountComponent.FirstRental);
    if (this.PROPOSALFINANCIALAGREEMENT.value.INSTALMENTPAYTOINTRODUCER == true) {
      //Controller.PROPOSAL_FINANCIAL_AGRM.INSTALMENTPAYTOINTRODUCER = true;
      this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.ASSETENTITY.controls.PROPOSALREPAYMENTPLANENTITYCOL.controls[0].controls.PRPLRPMTPLAN.value.GROSSRENTAL, AmountComponent.FirstRental, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._proposaldataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Nettingoff, this.PROPOSALFINANCIALAGREEMENT.value.INSTALMENTPAYTOINTRODUCER);

    }
    else {
      //Controller.PROPOSAL_FINANCIAL_AGRM.INSTALMENTPAYTOINTRODUCER = false;
      this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.ASSETENTITY.controls.PROPOSALREPAYMENTPLANENTITYCOL.controls[0].controls.PRPLRPMTPLAN.value.GROSSRENTAL, AmountComponent.FirstRental, this._proposaldataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._proposaldataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.None, this.PROPOSALFINANCIALAGREEMENT.value.INSTALMENTPAYTOINTRODUCER);
    }
  }

  isDownpaymentPayToDealerValuechanged(event: any) {
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
    this._calculationService.CalculateFirstPayment();
    this.SetDownpayment();
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTINDVALUECHANGED.setValue(true);
  }

  isStructuredRentalsValueChanged(){
    if(this.PROPOSALFINANCIALAGREEMENT.value.ISSTRUCTUREDRENTAL==true){
      this._proposalManagerService.isCalcButtonEnabled=false;

    }
    else{
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT != null && !this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ISSTRUCTUREDRENTAL && (this._proposalManagerService.CurrentAssetRentalDetail == null ||this._proposalManagerService.CurrentAssetRentalDetail.length == 0))
      {
        this._proposalManagerService.isCalcButtonEnabled=true;
      }
    }
    this._calculationService.ResetRentalDetail();
  }

  onReadownpaymentChange(evnt: Event) {
    if (evnt !== undefined) {
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.REALDOWNPAYMENTAMT.setValue(Number(evnt));
      if (this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.REALDOWNPAYMENTAMT > this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT) {
        this._messageService.showMesssage('msgrRDPCannotGreaterAsset', MessageType.Warning);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.REALDOWNPAYMENTPCT.setValue(0);
        this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.REALDOWNPAYMENTAMT.setValue(0);
      }
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.REALDOWNPAYMENTPCT.setValue(0);
      let updateAssetCoset = this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT - this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.CASHDEPOSITAMT + this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.REALDOWNPAYMENTAMT;

      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.REALDOWNPAYMENTPCT.setValue(Number(((this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.REALDOWNPAYMENTAMT / updateAssetCoset) * 100).toFixed(2)));
    }
  }

  chkGracePeriodAllowed_valuehanged(event: Event) {

    let _totalPremAmnt = this._proposaldataService.PRPLINSR.value.TOTALFINANCEAMNT +
      this._proposaldataService.PRPLINSR.value.TOTALINSRSUBSIDYAMNT +
      this._proposaldataService.PRPLINSR.value.TOTALUPFRONTAMNT;
    if (_totalPremAmnt > 0) {
      this._messageService.showMesssage('msgReCalculateInsurance', MessageType.Warning);
    }
    //this._calculationService.ResetRentalDetail();
    this._calculationService.EnableInsuranceCalculateButton();
    if (!event) {
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPFREQUENCY.setValue(0);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPINTERESTRTEFLAT.setValue(0);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.setValue(0);
      this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALGPINTERESTAMNT.setValue(0);
    }
  }

  onJP1CommissionIncludeToPOChange(event: any) {
    this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
  }

}
