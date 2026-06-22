import { Injectable } from '@angular/core';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IProposalApplicantEntity, IProposalArticleEntity } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IAddressEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IAddressEntity.model';
import { IOTO_PRPL_APLT_FAMInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IOTO_PRPL_APLT_FAMInfo.model';
import { IPRPL_APLT_ADDSInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_ADDSInfo.model';
import { IPRPL_APLT_BANKInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_BANKInfo.model';
import { IPRPL_APLT_COMYInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_COMYInfo.model';
import { IPRPL_APLT_INDVInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/IPRPL_APLT_INDVInfo.model';
import {
  IFINE_TYPE_INCM_CNFGInfo,
  IJP1JP2RecipientEntity,
  IJP2RecipientEntity,
  IMainInsuranceEntity,
  IProposalArticleComponentEntity, IProposalCommissionEntity, IProposalRepaymentPlanEntity, IPRPL_ARTE_AMNT_TRAN_TAXInfo, IPRPL_BPKB_RPRS_DETLInfo, IPRPL_RNTL_DETLInfo, IPRPL_SBSD_DETLInfo
} from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AddressTypeCode } from '@NFS_Enums/AdressTypeCode.enum';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { AmountInputTypes } from '@NFS_Enums/AmountInputTypes.enum';
import { ApplicantRoleCode } from '@NFS_Enums/ApplicantRoleCode.enum';
import { ApplicantType } from '@NFS_Enums/ApplicantType.enum';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';
import { AssetSelection } from '@NFS_Enums/AssetSelection.enum';
import { BPLegalType } from '@NFS_Enums/BPLegalType';
import { CommissionDivisionType } from '@NFS_Enums/CommissionDivisionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { IDTypeCode } from '@NFS_Enums/IDTypeCode';
import { InsuranceCollectionTypes } from '@NFS_Enums/InsuranceCollectionTypes.enum';
import { InsurancePremiumTypes } from '@NFS_Enums/InsurancePremiumTypes.enum';
import { InsuranceType } from '@NFS_Enums/InsuranceType.enum';
import { InterestType } from '@NFS_Enums/InterestType.enum';
import { MaritalStatus } from '@NFS_Enums/MaritalStatus.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { OTO_BPKBOwnerType } from '@NFS_Enums/OTOBPKBOwnerType.enum';
import { RentalCalculationMethod } from '@NFS_Enums/RentalCalculationMethod.enum';
import { RentalType } from '@NFS_Enums/RentalType.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { SignatoryTypes } from '@NFS_Enums/SignatoryType.enum';
import { TaxInclExcl } from '@NFS_Enums/TaxInclExcl.enum';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { ProposalEntityFormService } from '@NFS_Modules/CAP/CAPServices/ProposalEntityForm.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import  moment from 'moment';
import { ProposalEntityMapperService } from '../CAPServices/proposal-entity-mapper.service';

@Injectable({
  providedIn: 'root',
})
export class ProposalManagerService {
  private totalSecurityDepositAmt = 0;
  private _FINEYPECNFG!: IFINE_TYPE_INCM_CNFGInfo;
  public isChartCall = false;
  public isFlatAppliedCustomerSet = false;
  public GPFrequency = 0;
  public TaxTypes!: any[];
  public isCalcButtonEnabled = true;
  private totalAssetCost = 0;
  private totalCashDepositAmt = 0;
  private totalCashDepositPct = 0;
  private totalNetFinancedAmt = 0;
  private totalNetFinancedPct = 0;
  private totalDownPaymentRF = 0;
  private totalDownPaymentRFPct = 0;
  private totalInterestAmount = 0;
  private totalPayableAmt = 0;
  private totalRentalAmt = 0;
  private totalTradeInAmt = 0;
  private totalFinancedCharges = 0;
  private totalOnRoadCostAmt = 0;
  public msg: Array<string> = [];
  public app_count = 0;
  public signatory_typ = ["00001", "00002", "00003"];
  private m_resubmitCalculated = true;
  private skipEngChasBPKBValidationsss!: boolean;
  private m_modulecode = "";
  private totalPremiumAmount = 0;
  //rentalFrequency!: RentalFrequency;
  public ContractMinTerms = 0;
  public ContractMaxTerms = 0;
  public chkReceiveByDealer: boolean = false;
  public ISDEFAULTPREMIUMRTECHANGED: boolean = false;
  public isProposalRequestValid: boolean = true;
  public assetConditionChanged: boolean = false;

  constructor(
    private _dataService: ProposalDataService,
    private _ProposalForm: ProposalEntityFormService,
    private _proposalEntityMapperService: ProposalEntityMapperService,
    private _storageService: ClientStoreService,
    private _formBuilder: FormBuilder,
    private _formState: StateManagment,
    private _FormMode: FormModeService,
    private _messageService: MessageService,
    private _FCMasterDataService: FinancialClubMasterDataService
  ) { }

  public get TotalSecurityDepositAmt(): number {
    if (this._dataService.PROPOSALARTICLE.length > 0) {
      if (
        this._dataService.PROPOSALFINANCIALAGREEMENT.value.SECURITYDEPIND ==
        true
      ) {
        this.totalSecurityDepositAmt =
          this.totalSecurityDepositAmt +
          this._dataService.PROPOSALFINANCIALAGREEMENT.value.SECURITYDEPOSITAMT;
      }
      return this.totalSecurityDepositAmt;
    }
    return this.totalSecurityDepositAmt;
  }

  public set TotalSecurityDepositAmt(amount: number) {
    this.totalSecurityDepositAmt = amount;
  }

  public get AccessoryCostVatLessITC(): number {
    let vatAmount = 0;
    if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.ACCESSORYAMT > 0) {
      if (
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 &&
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(
          (x) =>
            x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)
        ).length > 0
      ) {
        let tempEntity =
          this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(
            (x) =>
              x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)
          )[0];
        if (tempEntity != null) {
          if (
            tempEntity.PRPLARTEAMNTTRANTAX != null &&
            tempEntity.PRPLARTEAMNTTRANTAX.length > 0
          ) {
            if (tempEntity.PRPLARTEAMNTTRANTAX[0].ITCPERCENTAGE > 0) {
              vatAmount =
                this._dataService.PROPOSALFINANCIALAGREEMENT.value
                  .ACCESSORYAMT -
                this._dataService.PROPOSALFINANCIALAGREEMENT.value
                  .ACCYWITHOUTVAT;
            }
          }
        }
      }
    }

    return vatAmount;
  }

  public get AssetCostVatLessITC(): number {
    let vatAmount = 0;
    if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.VATONASSETCOST > 0) {
      if (
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 &&
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(
          (x) => x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost)
        ).length > 0
      ) {
        let tempEntity =
          this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(
            (x) => x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost)
          )[0];
        if (tempEntity != null) {
          if (
            tempEntity.PRPLARTEAMNTTRANTAX != null &&
            tempEntity.PRPLARTEAMNTTRANTAX.length > 0
          ) {
            if (tempEntity.PRPLARTEAMNTTRANTAX[0].ITCPERCENTAGE > 0) {
              vatAmount =
                this._dataService.PROPOSALFINANCIALAGREEMENT.value
                  .VATONASSETCOST;
            }
          }
        }
      }
    }

    return vatAmount;
  }

  public get DealerReceiveableCharge(): number {
    let ReceiveByDealer: number = 0;
    if (this._dataService.PROPOSALARTICLE != null) {
      let assetEntity =
        this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.length - 1
        ];
      let drProposalFinancialPlan =
        this._dataService.PROPOSALFINANCIALAGREEMENT;
      if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
        ReceiveByDealer = assetEntity.value.ASSETENTITY.PROPOSALCHARGE.filter(
          (info) =>
            info != null &&
            (info.PRPLCHRG.FINANCEDIND == null ||
              info.PRPLCHRG.FINANCEDIND == 'False' ||
              info.PRPLCHRG.FINANCEDIND == 'F') && (info.PRPLCHRG.RowState !== DataRowState.Removed) &&
            info.PRPLCHRG.RECEIVEBYDEALERIND
        ).reduce(function (tot, record) {
          return tot + record.TAXINCULSIVEAMT;
        }, 0);
      }
    }
    return ReceiveByDealer;
  }

  public get FCReceiveableCharge(): number {
    let ReceiveByFC = 0;
    let assetEntity =
      this._dataService.PROPOSALARTICLE.controls[
      this._dataService.PROPOSALARTICLE.length - 1
      ];
    if (assetEntity != null) {
      let drProposalFinancialPlan = assetEntity.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT;
      if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
        ReceiveByFC = assetEntity.value.ASSETENTITY.PROPOSALCHARGE.filter((info) => info != null && ((info.PRPLCHRG.FINANCEDIND == null ||
          info.PRPLCHRG.FINANCEDIND == "" || info.PRPLCHRG.FINANCEDIND == 'False' || info.PRPLCHRG.FINANCEDIND == 'F') && info.RowState !== DataRowState.Removed) &&
          !info.PRPLCHRG.RECEIVEBYDEALERIND).reduce(function (tot, record) {
            return tot + record.TAXINCULSIVEAMT;
          }, 0);
      }
    }
    return ReceiveByFC;
  }

  public get ISCFNONMCOMIND(): boolean {
    if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN == false && this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
      return true;
    }
    else {
      return false;
    }
  }

  public get ISCFMCOMIND(): boolean {
    if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN == true && this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
      return true;
    }
    else {
      return false;
    }
  }

  public get ISRFNONMCOMIND(): boolean {
    if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN == false && this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      return true;
    }
    else {
      return false;
    }
  }

  public get ISRFMCOMIND(): boolean {
    if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN == true && this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      return true;
    }
    else {
      return false;
    }
  }

  public get ISOL(): boolean {
    if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
      return true;
    }
    else {
      return false;
    }
  }

  public get ISRDPIND(): boolean {
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.HirePurchase) {
      return false;
    }
    else {
      if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN && this._dataService.PROPOSAL.value.MCOMDEALER) {
        return false;
      }
      else {
        if (this._FormMode.FormMode == FormMode.EDIT || this._FormMode.FormMode == FormMode.RESUBMIT || this._FormMode.FormMode == FormMode.NEW || this._FormMode.FormMode == FormMode.SUBMIT || this._FormMode.FormMode == FormMode.COPY || this._FormMode.FormMode == FormMode.VIEW)
          return true;
        else {
          return false;
        }
      }
    }
  }

  public DealerPOAmount(): number {
    if (
      this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance &&
      this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN != true
    ) {
      let _dealerPOAddedamount = 0;
      let _dealerPODeductedamount = 0;

      let POAddedComponents = this.POAddedComponents;
      if (POAddedComponents)
        POAddedComponents.controls.filter(x => x.controls.RowState.value != DataRowState.Removed).forEach((element) => {
          _dealerPOAddedamount = _dealerPOAddedamount + element.value.NETPAYABLEAMT;
        });

      let PODeductedComponents = this.PODeductedComponents;
      if (PODeductedComponents)
        PODeductedComponents.controls.filter(x => x.controls.RowState.value != DataRowState.Removed).forEach((element) => {
          _dealerPODeductedamount = _dealerPODeductedamount + element.value.NETPAYABLEAMT;
        });
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.markAsDirty();
      return _dealerPOAddedamount - _dealerPODeductedamount;
    } else {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.markAsDirty();
      return 0;
    }
  }

  public CalculateInclExclValues() {
    this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(element => {
      if (element.value.RowState != DataRowState.Removed) {
        if (element.controls.PRPLARTEAMNTTRANTAX.length == 1) {
          if (element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXAPBLTYPECDE == TaxInclExcl.GetStringValue(TaxInclExcl.Exclusive)) {
            element.controls.TAXEXCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
            element.controls.TAXINCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT + (element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST) ? element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXAMT : 0));
          }
          else {
            element.controls.TAXEXCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT - (element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST) ? element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXAMT : 0));
            element.controls.TAXINCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
          }
          element.controls.NETPAYABLEAMT.setValue(element.controls.TAXINCULSIVEAMT.value - (element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT) ? element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXAMT : 0));
          if (element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST))
            element.controls.WITHVATLESSITCAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT + element.controls.PRPLARTEAMNTTRANTAX.value[0].TAXAMT - element.controls.PRPLARTEAMNTTRANTAX.value[0].ITCAMT);
          else
            element.controls.WITHVATLESSITCAMT.setValue(element.controls.TAXINCULSIVEAMT.value);
        }
        else if (element.controls.PRPLARTEAMNTTRANTAX.length > 1)         //OTO Specific code.
        {
          let _Taxabletype = element.value.PRPLARTEAMNTTRANTAX.find(k => k.TAXAPBLTYPECDE == TaxInclExcl.GetStringValue(TaxInclExcl.Exclusive) && k.RowState != DataRowState.Removed);
          let _Vat = element.value.PRPLARTEAMNTTRANTAX.find(k => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST) && k.TAXTYPE != "ITC" && k.RowState != DataRowState.Removed);
          let _Wht = element.value.PRPLARTEAMNTTRANTAX.find(k => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT) && k.TAXTYPE != "ITC" && k.RowState != DataRowState.Removed);
          if (_Taxabletype != null && _Taxabletype != undefined) {
            element.controls.TAXEXCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
            element.controls.TAXINCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT + (_Vat != undefined && _Vat != null ? _Vat.TAXAMT : 0));
          }
          else {
            element.controls.TAXEXCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT - (_Vat != undefined && _Vat != null ? _Vat.TAXAMT : 0));
            element.controls.TAXINCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
          }
          element.controls.NETPAYABLEAMT.setValue(element.controls.TAXINCULSIVEAMT.value - (_Wht != undefined && _Wht != null ? _Wht?.TAXAMT : 0))
          element.controls.WITHVATLESSITCAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT + (_Vat != undefined && _Vat != null ? _Vat.TAXAMT : 0) - (_Vat != undefined && _Vat != null ? _Vat.TAXAMT : 0));
        }
        else if (element.controls.PRPLARTEAMNTTRANTAX.value.length == 0) {
          element.controls.TAXINCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
          element.controls.TAXEXCULSIVEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
          element.controls.NETPAYABLEAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
          element.controls.WITHVATLESSITCAMT.setValue(element.value.PRPLARTEAMNTTRAN.INPUTAMT);
          element.controls.TAXWITHOUTVATAMT.setValue(Number(element.value.TAXINCULSIVEAMT));
        }
        if (element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
          element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
          element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
          element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
          element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
          element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
          element.controls.TAXWITHOUTVATAMT.setValue(Number(element.value.TAXINCULSIVEAMT) - Number(element.value.PRPLARTEAMNTTRANTAX.filter(s => s.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST))[0]?.TAXAMT || 0));
        else
          element.controls.TAXWITHOUTVATAMT.setValue(Number(element.value.TAXINCULSIVEAMT));
      }
    });
  }

  public get POAddedComponents(): FormArray<IProposalArticleComponentEntity> {
    this.CalculateInclExclValues();
    let m_poaddcomponents = this._formBuilder.array<IProposalArticleComponentEntity>([]) as FormArray<IProposalArticleComponentEntity>;
    if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN) {
      return m_poaddcomponents;
    }

    if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease && this._dataService.PROPOSALASSET != null &&
      this._dataService.PROPOSALASSET != null && this._dataService.PROPOSALASSET.value.ASSETSELECTIONCDE == AssetSelection.Inventory) {
      if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter((p) => p.PRPLARTEAMNTTRAN.INPUTAMT > 0 && p.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed &&
        p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)).length > 0) {
        if (this.AccessoriesCostAddedComponentPO(true) != null && this.AccessoriesCostAddedComponentPO(true).value.PRPLARTEAMNTTRAN.INPUTAMT > 0)
          m_poaddcomponents.push(this.AccessoriesCostAddedComponentPO(true));
      }
    }
    else {
      if (this._dataService.PROPOSALFINANCIALAGREEMENT != null && this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMISSIONINCLUDETOPO) {
        if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {
          if (m_poaddcomponents) {
            m_poaddcomponents.controls = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) => p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 && p.value.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed &&
              p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost));
          }
        }
        else {
          if (this.AssetCostAddedComponent(true) != null && this.AssetCostAddedComponent(true).value.PRPLARTEAMNTTRAN.INPUTAMT > 0) {
            m_poaddcomponents.push(this.AssetCostAddedComponent(true));
          }
        }
        if (this.JP1POEntity().controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
          m_poaddcomponents.push(this.JP1POEntity());

        if (this.AccessoriesCostAddedComponentPO(true) != null && this.AccessoriesCostAddedComponentPO(true).value.PRPLARTEAMNTTRAN.INPUTAMT > 0)
          m_poaddcomponents.push(this.AccessoriesCostAddedComponentPO(true));

        if (m_poaddcomponents != null && m_poaddcomponents.length > 0) {
          //comment by faisl as it needs    m_poaddcomponents.controls.forEach(p => p.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = ((AmountComponent)Enum.Parse(typeof(AmountComponent), p.PRPLARTEAMNTTRAN.AMTCMPTCDE, false)).GetDescriptionStringValue());
          m_poaddcomponents.controls.forEach(p => p.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetStringValueByCode(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE));
        }
      } else {
        if (this._dataService.PROPOSALARTICLE.controls[this._dataService.PROPOSALARTICLE.length - 1] != null &&
          this._dataService.PROPOSAL.value.FINANCETYP != null &&
          this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance)
          m_poaddcomponents = this._formBuilder.array(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) =>
            p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 && p.value.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed &&
            p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost)
          ).map((r: any) => this._formBuilder.group(r)));
        m_poaddcomponents.controls = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) =>
          p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 && p.value.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed && p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost));
        let accessoriesCost = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) => p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
          p.value.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed &&
          p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost))[0];
        if (accessoriesCost != null && accessoriesCost != undefined)
          m_poaddcomponents.controls.push(accessoriesCost);
        if (m_poaddcomponents != null && m_poaddcomponents.length > 0) {
          //comment as it needsdiscusion m_poaddcomponents.controls.forEach(p => p.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = ((AmountComponent)Enum.Parse(typeof(AmountComponent), p.PRPLARTEAMNTTRAN.AMTCMPTCDE, false)).GetDescriptionStringValue());
          m_poaddcomponents.controls.forEach(p => p.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetStringValueByCode(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE));
        }
      }
    }
    return m_poaddcomponents;
  }

  public get PODeductedComponents(): FormArray<IProposalArticleComponentEntity> {
    this.CalculateInclExclValues();
    let m_podeductedcomponents = this._formBuilder.array<IProposalArticleComponentEntity>([]) as FormArray<IProposalArticleComponentEntity>;
    if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease &&
      this._dataService.PROPOSALASSET != null &&
      this._dataService.PROPOSALASSET.value.ASSETSELECTIONCDE == AssetSelection.Inventory) {
      m_podeductedcomponents = this._formBuilder.array(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) =>
        p.value.PRPLARTEAMNTTRAN.INPUTAMT == 0 &&
        p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost) &&
        p.value.RowState != DataRowState.Removed
      ));
      return m_podeductedcomponents;
    }
    if (this._dataService.PROPOSAL.value.FINANCETYP != null &&
      this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance &&
      this._dataService.PROPOSALARTICLE.length > 0) {
      //m_podeductedcomponents = null;
      if (this.FirstPayment != undefined)
        m_podeductedcomponents = this._formBuilder.array(this.FirstPayment?.controls?.filter((p) => p.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.value == true && p.value.RowState != DataRowState.Removed));

      if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) => p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
        p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFeeSubsidy) &&
        p.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Nettingoff &&
        p.value.RowState != DataRowState.Removed).length > 0) {
        //DataContext.PROPOSALARTICLE[Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.Where(p => p.PRPLARTEAMNTTRAN.INPUTAMT > 0 && p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.AdminFeeSubsidy.GetStringValue() && p.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Nettingoff.GetStringValue()).ToGenericCollection();
        let a = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) => p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
          p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFeeSubsidy) &&
          p.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Nettingoff &&
          p.value.RowState != DataRowState.Removed);
        //m_podeductedcomponents.push(a.forEach(item=>{}))
        a.forEach((item) => { m_podeductedcomponents.push(item); });
      }

      if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) => p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
        p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceSubsidy)).length > 0) {
        m_podeductedcomponents.push(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) =>
          p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 && p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceSubsidy) && p.value.RowState != DataRowState.Removed)[0]);
      }
      if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter((p) => p.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
        p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.Discount)).length > 0) {
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) =>
          p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
          p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.Discount)
        )[0].controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue("Discount");
        if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) =>
          p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
          p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.Discount) && p.value.RowState != DataRowState.Removed).length > 0) {
          m_podeductedcomponents.push(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((p) =>
            p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
            p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.Discount) && p.value.RowState != DataRowState.Removed)[0]);
        }

      }

      if (
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(
          (p) =>
            p.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
            (p.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.DownpaymentSubsidy) ||
              p.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InterestSubsidyFixedAmount) ||
              p.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InterestSubsidyRateBased) ||
              p.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InstallmentSubsidy)) &&
            p.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE ==
            AmountClassification.Nettingoff
        ).length > 0
      ) {
        let a = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(
          (p) =>
            p.value.PRPLARTEAMNTTRAN.INPUTAMT > 0 &&
            (p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.DownpaymentSubsidy) ||
              p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InterestSubsidyFixedAmount) ||
              p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InterestSubsidyRateBased) ||
              (p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
                AmountComponent.GetStringValue(AmountComponent.InstallmentSubsidy) &&
                p.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE ==
                AmountClassification.Nettingoff) && p.value.RowState != DataRowState.Removed)
        );
        a.forEach((item) => {
          m_podeductedcomponents.push(item);
        });
      }

      // if (m_podeductedcomponents != null && m_podeductedcomponents.length > 0) {
      //   //comment by faisal m_podeductedcomponents.ForEach(p => p.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = ((AmountComponent)Enum.Parse(typeof (AmountComponent), p.PRPLARTEAMNTTRAN.AMTCMPTCDE, false)).GetDescriptionStringValue());
      //   m_podeductedcomponents.controls.forEach(element => {
      //     element.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetStringValueByCode(element.value.PRPLARTEAMNTTRAN.AMTCMPTCDE));
      //   });
      // }

      if (m_podeductedcomponents != null && m_podeductedcomponents.length > 0) {
        //comment as it needsdiscusion m_poaddcomponents.controls.forEach(p => p.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = ((AmountComponent)Enum.Parse(typeof(AmountComponent), p.PRPLARTEAMNTTRAN.AMTCMPTCDE, false)).GetDescriptionStringValue());
        m_podeductedcomponents.controls.forEach(p => p.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetStringValueByCode(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE));
      }
    }
    // if(m_podeductedcomponents==undefined)
    // m_podeductedcomponents=this._formBuilder.array([this._ProposalForm.ProposalArticleComponentForm()]);
    return m_podeductedcomponents;
  }

  public get FirstPayment(): FormArray<IProposalArticleComponentEntity> {
    let FC: FormArray<IProposalArticleComponentEntity> = this._formBuilder.array<IProposalArticleComponentEntity>([]);
    if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL != null) {
      this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach((entity) => {
        if (entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
          entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE != AmountComponent.GetStringValue(AmountComponent.ApplicationUpfrontCharges)) {
          if (AmountComponent.GetStringValue(AmountComponent.DownpaymentDeposit) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable) {
            if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.value)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            entity.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Down payment');
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.FirstRental) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE) {
            if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.INSTALMENTPAYTOINTRODUCER)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.PolicyFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE != AmountClassification.Nettingoff) {
            let cmpt_cnfg = this._dataService.PRPLCMPTCNFG.controls.filter((p) => p.value.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee))[0];
            if (cmpt_cnfg != null) {
              if (cmpt_cnfg.value.PAYTOINTRODUCERIND)
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
              else
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
              entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            }
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.FiduciaFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE != AmountClassification.Nettingoff) {
            let cmpt_cnfg = this._dataService.PRPLCMPTCNFG.controls.filter((p) => p.value.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))[0];
            if (cmpt_cnfg != null) {
              if (cmpt_cnfg.value.PAYTOINTRODUCERIND)
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
              else
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
              entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            }
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontInsurancePremium) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE != AmountClassification.Nettingoff) {
            if (this.MainInsuranceEntity.value.PRPLINSR.RECEIVEBYDEALERIND)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontAdminFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable) {
            if (
              this._dataService.PROPOSALADMINFEEDETAIL.value.RECEIVEDBYDEALERIND)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontProvisionFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable) {
            if (
              this._dataService.PROPOSALPROVISIONFEEDETAIL.value.RECEIVEDBYDEALERIND)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }
          if (AmountComponent.GetStringValue(AmountComponent.ETFromSOLOs) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Nettingoff
          ) {
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          // comment by faisal FC.controls.forEach(p => p.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(typeof(AmountComponent), p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE));
        }
      }
      );
    }

    let Charge = this.getChargeTransEntity(false);
    if (Charge != null && Charge.controls.PRPLARTEAMNTTRAN.value != null && Charge.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      FC.push(Charge);

    let Charge2 = this.getChargeTransEntity(true);
    if (Charge2 != null && Charge2.controls.PRPLARTEAMNTTRAN.value != null && Charge2.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      FC.push(Charge2);

    //DealerPOAmount = 0;
    this._dataService.PRPLARTICLECOMPONENTENTITYCOL.updateValueAndValidity();
    return FC;
  }

  public FirstPayamentSetValues() {

    let FC: FormArray<IProposalArticleComponentEntity> = this._formBuilder.array<IProposalArticleComponentEntity>([]);
    if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL != null) {
      this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach((entity) => {
        if (entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
          entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE != AmountComponent.GetStringValue(AmountComponent.ApplicationUpfrontCharges)) {
          if (AmountComponent.GetStringValue(AmountComponent.DownpaymentDeposit) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable) {
            if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.value)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            entity.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Down payment');
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.FirstRental) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE) {
            if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.INSTALMENTPAYTOINTRODUCER)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.PolicyFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE != AmountClassification.Nettingoff) {
            let cmpt_cnfg = this._dataService.PRPLCMPTCNFG.controls.filter((p) => p.value.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee))[0];
            if (cmpt_cnfg != null) {
              if (cmpt_cnfg.value.PAYTOINTRODUCERIND)
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
              else
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
              entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            }
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.FiduciaFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE != AmountClassification.Nettingoff) {
            let cmpt_cnfg = this._dataService.PRPLCMPTCNFG.controls.filter((p) => p.value.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))[0];
            if (cmpt_cnfg != null) {
              if (cmpt_cnfg.value.PAYTOINTRODUCERIND)
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
              else
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
              entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            }
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontInsurancePremium) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE != AmountClassification.Nettingoff) {
            if (this.MainInsuranceEntity.value.PRPLINSR.RECEIVEBYDEALERIND)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontAdminFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable) {
            if (
              this._dataService.PROPOSALADMINFEEDETAIL.value.RECEIVEDBYDEALERIND)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontProvisionFee) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable) {
            if (
              this._dataService.PROPOSALPROVISIONFEEDETAIL.value.RECEIVEDBYDEALERIND)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }
          if (AmountComponent.GetStringValue(AmountComponent.ETFromSOLOs) == entity.value.PRPLARTEAMNTTRAN.AMTCMPTCDE &&
            entity.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront &&
            entity.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Nettingoff
          ) {
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(entity);
          }

          // comment by faisal FC.controls.forEach(p => p.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(typeof(AmountComponent), p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE));
        }
      }
      );
    }

    let Charge = this.getChargeTransEntity(false);
    if (Charge != null && Charge.controls.PRPLARTEAMNTTRAN.value != null && Charge.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      FC.push(Charge);

    let Charge2 = this.getChargeTransEntity(true);
    if (Charge2 != null && Charge2.controls.PRPLARTEAMNTTRAN.value != null && Charge2.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      FC.push(Charge2);

    //DealerPOAmount = 0;
    this._dataService.PRPLARTICLECOMPONENTENTITYCOL.updateValueAndValidity();
    return FC;
  }

  public get MainInsuranceEntity(): FormGroup<IMainInsuranceEntity> {
    let m_maininsurance = this._ProposalForm.PropsalMainInsuranceForm();

    if (this._dataService.PROPOSALARTICLE.length > 0 &&
      this._dataService.PROPOSALINSURANCEMAIN.controls.filter(x => x.value.RowState != DataRowState.Removed).length > 0) {
      m_maininsurance = this._dataService.PROPOSALINSURANCEMAIN.controls.filter(x => x.value.RowState != DataRowState.Removed)[0];
    } else {
      if (this._dataService.PROPOSALINSURANCEMAIN != null) {
        this._dataService.PROPOSALINSURANCEMAIN.push(m_maininsurance);
      }
    }
    return m_maininsurance;
  }

  public AccessoriesCostAddedComponentPO(
    isFromPO: boolean = false
  ): FormGroup<IProposalArticleComponentEntity> {
    if (this._dataService.ASSETENTITY != null && this._dataService.PROPOSALACCESSORY.length > 0) {
      let accAmountSupplier = this._dataService.PROPOSALACCESSORY.value.filter((x) =>
        x.BPSUPPLIERID == this._dataService.PROPOSALASSET.value.BPINTRODUCERID
      ).reduce(function (tot, record) {
        return tot + record.ACCESSORYAMT;
      }, 0); //.Sum(x => x.ACCESSORYAMT);

      if (
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 &&
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(
          (x) =>
            x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)
        ).length > 0
      ) {
        let tempEntity =
          this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(
            (x) =>
              x.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)
          )[0];
        if (tempEntity != null) {
          if (
            tempEntity.value.PRPLARTEAMNTTRANTAX != null &&
            tempEntity.value.PRPLARTEAMNTTRANTAX.length > 0
          ) {
            if (tempEntity.value.PRPLARTEAMNTTRANTAX[0].ITCPERCENTAGE > 0) {
              let vatAmount = this._dataService.PROPOSALACCESSORY.value
                .filter(
                  (x) =>
                    x.BPSUPPLIERID ==
                    this._dataService.PROPOSALASSET.value.BPINTRODUCERID
                )
                .reduce(function (tot, record) {
                  return tot + record.VATAMT;
                }, 0); //.Sum(x => x.VATAMT);
              if (isFromPO) accAmountSupplier = accAmountSupplier + 0;
              else accAmountSupplier = accAmountSupplier - vatAmount;
            }
          }
        }
      }
      let entity = this._ProposalForm.ProposalArticleComponentForm();
      entity.controls.PRPLARTEAMNTTRAN =
        this._ProposalForm.ProposalArticleAmountTransferForm();
      entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
        ''
      );
      entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.setValue(
        AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)
      );
      //entity.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.AssetCost.GetDescriptionStringValue();
      entity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(
        accAmountSupplier
      );
      return entity;
    } else {
      let entity = this._ProposalForm.ProposalArticleComponentForm();
      return entity;
    }
  }

  public AssetCostAddedComponent(
    isFromPO: boolean = false
  ): FormGroup<IProposalArticleComponentEntity> {
    if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
      let assetCost = this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT;

      if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.VATONASSETCOST > 0) {
        if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 && this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((x) => x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost)).length > 0) {
          let tempEntity = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.find((x) => x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost));
          if (tempEntity != null) {
            if (tempEntity.value.PRPLARTEAMNTTRANTAX != null && tempEntity.value.PRPLARTEAMNTTRANTAX.length > 0) {
              if (tempEntity.value.PRPLARTEAMNTTRANTAX.find((a) => a.ITCPERCENTAGE > 0)) {
                let vatAmount = this._dataService.PROPOSALFINANCIALAGREEMENT.value
                  .VATONASSETCOST;
                if (isFromPO)
                  assetCost = assetCost + 0;
                else
                  assetCost = assetCost - vatAmount;
              }
            }
          }
        }
      }
      let entity = this._ProposalForm.ProposalArticleComponentForm();
      // entity.controls.PRPLARTEAMNTTRAN =
      //   this._ProposalForm.ProposalArticleAmountTransferForm();
      entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
        ''
      );
      entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.setValue(
        AmountComponent.GetStringValue(AmountComponent.AssetCost)
      );
      entity.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Asset Cost'); // = AmountComponent.AssetCost.GetDescriptionStringValue();
      entity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(assetCost);
      this.CalculateIncExcValues(entity);
      return entity;
    } else {
      if (
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(
          (x) =>
            x.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value ==
            AmountComponent.GetStringValue(AmountComponent.AssetCost)
        ).length > 0
      ) {
        var abc =
          this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(
            (x) =>
              x.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value ==
              AmountComponent.GetStringValue(AmountComponent.AssetCost) && x.controls.PRPLARTEAMNTTRAN.controls.RowState.value !== DataRowState.Removed
          )[0];
        return abc;
      } else return this._ProposalForm.ProposalArticleComponentForm();
    }
  }

  public JP1POEntity(): FormGroup<IProposalArticleComponentEntity> {
    let entity = this._ProposalForm.ProposalArticleComponentForm();
    //entity.controls.PRPLARTEAMNTTRAN = this._ProposalForm.ProposalArticleAmountTransferForm();
    entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue('');
    entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.setValue(AmountComponent.GetStringValue(AmountComponent.AllCommissions));
    entity.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(AmountComponent.AllCommissions));
    entity.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('All Commissions');

    if (this.ValidateCommissionEntity()) {
      let JP1JP2Sum = this._dataService.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls
        .filter((p) => p.value.PRPLJP1JP2RPNT.ROLECDE == RoleCode.Dealer).reduce(function (tot, record) {
          return tot + record.value.PRPLJP1JP2RPNT.JP1TAXINCLUSIVEAMT;
        }, 0); //.Sum(p => p.JP1TAXINCULSIVEAMT);
      entity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(JP1JP2Sum);
      entity.controls.NETPAYABLEAMT.setValue(JP1JP2Sum);
    }
    return entity;
  }

  private ValidateCommissionEntity(): boolean {
    if (
      this._dataService.PROPOSALCOMMISSIONENTITY != null &&
      this._dataService.PROPOSALCOMMISSIONENTITY.length > 0
    )
      return true;
    return false;
  }

  public getChargeTransEntity(receivedbydealer: boolean): FormGroup<IProposalArticleComponentEntity> {
    let ChargeTransEntity = this._ProposalForm.ProposalArticleComponentForm();
    ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.setValue(AmountComponent.GetStringValue(AmountComponent.ApplicationCharges));
    ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.OUTPUTCURRENCYCDE.setValue(this._dataService.PROPOSAL.value.CURRENCYCDE);
    ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetStringValueByCode('00116'));
    if (receivedbydealer) {
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(this.DealerReceiveableCharge);
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.OUTPUTAMT.setValue(this.DealerReceiveableCharge);
      ChargeTransEntity.controls.NETPAYABLEAMT.setValue(this.DealerReceiveableCharge);
    } else {
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(this.FCReceiveableCharge);
      ChargeTransEntity.controls.PRPLARTEAMNTTRAN.controls.OUTPUTAMT.setValue(this.FCReceiveableCharge);
      ChargeTransEntity.controls.NETPAYABLEAMT.setValue(this.DealerReceiveableCharge);
    }
    return ChargeTransEntity;
  }

  public IsCommissionValid(
    CommissionType: string,
    value: number
  ): Array<CommissionValidation> {
    let coll: Array<CommissionValidation> = [] as Array<CommissionValidation>;
    let info: CommissionValidation = {} as CommissionValidation;
    try {
      if (
        this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance
      ) {
        if (
          this._dataService.PROPOSALCOMMISSIONENTITY.value[0].JP1JP2RECIPIENT.filter(
            (p) => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType
          ).length > 0
        ) {
          //coll = new GenericCollection<CommissionValidation>();
          let com =
            this._dataService.PROPOSALCOMMISSIONENTITY.value[0].JP1JP2RECIPIENT.filter(
              (p) => p.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == CommissionType
            ) as Array<IJP1JP2RecipientEntity>;
          com.forEach((entity: IJP1JP2RecipientEntity) => {
            if (
              entity.PRPLJP1JP2RPNT.JP1COMMISSIONAMT <= value &&
              entity.PRPLJP1JP2RPNT.JP1COMMISSIONAMT > 0
            ) {
              info = {} as CommissionValidation;
              info.RecipientName = entity.PRPLJP1JP2RPNT.RECIPIENTNME;
              info.DevisionType = CommissionDivisionType.GetStringValue(CommissionDivisionType.JP1);
              info.CommisionType = entity.PRPLJP1JP2RPNT.COMMISSIONTYPECDE;
              coll.push(info);
            }
            if (
              entity.PRPLJP1JP2RPNT.JP2COMMISSIONAMT <= value &&
              entity.PRPLJP1JP2RPNT.JP2COMMISSIONAMT > 0
            ) {
              info = {} as CommissionValidation;
              info.RecipientName = entity.PRPLJP1JP2RPNT.RECIPIENTNME;
              info.DevisionType = CommissionDivisionType.GetStringValue(CommissionDivisionType.JP2);
              info.CommisionType = entity.PRPLJP1JP2RPNT.COMMISSIONTYPECDE;
              coll.push(info);
            }
          });
        }
      }
    } catch (Exception) { }
    return coll;
  }

  public ValidateCalculationParameters(): string {
    let errormessage = 'true';
    if (!this._dataService.PROPOSAL.value.ISPACKAGE) {
      if (this._dataService.PROPOSALARTICLEBASERATE != null && this._dataService.PROPOSALARTICLEBASERATE.length > 0) {
        let _basterate = this._dataService.PROPOSALARTICLEBASERATE.controls.find(p => moment(p.value.EFFECTIVEDATE).toDate() <= moment(this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTSTARTDTE).toDate());
        if (_basterate == null || _basterate == undefined)
          return errormessage = "strtdtegretBaseRteDte";
      }
      else {
        return errormessage = "minonebaserte";
      }
      if (this._dataService.PROPOSALTEMPLATERENTALINT.value.INTRTYPECDE == InterestType.Floating && this._dataService.PROPOSALTEMPLATERENTALINT.value.RVSONFRQCDE == null) {
        return errormessage = "revFreqMissCamgn";
      }
    }
    return errormessage;
  }

  get CurrentAssetRentalDetail() {
    // if (this._dataService.ASSETENTITY.controls?.PROPOSALRENTALDETAIL !== null && this._dataService.ASSETENTITY.controls?.PROPOSALRENTALDETAIL.length === 0) {
    //   return this._formBuilder.array<IPRPL_RNTL_DETLInfo>([]);
    // }
    // return this._dataService.ASSETENTITY.controls?.PROPOSALRENTALDETAIL;

    let m_CurrentAssetRentalDetail1 = this._formBuilder.array<IPRPL_RNTL_DETLInfo>([]);

    if (this._dataService.PROPOSALARTICLE.value != null &&
      this._dataService.PROPOSALARTICLE.value.length > 0 &&
      this._dataService.ASSETENTITY.value != null &&
      this._dataService.PROPOSALFINANCIALAGREEMENT.value != null &&
      this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT != 0 &&
      this._dataService.PROPOSALREPAYMENTPLANENTITYCOL.value != null &&
      this._dataService.PROPOSALREPAYMENTPLANENTITYCOL.value.length > 0) {
      this._dataService.PROPOSALREPAYMENTPLANENTITYCOL.value.filter(x => x.RowState != DataRowState.Removed).forEach(info => {
        if (m_CurrentAssetRentalDetail1.value.length == 0 || m_CurrentAssetRentalDetail1.value[m_CurrentAssetRentalDetail1.value.length - 1]?.RENTALAMT != info.PRPLRPMTPLAN.RENTALAMT) {
          let rentalDetail = {} as IPRPL_RNTL_DETLInfo;
          rentalDetail.STARTTRM = info.PRPLRPMTPLAN.REPAYMENTPLANID;
          rentalDetail.ENDTRM = info.PRPLRPMTPLAN.REPAYMENTPLANID;
          rentalDetail.RENTALAMT = info.PRPLRPMTPLAN.RENTALAMT;
          rentalDetail.ISGPRENTAL = info.PRPLRPMTPLAN.ISGPRENTAL;
          m_CurrentAssetRentalDetail1.push(this._proposalEntityMapperService.PROPOSALRENTALDETAILMapper(
            this._ProposalForm.PROPOSALRENTALDETAILForm(),
            rentalDetail
          ));
        }
        else {
          m_CurrentAssetRentalDetail1.controls[m_CurrentAssetRentalDetail1.value.length - 1].controls.ENDTRM.setValue(info.PRPLRPMTPLAN.REPAYMENTPLANID);
        }
      })
      let GPterms = this._dataService.PROPOSALFINANCIALAGREEMENT.value.GPTERMS;
      if (m_CurrentAssetRentalDetail1.value != null) {
        let tempColl = new Array<IPRPL_RNTL_DETLInfo>();
        let GPrental = false;

        m_CurrentAssetRentalDetail1.value.forEach((rental: any) => {
          if (rental.ISGPRENTAL) {
            GPrental = true;
          }
          else {
            if (GPrental) {
              rental.STARTTRM -= GPterms;
              rental.ENDTRM -= GPterms;
            }

            tempColl.push(rental);
          }
        })
        if (tempColl.length > 0) {
          if (tempColl.length == 2 && tempColl[0].RENTALAMT == tempColl[1].RENTALAMT) {
            tempColl[0].ENDTRM = tempColl[1].ENDTRM;
            tempColl.splice(1, 1);
          }
          m_CurrentAssetRentalDetail1 = this._formBuilder.array<IPRPL_RNTL_DETLInfo>([]);
          tempColl.forEach(item => {
            let items = this._ProposalForm.PROPOSALRENTALDETAILForm();
            items.patchValue(item);
            m_CurrentAssetRentalDetail1.push(items);
          });
        }
      }
      return m_CurrentAssetRentalDetail1;
    }
    return m_CurrentAssetRentalDetail1;
  }

  public get isFlat(): boolean {
    if (
      this._dataService.PROPOSALFINANCIALAGREEMENT != null &&
      (this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALCALCMTD ==
        RentalCalculationMethod.EqualPrincipalFlat ||
        this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALCALCMTD ==
        RentalCalculationMethod.Flat)
    )
      return true;
    else return false;
  }
  public get isRefinance(): boolean {
    if (
      this._dataService.PROPOSAL != null &&
      this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance
    )
      return true;
    else return false;
  }

  public get TotalFinancedCharges(): number {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE != null) {
      let assetEntity =
        this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.length - 1
        ];
      if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
        assetEntity.value.ASSETENTITY.PROPOSALCHARGE.forEach((x) => {
          if ((
            x.PRPLCHRG.FINANCEDIND == 'True' ||
            x.PRPLCHRG.FINANCEDIND == 'T') && (x.PRPLCHRG.RowState !== DataRowState.Removed)
          ) {
            totalAmount += x.TAXINCULSIVEAMT;
          }
        });
      }
    }
    return totalAmount;
  }

  public getFinancedChargesVATAmt(): number {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE != null) {
      let assetEntity =
        this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.length - 1
        ];
      if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
        assetEntity.value.ASSETENTITY.PROPOSALCHARGE.forEach((x) => {
          if (
            x != null &&
            (x.PRPLCHRG.FINANCEDIND == 'True' ||
              x.PRPLCHRG.FINANCEDIND == 'T') && (x.PRPLCHRG.RowState !== DataRowState.Removed) &&
            x.PRPLCHRGTAX.filter(
              (p) => p.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
            ).length > 0
          ) {
            totalAmount += x.PRPLCHRGTAX.filter(
              (pt) => pt.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
            )[0].TAXAMT;
          }
        });
      }
    }
    return totalAmount;
  }

  public getFinancedChargesWHTAmt(): number {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE != null) {
      let assetEntity =
        this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.length - 1
        ];
      if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
        assetEntity.value.ASSETENTITY.PROPOSALCHARGE.forEach((x) => {
          if (
            x != null &&
            (x.PRPLCHRG.FINANCEDIND == 'True' ||
              x.PRPLCHRG.FINANCEDIND == 'T') && (x.PRPLCHRG.RowState !== DataRowState.Removed) &&
            x.PRPLCHRGTAX.filter(
              (p) => p.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            ).length > 0
          ) {
            totalAmount += Number(x.PRPLCHRGTAX.filter(
              (pt) => pt.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            )[0].TAXAMT);
          }
        });
      }
    }
    return totalAmount;
  }

  public get NonFinanceChargeAmt(): number {
    let nonFinancedChargeAmt = 0;
    let assetEntity =
      this._dataService.PROPOSALARTICLE.controls[
      this._dataService.PROPOSALARTICLE.length - 1
      ];
    let drproposalFinancialPlan =
      assetEntity.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT;
    if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
      assetEntity.value.ASSETENTITY.PROPOSALCHARGE.forEach((x) => {
        if (
          (x.PRPLCHRG.FINANCEDIND == null ||
          x.PRPLCHRG.FINANCEDIND == "" ||
          x.PRPLCHRG.FINANCEDIND == 'False' ||
          x.PRPLCHRG.FINANCEDIND == 'F') && (x.PRPLCHRG.RowState !== DataRowState.Removed)
        ) {
          nonFinancedChargeAmt += Number(x.PRPLCHRG.CHARGEAMT);
        }
      });
    }
    return nonFinancedChargeAmt;
  }

  public getNonFinancedChargesVATAmt(): number {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE != null) {
      let assetEntity =
        this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.length - 1
        ];
      if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
        assetEntity.value.ASSETENTITY.PROPOSALCHARGE.forEach((x) => {
          if (
            x != null &&
            (x.PRPLCHRG.FINANCEDIND == null ||
              x.PRPLCHRG.FINANCEDIND == 'False' ||
              x.PRPLCHRG.FINANCEDIND == 'F') && (x.PRPLCHRG.RowState != DataRowState.Removed) &&
            x.PRPLCHRGTAX.filter(
              (p) => p.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
            ).length > 0
          ) {
            totalAmount += Number(x.PRPLCHRGTAX.filter(
              (pt) => pt.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
            )[0].TAXAMT);
          }
        });
      }
    }
    return totalAmount;
  }

  public getNonFinancedChargesWHTAmt(): number {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE != null) {
      let assetEntity =
        this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.length - 1
        ];
      if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null) {
        assetEntity.value.ASSETENTITY.PROPOSALCHARGE.forEach((x) => {
          if (
            x != null &&
            (x.PRPLCHRG.FINANCEDIND == null ||
              x.PRPLCHRG.FINANCEDIND == 'False' ||
              x.PRPLCHRG.FINANCEDIND == 'F') && (x.PRPLCHRG.RowState != DataRowState.Removed) &&
            x.PRPLCHRGTAX.filter(
              (p) => p.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            ).length > 0
          ) {
            totalAmount += x.PRPLCHRGTAX.filter(
              (pt) => pt.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            )[0].TAXAMT;
          }
        });
      }
    }
    return totalAmount;
  }

  public get isEffective(): Boolean {
    if (
      this._dataService.PROPOSALFINANCIALAGREEMENT != null &&
      (this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALCALCMTD ==
        RentalCalculationMethod.EqualPrincipal ||
        this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALCALCMTD ==
        RentalCalculationMethod.Annuity)
    )
      return true;
    else return false;
  }
  public get PROPOSAL_SUBSIDY_DETAIL(): IPRPL_SBSD_DETLInfo | null {
    if (
      this._dataService.PROPOSALARTICLE != null &&
      this._dataService.PROPOSALARTICLE.length > 0 &&
      this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.controls.length - 1
      ].controls.ASSETENTITY.controls != null &&
      this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.controls.length - 1
      ].controls.ASSETENTITY.controls.PROPOSALSUBSIDYDETAIL != null
    ) {
      return this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.length - 1
      ].controls.ASSETENTITY.controls.PROPOSALSUBSIDYDETAIL
        .value as IPRPL_SBSD_DETLInfo;
    } else return null;
  }

  public get OJKCommissionEffectiveInd(): boolean {
    if (this._dataService.PROPOSALASSET != null && this._dataService.PROPOSALCOMMISSIONENTITY != null && this._dataService.PROPOSALCOMMISSIONENTITY.length > 0 && this._dataService.PROPOSALCOMMISSIONENTITY.value[0].PRPLCOMM != null && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease && this.CommissionCalcInd) {
      if (this._dataService.PROPOSALCOMMISSIONENTITY.value[0].PRPLCOMM.OJKCOMMISSIONEFFECTIVEDTE != null) {
        let processinDate = new Date(this._storageService.GetUserInfo()?.ProcessingDate);
        let effectiveDate = new Date(this._dataService.PROPOSALCOMMISSIONENTITY.value[0].PRPLCOMM.OJKCOMMISSIONEFFECTIVEDTE);
        if (effectiveDate.toISOString() > processinDate.toISOString())
          return false;
        else if (effectiveDate.toISOString() <= processinDate.toISOString())
          return true;
        else
          return false;
      }
      else
        return false;
    } else {
      return false;
    }
  }

  // public get CommissionCalcInd(): boolean {
  //   // if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN && this._dataService.PROPOSAL.value.MCOMDEALER)
  //   //   return false;
  //   // else {
  //   //   if (this._dataService != null && this._dataService.PROPOSAL != null && this._dataService.PROPOSAL.value.APPLICANTIND == "I"
  //   //     && this._dataService.PROPOSALAPPLICANT != null && this._dataService.PROPOSALAPPLICANT.length > 0
  //   //     && DataContext.PROPOSALAPPLICANT.m_current[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND
  //   //     && !DataContext.PROPOSALAPPLICANT.m_current[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.CALCULATECOMMISSIONIND) {
  //   //     return false;
  //   //   }
  //   //   else {
  //   //     return true;
  //   //   }
  //   // }
  //   return false;
  // }

  public get IntroducerAvailable(): boolean {
    //--To DO
    // if (this._dataService.PROPOSALFINANCIALAGREEMENT != null && !this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMISSIONTYP || this.Mode && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance)
    //   return true;
    return false;
  }

  public AssetSelectOL() { }

  public get ProposalTermInYears(): number {
    let _proposalTerminYrs: number = 0;
    let _proposalTermDiv: number = 0;

    if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM > 0) {
      _proposalTermDiv =
        this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM / 12.0;
      _proposalTerminYrs = Math.ceil(_proposalTermDiv);
    }
    return _proposalTerminYrs;
  }

  public get InsuranceContractInclusiveSum(): number {
    let _pSumInclusive: number = 0;
    if (
      this._dataService.ASSETENTITY.value.PROPOSALASSETINSURANCE != null &&
      this._dataService.ASSETENTITY.value.PROPOSALASSETINSURANCE.length > 0
    ) {
      _pSumInclusive =
        this._dataService.ASSETENTITY.value.PROPOSALASSETINSURANCE.filter(
          (p) =>
            p.CMPTFINETYPECDE ==
            AssetComponentsFinancialConfiguration.ContractInclusive
        ).reduce((sum, current) => sum + current.PREMIUMAMT, 0);
    }
    return _pSumInclusive * this.ProposalTermInYears;
  }

  public get FINEYPECNFG() {
    if (this._FINEYPECNFG != null) return;
    else return null;
  }

  public set FINEYPECNFG(val: any) {
    this._FINEYPECNFG = val;
  }

  public get TotalChargesTaxInclusive() {
    let totalAmount = 0;

    if (this._dataService.PROPOSALARTICLE != null) {
      if (
        this._dataService.ASSETENTITY.controls.PROPOSALCHARGE.controls != null
      ) {
        this._dataService.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach(
          (element) => {
            if (element.controls.RowState.value !== DataRowState.Removed) {
              totalAmount += element.controls.TAXINCULSIVEAMT.value;
            }
          }
        );
      }
    }

    return totalAmount;
  }

  public AllowCalculationAgainstNewRental(): boolean {
    if (this.RentalExist()) {
      let count: number = 0;

      count = this._dataService.ASSETENTITY.value.PROPOSALRENTALDETAIL.filter(
        (w) =>
          w.RowState == DataRowState.Added &&
          w.RENTALAMT == 0 &&
          w.RENTALTYP == RentalType.GetStringValue(RentalType.None)
      ).length;

      if (count <= 0) return false;

      return true;
    }
    return false;
  }

  public RentalExist(): boolean {
    return (
      this.AssetExist() &&
      this._dataService.ASSETENTITY.value.PROPOSALRENTALDETAIL != null &&
      this._dataService.ASSETENTITY.value.PROPOSALRENTALDETAIL.length > 0
    );
  }

  public AssetExist(): boolean {
    return (
      this._dataService != null &&
      this._dataService.PROPOSALARTICLE != null &&
      this._dataService.PROPOSALARTICLE.length > 0 &&
      this._dataService.PROPOSALARTICLE != null &&
      this._dataService.PROPOSALARTICLE.length > 0
    );
  }

  public get RepaymentPlan(): Array<IProposalRepaymentPlanEntity> {
    if (this._dataService.ASSETENTITY.value.PROPOSALREPAYMENTPLANENTITYCOL != null &&
      this._dataService.ASSETENTITY.value.PROPOSALREPAYMENTPLANENTITYCOL.length > 0) {
      return this._dataService.PROPOSALREPAYMENTPLANENTITYCOL.value.filter(r => r.RowState !== DataRowState.Removed) as Array<IProposalRepaymentPlanEntity>;
    }
    else {
      return [] as Array<IProposalRepaymentPlanEntity>;
    }
  }

  public get TotalAssetCost() {
    let TotalAmount = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        TotalAmount +=
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .TOTALCOST.value;
      });
    }
    return TotalAmount;
  }

  public get TotalCashDepositAmt() {
    let TotalAmount = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        TotalAmount +=
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .CASHDEPOSITAMT.value;
      });
    }
    return TotalAmount;
  }

  public get TotalCashDepositPct() {
    if (this.TotalCashDepositAmt == 0 || this.TotalAssetCost == 0) {
      return 0;
    }
    let totalAmount = this.TotalCashDepositAmt / this.TotalAssetCost;
    return totalAmount;
  }

  public get TotalNetFinancedAmt() {
    let TotalAmount = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        TotalAmount +=
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .ADJUSTEDFINANCEDAMT.value;
      });
    }
    return TotalAmount;
  }

  public get TotalNetFinancedPct() {
    if (this.TotalNetFinancedAmt == 0 || this.TotalAssetCost == 0) {
      return 0;
    }
    let totalAmount = 0;
    if (this.TotalAssetCost > 0) {
      totalAmount = this.TotalNetFinancedAmt / this.TotalAssetCost;
    }
    return totalAmount;
  }
  public get TotalDownPaymentRF() {
    let totalDownPaymentRF = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        totalDownPaymentRF +=
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .DSCTAMNTOTO.value;
      });
    }
    return totalDownPaymentRF;
  }

  public get TotalDownPaymentRFPct() {
    if (this.TotalDownPaymentRF == 0 || this.TotalAssetCost == 0) {
      return 0;
    }
    let totalPctAmount = (this.TotalDownPaymentRF / this.TotalAssetCost) * 100;
    return Number(totalPctAmount.toFixed(2));
  }

  public get TotalInterestAmount() {
    let totalAmount = 0;
    if (this.RepaymentPlan != null && this.RepaymentPlan.length > 0) {
      totalAmount = this.RepaymentPlan.reduce((sum, current) => sum + current.PRPLRPMTPLAN.INTERESTAMT, 0);
    }
    return totalAmount;
  }

  public get TotalPayableAmt() {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        totalAmount +=
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .TOTALPAYABLEAMT.value;
      });
    }
    return totalAmount;
  }
  public get TotalRentalAmt() {
    let TotalRentalAmt = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        TotalRentalAmt +=
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .BALANCEPAYABLE.value;
      });
    }
    return TotalRentalAmt;
  }
  public get TotalTradeInAmt() {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        if (
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .TOTALCOST.value <= 0
        ) {
          totalAmount = 0;
        } else {
          totalAmount +=
            p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
              .TRADEINAMT.value;
        }
      });
    }
    return totalAmount;
  }

  // public get TotalSecurityDepositAmt(){
  //   let amount=0;
  //   if(this._dataService.PROPOSALARTICLE.controls!=null && this._dataService.PROPOSALARTICLE.controls.length>0){
  //     if(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.SECURITYDEPIND.value==true){
  //       this._dataService.PROPOSALARTICLE.controls.forEach(p=>{
  //         amount+=p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.SECURITYDEPOSITAMT.value;
  //       })
  //     }
  //     return amount;
  //   }
  //   return amount;
  // }

  public get TotalOnRoadCostAmt() {
    let totalAmount = 0;
    if (this._dataService.PROPOSALARTICLE.value != null) {
      this._dataService.PROPOSALARTICLE.controls.forEach((p) => {
        if (
          p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .TOTALCOST.value <= 0
        ) {
          totalAmount = 0;
        } else {
          totalAmount +=
            p.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
              .ONROADCOSTAMT.value;
        }
      });
    }
    return totalAmount;
  }

  public set TotalAssetCost(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALCOST.setValue(
      amount
    );
  }

  public set TotalCashDepositAmt(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.setValue(
      amount
    );
  }

  public set TotalCashDepositPct(amount: number) {
    this.totalCashDepositPct = amount;
  }

  public set TotalNetFinancedAmt(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.setValue(
      amount
    );
  }

  public set TotalNetFinancedPct(amount: number) {
    this.totalNetFinancedPct = amount;
  }

  public set TotalDownPaymentRF(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.setValue(
      amount
    );
  }

  public set TotalDownPaymentRFPct(amount: number) {
    this.totalDownPaymentRFPct = amount;
  }

  public set TotalInterestAmount(amount: number) {
    this._dataService.PROPOSALREPAYMENTPLANENTITYCOL.controls.forEach(
      (x) => {
        x.controls.PRPLRPMTPLAN.controls.INTERESTAMT.setValue(amount);
      }
    );
  }

  public set TotalPayableAmt(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALPAYABLEAMT.setValue(
      amount
    );
  }

  public set TotalRentalAmt(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.BALANCEPAYABLE.setValue(
      amount
    );
  }

  public set TotalTradeInAmt(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.setValue(
      amount
    );
  }

  public set TotalFinancedCharges(amount: number) {
    this._dataService.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach(
      (x) => {
        x.controls.TAXINCULSIVEAMT.setValue(amount);
      }
    );
  }

  public set TotalOnRoadCostAmt(amount: number) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ONROADCOSTAMT.setValue(
      amount
    );
  }

  public get OJKTotalIncomeComponents() {
    let OJKTotalIncomeComponents = this._formBuilder.array<IProposalArticleComponentEntity>([])
    if (
      this._dataService.PROPOSAL.controls.FINANCETYP.value !=
      FinanceType.Refinance &&
      this._dataService.PROPOSALARTICLE.controls.length > 0 &&
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL
        .controls.length > 0
    ) {
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(
        (p) => {
          if (
            (p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value ==
              AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value ==
              AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value ==
              AmountComponent.GetStringValue(AmountComponent.InsuranceCommission)) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed)
            OJKTotalIncomeComponents.push(this._proposalEntityMapperService.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), p.value as IProposalArticleComponentEntity));
        }
      );
      // if (OJKTotalIncomeComponents.controls.length >= 1) {
      //   let arr: Array<IProposalArticleComponentEntity> = OJKTotalIncomeComponents.value as Array<IProposalArticleComponentEntity>
      //   arr.forEach((element, index) => {
      //     this._proposalEntityMapperService.ProposalArticleComponentEntityMapper(OJKTotalIncomeComponents.controls[index], element);
      //   });
      // }
      OJKTotalIncomeComponents.controls.forEach(x => {
        x.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue((Number(x.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value))))
      })

      //   OJKTotalIncomeComponents.AddRange(DataContext.PROPOSALARTICLE[this.Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL
      //     .FindAll(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.AdminFee.GetStringValue()
      //     || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.ProvisionFee.GetStringValue()
      //     || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.InsuranceCommission.GetStringValue()
      //     ).Distinct());
      // OJKTotalIncomeComponents = OJKTotalIncomeComponents.GroupBy(x => x.PRPLARTEAMNTTRAN.AMTCMPTCDE)
      // .Where(g => g.Count() >= 1)
      // .Select(g => g.First()).ToGenericCollection();
      // OJKTotalIncomeComponents.ForEach(p => p.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = ((AmountComponent)Enum.Parse(typeof(AmountComponent), p.PRPLARTEAMNTTRAN.AMTCMPTCDE, false)).GetDescriptionStringValue());

    }
    return OJKTotalIncomeComponents;
  }
  public get skipEngChasBPKBValidations(): boolean {
    return this.skipEngChasBPKBValidationsss;
  }

  public set skipEngChasBPKBValidations(value: boolean) {
    this.skipEngChasBPKBValidationsss = value;
  }


  public get RentalsAreCalculated(): boolean {
    return this.m_resubmitCalculated;
  }
  public set RentalsAreCalculated(value: boolean) {
    this.m_resubmitCalculated = value;
  }

  public isProposalFieldsEmpty(isCalculated: Boolean): Array<string> {
    let financeType = "";
    //initializing array of messages on every submit click
    this.msg = [];

    this.ValidateGeneralData(financeType);

    if (this.msg.length > 0) {
      return this.msg; //Initial Data is missing. It needs to be filled first
    }

    if (this._dataService.PROPOSAL.value != null) {

      let applicants = this._dataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed) as Array<IProposalApplicantEntity>;
      let articalEntity = this._dataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;

      // #region Validations for Hard Coded Mandatory Fields

      // RF Business Implementation
      if (this._dataService.PROPOSAL.value.FINANCETYP != null && this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance
        && this._dataService.PROPOSALAPPLICANT.value != null && this._dataService.PROPOSALARTICLE.value != null) {
        this.ValidateRFMandatoryFields(applicants, articalEntity);
      }


      if (this._dataService.PROPOSAL.value.FINANCETYP != null && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance
        && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease && this._dataService.PROPOSALAPPLICANT.value != null && this._dataService.PROPOSALARTICLE.value != null)
        this.ValidateCFMandatoryFields(applicants, articalEntity);

      //OL - Hassan Kalim - OL needed separate validations

      if (this._dataService.PROPOSAL.value.FINANCETYP != null && this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease
        && this._dataService.PROPOSALAPPLICANT.value != null && this._dataService.PROPOSALARTICLE.value != null)
        this.ValidateOLMandatoryFields(applicants, articalEntity);

      if (this._dataService.PROPOSAL.value.FINANCETYP != null)
        this.ValidateHardCodedMandatoryFields(applicants);

      //#endregion

      //#region Applicant's Data validation

      if (applicants.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower).length == 0) {
        this.msg.push("msgAddBorrower" + "\n");
      }
      else {
        if (applicants != null)
          this.ValidateApplicantsData(applicants);
      }


      //#endregion


      //TODO Insurance's validation
      // //#region Insurance's Data Validation
      if (this._dataService.PROPOSAL.controls.FINANCETYP && this._dataService.PROPOSAL.controls.FINANCETYP.value !== FinanceType.OperatingLease) {
        if (isCalculated == true && this._dataService != null
          && this._dataService.PROPOSAL != null
          //&& DataContext.PROPOSAL.FINANCETYP != FinanceType.Refinance.GetStringValue()
          //&& DataContext.PROPOSAL.FINANCETYP != FinanceType.PACMAS.GetStringValue()
          && this.MainInsuranceEntity != null
          && this.MainInsuranceEntity.controls.PRPLINSR != null
          && this.MainInsuranceEntity.controls.STANDARDINSURANCE != null
          && this.MainInsuranceEntity.controls.STANDARDINSURANCE.value.filter(item => item.RowState != DataRowState.Removed).length > 0)
        //&& (this.MainInsuranceEntity.STANDARDINSURANCE.Where(s => s.PRPLSTNDINSR.COLLECTIONMETHODCDE != InsuranceCollectionTypes.LeaseClause.GetStringValue()).Count() > 0)
        {
          this.msg.push("CalInsr");
        }

        if (this.MainInsuranceEntity != null
          && this.MainInsuranceEntity.controls.PRPLINSR != null
          && this.MainInsuranceEntity.controls.PRPLINSR.controls.INSURER == null
          //&& this.DataContext.PROPOSAL.FINANCETYP == FinanceType.PACMAS.GetStringValue())
          && this._dataService.PROPOSAL.controls.ISPACKAGE) {
          this.msg.push("msgSelectedInsurarCompany");
        }

      }
      // if (this.msg.length > 0)
      // {

      //     return this.msg.length > 1 ? true : false; //CF Insurance is not calculated. It needs to be calculated.
      // }

      if (this.MainInsuranceEntity
        && this.MainInsuranceEntity.controls.PRPLINSR != null
        && this._dataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.OperatingLease
        //&& this.DataContext.PROPOSAL.FINANCETYP != FinanceType.PACMAS.GetStringValue()
        && !this._dataService.PROPOSAL.controls.ISPACKAGE
        && this.MainInsuranceEntity.controls.PRPLINSR.controls.DEPRECIATIONPOLICYCDE == null) {

        this.msg.push("msgmissingdepriciation");

      }

      if (this.msg.length > 0) {
        return this.msg;  //Applicant's Data is missing. It needs to be filled second
      }
      // #endregion

      //#region Article's Data validation

      if (articalEntity != null) {
        if (articalEntity) {
          this.ValidateArticleData(financeType);
        }
        else {
          this.msg.push("msgSelectAsset");
        }

        if (this.msg.length > 0) {
          return this.msg;  //Articles's Data is missing. It needs to be filled thridly
        }
      }
      //#endregion

      //#region New Validations SOCD-14409, SOCD-14021

      // TODO for insurance validations
      // if (this.DataContext != null
      //     && DataContext.PROPOSAL != null
      //     && DataContext.PROPOSAL.FINANCETYP != FinanceType.Refinance.GetStringValue()
      //     && DataContext.PROPOSALARTICLE != null
      //     && this.MainInsuranceEntity != null
      //     && this.MainInsuranceEntity.PRPLINSR != null
      //     )
      // {
      //     if (this.MainInsuranceEntity.PRPLINSR.RECEIVEBYDEALERIND)
      //     {
      //         for (int i = 0; i < DataContext.PROPOSALARTICLE.Count; i++)
      //         {
      //             ProposalArticleEntity asset = DataContext.PROPOSALARTICLE[i];

      //             if (asset.ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.FindAll(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.UpfrontInsurancePremium.GetStringValue()).Count != 2)
      //             {
      //                 this.msg.push("msgUpfrontInsurancePremiumMissing");
      //             }

      //         }
      //     }
      //     if (msg.Length > 0)
      //     {
      //         return msg.Length > 1 ? true : false;
      //     }
      // }

      if (this._dataService.PROPOSAL.value != null
        && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance
        && this._dataService.PROPOSALARTICLE.value != null
      ) {
        let asset = articalEntity as IProposalArticleEntity;
        if (asset.ASSETENTITY.PROPOSALADMINFEEDETAIL.RECEIVEDBYDEALERIND
          && asset.ASSETENTITY.PROPOSALADMINFEEDETAIL.UPFRONTADMINFEE > 0
          && asset.ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.filter(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.UpfrontAdminFee) && p.PRPLARTEAMNTTRAN.RowState !== DataRowState.Removed).length != 2) {
          this.msg.push("msgUpfrontAdminFeeMissing");
        }
        if (asset.ASSETENTITY.PROPOSALPROVISIONFEEDETAIL.RECEIVEDBYDEALERIND
          && asset.ASSETENTITY.PROPOSALPROVISIONFEEDETAIL.PROVISIONFEEUPFRONT > 0
          && asset.ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.filter(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.UpfrontProvisionFee) && p.PRPLARTEAMNTTRAN.RowState !== DataRowState.Removed).length != 2) {
          this.msg.push("msgUpfrontProvisionFeeMissing");
        }

        if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.GPALLOWEDIND && asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.GPTERMS == 0) {
          this.msg.push("IncoGPTerms");

        }
        if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.GPALLOWEDIND && asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.GPFREQUENCY == 0) {
          this.msg.push("IncoGPFreq");

        }

      }
      if (this.msg.length > 0) {
        return this.msg;
      }
    }

    //#endregion



    if (!this.RentalsAreCalculated) {
      this.msg.push("RentalsNotCalculated");
      if (this.msg.length > 0) {
        return this.msg;
      }
    }

    return this.msg;
  }

  private ValidateGeneralData(financeType: string): Array<string> {
    //let msg: Array<string>=[];

    if (this._dataService.PROPOSAL.value.BPCOMPANYID <= 0) {
      this.msg.push("SelectFinanceCompany");
    }
    if (this._dataService.PROPOSAL.value.BPCOMPANYBRANCHID <= 0) {
      this.msg.push("SelectFinanceCompanyBranch");
    }
    if (this._dataService.PROPOSAL.value.BPINTRODUCERID <= 0) {
      this.msg.push("SelectIntroducer");
    }
    financeType = "";
    if (this._dataService.PROPOSAL.value.FINANCETYP == null || this._dataService.PROPOSAL.value.FINANCETYP == "") {
      this.msg.push("SelectFinancialCampaignGroup");
    }
    else {
      financeType = this._dataService.PROPOSAL.value.FINANCETYP;
    }

    if (this._dataService.PROPOSAL.value.FINANCIALPRODUCTID <= 0) {
      this.msg.push("SelectFinancialCampaign");
    }

    if (this._dataService.PROPOSAL.value.CURRENCYCDE == null || this._dataService.PROPOSAL.value.CURRENCYCDE == ""
      || this._dataService.PROPOSAL.value.CURRENCYCDE == "00000"
    ) {
      if (this._dataService.PROPOSAL.value.PROPOSALNBR != null && this._dataService.PROPOSAL.value.PROPOSALNBR.substring(0, 2) == "TM")
        this.msg.push("SelectTemplateCurrency");
      else
        this.msg.push("SelectApplicationCurrency");
    }

    /// OL Implementation
    /// GAP 1.0
    /// 09-08-2017
    /// In Refinance, Supplier is not mandatory

    if (financeType != FinanceType.Refinance && financeType != FinanceType.HirePurchase) {
      if (financeType == FinanceType.OperatingLease &&
        this._dataService.PROPOSALARTICLE.value != null &&
        this._dataService.ASSETENTITY.value != null &&
        this._dataService.PROPOSALASSET.value != null &&
        (this._dataService.PROPOSALASSET.value.SUPPLIERNAME == null || this._dataService.PROPOSALASSET.value.SUPPLIERNAME == '')) {
        this.msg.push("msgSupplierSearchNoSelectMessage");

      }
      else if (financeType != FinanceType.OperatingLease && financeType != FinanceType.HirePurchase &&
        this._dataService.PROPOSALARTICLE.value != null &&
        this._dataService.ASSETENTITY.value != null &&
        this._dataService.PROPOSALASSET.value != null &&
        (this._dataService.PROPOSALASSET.value.SUPPLIERNAME == null ||
          this._dataService.PROPOSALASSET.value.SUPPLIERNAME == '' ||
          this._dataService.PROPOSALASSET.value.BPINTRODUCERID == null ||
          this._dataService.PROPOSALASSET.value.BPINTRODUCERID <= 0) && this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN != true) //Added in OL Merging
      {
        this.msg.push("msgSupplierSearchNoSelectMessage");
      }
    }

    return this.msg;


  }

  private ValidateOLMandatoryFields(applicantEntityCollection: Array<IProposalApplicantEntity>, proposalArticle: IProposalArticleEntity) {

    applicantEntityCollection.forEach(entity => {
      if (entity.PROPOSALAPPLICANT != null && entity.PROPOSALAPPLICANT.ROLECDE != null && entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
        if (entity.PROPOSALAPPLICANTMAIN != null && entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP != null && entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I") {
          if (entity.INDIVIDUALAPPLICANT != null) {
            if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL != null && entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.SALARY <= 0) {
              this.msg.push("msgSalaryLessThanZero");
            }
          }
        }
      }
      if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I" && entity.INDIVIDUALAPPLICANT != null) {
        if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE == MaritalStatus.Married) {
          if (entity.PROPOSALAPPLICANT.ROLECDE != null
            && entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL != null) {
            //For Borrower
            if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHPLACE == "").length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceBirthplaceEmptyofBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.EXPIRYIDDATE == null).length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceExpiryDateEmptyofBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.SPOUSEADDRESS == "").length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceAddressEmptyofBorrower");
              }
            }
            //For Co-Borrower
            else if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.CoBorrower) {
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHPLACE == "").length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceBirthplaceEmptyofCoBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.EXPIRYIDDATE == null).length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceExpiryDateEmptyCoBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.SPOUSEADDRESS == "").length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceAddressEmptyofCoBorrower");
              }
            }
            //For Guarantor
            else if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Guarantor) {
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHPLACE == "").length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceBirthplaceEmptyofGuranter");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.EXPIRYIDDATE == null).length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {

                this.msg.push("msgSpouceExpiryDateEmptyofGuarantor");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.SPOUSEADDRESS == "").length == entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.length) {
                this.msg.push("msgSpouceAddressEmptyofGuarantor");
              }
            }
          }

        }

        if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower &&
          entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY != null && entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.length > 0) {
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.NAME == "")).length > 0) {
            this.msg.push("msgFamilyMembNameEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.DATEOFBIRTH == null)).length > 0) {
            this.msg.push("msgFamilyMembDOBEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.FAMCRDNUM == "")).length > 0) {
            this.msg.push("msgFamilyCardNoEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.RELATIONSHIPCDE == "")).length > 0) {
            this.msg.push("msgFamilyRelationshipEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.GENDER == "")).length > 0) {
            this.msg.push("msgFamilyGenderEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.OCCUPATIONCDE == "")).length > 0) {
            this.msg.push("msgFamilyOccupationEmpty");
          }
        }
      }
      entity.ADDRESS.forEach(adr => {
        if (adr.PROPOSALADDRESSTYPEDETAIL.filter(k => k.DEFAULTIND == true).length > 0) {
          if (adr.PROPOSALAPPLICANTPHONEFAX.filter(p => p.PHONETYPECDE == "00003").length == 0) {
            this.msg.push("msgMobileNumberEmpty");
          }
        }
      })
    })

    if (proposalArticle.ASSETENTITY) {
      if (proposalArticle.ASSETENTITY.PROPOSALASSET && !proposalArticle.ASSETENTITY.PROPOSALASSET.USAGETYPECODE) {
        this.msg.push("msgAsstUsgeTypeEmpty");
      }
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL) {
        if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY != ApplicantType.Company) {
          if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.GENDER || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.GENDER == "")
            this.msg.push("msgBPKBOwnerGenderEmpty");

          if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB)
            this.msg.push("msgBPKBOwnerDOB");
          if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE)
            this.msg.push("msgBPKBOwnerMaritalStatus");

          if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE
            && proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE == MaritalStatus.Married
            && !proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNERSPOUSENME)
            this.msg.push("msgBPKBOwnerSpouseName");
        }

        if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.ADDSDSC) {
          this.msg.push("msgBPKBOwnerAddress");
        }
      }

      if (proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL) {
        if (proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.CITYOFREGISTRATIONOTO <= 0)
          this.msg.push("msgCityofRegisteration");
      }

      let applicantEntity = this._dataService.PROPOSALAPPLICANT.controls.find(p => p.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == RoleCode.Borrower) as FormGroup<IProposalApplicantEntity>;
      this.SetDefaultAddress(proposalArticle, applicantEntity);
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOPROVINCE == 0) {
        this.msg.push("msgBPKBProvince");
      }
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKOTAMADYA == 0) {
        this.msg.push("msgBPKBKotamadya");
      }
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKECAMATAN == 0) {
        this.msg.push("msgBPKBKecamatan");
      }
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTODESA == 0) {
        this.msg.push("msgBPKBKelurahan");
      }
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORT == null || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORT == "") {
        this.msg.push("msgBPKBRT");
      }
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORW == null || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORW == "") {
        this.msg.push("msgBPKBRW");
      }


    }

    if (this._dataService.PROPOSAL.value.MARKETINGOFFICERID <= 0) {
      this.msg.push("msgmarketingofficer");
    }



    return this.msg;
  }

  private SetDefaultAddress(article: IProposalArticleEntity, applicantEntity: FormGroup<IProposalApplicantEntity>) {
    if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER != null &&
      article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNER == OTO_BPKBOwnerType.Borrower
    ) {
      if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKOTAMADYA == null ||
        article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKECAMATAN == null ||
        article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTODESA == null) {
        let isFirstLegal = true;
        let borrowerAddress = {} as IPRPL_APLT_ADDSInfo;

        applicantEntity.value.ADDRESS.forEach(addressType => {
          if (addressType.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.Legal).length > 0 && isFirstLegal) {
            isFirstLegal = false;
            borrowerAddress = addressType.PROPOSALAPPLICANTADDRESS as IPRPL_APLT_ADDSInfo;
          }
        })

        this._dataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOKOTAMADYA.setValue(Number(borrowerAddress.KOTAMADYAIDOTO));
        this._dataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTOKECAMATAN.setValue(Number(borrowerAddress.KECAMATANIDOTO));
        this._dataService.PROPOSALARTICLEFORMGROUP.controls.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.OTODESA.setValue(Number(borrowerAddress.KELURAHANIDOTO));
      }
    }
  }

  private ValidateHardCodedMandatoryFields(applicantEntityCollection: Array<IProposalApplicantEntity>) {
    applicantEntityCollection.forEach(entity => {
      if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
        entity.PROPOSALAPPLICANTBANK.forEach(bank => {
          if (bank.OTHERBRANCHIND) {
            if (!bank.OTOOTHRBRANCHNME && bank.RowState !== DataRowState.Removed) {
              this.msg.push("msgBankBranchMissing");
              //break;
            }
          }
          else {
            if ((bank.BANKBRANCHBPID == 0 || bank.BANKBRANCHBPID == null || bank.BANKBRANCHBPID == undefined || String(bank.BANKBRANCHBPID) == "") && bank.RowState !== DataRowState.Removed) {
              this.msg.push("msgBankBranchMissing");
              //break;
            }
          }
        })
      }
    })
  }

  private ValidateApplicantsData(applicantEntityCollection: Array<IProposalApplicantEntity>) {
    this.app_count = 0;
    applicantEntityCollection.forEach(entity => {
      let title = this.getTitle(entity.PROPOSALAPPLICANT.ROLECDE, entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP);
      if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I") {
        if (entity.INDIVIDUALAPPLICANT != null && entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL != null) {
          this.IndividualApplicantValidation(entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL, title);
        }
        // if (entity.PROPOSALAPPLICANTIDDETAIL[0] == null || entity.PROPOSALAPPLICANTIDDETAIL[0].ISSUEDTE == null) {
        //   this.msg.push("msgIDIssueDate");
        // }
        // if (entity.PROPOSALAPPLICANTIDDETAIL[0] == null || entity.PROPOSALAPPLICANTIDDETAIL[0].EXPIRYDTE == null) {
        //   this.msg.push("msgIDExpiryDate");
        // }
      }
      else {
        if (entity.COMPANYAPPLICANT != null && entity.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY != null) {
          this.ComapnyApplicantValidation(entity.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY, title);
        }
      }
      if (this._dataService.PROPOSAL.value != null && this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease && entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
        if (entity.PROPOSALAPPLICANTMAIN != null && (entity.PROPOSALAPPLICANTMAIN.ACCTYPCDE == "" || entity.PROPOSALAPPLICANTMAIN.ACCTYPCDE == null)) {
          this.msg.push("msgOLAccountingType");
        }
        if (entity.PROPOSALAPPLICANTMAIN != null && (entity.PROPOSALAPPLICANTMAIN.INVCOPTNCDE == "" || entity.PROPOSALAPPLICANTMAIN.INVCOPTNCDE == null)) {
          this.msg.push("msgOLInvoiceOption");
        }
      }

      this.ValidateAddressData(entity as IProposalApplicantEntity, title);
      this.ValidateApplicantBankData(entity as IProposalApplicantEntity, title);
      this.ValidateEmploymentAndReferenceData(entity as IProposalApplicantEntity, title);
      this.ValidateFamilyData(entity as IProposalApplicantEntity, title);
      //----commented following method because in this method only email validation occurs which will be done through validator
      //this.ValidateBusinessData(entity.value as IProposalApplicantEntity,title);
      this.app_count++;

    })
    var signatoryMsg = this.CheckSignatoryTypeValid(true);
    if (signatoryMsg.length > 0) {
      this.msg.push(signatoryMsg);
    }
  }

  private getTitle(rolecode: string, applicanttype: string): string {
    let title = "";
    if (applicanttype == "I") {
      if (rolecode == RoleCode.Borrower) {
        title = "Borrower";
      }
      else if (rolecode == RoleCode.Guarantor) {
        title = "Guarantor Individual-" + String(this.app_count);
      }
      else if (rolecode == RoleCode.CoBorrower) {
        title = "Co-Borrower Individual-" + String(this.app_count);
      }

    }
    else if (applicanttype == "C") {
      if (rolecode == RoleCode.Borrower) {
        title = "Borrower";
      }
      else if (rolecode == RoleCode.Guarantor) {
        title = "Guarantor Company-" + String(this.app_count);
      }
      else if (rolecode == RoleCode.CoBorrower) {
        title = "Co-Borrower Company-" + String(this.app_count);
      }

    }

    return title;
  }

  private IndividualApplicantValidation(info: IPRPL_APLT_INDVInfo, title: string) {
    if (info.IDCARDNBR == null || info.IDCARDNBR == "") {
      this.msg.push("plzEntIDNBR");
    }
    if (info.FIRSTNME == null || info.FIRSTNME == "") {
      this.msg.push("plzEntfirstName");
    }
    if (info.DATEOFBIRTH != null && info.DATEOFBIRTH > new Date()) {
      let temp = "Borrower";
      this.msg.push("msgWrongDateOfBirthApplicant" + "," + title);
    }

    //---Email Address Validation Already done with Validator

    // if (!string.IsNullOrWhiteSpace(info.EMAILADDRESS))
    //   {
    //       if (!(ValidateEmailAddress(info.EMAILADDRESS, title)))
    //       {
    //           title += " at Applicant";
    //           this.msg.push("plzEntEmail" + "," + title);
    //       }
    //   }

  }
  //----Email Validation commented because it will be done through Validator

  // private bool ValidateEmailAddress(string emailAddress, string title)
  // {
  //     string regexPattern = @"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$";
  //     Regex reg = new Regex(regexPattern, RegexOptions.IgnoreCase);
  //     if (!reg.IsMatch(emailAddress))
  //     {
  //         return false;
  //         //this.msg.push("Please enter "+title+"'s Valid Email address.");
  //     }
  //     return true;
  // }

  private ComapnyApplicantValidation(entity: IPRPL_APLT_COMYInfo, title: string) {
    if (entity.NAME == null || entity.NAME == "") {
      this.msg.push("plzEntName");
    }
    if (entity.COMPANYNBR == null || entity.COMPANYNBR == "") {
      this.msg.push("plzEntCustID");
    }
    if (entity.LASTREGISTRATIONDTE != null && entity.LASTREGISTRATIONDTE > new Date()) {
      this.msg.push("msgLastRegDateCannotFutureDate");
    }
    if (entity.ESTABLISHEDSINCE != null && entity.ESTABLISHEDSINCE > new Date()) {
      this.msg.push("msgEstbSinceDateCannotFutureDate");
    }
  }

  private ValidateAddressData(entity: IProposalApplicantEntity, title: string) {
    let ind = false, legal = false, emergency = false, contact = false, blnHouseOwnerShipSelected = true, blnMobilePhone = true, isphoneFormatValid = true;
    if (entity.ADDRESS.length > 0) {
      entity.ADDRESS.forEach(item => {
        if (item.PROPOSALAPPLICANTADDRESS.TEMPLATEMAINID == null) {
          this.msg.push("msgSelectAddressTemplate");
        }
        else {
          if ((entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I" && item.PROPOSALADDRESSTYPEDETAIL.filter(x => x.ADDRESSTYPECDE == AddressTypeCode.Residential && x.RowState !== DataRowState.Removed).length > 0) ||
            (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "C" && item.PROPOSALADDRESSTYPEDETAIL.filter(x => x.ADDRESSTYPECDE == AddressTypeCode.Official && x.RowState !== DataRowState.Removed).length > 0)) {
            ind = true;
          }
          if ((entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I" && item.PROPOSALADDRESSTYPEDETAIL.filter(x => x.ADDRESSTYPECDE == AddressTypeCode.Legal && x.RowState !== DataRowState.Removed).length > 0)) {
            legal = true;
          }
          if (item.PROPOSALADDRESSTYPEDETAIL.filter(x => x.ADDRESSTYPECDE == AddressTypeCode.Mailing && x.RowState !== DataRowState.Removed).length > 0) {
            contact = true;
          }
          if ((item.PROPOSALADDRESSTYPEDETAIL.filter(x => x.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress && x.RowState !== DataRowState.Removed).length > 0) && entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower
            || entity.PROPOSALAPPLICANT.ROLECDE != RoleCode.Borrower) {
            emergency = true;
          }
          if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower && item.PROPOSALADDRESSTYPEDETAIL.filter(x => x.ADDRESSTYPECDE == AddressTypeCode.Legal && x.RowState !== DataRowState.Removed).length > 0) {
            if (item.PROPOSALAPPLICANTADDRESS.HOUSINGOWNERSHIPCDE == null || item.PROPOSALAPPLICANTADDRESS.HOUSINGOWNERSHIPCDE == "")
              blnHouseOwnerShipSelected = false;
            if (item.PROPOSALAPPLICANTPHONEFAX.filter(p => p.PHONETYPECDE == "00003").length == 0)
              blnMobilePhone = false;

            item.PROPOSALAPPLICANTPHONEFAX.forEach(_phoneFax => {
              if (_phoneFax.PHONETYPECDE == "00003" && (_phoneFax.NUMBER == null || _phoneFax.NUMBER == "")) {
                blnMobilePhone = false;
              }
            })
          }

          //----phone number validation will be done through validator
          // if (item.PROPOSALAPPLICANTPHONEFAX != null && item.PROPOSALAPPLICANTPHONEFAX.length > 0){
          //   item.PROPOSALAPPLICANTPHONEFAX.forEach(phone=>{
          //     if(phone.NUMBER!=null){

          //     }
          //   })
          //             foreach (PRPL_APLT_PHNE_FAXInfo phone in item.PROPOSALAPPLICANTPHONEFAX)
          //             {
          //                 if (phone.NUMBER != null)
          //                 {
          //                     if (this.isPhoneNoValid(phone.NUMBER) == false)
          //                     {
          //                         isphoneFormatValid = false;
          //                     }
          //                 }
          //             }
          // }
        }
      })

      if (!blnHouseOwnerShipSelected) { this.msg.push("plzslctHouseOwnerLegalAddsforBorr"); }
      if (!blnMobilePhone) { this.msg.push("plzslctMobileLegalAddsforBorr"); }

      //phone number validation commented
      // if (isphoneFormatValid == false)
      // { this.msg.push("msgInvalidPhoneNo"); }

      if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I" && !legal) {
        if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
          this._messageService.showCustomMesssage("Please select Legal Address Type detail for " + RoleCode.GetStringValueByCode(entity.PROPOSALAPPLICANT.ROLECDE), MessageType.Warning);
          this.isProposalRequestValid = false;
          //this.msg.push("plzslctAddforLegal" + "," + entity.PROPOSALAPPLICANT.ROLECDE);
        }
        else {
          this._messageService.showCustomMesssage("Please select Legal Address Type detail for " + RoleCode.GetStringValueByCode(entity.PROPOSALAPPLICANT.ROLECDE), MessageType.Warning);
          this.isProposalRequestValid = false;
          //this.msg.push("plzslctAddforLegal" + "," + entity.PROPOSALAPPLICANT.ROLECDE + " Individual-" + this.app_count);
        }
      }
      if (!ind) {
        if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I")
          if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
            this._messageService.showCustomMesssage("Please select Residential Address Type detail for " + RoleCode.GetStringValueByCode(entity.PROPOSALAPPLICANT.ROLECDE), MessageType.Warning);
            this.isProposalRequestValid = false;
          }
          else {
            this._messageService.showCustomMesssage("Please select Residential Address Type detail for " + RoleCode.GetStringValueByCode(entity.PROPOSALAPPLICANT.ROLECDE), MessageType.Warning);
            this.isProposalRequestValid = false;
          }
        else
          if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
            this._messageService.showCustomMesssage("Please select Official Address Type detail for " + RoleCode.GetStringValueByCode(entity.PROPOSALAPPLICANT.ROLECDE), MessageType.Warning);
            this.isProposalRequestValid = false;
            //   let msg = ["plzslctAddforOffical"];
            // this._messageService.showNewMesssage(msg, "Borrower", MessageType.Info)
          }
          else {
            let roleCode = entity.PROPOSALAPPLICANT.ROLECDE
            if (roleCode == ApplicantRoleCode.CoBorrower) {
              roleCode = "CoBorrower";
            }
            else if (roleCode == ApplicantRoleCode.Dealer) {
              roleCode = "Dealer";
            }
            else {
              roleCode = "Guarantor";
            }
            this._messageService.showCustomMesssage("Please select Official Address Type detail for " + RoleCode.GetStringValueByCode(entity.PROPOSALAPPLICANT.ROLECDE), MessageType.Warning);
            this.isProposalRequestValid = false;
            // let msg = ["plzslctAddforOffical"];
            // this._messageService.showNewMesssage(msg, roleCode, MessageType.Info);
          }
      }
      if (!emergency) {
        this.msg.push("plzslctAddforEmergency");
      }
      if (!contact) {
        this.msg.push("plzslctAddforContact");

      }
      if (entity.ADDRESS.length >= 2 && entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
        this.CompareAddresses(entity.ADDRESS);
      }
      this.EmergencyAddressDetailValidate(entity.ADDRESS);

      if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
        this.ContactAddressDetailValidate(entity.ADDRESS);
      }

      this.ValidateDefaultAddress(entity.ADDRESS);
      this.ValidateApplicableddress(entity.ADDRESS);

    }
    else {
      this.msg.push("plzEntAddr");
    }
  }

  private CompareAddresses(entityList: Array<IAddressEntity>) {
    let entity1 = {} as IAddressEntity;
    let entity2 = {} as IAddressEntity;
    entityList.forEach(item => {
      if (item.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.Residential && p.RowState != DataRowState.Removed).length > 0 ||
        item.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.Mailing && p.RowState != DataRowState.Removed).length > 0 ||
        item.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.Invoice && p.RowState != DataRowState.Removed).length > 0 ||
        item.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.Official && p.RowState != DataRowState.Removed).length > 0) {
        entity1 = item;
      }
      else if (item.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress && item.RowState != DataRowState.Removed).length > 0) {
        entity2 = item;
      }
    })

    if (entity2.PROPOSALAPPLICANTADDRESS == null || entity2.PROPOSALAPPLICANTADDRESS.ADDRESSOTO == null || entity2.PROPOSALAPPLICANTADDRESS.ADDRESSOTO == '') {
      this.msg.push("plzinputemergencyaddress");
      return;
    }
    if (entity1.PROPOSALAPPLICANTADDRESS != null && entity2.PROPOSALAPPLICANTADDRESS != null) {

      var address1 = this.RemoveSpaces(entity1.PROPOSALAPPLICANTADDRESS.ADDRESSOTO);
      var address2 = this.RemoveSpaces(entity2.PROPOSALAPPLICANTADDRESS.ADDRESSOTO);
      if (address1 == address2) {
        this.msg.push("plzslctDiffAddress");
      }
    }
  }

  private RemoveSpaces(str: string) {
    if (str == null) {
      return null;
    }
    let tempArr = str.split(' ');
    let newArr = "";
    tempArr.forEach(ss => {
      if (ss != "") {
        newArr += ss.trim();
      }
    })
    return newArr.trim();
  }

  private EmergencyAddressDetailValidate(EntityCollection: Array<IAddressEntity>) {
    EntityCollection.forEach(item => {
      if (item.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.EmergencyAddress && p.RowState != DataRowState.Removed).length > 0) {
        if (item.PROPOSALAPPLICANTADDRESS.ADDRESSOTO == null || item.PROPOSALAPPLICANTADDRESS.ADDRESSOTO == "" || item.PROPOSALAPPLICANTPHONEFAX.length == 0 || item.PROPOSALAPPLICANTPHONEFAX.filter(p => p.RowState != DataRowState.Removed).length == 0) {
          this.msg.push("EmrgPhoneAddressMiss");
        }
      }
    })
  }

  private ContactAddressDetailValidate(EntityCollection: Array<IAddressEntity>) {
    let addsCount = 0;
    EntityCollection.forEach(item => {
      if (item.PROPOSALADDRESSTYPEDETAIL.filter(p => p.ADDRESSTYPECDE == AddressTypeCode.Mailing && p.RowState != DataRowState.Removed).length > 0) {
        addsCount++;
      }
    })
    if (addsCount > 1) {
      this.msg.push("msgContactAddressCountExceeded");
    }
  }

  private ValidateDefaultAddress(entity: Array<IAddressEntity>) {
    let result = false;

    for (let i = 0; i < entity.length; i++) {
      if (entity[i] != null) {
        let r = entity[i].PROPOSALADDRESSTYPEDETAIL.filter(k => k.RowState != DataRowState.Removed && k.DEFAULTIND == true).length == 0;

        if (!r) {
          result = true;
        }
      }

      entity[i].PROPOSALADDRESSTYPEDETAIL.forEach(PRPL_ADDS_TYP_DETLInfo => {
        if (PRPL_ADDS_TYP_DETLInfo.DEFAULTIND) {
          if ((entity[i].PROPOSALAPPLICANTADDRESS.KOTAMADYAIDOTO == null || entity[i].PROPOSALAPPLICANTADDRESS.KOTAMADYAIDOTO <= 0) && (entity[i].RowState != DataRowState.Removed)) {
            this.msg.push("msgKotamadyaKabupatenDflt")
            //break;
          }
        }
      })
    }
    if (!result) {
      this.msg.push("plzslctdefAdd");
    }
    // entity.forEach(item => {

    //   if (item != null) {
    //     result = item.PROPOSALADDRESSTYPEDETAIL.filter(k => k.DEFAULTIND == false).length == item.PROPOSALADDRESSTYPEDETAIL.length;
    //   }
    //   if (result) {
    //     this.msg.push("plzslctdefAdd");
    //   }

    //   item.PROPOSALADDRESSTYPEDETAIL.forEach(PRPL_ADDS_TYP_DETLInfo => {
    //     if (PRPL_ADDS_TYP_DETLInfo.DEFAULTIND) {
    //       if (item.PROPOSALAPPLICANTADDRESS.KOTAMADYAIDOTO == null || item.PROPOSALAPPLICANTADDRESS.KOTAMADYAIDOTO == 0) {
    //         this.msg.push("msgKotamadyaKabupatenDflt")
    //         //break;
    //       }
    //     }
    //   })

    // })
  }

  private ValidateApplicantBankData(applicantEntity: IProposalApplicantEntity, title: string) {
    if (applicantEntity.PROPOSALAPPLICANTBANK != null && applicantEntity.PROPOSALAPPLICANTBANK.length > 0) {
      if (applicantEntity.PROPOSALAPPLICANTBANK.filter(p => p.OTODEFAULTIND == true && p.RowState != DataRowState.Removed).length == 0) {
        if (applicantEntity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
          this.msg.push("SlctBrrwrDfltBank");
        }
        else if (applicantEntity.PROPOSALAPPLICANT.ROLECDE == RoleCode.CoBorrower) {
          this.msg.push("SlctCoBrrwrDfltBank");
        }
        else if (applicantEntity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Guarantor) {
          this.msg.push("SlctGrntrDfltBank");
        }
      }
      if (!this.CheckBankDuplicate(applicantEntity.PROPOSALAPPLICANTBANK.filter(p => p.RowState != DataRowState.Removed))) {
        if (applicantEntity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
          this.msg.push("duplicateBanksBorrower")
        }
        else if (applicantEntity.PROPOSALAPPLICANT.ROLECDE == RoleCode.CoBorrower) {
          this.msg.push("duplicateBanksCoBorrower")
        }
        else if (applicantEntity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Guarantor) {
          this.msg.push("duplicateBanksGuarantor")
        }
      }
    }
  }

  private CheckBankDuplicate(BankDetail: Array<IPRPL_APLT_BANKInfo>) {

    let bStatus = true;
    if (BankDetail.length > 1) {
      for (let index = 0; index < BankDetail.length - 1; index++) {
        for (let temp = 0; temp < BankDetail.length - 1; temp++) {
          if (temp + 1 != index) {
            if (BankDetail[index].BANKBPID == BankDetail[temp + 1].BANKBPID && BankDetail[index].BANKBRANCHBPID == BankDetail[temp + 1].BANKBRANCHBPID
              && BankDetail[index].ACCOUNTNBR == BankDetail[temp + 1].ACCOUNTNBR) {
              bStatus = false;
            }
          }
        }
      }
    }
    return bStatus;
  }

  private ValidateEmploymentAndReferenceData(applicantEntity: IProposalApplicantEntity, title: string) {
    if (applicantEntity.INDIVIDUALAPPLICANT != null && applicantEntity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT != null && this._dataService.PROPOSAL.controls.APPLICANTIND.value == "I") {
      applicantEntity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.forEach(employment => {

        //----Email Validation will be done by validator
        // if(employment.EMAIL!=null){
        //   if (!(ValidateEmailAddress(employment.EMAIL, title)))
        //           {
        //               title += " at Employment";
        //               this.msg.push("plzEntEmail" + "," + title);
        //               break;
        //           }
        // }

        if (employment != null && employment.FROMDTE != null && employment.TODTE != null && employment.FROMDTE > employment.TODTE) {
          title += " at Employment";
          this.msg.push("msgEmploymentFromDateCannotBeGreaterthanToDate" + "," + title);
          //break;
        }
        if (applicantEntity.PROPOSALAPPLICANTMAIN.BUSINESSPARTNERID > 0 && employment != null && (employment.ECNMSCTRCODEOTO == null || employment.ECNMSCTRCODEOTO == "")) {
          title += " at Employment";
          this.msg.push("msgEconomicSectorEmpty");
          //break;
        }
      })
    }

    //Email Validation will be done through validator
    // if (msg.Length < 1)
    // {
    //     if (applicantEntity.PROPOSALAPPLICANTPERSONNALREFERENCE != null)
    //     {
    //         foreach (var reference in applicantEntity.PROPOSALAPPLICANTPERSONNALREFERENCE)
    //         {
    //             if (!string.IsNullOrWhiteSpace(reference.EMAIL))
    //             {
    //                 if (!(ValidateEmailAddress(reference.EMAIL, title)))
    //                 {
    //                     title += " at Reference";
    //                     this.msg.push("plzEntEmail" + "," + title);
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }
  }

  private ValidateFamilyData(entity: IProposalApplicantEntity, title: string) {
    if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I" && entity.INDIVIDUALAPPLICANT != null) {
      if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE == MaritalStatus.Married) {
        if (entity.PROPOSALAPPLICANT.ROLECDE != null && entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL != null) {
          if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower) {
            if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHDATE > new Date()).length > 0) {
              this.msg.push("msgWrongDateOfBirthSpouse" + "," + RoleCode.Borrower);
            }
          }
          else if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.CoBorrower) {
            if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHDATE > new Date()).length > 0) {
              this.msg.push("msgWrongDateOfBirthSpouse" + "," + RoleCode.CoBorrower);
            }
          }
          else if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Guarantor) {
            if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHDATE > new Date()).length > 0) {
              this.msg.push("msgWrongDateOfBirthSpouse" + "," + RoleCode.Guarantor);
            }
          }
        }
      }
      if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower && entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY != null
        && entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.length > 0) {
        if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.DATEOFBIRTH > new Date()).length > 0) {
          this.msg.push("msgWrongDateOfBirthFamilyMember");
        }
      }
    }
  }

  public CheckSignatoryTypeValid(isSubmission: boolean = false) {
    let msg: any = [];
    if (this._dataService.PROPOSALAPPLICANT.value != null && this._dataService.PROPOSAL.value.APPLICANTIND == "C") {
      this._dataService.PROPOSALAPPLICANT.value.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower && p.RowState !== DataRowState.Removed).forEach(item => {
        if (item.PROPOSALAPPLICANTREPRESENTATIVE != null && item.PROPOSALAPPLICANTREPRESENTATIVE.length > 0) {
          if (isSubmission && item.PROPOSALAPPLICANTREPRESENTATIVE.filter(p => p.REPRESENTATIVETYPE == null || p.REPRESENTATIVETYPE == "").length > 0) {
            this._messageService.showMesssage("msgRepresentativeTypeEmpty", MessageType.Warning);
            return;
          }

          this.signatory_typ.filter(sig => {
            if (!item.PROPOSALAPPLICANTREPRESENTATIVE.some(p => p.SIGNATORYCDE != null && p.SIGNATORYCDE.toString() == SignatoryTypes.First)) {
              item.PROPOSALAPPLICANTREPRESENTATIVE.forEach(p => {
                p.SIGNATORYCDE = null;
              })
              if (msg.filter((x: any) => x == "msgSignatoryFirstNotSelect").length > 0) {
                return;
              }
              else {
                msg.push("msgSignatoryFirstNotSelect");
                return;
              }
            }
            if ((item.PROPOSALAPPLICANTREPRESENTATIVE.filter(p => p.SIGNATORYCDE != null && p.SIGNATORYCDE.toString() == SignatoryTypes.Third).length > 0)
              && !(item.PROPOSALAPPLICANTREPRESENTATIVE.filter(p => p.SIGNATORYCDE != null && p.SIGNATORYCDE.toString() == SignatoryTypes.Second).length > 0)) {
              item.PROPOSALAPPLICANTREPRESENTATIVE.filter(p => p.SIGNATORYCDE != null && p.SIGNATORYCDE.toString() == SignatoryTypes.Third)[0].SIGNATORYCDE = null;
              if (msg.filter((x: any) => x == "msgSignatorySecondNotSelected").length > 0) {
                return;
              }
              else {
                msg.push("msgSignatorySecondNotSelected");
                return;
              }
            }
            if (item.PROPOSALAPPLICANTREPRESENTATIVE.filter(p => p.SIGNATORYCDE != null && p.SIGNATORYCDE.toString() == sig && p.RowState != DataRowState.Removed).length > 1) {
              msg.push("msgSignatorySelectAgain");
              return;
            }
            return msg;
          })
        }
        return msg;
      })
    }
    return msg;
  }

  private ValidateArticleData(financetype: string) {
    if (this._dataService.PRPLCMPTCNFG.value.filter(p => p.AMNTCMPTCNFG == null).length > 0) {
      this.msg.push("msgSelectArticleCompnentConfig");
    }

    let articalEntity = this._dataService.PROPOSALARTICLE.value.find(x => x.RowState != DataRowState.Removed) as IProposalArticleEntity;
    if (articalEntity != null) {
      let asset = articalEntity as IProposalArticleEntity;
      if (financetype != FinanceType.HomeLoan
        && financetype != FinanceType.PersonalLoan
        && financetype != FinanceType.CommercialLoan
        && asset.ASSETENTITY != null) {
        if (asset.ASSETENTITY.PROPOSALASSET.MAKECDE == null ||
          asset.ASSETENTITY.PROPOSALASSET.BRANDCDE == null ||
          asset.ASSETENTITY.PROPOSALASSET.MODELCDE == null) {
          this.msg.push("plzSelectTotCost");
        }
        if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT != null && asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.TOTALCOST <= 0) {
          this.msg.push("plzSelectTotCost");
        }
        if (asset.ASSETENTITY.PROPOSALRENTALDETAIL == null || asset.ASSETENTITY.PROPOSALRENTALDETAIL.length <= 0) {
          this.msg.push("RentalsAreNotCalculated");
        }
        else {
          let _rentalDetails = this._dataService.ASSETENTITY.controls.PROPOSALRENTALDETAIL.controls.filter(p => p.value.RowState != DataRowState.Removed);
          if (_rentalDetails == null || _rentalDetails.length <= 0)
            this.msg.push("RentalsAreNotCalculated");
        }
        if (asset.ASSETENTITY.PROPOSALASSET.PLICCTGYCODEOTO == null) {
          this.msg.push("plzSelectAssetPolic");
        }
        if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT != null) {
          if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTSTARTDTE != null && asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTTRM != null) {
            var x = new Date(asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTSTARTDTE);
            var newDate = new Date(x.setMonth(x.getMonth() + asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CONTRACTTRM));
            var processingDate = new Date(
              this._storageService.GetUserInfo().ProcessingDate
            );

            if (newDate < processingDate) {
              this.msg.push("ContractDateCurrentProcessingDateValidation")
            }
          }
          if (asset.ASSETENTITY.PROPOSALASSET.NONCMCLASETUSGEDOWNPYMTPCNT > asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CASHDEPOSITPCT && asset.ASSETENTITY.PROPOSALASSET.USAGETYPECODE == "00002") {
            this.msg.push("AssetUsageDownPaymentPercentValidation")
          }
          if (this._dataService.PROPOSALASSET.value.CMCLASETUSGEDOWNPYMTPCNT > this._dataService.PROPOSALFINANCIALAGREEMENT.value.CASHDEPOSITPCT && this._dataService.PROPOSALASSET.value.USAGETYPECODE == "00001") {
            this.msg.push("AssetUsageDownPaymentPercentValidation")
          }
          if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.FINANCETYP == FinanceType.HirePurchase && this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN != true) {
            if (asset.ASSETENTITY.PROPOSALASSET.BPINTRODUCERID == null || asset.ASSETENTITY.PROPOSALASSET.BPINTRODUCERID <= 0) {
              this.msg.push("msgSupplierMandatory");
            }
          }

        }
        if (asset.ASSETENTITY.PROPOSALVEHICLEDETAIL != null) {
          if (asset.ASSETENTITY.PROPOSALVEHICLEDETAIL.CRDTPURPCODEOTO == null || asset.ASSETENTITY.PROPOSALVEHICLEDETAIL.CRDTPURPCODEOTO == "") {
            this.msg.push("msgCreditPurpose");
          }
          if (asset.ASSETENTITY.PROPOSALVEHICLEDETAIL.RELEASEYEAR == null || asset.ASSETENTITY.PROPOSALVEHICLEDETAIL.RELEASEYEAR == "") {
            this.msg.push("msgManufacturingDate");
          }
        }
        if (financetype == FinanceType.OperatingLease && this._dataService.PROPOSALFINANCIALAGREEMENT.value != null) {
          if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RVINPUTCDE == AmountInputTypes.InputPercentage) {
            if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALPCT < asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.MINRESIDUALPCT) {
              this.msg.push("mgsrvballoonpcntLessValidation");
            }
            if (asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALPCT > asset.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.MAXRESIDUALPCT) {
              this.msg.push("mgsrvballoonpcntGrtrValidation");
            }
          }
        }

      }

    }
  }


  public CalculateIncExcValues(ProposalArticleComponentEntity: FormGroup<IProposalArticleComponentEntity>) {
    if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.length == 1) {
      if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.TAXAPBLTYPECDE.value == TaxInclExcl.GetStringValue(TaxInclExcl.Exclusive)) {
        ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value);// = PRPLARTEAMNTTRAN.INPUTAMT;
        ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.setValue(Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value) + Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.TAXAMT.value));//m_taxinculsiveamt = PRPLARTEAMNTTRAN.INPUTAMT + PRPLARTEAMNTTRANTAX.First().TAXAMT;
        ProposalArticleComponentEntity.controls.NETPAYABLEAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.WHT))[0].TAXAMT));//m_netpayableamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE == NFS.Business.Contracts.TaxType.WHT.GetStringValue()).Select(s => s.TAXAMT).FirstOrDefault();
        ProposalArticleComponentEntity.controls.WITHVATLESSITCAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value + Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.TAXAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.ITCAMT.value))//m_withvatlessitcamt = PRPLARTEAMNTTRAN.INPUTAMT + PRPLARTEAMNTTRANTAX.First().TAXAMT - PRPLARTEAMNTTRANTAX.First().ITCAMT;

        if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
          ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue((ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.VAT_GST))[0].TAXAMT)) // m_taxwithoutvatamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.FindAll(s => s.TAXTYPECDE == NFS.Business.Contracts.TaxType.VAT_GST.GetStringValue()).Select(x => x.TAXAMT).FirstOrDefault();
        else
          ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) //m_taxwithoutvatamt = m_taxinculsiveamt;
      }
      else {
        ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value)//m_taxinculsiveamt = PRPLARTEAMNTTRAN.INPUTAMT;
        ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value - ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.TAXAMT.value);//m_taxexculsiveamt = PRPLARTEAMNTTRAN.INPUTAMT - PRPLARTEAMNTTRANTAX.First().TAXAMT;
        ProposalArticleComponentEntity.controls.NETPAYABLEAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.WHT))[0].TAXAMT))  //m_netpayableamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE == NFS.Business.Contracts.TaxType.WHT.GetStringValue()).Select(s => s.TAXAMT).FirstOrDefault();
        ProposalArticleComponentEntity.controls.WITHVATLESSITCAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.ITCAMT.value))//m_withvatlessitcamt = PRPLARTEAMNTTRAN.INPUTAMT - PRPLARTEAMNTTRANTAX.First().ITCAMT;
        if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
          ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
          ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.VAT_GST))[0].TAXAMT)));//m_taxwithoutvatamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.FindAll(s => s.TAXTYPECDE == NFS.Business.Contracts.TaxType.VAT_GST.GetStringValue()).Select(x => x.TAXAMT).FirstOrDefault();
        else
          ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value)//m_taxwithoutvatamt = m_taxinculsiveamt;
      }
    }

    //}
    else if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.length > 1)         //OTO Specific code.
    {

      if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value[0].TAXAPBLTYPECDE == TaxInclExcl.GetStringValue(TaxInclExcl.Exclusive)) {
        if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value[0].ISWHTDEDUCTED) {
          ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value[0].BASEAMOUNT)//m_taxexculsiveamt = PRPLARTEAMNTTRANTAX.First().BASEAMOUNT;
          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(k => k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) && k.TAXTYPE != "ITC") as Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>;
          if (tax != null) {
            ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.setValue(tax[0].BASEAMOUNT)//m_taxinculsiveamt = tax.First().BASEAMOUNT + tax.First().TAXAMT;
            ProposalArticleComponentEntity.controls.NETPAYABLEAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.WHT))[0].TAXAMT))//m_netpayableamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE == NFS.Business.Contracts.TaxType.WHT.GetStringValue()).Select(s => s.TAXAMT).FirstOrDefault();
            ProposalArticleComponentEntity.controls.WITHVATLESSITCAMT.setValue(Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value) + Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.TAXAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.controls[0].controls.ITCAMT.value))  //m_withvatlessitcamt = tax.First().BASEAMOUNT + tax.First().TAXAMT - tax.First().ITCAMT;
            if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.VAT_GST))[0].TAXAMT))//m_taxwithoutvatamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.FindAll(s => s.TAXTYPECDE == NFS.Business.Contracts.TaxType.VAT_GST.GetStringValue()).Select(x => x.TAXAMT).FirstOrDefault();
            else
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value);//m_taxwithoutvatamt = m_taxinculsiveamt;
          }

        }
        else {
          ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.INPUTAMT)//m_taxexculsiveamt = PRPLARTEAMNTTRAN.INPUTAMT;
          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(k => k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) && k.TAXTYPE != "ITC") as Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>;
          //IEnumerable<PRPL_ARTE_AMNT_TRAN_TAXInfo> tax = PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE != NFS.Business.Contracts.TaxType.WHT.GetStringValue() && k.TAXTYPE != "ITC");
          if (tax != null) {
            ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.setValue(tax[0].BASEAMOUNT + tax[0].TAXAMT)//m_taxinculsiveamt = tax.First().BASEAMOUNT + tax.First().TAXAMT;//PRPLARTEAMNTTRAN.INPUTAMT + tax.Sum(p => p.TAXAMT);
            ProposalArticleComponentEntity.controls.NETPAYABLEAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.WHT))[0].TAXAMT))//m_netpayableamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE == NFS.Business.Contracts.TaxType.WHT.GetStringValue()).Select(s => s.TAXAMT).FirstOrDefault();
            ProposalArticleComponentEntity.controls.WITHVATLESSITCAMT.setValue(tax[0].BASEAMOUNT + tax[0].TAXAMT - tax[0].ITCAMT)//m_withvatlessitcamt = tax.First().BASEAMOUNT + tax.First().TAXAMT - tax.First().ITCAMT;
            if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.VAT_GST))[0].TAXAMT))    //m_taxwithoutvatamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.FindAll(s => s.TAXTYPECDE == NFS.Business.Contracts.TaxType.VAT_GST.GetStringValue()).Select(x => x.TAXAMT).FirstOrDefault();
            else
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value)//m_taxwithoutvatamt = m_taxinculsiveamt;
          }
        }
      }
      else {
        if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value[0].ISWHTDEDUCTED) {
          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(k => k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) && k.TAXTYPE != "ITC") as Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>;
          //IEnumerable<PRPL_ARTE_AMNT_TRAN_TAXInfo> tax = PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE != NFS.Business.Contracts.TaxType.WHT.GetStringValue() && k.TAXTYPE != "ITC");
          if (tax != null) {
            ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(tax[0].BASEAMOUNT)//m_taxexculsiveamt = tax.First().BASEAMOUNT;// -tax.Sum(p => p.TAXAMT);
            ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value[0].BASEAMOUNT + tax[0].TAXAMT)  //m_taxinculsiveamt = PRPLARTEAMNTTRANTAX.First().BASEAMOUNT + tax.Select(p => p.TAXAMT).FirstOrDefault();
            ProposalArticleComponentEntity.controls.NETPAYABLEAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.WHT))[0].TAXAMT))//m_netpayableamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE == NFS.Business.Contracts.TaxType.WHT.GetStringValue()).Select(s => s.TAXAMT).FirstOrDefault();
            ProposalArticleComponentEntity.controls.WITHVATLESSITCAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value[0].BASEAMOUNT + tax[0].TAXAMT - tax[0].ITCAMT)  //m_withvatlessitcamt = PRPLARTEAMNTTRANTAX.First().BASEAMOUNT + tax.Select(p => p.TAXAMT).FirstOrDefault() - tax.Select(p => p.ITCAMT).FirstOrDefault();
            if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.VAT_GST))[0].TAXAMT))    //m_taxwithoutvatamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.FindAll(s => s.TAXTYPECDE == NFS.Business.Contracts.TaxType.VAT_GST.GetStringValue()).Select(x => x.TAXAMT).FirstOrDefault();
            else
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) //m_taxwithoutvatamt = m_taxinculsiveamt;
          }

        }
        else {
          ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value)//m_taxinculsiveamt = PRPLARTEAMNTTRAN.INPUTAMT;
          ProposalArticleComponentEntity.controls.NETPAYABLEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.WHT))[0].TAXAMT))  //m_netpayableamt = PRPLARTEAMNTTRAN.INPUTAMT - PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE == NFS.Business.Contracts.TaxType.WHT.GetStringValue()).Select(s => s.TAXAMT).FirstOrDefault();
          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> = ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(k => k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) && k.TAXTYPE != "ITC") as Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>;
          //IEnumerable<PRPL_ARTE_AMNT_TRAN_TAXInfo> tax = PRPLARTEAMNTTRANTAX.Where(k => k.TAXTYPECDE != NFS.Business.Contracts.TaxType.WHT.GetStringValue() && k.TAXTYPE != "ITC");
          if (tax != null) {
            ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(tax[0].BASEAMOUNT);//m_taxexculsiveamt = tax.First().BASEAMOUNT;//PRPLARTEAMNTTRAN.INPUTAMT - tax.Sum(p => p.TAXAMT);
            ProposalArticleComponentEntity.controls.WITHVATLESSITCAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.INPUTAMT - tax[0].ITCAMT)  //m_withvatlessitcamt = PRPLARTEAMNTTRAN.INPUTAMT - tax.First().ITCAMT;
            if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(Number(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value) - Number(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.filter(x => x.TAXTYPE == TaxType.GetStringValue(TaxType.VAT_GST))[0].TAXAMT))   //m_taxwithoutvatamt = m_taxinculsiveamt - PRPLARTEAMNTTRANTAX.FindAll(s => s.TAXTYPECDE == NFS.Business.Contracts.TaxType.VAT_GST.GetStringValue()).Select(x => x.TAXAMT).FirstOrDefault();
            else
              ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.value);
          }
        }
      }
    }
    else if (ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRANTAX.value.length == 0) {
      ProposalArticleComponentEntity.controls.TAXINCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.INPUTAMT)//m_taxinculsiveamt = PRPLARTEAMNTTRAN.INPUTAMT;
      ProposalArticleComponentEntity.controls.TAXEXCULSIVEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.INPUTAMT)  //m_taxexculsiveamt = PRPLARTEAMNTTRAN.INPUTAMT;
      ProposalArticleComponentEntity.controls.NETPAYABLEAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.INPUTAMT)  //m_netpayableamt = PRPLARTEAMNTTRAN.INPUTAMT;
      ProposalArticleComponentEntity.controls.WITHVATLESSITCAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.INPUTAMT)  //m_withvatlessitcamt = PRPLARTEAMNTTRAN.INPUTAMT;
      ProposalArticleComponentEntity.controls.TAXWITHOUTVATAMT.setValue(ProposalArticleComponentEntity.controls.PRPLARTEAMNTTRAN.value.INPUTAMT)  //m_taxwithoutvatamt = m_taxinculsiveamt;
    }
  }

  public get PRPLMODULECODE(): string {
    return this.m_modulecode;
  }

  public set PRPLMODULECODE(value: string) {
    this.m_modulecode = value;
  }

  public UpdateBPKBRepresentatives() {
    if (this._dataService.ASSETENTITY.value != null && this._dataService.ASSETENTITY.value.OTOPRPLASSTBPKBRPRSDETL != null) {
      this._dataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL.controls.forEach(item => {
        if (item.controls.ACTIVEIND.value) {
          this._formState.ResetFormState(item, DataRowState.Removed);
        }
      })
    }
    this._dataService.PROPOSALAPPLICANT.value.filter(p => p.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower).forEach(item => {
      if (item.PROPOSALAPPLICANTREPRESENTATIVE != null && item.PROPOSALAPPLICANTREPRESENTATIVE.length > 0) {
        item.PROPOSALAPPLICANTREPRESENTATIVE.forEach(representative => {

          if (representative.SHAREHOLDERTYPE != null && representative.SHAREHOLDERTYPE == ApplicantType.Individual && representative.RowState != DataRowState.Removed) {
            if (representative.SIGNATORYCDE != null && representative.SIGNATORYCDE != "") {
              if (representative.SIGNATORYCDE != SignatoryTypes.Third) {
                let orig = this._ProposalForm.OTOPRPLASSTBPKBRPRSDETLForm();
                if (representative.IDTYPECDE == IDTypeCode.KTP) {
                  orig.controls.REPRESENTATIVEKTPID.setValue(representative.IDCARDNBR);
                }
                orig.controls.REPRESENTATIVENME.setValue(this._dataService.concatenateNames(representative.FIRSTNME, representative.MIDDLENME, representative.LASTNME));
                orig.controls.REPRESENTATIVEDESIGNATION.setValue(representative.DESIGNATIONCDE);
                orig.controls.REPRESENTATIVEADDRESS.setValue(representative.ADDRESSOTO);
                orig.controls.ACTIVEIND.setValue(true);
                if (this._dataService.ASSETENTITY.value != null && this._dataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL.length == 0) {
                  this._dataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL = this._formBuilder.array<IPRPL_BPKB_RPRS_DETLInfo>([]);
                }
                if (this._dataService.ASSETENTITY.value != null && this._dataService.ASSETENTITY.value.OTOPRPLASSTBPKBRPRSDETL.filter(p => p.REPRESENTATIVENME == orig.controls.REPRESENTATIVENME.value && p.REPRESENTATIVEKTPID == orig.controls.REPRESENTATIVEKTPID.value && orig.controls.ACTIVEIND.value && p.RowState != DataRowState.Removed).length == 0) {
                  this._dataService.ASSETENTITY.controls.OTOPRPLASSTBPKBRPRSDETL.push(orig)
                }
              }
            }
          }
        })
      }
    })
  }

  public get TotalPremiumAmount() {
    if (this._dataService.PRPLINSR.value != null) {
      this.totalPremiumAmount = this.MainInsuranceEntity.value.PRPLINSR.TOTALFINANCEAMNT +
        this.MainInsuranceEntity.value.PRPLINSR.TOTALINSRSUBSIDYAMNT +
        this.MainInsuranceEntity.value.PRPLINSR.TOTALUPFRONTAMNT;
    }
    return this.totalPremiumAmount;
  }

  // public set TotalPremiumAmount(value: number) {
  //   this.totalPremiumAmount = value;
  // }

  public ReCalculateInsurancePremiumRate() {
    let TotalPremiumAmnt = 0;
    let CalculatedDefaultRate = 0;
    let TotalAddlPremiumAmount = 0;

    if (this._dataService.PROPOSALINSURANCEMAIN != null
      && this._dataService.STANDARDINSURANCE != null
      && this._dataService.STANDARDINSURANCE.length > 0) {


      this._dataService.STANDARDINSURANCE.controls.forEach(Stnd => {
        Stnd.controls.PRPLSTNDINSR.controls.TOTALPREMIUMAMNT.setValue(0);

        Stnd.controls.PRPLADDLINSR.controls.forEach(Addl => {
          Addl.controls.TOTALPREMIUMAMNT.setValue(0);
        })
      })
      this._dataService.STANDARDINSURANCE.controls.forEach(Stnd => {
        Stnd.controls.STANDARDINSURANCEDETAIL.controls.forEach(StndDetail => {
          if (Stnd.controls.PRPLSTNDINSR.value.COLLECTIONMETHODCDE != InsuranceCollectionTypes.LeaseClause) {
            if (this._dataService.PROPOSALTEMPLATERENTALINT.value.VEHICLEAGE < this._dataService.PROPOSALVEHICLEDETAIL.value.VEHICLEAGE
              && StndDetail.controls.PRPLSTNDINSRDETL.value.INSRTYPECDE == InsuranceType.CompulsoryInsurance) {
              CalculatedDefaultRate = StndDetail.controls.PRPLSTNDINSRDETL.value.DEFAULTPREMIUMRTE / 100;

              StndDetail.controls.PRPLSTNDINSRDETL.controls.FINALPREMIUMRTE.setValue(
                (StndDetail.controls.PRPLSTNDINSRDETL.value.DEFAULTPREMIUMRTE) +
                ((CalculatedDefaultRate) * (this._dataService.PRPLINSR.value.LOADINGRTE)) +
                this._dataService.PRPLINSR.value.ASSETUSAGEDEFAULTRTE);

              let totalmonths = StndDetail.controls.PRPLSTNDINSRDETL.value.TERMTO - StndDetail.controls.PRPLSTNDINSRDETL.value.TERMFROM + 1;

              StndDetail.controls.PRPLSTNDINSRDETL.controls.PREMIUMAMNT.setValue(+((((StndDetail.controls.PRPLSTNDINSRDETL.value.SUMINSUREDAMNT * (StndDetail.controls.PRPLSTNDINSRDETL.value.FINALPREMIUMRTE) / 100)) / 12) * totalmonths).toFixed(5));

              if (StndDetail.controls.PRPLSTNDINSRDETL.value.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount) {
                StndDetail.controls.PRPLSTNDINSRDETL.controls.FIXPREMIUMAMT.setValue(
                  ((StndDetail.controls.PRPLSTNDINSRDETL.value.SUMINSUREDAMNT * (StndDetail.controls.PRPLSTNDINSRDETL.value.DEFAULTPREMIUMRTE / 100)) / 12) * totalmonths);
              }
              else {
                StndDetail.controls.PRPLSTNDINSRDETL.value.FIXPREMIUMAMT = 0;
              }

              TotalPremiumAmnt += Math.ceil(StndDetail.controls.PRPLSTNDINSRDETL.value.PREMIUMAMNT);
            }
            else {
              CalculatedDefaultRate = StndDetail.controls.PRPLSTNDINSRDETL.value.DEFAULTPREMIUMRTE / 100;

              StndDetail.controls.PRPLSTNDINSRDETL.controls.FINALPREMIUMRTE.setValue(
                (StndDetail.controls.PRPLSTNDINSRDETL.value.DEFAULTPREMIUMRTE) +
                this._dataService.PRPLINSR.value.ASSETUSAGEDEFAULTRTE);

              let totalmonths = StndDetail.controls.PRPLSTNDINSRDETL.value.TERMTO - StndDetail.controls.PRPLSTNDINSRDETL.value.TERMFROM + 1;

              StndDetail.controls.PRPLSTNDINSRDETL.controls.PREMIUMAMNT.setValue(
                +(((StndDetail.controls.PRPLSTNDINSRDETL.value.SUMINSUREDAMNT * (StndDetail.controls.PRPLSTNDINSRDETL.value.FINALPREMIUMRTE / 100)) / 12) * totalmonths).toFixed(5));

              if (StndDetail.controls.PRPLSTNDINSRDETL.value.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount) {
                StndDetail.controls.PRPLSTNDINSRDETL.controls.FIXPREMIUMAMT.setValue(
                  ((StndDetail.controls.PRPLSTNDINSRDETL.value.SUMINSUREDAMNT * (StndDetail.controls.PRPLSTNDINSRDETL.value.DEFAULTPREMIUMRTE / 100)) / 12) * totalmonths);
              }
              else {
                StndDetail.controls.PRPLSTNDINSRDETL.value.FIXPREMIUMAMT = 0;
              }
              TotalPremiumAmnt += Math.ceil(StndDetail.controls.PRPLSTNDINSRDETL.value.PREMIUMAMNT);
            }
            Stnd.controls.PRPLSTNDINSR.controls.TOTALPREMIUMAMNT.setValue(
              Stnd.controls.PRPLSTNDINSR.value.TOTALPREMIUMAMNT + (Stnd.controls.PRPLSTNDINSR.value.COLLECTIONMETHODCDE == InsuranceCollectionTypes.ARO ? Math.ceil(StndDetail.controls.PRPLSTNDINSRDETL.value.PREMIUMAMNT) : Math.ceil(StndDetail.controls.PRPLSTNDINSRDETL.value.PREMIUMAMNT)));
          }
          StndDetail.controls.PRPLADDLINSRDETL.controls.forEach(AddlInsrDetl => {
            let totalmonths = StndDetail.controls.PRPLSTNDINSRDETL.value.TERMTO - StndDetail.controls.PRPLSTNDINSRDETL.value.TERMFROM + 1;

            if (AddlInsrDetl != null && AddlInsrDetl.value.INSURANCEPREMIUMTYPECDE == InsurancePremiumTypes.FixAmount && AddlInsrDetl.value.FIXPREMIUMAMT > 0 && !this.ISDEFAULTPREMIUMRTECHANGED) {
              AddlInsrDetl.controls.DEFAULTPREMIUMRTE.setValue((AddlInsrDetl.value.FIXPREMIUMAMT * 12 * 100) / (totalmonths * StndDetail.controls.PRPLSTNDINSRDETL.value.SUMINSUREDAMNT));
            }

            if (AddlInsrDetl != null && AddlInsrDetl.value.DEFAULTPREMIUMRTE > AddlInsrDetl.value.MAXINSRPREMIUMRTE || AddlInsrDetl.value.DEFAULTPREMIUMRTE < AddlInsrDetl.value.MININSRPREMIUMRTE) {
              this.ISDEFAULTPREMIUMRTECHANGED = true;
              AddlInsrDetl.controls.DEFAULTPREMIUMRTE.setValue(AddlInsrDetl.value.MININSRPREMIUMRTE);
              AddlInsrDetl.controls.FIXPREMIUMAMT.setValue(((StndDetail.value.PRPLSTNDINSRDETL.SUMINSUREDAMNT * (AddlInsrDetl.value.DEFAULTPREMIUMRTE / 100)) / 12) * totalmonths);
            }

            if (AddlInsrDetl.value.TPLCOVERAGEAMNT > 0) {

              AddlInsrDetl.controls.PREMIUMAMNT.setValue(+((AddlInsrDetl.value.TPLCOVERAGEAMNT * (AddlInsrDetl.value.TPLCOVERAGERTE) / 100)).toFixed(5));
              TotalAddlPremiumAmount += Math.ceil(AddlInsrDetl.value.PREMIUMAMNT);
            }

            else {
              AddlInsrDetl.controls.PREMIUMAMNT.setValue(+(((StndDetail.value.PRPLSTNDINSRDETL.SUMINSUREDAMNT * (AddlInsrDetl.value.DEFAULTPREMIUMRTE) / 100) / 12) * totalmonths).toFixed(5)); //(StndDetail.PRPLSTNDINSRDETL.SUMINSUREDAMNT * AddlInsrDetl.DEFAULTPREMIUMRTE) / 100;
              TotalAddlPremiumAmount += Math.ceil(AddlInsrDetl.value.PREMIUMAMNT);
            }

            if (Stnd.value.PRPLADDLINSR.filter(s => s.PRPLADDLINSRID == AddlInsrDetl.value.PRPLADDLINSRID && s.PRPLSTNDINSRID == AddlInsrDetl.value.PRPLSTNDINSRID).length > 0
              && Stnd.value.PRPLADDLINSR.filter(s => s.PRPLADDLINSRID == AddlInsrDetl.value.PRPLADDLINSRID && s.PRPLSTNDINSRID == AddlInsrDetl.value.PRPLSTNDINSRID) != null) {
              let res = Stnd.controls.PRPLADDLINSR.controls.filter(s => s.value.PRPLADDLINSRID == AddlInsrDetl.value.PRPLADDLINSRID && s.value.PRPLSTNDINSRID == AddlInsrDetl.value.PRPLSTNDINSRID)[0].controls.TOTALPREMIUMAMNT
              res.setValue(res.value + AddlInsrDetl.value.PREMIUMAMNT);
            }
          });
        });
        let FinalPremiumAmount = TotalAddlPremiumAmount + TotalPremiumAmnt;
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(FinalPremiumAmount);
        CalculatedDefaultRate = 0;
      })
      this.CalculateAmounts();
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(this.TotalPremiumAmount);
      this._formState.UpdateFormArrayState(this._dataService.PROPOSALINSURANCEMAIN, DataRowState.Updated);
    }



  }

  public CalculateAmounts() {
    if (this._dataService.PROPOSALINSURANCEMAIN != null && this._dataService.PRPLINSR != null) {
      //reset values
      this._dataService.PRPLINSR.controls.TOTALFINANCEAMNT.setValue(0);
      this._dataService.PRPLINSR.controls.TOTALUPFRONTAMNT.setValue(0);
      this._dataService.PRPLINSR.controls.TOTALINSRSUBSIDYAMNT.setValue(0);
      this._dataService.PRPLINSR.controls.TOTALAROAMNT.setValue(0);
      //this.TotalPremiumAmount = 0;

      let finance = this._dataService.STANDARDINSURANCE.controls.filter(s => s.value.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.Financed && s.value.RowState !== DataRowState.Removed);
      let upfront = this._dataService.STANDARDINSURANCE.controls.filter(s => s.value.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.Upfront && s.value.RowState !== DataRowState.Removed);
      let subsidy = this._dataService.STANDARDINSURANCE.controls.filter(s => s.value.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.InsuranceSubsidy && s.value.RowState !== DataRowState.Removed);
      let aro = this._dataService.STANDARDINSURANCE.controls.filter(s => s.value.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.ARO && s.value.RowState !== DataRowState.Removed);

      finance.forEach(item => {
        item.controls.PRPLADDLINSR.controls.filter(s => s.value.RowState !== DataRowState.Removed).forEach(detail => {
          this._dataService.PRPLINSR.controls.TOTALFINANCEAMNT.setValue(this._dataService.PRPLINSR.value.TOTALFINANCEAMNT + Math.ceil(detail.value.TOTALPREMIUMAMNT));
        })
        this._dataService.PRPLINSR.controls.TOTALFINANCEAMNT.setValue(this._dataService.PRPLINSR.value.TOTALFINANCEAMNT + Math.ceil(item.controls.PRPLSTNDINSR.value.TOTALPREMIUMAMNT));
        this._dataService.PRPLINSR.controls.TOTALFINANCEAMNT.setValue(Math.ceil(this._dataService.PRPLINSR.value.TOTALFINANCEAMNT));
      });

      upfront.forEach(item => {
        item.controls.PRPLADDLINSR.controls.filter(s => s.value.RowState !== DataRowState.Removed).forEach(detail => {
          this._dataService.PRPLINSR.controls.TOTALUPFRONTAMNT.setValue(this._dataService.PRPLINSR.value.TOTALUPFRONTAMNT + Math.ceil(detail.value.TOTALPREMIUMAMNT));
        })
        this._dataService.PRPLINSR.controls.TOTALUPFRONTAMNT.setValue(this._dataService.PRPLINSR.value.TOTALUPFRONTAMNT + Math.ceil(item.controls.PRPLSTNDINSR.value.TOTALPREMIUMAMNT));
        this._dataService.PRPLINSR.controls.TOTALUPFRONTAMNT.setValue(Math.ceil(this._dataService.PRPLINSR.value.TOTALUPFRONTAMNT));
      });

      subsidy.forEach(item => {
        item.controls.PRPLADDLINSR.controls.filter(s => s.value.RowState !== DataRowState.Removed).forEach(detail => {
          this._dataService.PRPLINSR.controls.TOTALINSRSUBSIDYAMNT.setValue(this._dataService.PRPLINSR.value.TOTALINSRSUBSIDYAMNT + Math.ceil(detail.value.TOTALPREMIUMAMNT));
        })
        this._dataService.PRPLINSR.controls.TOTALINSRSUBSIDYAMNT.setValue(this._dataService.PRPLINSR.value.TOTALINSRSUBSIDYAMNT + Math.ceil(item.controls.PRPLSTNDINSR.value.TOTALPREMIUMAMNT));
        this._dataService.PRPLINSR.controls.TOTALINSRSUBSIDYAMNT.setValue(Math.ceil(this._dataService.PRPLINSR.value.TOTALINSRSUBSIDYAMNT));
      });

      aro.forEach(item => {
        item.controls.PRPLADDLINSR.controls.filter(s => s.value.RowState !== DataRowState.Removed).forEach(detail => {
          this._dataService.PRPLINSR.controls.TOTALAROAMNT.setValue(this._dataService.PRPLINSR.value.TOTALAROAMNT + Math.ceil(detail.value.TOTALPREMIUMAMNT));
        })
        this._dataService.PRPLINSR.controls.TOTALAROAMNT.setValue(this._dataService.PRPLINSR.value.TOTALAROAMNT + Math.ceil(item.controls.PRPLSTNDINSR.value.TOTALPREMIUMAMNT));
        this._dataService.PRPLINSR.controls.TOTALAROAMNT.setValue(Math.ceil(this._dataService.PRPLINSR.value.TOTALAROAMNT));
      });

      //B2B Fee Calculations
      if (this._dataService.PRPLINSR.value.UPDATEDB2BIND && this._dataService.PRPLINSR.value.INSURANCEB2BPCT > 0) {
        this._dataService.PRPLINSR.controls.INSURANCEB2BAMNT.setValue((this.TotalPremiumAmount * this._dataService.PRPLINSR.value.INSURANCEB2BPCT) / 100);
      }

      if (this._dataService.PRPLINSR.value.TOTALUPFRONTAMNT > 0 && this._FormMode.FormMode != FormMode.VIEW
        && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN != true)
        this.chkReceiveByDealer = true;
      else
        this.chkReceiveByDealer = false;

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(this.TotalPremiumAmount);
    }
  }

  public get CommissionCalcInd(): boolean {
    if (this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN && this._dataService.PROPOSAL.value.MCOMDEALER)
      return false;
    else {

      if (this._dataService.PROPOSAL.value != null && this._dataService.PROPOSAL.value.APPLICANTIND == "I"
        && this._dataService.PROPOSALAPPLICANT.value != null && this._dataService.PROPOSALAPPLICANT.value.length > 0
        && this._dataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND
        && !this._dataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.CALCULATECOMMISSIONIND) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  ProposalCommissionMapper(commission: IProposalCommissionEntity, CommissionTypeCode: string = '') {
    // PRPL_COMM
    if (commission.PRPLCOMM.RowState != DataRowState.Added)
      commission.PRPLCOMM.RowState = DataRowState.Updated;
    this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.patchValue(commission.PRPLCOMM);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.UNALLOCATEDEXPENSEAMT.setValue(commission.PRPLCOMM.UNALLOCATEDEXPENSEAMT);

    //PRPL_SCHM
    this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMMSCHM.clear();
    commission.PRPLCOMMSCHM.forEach(schm => {
      if (schm.RowState != DataRowState.Added)
        schm.RowState = DataRowState.Updated;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMMSCHM.push(this._proposalEntityMapperService.PRPLCOMMSCHMMapper(this._ProposalForm.PRPLCOMMSCHMForm(), schm));
    })
    //JP1JP2RECIPIENT Mapper
    this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.forEach(rpnt => {
      rpnt.controls.PRPLJP1JP2RPNTTAX.updateValueAndValidity();
      let recepient = commission.JP1JP2RECIPIENT.find(x => x.PRPLJP1JP2RPNT.PROPOSALID == rpnt.value.PRPLJP1JP2RPNT.PROPOSALID && x.PRPLJP1JP2RPNT.COMMISSIONTYPECDE == rpnt.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE && x.PRPLJP1JP2RPNT.ROLECDE == rpnt.value.PRPLJP1JP2RPNT.ROLECDE && x.PRPLJP1JP2RPNT.RECIPIENTID == rpnt.value.PRPLJP1JP2RPNT.RECIPIENTID) as IJP1JP2RecipientEntity;

      for (var i = rpnt.controls.PRPLJP1JP2RPNTTAX.length; i >= 0; i--) {
        if (rpnt.controls.PRPLJP1JP2RPNTTAX?.value[i]?.COMMISSIONTYPECDE == CommissionTypeCode) {
          if (rpnt.controls.PRPLJP1JP2RPNTTAX.value[i]?.RowState == DataRowState.Added)
            rpnt.controls.PRPLJP1JP2RPNTTAX.removeAt(i);
          else
            rpnt.controls.PRPLJP1JP2RPNTTAX.controls[i].controls.RowState.setValue(DataRowState.Removed);
        }
      }

      if (rpnt.value.RowState != DataRowState.Added) {
        rpnt.controls.RowState.setValue(DataRowState.Updated);
        rpnt.controls.PRPLJP1JP2RPNT.controls.RowState.setValue(DataRowState.Updated);
      }
      //this._formState.ResetFormState(rpnt, DataRowState.Updated);

      rpnt.controls.JP1TAXEXCULSIVEAMT.setValue(recepient.JP1TAXEXCULSIVEAMT);
      rpnt.controls.JP1TAXINCULSIVEAMT.setValue(recepient.JP1TAXINCULSIVEAMT);
      rpnt.controls.JP2TAXEXCULSIVEAMT.setValue(recepient.JP2TAXEXCULSIVEAMT);
      rpnt.controls.JP2TAXINCULSIVEAMT.setValue(recepient.JP2TAXINCULSIVEAMT);

      rpnt.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(recepient.PRPLJP1JP2RPNT.JP1COMMISSIONAMT);
      rpnt.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(recepient.PRPLJP1JP2RPNT.JP2COMMISSIONAMT);
      rpnt.controls.PRPLJP1JP2RPNT.controls.JP1TAXINCLUSIVEAMT.setValue(recepient.PRPLJP1JP2RPNT.JP1TAXINCLUSIVEAMT);
      rpnt.controls.PRPLJP1JP2RPNT.controls.JP1TAXEXCLUSIVEAMT.setValue(recepient.PRPLJP1JP2RPNT.JP1TAXEXCLUSIVEAMT);
      rpnt.controls.PRPLJP1JP2RPNT.controls.JP2TAXINCLUSIVEAMT.setValue(recepient.PRPLJP1JP2RPNT.JP2TAXINCLUSIVEAMT);
      rpnt.controls.PRPLJP1JP2RPNT.controls.JP2TAXEXCLUSIVEAMT.setValue(recepient.PRPLJP1JP2RPNT.JP2TAXEXCLUSIVEAMT);

      //this._formState.ResetFormArrayState(rpnt.controls.PRPLJP1JP2RPNTTAX, DataRowState.Removed);


      recepient.PRPLJP1JP2RPNTTAX.forEach(tax => {
        if (tax.RowState != DataRowState.Added)
          tax.RowState = DataRowState.Added;
        rpnt.controls.PRPLJP1JP2RPNTTAX.push(this._proposalEntityMapperService.PRPLJP1JP2RPNTTAXMapper(this._ProposalForm.PRPLJP1JP2RPNTTAXForm(), tax));
      })
    });
    //JP2RECIPIENT Mapper
    this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP2RECIPIENT.controls.forEach(rpnt => {
      let recepient = commission.JP2RECIPIENT.find(x => x.PRPLJP2RPNT.PROPOSALID == rpnt.value.PRPLJP2RPNT.PROPOSALID && x.PRPLJP2RPNT.COMMISSIONTYPECDE == rpnt.value.PRPLJP2RPNT.COMMISSIONTYPECDE && x.PRPLJP2RPNT.ROLECDE == rpnt.value.PRPLJP2RPNT.ROLECDE && x.PRPLJP2RPNT.RECIPIENTID == rpnt.value.PRPLJP2RPNT.RECIPIENTID) as IJP2RecipientEntity;

      for (var i = rpnt.controls.PRPLJP2RPNTTAX.length; i >= 0; i--) {
        if (rpnt.controls.PRPLJP2RPNTTAX?.value[i]?.COMMISSIONTYPECDE == CommissionTypeCode) {
          if (rpnt.controls.PRPLJP2RPNTTAX.value[i]?.RowState == DataRowState.Added)
            rpnt.controls.PRPLJP2RPNTTAX.removeAt(i);
          else
            rpnt.controls.PRPLJP2RPNTTAX.controls[i].controls.RowState.setValue(DataRowState.Removed);
        }
      }

      if (rpnt.value.RowState != DataRowState.Added) {
        rpnt.controls.RowState.setValue(DataRowState.Updated);
        rpnt.controls.PRPLJP2RPNT.controls.RowState.setValue(DataRowState.Updated);
      }

      //this._formState.ResetFormState(rpnt, DataRowState.Updated);
      rpnt.controls.PRPLJP2RPNT.controls.JP2SCHEMECOMMISSIONAMT.setValue(recepient.PRPLJP2RPNT.JP2SCHEMECOMMISSIONAMT);
      rpnt.controls.PRPLJP2RPNT.controls.JP2SCHEMECOMMISSIONPCT.setValue(recepient.PRPLJP2RPNT.JP2SCHEMECOMMISSIONPCT);
      rpnt.controls.PRPLJP2RPNT.controls.TAXEXCLUSIVEAMT.setValue(recepient.PRPLJP2RPNT.TAXEXCLUSIVEAMT);
      rpnt.controls.PRPLJP2RPNT.controls.TAXINCLUSIVEAMT.setValue(recepient.PRPLJP2RPNT.TAXINCLUSIVEAMT);

      //this._formState.ResetFormArrayState(rpnt.controls.PRPLJP2RPNTTAX, DataRowState.Removed);

      recepient.PRPLJP2RPNTTAX.forEach(tax => {
        if (tax.RowState != DataRowState.Added)
          tax.RowState = DataRowState.Added;
        rpnt.controls.PRPLJP2RPNTTAX.push(this._proposalEntityMapperService.PRPLJP2RPNTTAXMapper(this._ProposalForm.PRPLJP2RPNTTAXForm(), tax));
      })
    });

  }

  private ValidateRFMandatoryFields(applicantEntityCollection: Array<IProposalApplicantEntity>, proposalArticle: IProposalArticleEntity) {

    let userInfo = this._storageService.GetUserInfo();
    applicantEntityCollection.forEach(entity => {
      if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I") {
        if (userInfo && userInfo.IsOTO) {
          if (entity.PROPOSALAPPLICANTIDDETAIL && entity.PROPOSALAPPLICANTIDDETAIL.filter(p => p.IDTYPECDE != null) && (entity.PROPOSALAPPLICANTIDDETAIL.filter(p => p.IDTYPECDE == IDTypeCode.NPWP && p.RowState !== DataRowState.Removed).length === 0)) {
            this.msg.push("msgNPWPNotSelected");
          }
        }



        if (entity.INDIVIDUALAPPLICANT) {
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL && (!(entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNMELOCAL))) {
            this.msg.push("msgAliasNameEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL && (!(entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.DBTRCTGYCODEOTO))) {
            this.msg.push("msgDebtorCategoryEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT && (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTEMPLOYMENT.filter(p => p.FROMDTE == null || p.TODTE == null).length > 0)) {
            this.msg.push("msgEmploymentDatesEmpty");
          }
          if (entity.PROPOSALAPPLICANT && entity.PROPOSALAPPLICANT.ROLECDE && entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.toString()) {
            if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL && entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.SALARY <= 0)
              this.msg.push("msgSalaryLessThanZero");
          }
        }

        /// SOCD-17462
        /// Family Members checks should be only for Borrower
        if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.toString() &&
          entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY && entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed).length > 0) {
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.NAME == null || p.NAME === '')).length > 0) {
            this.msg.push("msgFamilyMembNameEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.DATEOFBIRTH == null)).length > 0) {
            this.msg.push("msgFamilyMembDOBEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.FAMCRDNUM == null || p.FAMCRDNUM === '')).length > 0) {
            this.msg.push("msgFamilyCardNoEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.RELATIONSHIPCDE == null || p.RELATIONSHIPCDE === '')).length > 0) {
            this.msg.push("msgFamilyRelationshipEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.GENDER == null || p.GENDER === '')).length > 0) {
            this.msg.push("msgFamilyGenderEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.OCCUPATIONCDE == null || p.OCCUPATIONCDE === '')).length > 0) {
            this.msg.push("msgFamilyOccupationEmpty");
          }
        }
      }

      entity.ADDRESS.forEach(adr => {
        if (adr.PROPOSALADDRESSTYPEDETAIL.filter(k => k.DEFAULTIND == true && k.RowState !== DataRowState.Removed).length === 1) {
          if (adr.PROPOSALAPPLICANTPHONEFAX.filter(p => p.PHONETYPECDE === "00010" && p.RowState !== DataRowState.Removed).length === 0) //Fixed Line
          {
            this.msg.push("msgFixPhoneNumberEmpty");
          }
        }
      });
    });

    // proposalArticle.forEach(article => {

    if (proposalArticle.ASSETENTITY) {
      if (proposalArticle.ASSETENTITY.PROPOSALFINANCIALAGREEMENT && proposalArticle.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.CHARGEAMT <= 0) {
        this.msg.push("msgApplChargesEmpty");
      }
      //if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL != null && string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBNUMBER))
      //{
      //    this.msg.push("msgBPKBNumberEmpty");
      //}
      //if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL != null && article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBDTE == null)
      //{
      //    this.msg.push("msgBPKBDateEmpty");
      //}
      //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY))
      //{
      //    this.msg.push("msgBPKBOwnerCatgEmpty");
      //}
      //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBHOLDERADDRESS))
      //{
      //    this.msg.push("msgBPKBholderAddressEmpty");
      //}
      if (!proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.CHASSISNBROTO) {
        this.msg.push("msgVehicleChassisEmpty");
      }
      if (!proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.TRAILERREGISTRATIONNUMBER) {
        this.msg.push("msgVehicleLicPlateEmpty");
      }
      if (!proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.ENGINENUMBER) {
        this.msg.push("msgVehicleEngineNoEmpty");
      }
      if (!proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.COLOR) {
        this.msg.push("msgVehicleColor");
      }
      if (this.MainInsuranceEntity && this.MainInsuranceEntity.controls.STANDARDINSURANCE.value && this.MainInsuranceEntity.controls.STANDARDINSURANCE.value.length == 0) {
        this.msg.push("msgInsuranceEmpty");
      }
      //BPKB Fields
      //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY))
      //{
      //    this.msg.push("msgBPKBOwnerCatgEmpty");
      //}
      //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERTYPE))
      //{
      //    this.msg.push("msgBPKBOwnerTypeEmpty");
      //}
      //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNERNME))
      //{
      //    this.msg.push("msgBPKBOwnerNameEmpty");
      //}
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY !== ApplicantType.Company) {
        if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.GENDER)
          this.msg.push("msgBPKBOwnerGenderEmpty");
        //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERKTPID))
        //    this.msg.push("msgBPKBOwnerKTPEmpty");
        if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB)
          this.msg.push("msgBPKBOwnerDOB");

        /// SOCD - 17449
        if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB &&
          proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB > new Date())
          this.msg.push("WrongDateOfBirthBPKB");

        if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE)
          this.msg.push("msgBPKBOwnerMaritalStatus");

        if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE == null
          && proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE == MaritalStatus.Married.toString()
          && proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNERSPOUSENME == null)
          this.msg.push("msgBPKBOwnerSpouseName");


      }
      //else if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY == NetSol.Core.Enum.ApplicantType.Company.GetStringValue())
      //{
      //    if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERKTPID))
      //        this.msg.push("msgBPKBOwnerSIUPEmpty");
      //}
      //if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE == MaritalStatus.Married.GetStringValue())
      //{
      //    if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERSPOUSEADDRESS))
      //        this.msg.push("msgBPKBOwnerSpouceAddEmpty");
      //}
      //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBHOLDERNME))
      //{
      //    this.msg.push("msgBPKBHolderNameEmpty");
      //}
      //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBHOLDERADDRESS))
      //{
      //    this.msg.push("msgBPKBholderAddressEmpty");
      //}
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.ADDSDSC) {
        this.msg.push("msgBPKBOwnerAddress");
      }



      // #region BPKB Address

      let proposalApplicant = this._dataService.PROPOSALAPPLICANT.controls.find(p => p.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == RoleCode.Borrower) as FormGroup<IProposalApplicantEntity>;
      this.SetDefaultAddress(proposalArticle, proposalApplicant);

      if (!(proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOPROVINCE) || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOPROVINCE == 0) {
        this.msg.push("msgBPKBProvince");
      }
      if (!(proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKOTAMADYA) || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKOTAMADYA == 0) {
        this.msg.push("msgBPKBKotamadya");
      }
      if (!(proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKECAMATAN) || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKECAMATAN == 0) {
        this.msg.push("msgBPKBKecamatan");
      }
      if (!(proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTODESA) || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTODESA == 0) {
        this.msg.push("msgBPKBKelurahan");
      }
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORT) {
        this.msg.push("msgBPKBRT");
      }
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORW) {
        this.msg.push("msgBPKBRW");
      }
      // #endregion
    }
    // })

    return this.msg;
  }

  private ValidateCFMandatoryFields(applicantEntityCollection: Array<IProposalApplicantEntity>, proposalArticle: IProposalArticleEntity) {
    applicantEntityCollection.forEach(entity => {
      if (entity.PROPOSALAPPLICANT && entity.PROPOSALAPPLICANT.ROLECDE && entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.toString()) {
        if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I") {
          if (entity.INDIVIDUALAPPLICANT) {
            if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL && entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.SALARY <= 0) {
              this.msg.push("msgSalaryLessThanZero");
            }
          }
        }
      }


      if (entity.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I" && entity.INDIVIDUALAPPLICANT) {
        if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.MARITALSTATUSCDE == MaritalStatus.Married.toString()) {
          if (entity.PROPOSALAPPLICANT.ROLECDE
            && entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL) {
            //For Borrower
            if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.toString()) {
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHPLACE == null || p.BIRTHPLACE == "").length > 0) {
                this.msg.push("msgSpouceBirthplaceEmptyofBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.EXPIRYIDDATE == null).length > 0) {
                this.msg.push("msgSpouceExpiryDateEmptyofBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.SPOUSEADDRESS == null || p.SPOUSEADDRESS == "").length > 0) {
                this.msg.push("msgSpouceAddressEmptyofBorrower");
              }
            }
            //For Co-Borrower
            else if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.CoBorrower.toString()) {
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHPLACE == null || p.BIRTHPLACE == "").length > 0) {
                this.msg.push("msgSpouceBirthplaceEmptyofCoBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.EXPIRYIDDATE == null).length > 0) {
                this.msg.push("msgSpouceExpiryDateEmptyCoBorrower");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.SPOUSEADDRESS == null || p.SPOUSEADDRESS == "").length > 0) {
                this.msg.push("msgSpouceAddressEmptyofCoBorrower");
              }
            }
            //For Guarantor
            else if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Guarantor.toString()) {
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.BIRTHPLACE == null || p.BIRTHPLACE == "").length > 0) {
                this.msg.push("msgSpouceBirthplaceEmptyofGuranter");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.EXPIRYIDDATE == null).length > 0) {
                this.msg.push("msgSpouceExpiryDateEmptyofGuarantor");
              }
              if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPSPOUSEDETAIL.filter(p => p.SPOUSEADDRESS == null || p.SPOUSEADDRESS == "").length > 0) {
                this.msg.push("msgSpouceAddressEmptyofGuarantor");
              }
            }
          }
        }

        /// SOCD-17462
        /// Family Members checks should be only for Borrower
        if (entity.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower.toString() &&
          entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY && entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed).length > 0) {
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.NAME == null || p.NAME === '').length > 0) {
            this.msg.push("msgFamilyMembNameEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.DATEOFBIRTH == null)).length > 0) {
            this.msg.push("msgFamilyMembDOBEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.FAMCRDNUM == null || p.FAMCRDNUM === '')).length > 0) {
            this.msg.push("msgFamilyCardNoEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.RELATIONSHIPCDE == null || p.RELATIONSHIPCDE === '')).length > 0) {
            this.msg.push("msgFamilyRelationshipEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.GENDER == null || p.GENDER === '')).length > 0) {
            this.msg.push("msgFamilyGenderEmpty");
          }
          if (entity.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.RowState !== DataRowState.Removed && (p.OCCUPATIONCDE == null || p.OCCUPATIONCDE === '')).length > 0) {
            this.msg.push("msgFamilyOccupationEmpty");
          }
        }
      }

      entity.ADDRESS.forEach(adr => {
        if (adr.PROPOSALADDRESSTYPEDETAIL.filter(k => k.DEFAULTIND == true).length > 0) {
          if (adr.PROPOSALAPPLICANTPHONEFAX.filter(p => p.PHONETYPECDE == "00003").length == 0) {
            this.msg.push("msgMobileNumberEmpty");
          }
        }
      });
    });

    if (proposalArticle.ASSETENTITY) {
      if (proposalArticle.ASSETENTITY.PROPOSALASSET && !proposalArticle.ASSETENTITY.PROPOSALASSET.USAGETYPECODE) {
        this.msg.push("msgAsstUsgeTypeEmpty");
      }
      let totalAdminFee = proposalArticle.ASSETENTITY.PROPOSALADMINFEEDETAIL.STANDARDADMINFEE + proposalArticle.ASSETENTITY.PROPOSALADMINFEEDETAIL.ADDITIONALADMINFEE;
      if (proposalArticle.ASSETENTITY.PROPOSALADMINFEEDETAIL && totalAdminFee <= 0) {
        this.msg.push("msgAdminFeeEmpty");
      }

      if (this.MainInsuranceEntity && this.MainInsuranceEntity.controls.STANDARDINSURANCE.value && this.MainInsuranceEntity.controls.STANDARDINSURANCE.length == 0) {
        this.msg.push("msgInsuranceEmpty");
      }
      //BPKB Fields
      if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL) {
        //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY))
        //{
        //    this.msg.push("msgBPKBOwnerCatgEmpty");
        //}
        //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERTYPE))
        //{
        //    this.msg.push("msgBPKBOwnerTypeEmpty");
        //}
        //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNERNME))
        //{
        //    this.msg.push("msgBPKBOwnerNameEmpty");
        //}
        if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY != ApplicantType.Company) {
          if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.GENDER)
            this.msg.push("msgBPKBOwnerGenderEmpty");
          //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERKTPID))
          //    this.msg.push("msgBPKBOwnerKTPEmpty");
          if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB)
            this.msg.push("msgBPKBOwnerDOB");

          /// SOCD - 17449
          if (proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB &&
            proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERDOB > new Date())
            this.msg.push("WrongDateOfBirthBPKB");

          if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE)
            this.msg.push("msgBPKBOwnerMaritalStatus");

          if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE
            && proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE == MaritalStatus.Married.toString()
            && proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBOWNERSPOUSENME)
            this.msg.push("msgBPKBOwnerSpouseName");
        }
        //else if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY == NetSol.Core.Enum.ApplicantType.Company.GetStringValue())
        //{
        //    if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERKTPID))
        //        this.msg.push("msgBPKBOwnerSIUPEmpty");
        //}
        //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOBPKBHOLDERNME))
        //{
        //    this.msg.push("msgBPKBHolderNameEmpty");
        //}
        //if (article.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOMARITALSTATUSCDE == MaritalStatus.Married.GetStringValue())
        //{
        //    if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBOWNERSPOUSEADDRESS))
        //        this.msg.push("msgBPKBOwnerSpouceAddEmpty");
        //}
        //if (string.IsNullOrWhiteSpace(article.ASSETENTITY.OTOPRPLASSTBPKBDETL.BPKBHOLDERADDRESS))
        //{
        //    this.msg.push("msgBPKBholderAddressEmpty");
        //}
        if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.ADDSDSC) {
          this.msg.push("msgBPKBOwnerAddress");
        }
      }
      if (proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL) {
        if (proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.CITYOFREGISTRATIONOTO <= 0)
          this.msg.push("msgCityofRegisteration");
      }
      try {
        if (this._dataService.ASSETENTITY.value.PROPOSALSOFCOMMISSIONDETAIL && this._dataService.ASSETENTITY.value.PROPOSALSOFCOMMISSIONDETAIL.MAXSOFCOMMISSION < this._dataService.ASSETENTITY.value.PROPOSALSOFCOMMISSIONDETAIL.TOTALSOFCOMMISSION) {
          this.msg.push("msgTotalSOFCommGreaterthanMaxComm");
        }
      }
      catch (Exception) {
        return false;
      }

      //pOJK Fields validation
      if (!proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.GOODSSERVICESFUND)
        this.msg.push("msgGoodsFundService");
      if (this._dataService.PROPOSAL.controls.ENABLEGOODSDETAILS.value == true && this._dataService.PROPOSAL.controls.ISGOODSDETAILSMANDATORY.value == true && (proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.GOODSSERVICESFUNDDETAILS == '' || proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.GOODSSERVICESFUNDDETAILS==null))
        this.msg.push("msgGoodsFundDetails");
      if (!proposalArticle.ASSETENTITY.PROPOSALVEHICLEDETAIL.FINANCINGTYPE)
        this.msg.push("msgFinancingType");

      // #region BPKB Address

      let proposalApplicant = this._dataService.PROPOSALAPPLICANT.controls.find(p => p.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == RoleCode.Borrower) as FormGroup<IProposalApplicantEntity>;
      this.SetDefaultAddress(proposalArticle, proposalApplicant);

      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOPROVINCE || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOPROVINCE == 0) {
        this.msg.push("msgBPKBProvince");
      }
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKOTAMADYA || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKOTAMADYA == 0) {
        this.msg.push("msgBPKBKotamadya");
      }
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKECAMATAN || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTOKECAMATAN == 0) {
        this.msg.push("msgBPKBKecamatan");
      }
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTODESA || proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTODESA == 0) {
        this.msg.push("msgBPKBKelurahan");
      }
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORT) {
        this.msg.push("msgBPKBRT");
      }
      if (!proposalArticle.ASSETENTITY.OTOPRPLASSTBPKBDETL.OTORW) {
        this.msg.push("msgBPKBRW");
      }
      // #endregion

      return this.msg;
    }
    else {
      return false;
    }
  }


  public SlikValidation() {
    let msg: string = "";
    let ind: boolean = true;
    // var validationMessages = new List<Controls.ValidationMessage>();

    if (this._dataService.PROPOSALAPPLICANT !== null) {
      this._dataService.PROPOSALAPPLICANT.controls.filter(item => {
        if (item.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == RoleCode.Borrower && item.controls.RowState.value !== DataRowState.Removed) {
          if (item.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.value == "I") {
            if (item != null && item.controls.INDIVIDUALAPPLICANT != null && item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL != null && item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.NATIONALITYCDE.value == "00002") {
              if (item.controls.PROPOSALAPPLICANTIDDETAIL.controls.filter(x => x.controls.IDTYPECDE.value == "00002" && x.controls.RowState.value !== DataRowState.Removed).length == 0) {
                ind = false;
                this._messageService.showMesssage("plzaddPassport", MessageType.Warning);
                return;
              }
            }
            let info: any;

            if (item != null && item.controls.ADDRESS != null && item.controls.ADDRESS.length > 0) {
              let temp: any;
              item.controls.ADDRESS.controls.filter(Adress => {
                {
                  if (Adress.controls.PROPOSALADDRESSTYPEDETAIL != null && Adress.controls.PROPOSALADDRESSTYPEDETAIL.length > 0 && Adress.controls.RowState.value !== DataRowState.Removed) {
                    temp = Adress.controls.PROPOSALADDRESSTYPEDETAIL.controls.find(x => x.controls.ADDRESSTYPECDE.value == AddressTypeCode.Legal && x.controls.RowState.value !== DataRowState.Removed);
                  }
                  if (temp != null) {
                    info = Adress;
                    return;
                  }
                }
              })
            }

            if (info && info.controls.PROPOSALAPPLICANTADDRESS.value) {
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.KOTAMADYAIDOTO.value == 0 || info.controls.PROPOSALAPPLICANTADDRESS.controls.KOTAMADYAIDOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctKotamadyaKabupatenLeglAdds", MessageType.Warning);
                return;

              }
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.value == 0 || info.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctKecamatanLeglAdds", MessageType.Warning);
                return;
              }
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.value == 0 || info.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctKelurahanDesaLeglAdds", MessageType.Warning);
                return;
              }
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSOTO.value == null || info.controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzAddAdressBorrower", MessageType.Warning);
                return;
              }


            }

            if (!info) {
              ind = false;
              this._messageService.showMesssage("plzaddLegalAdds", MessageType.Warning);
              return;

            }
            if (info.controls.PROPOSALAPPLICANTPHONEFAX.controls.filter((x: any) => x.controls.PHONETYPECDE.value == "00010" && x.controls.RowState.value != DataRowState.Removed).length == 0) {
              ind = false;
              this._messageService.showMesssage("plzaddFixedLine", MessageType.Warning);
              return;

            }
            if (info.controls.PROPOSALAPPLICANTPHONEFAX.controls.filter((x: any) => x.controls.PHONETYPECDE.value == "00003").length == 0) {
              ind = false;
              this._messageService.showMesssage("plzaddMobile", MessageType.Warning);
              return;

            }
          }

          else {
            if (item.controls.PROPOSALAPPLICANTIDDETAIL.controls.filter(x => x.controls.IDTYPECDE.value == "00005" && x.controls.RowState.value !== DataRowState.Removed).length == 0) {
              ind = false;
              this._messageService.showMesssage("plzslctNPWPId", MessageType.Warning);
              return;
              ;
            }

            let info: any;

            //info = item.ADDRESS.FindAll(x => x.PROPOSALADDRESSTYPEDETAIL.Where(y => y.ADDRESSTYPECDE == AddressTypeCode.Legal.GetStringValue()).ToGenericCollection()).FirstOrDefault();
            if (item != null && item.controls.ADDRESS != null && item.controls.ADDRESS.length > 0) {
              let temp: any;


              item.controls.ADDRESS.controls.filter(Adress => {
                {
                  if (Adress.controls.PROPOSALADDRESSTYPEDETAIL != null && Adress.controls.PROPOSALADDRESSTYPEDETAIL.length > 0 && Adress.controls.RowState.value !== DataRowState.Removed) {
                    temp = Adress.controls.PROPOSALADDRESSTYPEDETAIL.controls.find(x => x.controls.ADDRESSTYPECDE.value == AddressTypeCode.Legal);
                  }
                  if (temp != null) {
                    info = Adress;
                    return;
                  }
                }
              })
            }

            if (info && info.controls.PROPOSALAPPLICANTADDRESS) {
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.KOTAMADYAIDOTO.value == 0 || info.controls.PROPOSALAPPLICANTADDRESS.controls.KOTAMADYAIDOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctKotamadyaKabupatenLeglAdds", MessageType.Warning);
                return;

              }
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.value == 0 || info.controls.PROPOSALAPPLICANTADDRESS.controls.KECAMATANIDOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctKecamatanLeglAdds", MessageType.Warning);
                return;
              }
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.value == 0 || info.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctKelurahanDesaLeglAdds", MessageType.Warning);
                return;
              }
              if (info.controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSOTO.value == null || info.controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSOTO.value == "") {
                ind = false;
                this._messageService.showMesssage("plzAddAdressBorrower", MessageType.Warning);
                return;
              }

              if (item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.INITIALCERTIFICATE.value == null || item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.INITIALCERTIFICATE.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctInitialCertificate", MessageType.Warning);
                return;
              }
              if (item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.PLACEINTLCERTIFICATEISSUED.value == null || item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.PLACEINTLCERTIFICATEISSUED.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctInitialCertificateIssued", MessageType.Warning);
                return;

              }
              if (item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.LASTREGISTRATIONDTE.value == null) {
                ind = false;
                this._messageService.showMesssage("plzslctLastRegistrationDte", MessageType.Warning);
                return;

              }
              if (item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.LASTCOMYREGISTRATIONNBR.value == null || item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.LASTCOMYREGISTRATIONNBR.value == "") {
                ind = false;
                this._messageService.showMesssage("plzslctLastCompanyRegistrationNo", MessageType.Warning);
                return;

              }
              if (item.controls.COMPANYAPPLICANT.controls.PROPOSALAPPLICANTCOMPANY.controls.INITIALCERTIFICATEDTE.value == null) {
                ind = false;
                this._messageService.showMesssage("plzslctInitialCertificateDte", MessageType.Warning);
                return;

              }

            }

            let pecentage: number = 0;
            if (item.controls.PROPOSALAPPLICANTREPRESENTATIVE.value != null && item.controls.PROPOSALAPPLICANTREPRESENTATIVE.length > 0 && item.controls.PROPOSALAPPLICANTREPRESENTATIVE.value.filter(x => x.RowState !== DataRowState.Removed).length > 0) {
              let index = 0;


              item.controls.PROPOSALAPPLICANTREPRESENTATIVE.controls.filter(item1 => {
                if (item1.controls.RowState.value !== DataRowState.Removed) {
                  index++;
                  if (item1.controls.SHAREHOLDERTYPE.value == null) // SOCD - 18259
                  {
                    ind = false;
                    this._messageService.showNewMesssage("msgSelectRepType", " - " + index, MessageType.Warning);
                    return;
                  }
                  // if ((item1.controls.KELURAHANIDOTO.value == null || item1.controls.KELURAHANIDOTO.value == -1) && item1.controls.RowState.value !== DataRowState.Removed) {
                  //   ind = false;
                  //   this._messageService.showMesssage("plzslctKelurahanDesaRepAdds", MessageType.Warning);
                  //   return;
                  // }

                  // if ((item1.controls.KOTAMADYAIDOTO.value == null || item1.controls.KOTAMADYAIDOTO.value == -1) && item1.controls.RowState.value !== DataRowState.Removed ) {
                  //   ind = false;
                  //   this._messageService.showMesssage("plzslctKotamadyaDesaRepAdds", MessageType.Warning);
                  //   return;
                  // }

                  // if ((item1.controls.ADDRESSOTO.value == null || item1.controls.ADDRESSOTO.value == "") && (item1.controls.RowState.value !== DataRowState.Removed)) {
                  //   ind = false;
                  //   this._messageService.showMesssage("plzAddressRep", MessageType.Warning);
                  //   return;
                  // }
                  if (item1.controls.SHAREHOLDERTYPE.value == BPLegalType.Individual) {
                    if (item1.controls.REPRESENTATIVETYPE.value == "00004") {
                      pecentage = parseFloat(((pecentage + Number(item1.controls.PERCENTAGESHARE.value)).toFixed(2)));
                    }

                    if ((item1.controls.IDTYPECDE.value == null || item1.controls.IDTYPECDE.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzIdTypeRep", " - " + index, MessageType.Warning);
                      return;
                    }

                    if ((item1.controls.IDCARDNBR.value == null || item1.controls.IDCARDNBR.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzIdTypeNumberRep", " - " + index, MessageType.Warning);
                      return;
                    }
                    if ((item1.controls.GENDER.value == null || item1.controls.GENDER.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzGenderRep", " - " + index, MessageType.Warning);
                      return;
                    }

                    if ((item1.controls.FIRSTNME.value == null || item1.controls.FIRSTNME.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzNameRep", " - " + index, MessageType.Warning);
                      return;

                    }

                    if ((item1.controls.DESIGNATIONCDE.value == null || item1.controls.DESIGNATIONCDE.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzadddsgnforRep", " - " + index, MessageType.Warning);
                      return;

                    }
                  }
                  else {

                    if (item1.controls.SHAREHOLDERTYPE.value == BPLegalType.Company && item1.controls.REPRESENTATIVETYPE.value == "00004") {
                      pecentage = parseFloat(((pecentage + Number(item1.controls.PERCENTAGESHARECOMY.value)).toFixed(2)));
                    }

                    if ((item1.controls.COMPANYNAME.value == null || item1.controls.COMPANYNAME.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzNameRep", " - " + index, MessageType.Warning);
                      return;
                    }

                    if ((item1.controls.IDTYPECDECOMY.value == null || item1.controls.IDTYPECDECOMY.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzIdTypeRep", " - " + index, MessageType.Warning);
                      return;
                    }

                    if ((item1.controls.IDCARDNBRCOMY.value == null || item1.controls.IDCARDNBRCOMY.value == "")) {
                      ind = false;
                      this._messageService.showNewMesssage("plzIdTypeNumberRep", " - " + index, MessageType.Warning);
                      return;
                    }

                  }

                  if ((item1.controls.KOTAMADYAIDOTO.value == null || item1.controls.KOTAMADYAIDOTO.value == -1 || item1.controls.KOTAMADYAIDOTO.value.toString() == "")) {
                    ind = false;
                    this._messageService.showNewMesssage("plzslctKotamadyaDesaRepAdds", " - " + index, MessageType.Warning);
                    return;
                  }
                  if ((item1.controls.KELURAHANIDOTO.value == null || item1.controls.KELURAHANIDOTO.value == -1 || item1.controls.KELURAHANIDOTO.value.toString() == "")) {
                    ind = false;
                    this._messageService.showNewMesssage("plzslctKelurahanDesaRepAdds", " - " + index, MessageType.Warning);
                    return;
                  }

                  if ((item1.controls.ADDRESSOTO.value == null || item1.controls.ADDRESSOTO.value == "")) {
                    ind = false;
                    this._messageService.showNewMesssage("plzAddressRep", " - " + index, MessageType.Warning);
                    return;
                  }
                }
              })
            }
            if (item.controls.PROPOSALAPPLICANTREPRESENTATIVE.value != null && item.controls.PROPOSALAPPLICANTREPRESENTATIVE.controls.filter(p => p.controls.REPRESENTATIVETYPE.value == "00004" && p.controls.RowState.value !== DataRowState.Removed).length > 0) {
              if (pecentage != 100) {
                ind = false;
                this._messageService.showMesssage("sharePercentage", MessageType.Warning);
                return;
              }

              let genShareHolderColl: any = item.controls.PROPOSALAPPLICANTREPRESENTATIVE.controls.filter(p => p.controls.REPRESENTATIVETYPE.value == "00004" && p.controls.RowState.value !== DataRowState.Removed);

              genShareHolderColl.filter((_ShareHolder: any) => {
                {
                  if (genShareHolderColl.filter((p: any) => p.controls.SHAREHOLDERTYPE.value == BPLegalType.Individual && (p.controls.IDTYPECDE.value == IDTypeCode.KTP && p.IDCARDNBR == _ShareHolder.controls.IDCARDNBR)).length > 1) {
                    ind = false;
                    this._messageService.showMesssage("plzchngeIDTypeShareHolder", MessageType.Warning);
                    return;
                  }

                  if (genShareHolderColl.filter((p: any) => p.controls.SHAREHOLDERTYPE == BPLegalType.Company && (p.controls.IDTYPECDE.value == IDTypeCode.SIUP && p.IDCARDNBRCOMY == _ShareHolder.controls.IDCARDNBRCOMY)).length > 1) {
                    ind = false;
                    this._messageService.showMesssage("plzchngeIDTypeShareHolder", MessageType.Warning);
                    return;
                  }
                }


              });
            }

            else {

              ind = false;
              this._messageService.showMesssage("msgAddShareHolder", MessageType.Warning);
              return;

            }
            //if (item.PROPOSALAPPLICANTREPRESENTATIVE != null && item.PROPOSALAPPLICANTREPRESENTATIVE.Count > 0)
            //{
            //    decimal share = 0;
            //    foreach (var shareHolder in item.PROPOSALAPPLICANTREPRESENTATIVE)
            //    {
            //        share = share + shareHolder.PERCENTAGESHARE + shareHolder.PERCENTAGESHARECOMY;
            //    }
            //    if (share != 100)
            //    {
            //        validationMessages.Add(new Controls.ValidationMessage() { Type = MessageType.Warning, Description = string.Format(Utilities.GetMessageDescfrmCode("sharePercentage")) });
            //        this.validator.ShowWarningMessages(validationMessages);
            //        return false;
            //    }
            //}
            //corporate
          }
        }

        if (item.controls.PROPOSALAPPLICANT.controls.ROLECDE.value == RoleCode.Guarantor && item.value.RowState !== DataRowState.Removed) {
          if (item.controls.PROPOSALAPPLICANTMAIN != null && item.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.value == "I") {
            if (item.controls.INDIVIDUALAPPLICANT != null && item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL != null && (item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.NATIONALITYCDE.value == null || item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.NATIONALITYCDE.value == "") && (item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.RowState.value !== DataRowState.Removed)) {
              ind = false;
              this._messageService.showMesssage("plzaddNationalityGuranotor", MessageType.Warning);
              return;
            }
            if (item != null && item.controls.INDIVIDUALAPPLICANT != null && item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL != null && item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.NATIONALITYCDE.value == "00002" && (item.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.RowState.value !== DataRowState.Removed)) {
              if (item.controls.PROPOSALAPPLICANTIDDETAIL.controls.filter(x => x.controls.IDTYPECDE.value == "00002").length == 0) {
                ind = false;
                this._messageService.showMesssage("plzaddPassportGurantor", MessageType.Warning);
                return;

              }
            }
            //individual
          }
          else {
            if (item.controls.PROPOSALAPPLICANTIDDETAIL.controls.filter(x => x.controls.IDTYPECDE.value == "00003" && x.controls.RowState.value !== DataRowState.Removed).length == 0) {
              ind = false;
              this._messageService.showMesssage("plzaddSIUPidGuranotr", MessageType.Warning);
              return;

            }

            if (item.controls.PROPOSALAPPLICANTIDDETAIL.controls.filter(x => x.controls.IDTYPECDE.value == "00005" && x.controls.RowState.value !== DataRowState.Removed).length == 0) {
              ind = false;
              this._messageService.showMesssage("plzaddNPWPidGuranotr", MessageType.Warning);
              return;

            }
          }
          let info: any = null;

          //info = item.ADDRESS.FindAll(x => x.PROPOSALADDRESSTYPEDETAIL.Where(y => y.ADDRESSTYPECDE == AddressTypeCode.Legal.GetStringValue()).ToGenericCollection()).FirstOrDefault();
          if (item != null && item.controls.ADDRESS != null && item.controls.ADDRESS.length > 0) {
            let temp: any = null;

            item.controls.ADDRESS.controls.filter(Adress => {
              {
                if (Adress.controls.PROPOSALADDRESSTYPEDETAIL != null && Adress.controls.PROPOSALADDRESSTYPEDETAIL.length > 0 && Adress.controls.RowState.value !== DataRowState.Removed) {
                  temp = Adress.controls.PROPOSALADDRESSTYPEDETAIL.controls.filter(x => x.controls.ADDRESSTYPECDE.value == AddressTypeCode.Legal);
                }
                if (temp != null) {
                  info = Adress;
                  return;
                }
              }
            })
          }
          if (info == null) {
            ind = false;
            this._messageService.showMesssage("plzaddLegalAddsGurantor", MessageType.Warning);
            return;

          }

          if (info != null && info.controls.PROPOSALAPPLICANTADDRESS.controls.KELURAHANIDOTO == null) {
            ind = false;
            this._messageService.showMesssage("plzslctKelurahanDesaLeglAddsGurantor", MessageType.Warning);
            return;

          }


          if (info != null && info.controls.PROPOSALAPPLICANTADDRESS.controls.ADDRESSOTO == null) {
            ind = false;
            this._messageService.showMesssage("plzAddAdressGurantor", MessageType.Warning);
            return;

          }

        }
      })
      return ind;
    }
    else
      return true;
  }


  public AddRemoveFamilyTab(isforadd: boolean) {
    if (isforadd) {
      let spousedetail = this._dataService.BORROWERSPOUSEDETAILS;
      if (spousedetail != null) {
        let spousename = this._dataService.concatenateNames(spousedetail.controls.FIRSTNME.value, spousedetail.controls.MIDDLENME.value, spousedetail.controls.LASTNME.value);
        if (this._dataService.CURRENTBORROWER.value.INDIVIDUALAPPLICANT.PROPOSALAPPFAMILY.filter(p => p.ISSPOUSEIND === true && p.RowState !== DataRowState.Removed).length === 0) {
          let item: FormGroup<IOTO_PRPL_APLT_FAMInfo> = this._ProposalForm.proposalIndvidualFamilyMemberForm();
          let famCode: number = 0;
          if (this._dataService.CURRENTBORROWER.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls.length > 0) {
            famCode = this._dataService.CURRENTBORROWER.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls[this._dataService.CURRENTBORROWER.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls.length - 1].controls.FAMCDE.value + 1;
          }

          item.patchValue({
            NAME: spousename,
            DATEOFBIRTH: spousedetail.controls.BIRTHDATE.value,
            ISSPOUSEIND: true,
            //OCCUPATIONCDE: spousedetail.controls.OCCUPATIONCDE.value,
            FAMCDE: famCode
          });
          this._dataService.CURRENTBORROWER.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.push(item);
        }
        else {
          this._dataService.CURRENTBORROWER.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls.forEach(spouse => {
            if (spouse.value.ISSPOUSEIND && spousedetail?.controls.BIRTHDATE.value === spouse.value.DATEOFBIRTH) {
              spouse.patchValue({
                NAME: spousename,
                DATEOFBIRTH: spousedetail?.controls.BIRTHDATE.value
                //OCCUPATIONCDE: spousedetail?.controls.OCCUPATIONCDE.value
              });

              if (spouse.controls.RowState.value !== DataRowState.Added) {
                spouse.controls.RowState.setValue(DataRowState.Updated);
              }
            }
          });
        }
      }
    }
    // else {
    //   let index: number = this._dataService.PROPOSALAPPFAMILY.controls.findIndex(p => p.value.ISSPOUSEIND === true)
    //   if (index !== -1) {

    //     if (this._dataService.PROPOSALAPPFAMILY.controls[index].controls.RowState.value == DataRowState.Added) {
    //       this._dataService.PROPOSALAPPFAMILY.removeAt(index);
    //       this._messageService.ClearValidatorMessages('-FamilyMember-' + (index + 1));
    //     }
    //     else {
    //       this._formState.ResetFormState(this._dataService.PROPOSALAPPFAMILY.controls[index], DataRowState.Removed);
    //       this._messageService.ClearValidatorMessages('-FamilyMember-' + (index + 1));
    //     }

    //     // this._dataService.PROPOSALAPPFAMILY.removeAt(index);
    //   }
    // }
  }
  public getFPCampaignArray: any;


  public SetFPCampaignArray(): any {
    this.getFPCampaignArray = this._FCMasterDataService.FPCampaignCol[this._dataService.PROPOSAL.controls.BPINTRODUCERID.value]?.
      filter((f: any) => f.FPGROUPID == this._dataService.PROPOSAL.controls.FPGROUPID.value && f.BRANCHID == this._dataService.PROPOSAL.controls.BPCOMPANYBRANCHID.value);

    if (this._dataService.PROPOSAL.controls.PROPOSALTYPECDE.value == ApplicantType.Company) {
      this.getFPCampaignArray = this.getFPCampaignArray?.filter((f: any) => f.LEGALSTATUSCDE == BPLegalType.Company || f.LEGALSTATUSCDE == BPLegalType.Both);
    }
    else if (this._dataService.PROPOSAL.controls.PROPOSALTYPECDE.value == ApplicantType.Individual) {
      this.getFPCampaignArray = this.getFPCampaignArray?.filter((f: any) => f.LEGALSTATUSCDE == BPLegalType.Individual || f.LEGALSTATUSCDE == BPLegalType.Both);
    }

    this.getFPCampaignArray = this.getFPCampaignArray?.map((p: any) => ({ code: p.FINANCIALPRODUCTID.toString(), TextValue: p.FINANCIALPRODUCTNME }));
    if (this._FCMasterDataService.FPCampaignCol[this._dataService.PROPOSAL.controls.BPINTRODUCERID.value] != undefined) {
      let temp = this._FCMasterDataService.FPCampaignCol[this._dataService.PROPOSAL.controls.BPINTRODUCERID.value]?.filter((f: any) => f.FPGROUPID == this._dataService.PROPOSAL.controls.FPGROUPID.value
        && f.BRANCHID == this._dataService.PROPOSAL.controls.BPCOMPANYBRANCHID.value && f.FINANCIALPRODUCTID == this._dataService.PROPOSAL.controls.FINANCIALPRODUCTID.value);
      if (temp != null && temp.length > 0) {
        this.ContractMinTerms = temp[0].MINTERMS;
        this.ContractMaxTerms = temp[0].MAXTERMS;
      }
    }
  }

  public UpdateInsuranceDatesCF() {
    if (this.MainInsuranceEntity != null
      && this.MainInsuranceEntity.value.PRPLINSR != null
      //&& DataContext.PROPOSAL.FINANCETYP != FinanceType.Refinance.GetStringValue()
      /*&& DataContext.PROPOSALARTICLE != null
      && DataContext.PROPOSALARTICLE.Count > 0
      && DataContext.PROPOSALARTICLE.First().ASSETENTITY != null*/
      && this._dataService.PROPOSALFINANCIALAGREEMENT.value != null
      && this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTSTARTDTE != null) {
      this.MainInsuranceEntity.controls.PRPLINSR.controls.STARTDTE.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTSTARTDTE);
      this.MainInsuranceEntity.controls.PRPLINSR.controls.EXPIRYDTE.setValue(moment(this.MainInsuranceEntity.value.PRPLINSR.STARTDTE).add(this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM + this._dataService.PROPOSALFINANCIALAGREEMENT.value.GPTERMS, 'months').toDate());
      let PreviousDate = this.MainInsuranceEntity.value.PRPLINSR.STARTDTE;
      let PreviousDateForDetail = this.MainInsuranceEntity.value.PRPLINSR.STARTDTE;
      this.MainInsuranceEntity.controls.STANDARDINSURANCE.controls.forEach((StndInsr, index) => {
        StndInsr.controls.PRPLSTNDINSR.controls.STARTDTE.setValue(PreviousDate);
        PreviousDateForDetail = PreviousDate;
        StndInsr.controls.PRPLSTNDINSR.controls.ENDDTE.setValue(moment(StndInsr.value.PRPLSTNDINSR.STARTDTE).add(StndInsr.value.PRPLSTNDINSR.TERMTO - StndInsr.value.PRPLSTNDINSR.TERMFROM + 1, 'months').subtract(1, 'day').toDate());
        PreviousDate = StndInsr.value.PRPLSTNDINSR.ENDDTE;
        PreviousDate = moment(PreviousDate).add(1, 'day').toDate();
        // StndInsr.controls.RowState.setValue(DataRowState.Updated);
        if (StndInsr.value.RowState != DataRowState.Added && StndInsr.value.RowState != DataRowState.Removed) {
          this._formState.ResetFormState(this._dataService.STANDARDINSURANCE.controls[index], DataRowState.Updated);
        }
        StndInsr.controls.STANDARDINSURANCEDETAIL.controls.forEach(StndInsrDetl => {
          if(StndInsrDetl.controls.PRPLSTNDINSRDETL.value.RowState !=  DataRowState.Removed){
            StndInsrDetl.controls.PRPLSTNDINSRDETL.controls.STARTDTE.setValue(PreviousDateForDetail);
            StndInsrDetl.controls.PRPLSTNDINSRDETL.controls.ENDDTE.setValue(moment(StndInsrDetl.value.PRPLSTNDINSRDETL.STARTDTE).add(StndInsrDetl.value.PRPLSTNDINSRDETL.TERMTO - StndInsrDetl.value.PRPLSTNDINSRDETL.TERMFROM + 1, 'months').subtract(1, 'day').toDate());
            PreviousDateForDetail = moment(StndInsrDetl.value.PRPLSTNDINSRDETL.ENDDTE).add(1, 'day').toDate();
          }
          
        })
      })
      /*---if (this.MainInsuranceEntity != null
        && this.MainInsuranceEntity.value.STANDARDINSURANCE != null
        && this.MainInsuranceEntity.value.STANDARDINSURANCE.length > 0) {
          this.MainInsuranceEntity.controls.STANDARDINSURANCE.controls.forEach(stDetail => {
            this._formState.ResetFormArrayState(stDetail.controls.STANDARDINSURANCEDETAIL, DataRowState.Removed)
          });
        // foreach(StandardInsuranceEntity stndInsr in this.MainInsuranceEntity.STANDARDINSURANCE.Where(s => s.PRPLSTNDINSR.COLLECTIONMETHODCDE == InsuranceCollectionTypes.LeaseClause.GetStringValue()).ToGenericCollection())
        // {
        //   stndInsr.STANDARDINSURANCEDETAIL.RemoveAll();
        // }
      }------*/

      if (this.MainInsuranceEntity.value.STANDARDINSURANCE != null && this.MainInsuranceEntity.value.STANDARDINSURANCE.length > 0) {
        let StndInsr1 = this.MainInsuranceEntity.controls.STANDARDINSURANCE.controls[this.MainInsuranceEntity.value.STANDARDINSURANCE.length - 1];//lastordefault
        StndInsr1.controls.PRPLSTNDINSR.controls.ENDDTE.setValue(moment(StndInsr1.value.PRPLSTNDINSR.ENDDTE).add(1, 'day').toDate());
        let StndInsrDetl1 = StndInsr1.controls.STANDARDINSURANCEDETAIL.controls[StndInsr1.value.STANDARDINSURANCEDETAIL.length - 1];
        if (StndInsrDetl1 != undefined && StndInsrDetl1.value != null) {
          StndInsrDetl1.controls.PRPLSTNDINSRDETL.controls.ENDDTE.setValue(moment(StndInsrDetl1.value.PRPLSTNDINSRDETL.ENDDTE).add(1, 'day').toDate());
        }
      }
      // MainInsuranceEntity.PRPLINSR.EXPIRYDTE  = MainInsuranceEntity.PRPLINSR.EXPIRYDTE.Value.AddDays(1);
    }
  }

  loadSupplier() {
    if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase && this._dataService.PROPOSAL.value.ISMCOMCAMPAIGN == true) {
      if(this._dataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed && x.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)!=null){
        let borrower = this._dataService.PROPOSALAPPLICANT.value.filter(x => x.RowState != DataRowState.Removed && x.PROPOSALAPPLICANT.ROLECDE == RoleCode.Borrower)[0] as IProposalApplicantEntity;
        if (borrower.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I") {
          this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.SUPPLIERNAME.setValue(borrower.PROPOSALAPPLICANT.APPLICANTNME)
        }
        else {
          this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.SUPPLIERNAME.setValue(borrower.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY.NAME)
        }
        this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.BPINTRODUCERID.setValue(borrower.PROPOSALAPPLICANTMAIN.BUSINESSPARTNERID)
      }
    }
    else if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
      this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.SUPPLIERNAME.setValue('');
      this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.BPINTRODUCERID.setValue(-1);
    }
    else if (this.ISOL &&
      this._dataService.PROPOSALASSET.controls.SALESANDLEASEBACKIND.value === true &&
      this._dataService.PROPOSALASSET.controls.BPINTRODUCERID.value === 0) {
      if (this._dataService.CurrentApplicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP == "I")
        this._dataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(this._dataService.CurrentApplicant.value.INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.FIRSTNME);
      else if (this._dataService.CurrentApplicant.value.PROPOSALAPPLICANTMAIN.APPLICANTTYP != "I")
        this._dataService.PROPOSALASSET.controls.SUPPLIERNAME.setValue(this._dataService.CurrentApplicant.value.COMPANYAPPLICANT.PROPOSALAPPLICANTCOMPANY.NAME);
    }
  }

  public isBPalreadyLoaded(IdNumber: string, IdType: string): boolean {
    let response: any = false;
    if (this._dataService.PROPOSALAPPLICANT !== null) {
      this._dataService.PROPOSALAPPLICANT.controls.filter(item => {
        // if (item.controls.PROPOSALAPPLICANTMAIN.controls.APPLICANTTYP.value == "I") {
        if (item != null && item.controls.PROPOSALAPPLICANTIDDETAIL != null && (item.controls.PROPOSALAPPLICANTIDDETAIL.controls.filter(x => x.controls.IDTYPECDE.value !== IDTypeCode.NPWP && x.value.IDTYPECDE == IdType && x.controls.IDTYPENBR.value == IdNumber && x.controls.RowState.value !== DataRowState.Removed)).length > 0) {
          response = true;
        }
        // }
      })
      return response;
    }
    else {
      return response;
    }
  }
  private ValidateApplicableddress(entity: Array<IAddressEntity>) {
    let result = false;

    for (let i = 0; i < entity.length; i++) {
      if (entity[i] != null && entity[i].RowState !=DataRowState.Removed) {
        result = entity[i].PROPOSALADDRESSTYPEDETAIL.filter(k => k.RowState != DataRowState.Removed).length==0;

        if (result) {
          this.msg.push("plzSelectApplicable");
          this.isProposalRequestValid=false;
        }
      }
    }
  }

  public Round(value: any, decimals: number = 2) {
    return +Number(value).toFixed(decimals);
  }

  public Sharpen(input: any, decimals: number = 2) {
    //return +value.toFixed(decimals);
    //return +value.toFixed(3).slice(0, -1);
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (decimals || -1) + '})?');
    return +input.toString().match(re)[0];
  }

  public Trunc(value: any, decimals: number = 2) {
    let val = '';
    val = String(value);
    let finalVal = val.substring(0, val.indexOf('.') + 3);
    return Number(finalVal);
  }
}

export interface CommissionValidation {
  RecipientName: string;
  CommisionType: string;
  DevisionType: string;
  RecipientRole: string;
}
