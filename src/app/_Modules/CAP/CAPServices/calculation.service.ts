import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ClientStoreService } from '@NFS_Core/NFSServices/ClientCache/client-store.service';
import { FormatterService } from '@NFS_Core/NFSServices/Formatter/formatter.service';
import { FormModeService } from '@NFS_Core/NFSServices/FormMode/form-mode.service';
import { AssetDetailsMasterdataService } from '@NFS_Core/NFSServices/MasterData/asset-details-masterdata.service';
import { FinancialClubMasterDataService } from '@NFS_Core/NFSServices/MasterData/FinancialClub-master-data.service';
import { ProposalMasterDataRequest } from '@NFS_Core/NFSServices/MasterData/MasterdataHelper/proposalMasterDataRequests';
import { MessageService } from '@NFS_Core/NFSServices/MessageService/message.service';
import { ProposalService } from '@NFS_Core/NFSServices/Proposal/proposal.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IFinancialProductEntity } from '@NFS_Entity/HelperEntities/IFinancialProductEntity';
import { ITPLE_RNTL_CMPT_ATCHInfo } from '@NFS_Entity/HelperEntities/ITPLE_RNTL_CMPT_ATCHInfo';
import { RentalFrequency } from '@NFS_Entity/Proposal-Entity/Calculation/RentalFrequency';
import { IProposalArticleEntity, IProposalEntity, IPRPL_CHRTInfo, IPRPL_CMPT_CNFGInfo, IPRPL_TPLE_COMM_CNFGInfo, IPRPL_TPLE_INCM_CNFGInfo, IPRPL_TPLE_RNTL_INTInfo } from '@NFS_Entity/Proposal-Entity/ProposalEntity.model.index';
import { IPRPL_APLT_ADDSInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { IAssetEntity, IINSR_DPRN_PLCYInfo, IMainInsuranceEntity, IProposalArticleComponentEntity, IProposalChargeEntity, IProposalRepaymentPlanEntity, IPRPL_ARTE_AMNT_TRAN_TAXInfo, IPRPL_ARTE_BASE_RATEInfo, IPRPL_ARTE_CHRT_DETLInfo, IPRPL_CHRGInfo, IPRPL_CHRG_TAXInfo, IPRPL_FINL_AGRMInfo, IPRPL_MKTG_COMMInfo, IPRPL_RNTL_DETLInfo, IPRPL_RPMT_PLANInfo, IPRPL_RPMT_PLAN_TAXInfo, IProposalCommissionEntity, IPRPL_ARTE_AMNT_TRANInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { AmortizationMethod } from '@NFS_Enums/AmortizationMethod.enum';
import { AmountClassification } from '@NFS_Enums/AmountClassification.enum';
import { AmountComponent } from '@NFS_Enums/AmountComponent';
import { ArticleType } from '@NFS_Enums/ArticleType.enum';
import { AssetTypeCodeCF } from '@NFS_Enums/AssetTypeCodeCF.enum';
import { BaseRateType } from '@NFS_Enums/BaseRateType.enum';
import { BusinessRuleModelCode } from '@NFS_Enums/BusinessRuleModelCode.enum';
import { CalculateRVBasedOn } from '@NFS_Enums/CalculateRVBasedOn.enum';
import { ChartType } from '@NFS_Enums/ChartType.enum';
import { CommissionCalculationMethod } from '@NFS_Enums/CommissionCalculationMethod';
import { CommissionType } from '@NFS_Enums/CommissionType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FinanceType } from '@NFS_Enums/FinanceType';
import { FinancialComponentsOperations } from '@NFS_Enums/FinancialComponentsOperations';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { InsuranceAssetUsageType } from '@NFS_Enums/InsuranceAssetUsageType.enum';
import { InsuranceCollectionTypes } from '@NFS_Enums/InsuranceCollectionTypes.enum';
import { InterestType } from '@NFS_Enums/InterestType.enum';
import { MessageType } from '@NFS_Enums/MessageType.enum';
import { NationalityTypes } from '@NFS_Enums/NationalityTypes.enum';
import { PayableTypeCode } from '@NFS_Enums/PayableTypeCode.enum';
import { RentalCalculationMethod } from '@NFS_Enums/RentalCalculationMethod.enum';
import { RentalFrequencyBasis } from '@NFS_Enums/RentalFrequencyBasis.enum';
import { RentalMode } from '@NFS_Enums/RentalMode';
import { RentalType } from '@NFS_Enums/RentalType.enum';
import { ReturnCode } from '@NFS_Enums/ReturnCode.enum';
import { RoleCode } from '@NFS_Enums/RoleCode';
import { RuleModelType } from '@NFS_Enums/RuleModelType.enum';
import { RVBalloonType } from '@NFS_Enums/RVBalloonType.enum';
import { SecurityDepositCalculationMethod } from '@NFS_Enums/SecurityDepositCalculationMethod';
import { SubsidyType } from '@NFS_Enums/SubsidyType.enum';
import { TaxInclExcl } from '@NFS_Enums/TaxInclExcl.enum';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { CommissionCalculationParam } from '@NFS_Interfaces/RequestInterfaces/CommissionCalculationParam';
import { ICalculationInfoParam } from '@NFS_Interfaces/RequestInterfaces/ICalculationInfoParam';
import { IChartInfoPOSParm } from '@NFS_Interfaces/RequestInterfaces/IChartInfoPOSParm';
import { IGenericChartRequestParams } from '@NFS_Interfaces/RequestInterfaces/IGenericChartRequestParams';
import { IProposalInfoParm } from '@NFS_Interfaces/RequestInterfaces/IProposalInfoParm';
import { ITAXParam } from '@NFS_Interfaces/RequestInterfaces/ITaxParam';
import { RentalStructureCountParam } from '@NFS_Interfaces/RequestInterfaces/RentalStructureCountParam';
import { ProposalManagerService } from '@NFS_Modules/CAP/_helpers/proposal-manager.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from 'src/Library';
import { ExtractGroupValue } from 'src/Library/lib/src/lib/types';
import  moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProposalDataService } from './proposal-data.service';
import { ProposalEntityMapperService } from './proposal-entity-mapper.service';
import { ProposalEntityFormService } from './ProposalEntityForm.service';
import { AssetDetailsCommonComponent } from '../Proposal/Assets/asset-details/asset-details-common/asset-details-common.component';
import { stringify } from 'querystring';
import { AssetComponentsFinancialConfiguration } from '@NFS_Enums/AssetComponentsFinancialConfiguration.enum';

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  AssetEntityCollection: Array<IProposalChargeEntity> = new Array();
  public PRPLCHRGTAXDataset: FormArray<IPRPL_CHRG_TAXInfo>[] = [];
  public totalTaxAmountArr: number[] = [];
  rentalFrequency!: RentalFrequency;
  private TAXINCULSIVEAMT: number = 0;
  private PROPOSALTEMPLATERENTALINT: any = {};
  public Configurations: FormGroup<IPRPL_FINL_AGRMInfo> = this._ProposalForm.ProposalFinancialAgreementForm();
  private financialProdEntity!: IFinancialProductEntity;
  netpayableamt = 0;
  private subscription$ = new Subject();
  // apiCacheData : any = null;
  // apiBusinessData : any = null;

  public btnInsCalculateIsEnabled: boolean = false;

  // PRPLBPKBDETL!: FormGroup<IOTO_PRPL_ASST_BPKB_DETLInfo>;

  public OldContractformGroup!: FormGroup<any>
  constructor(
    private _dataService: ProposalDataService,
    private _ProposalForm: ProposalEntityFormService,
    private _FormState: StateManagment,
    private _formatter: FormatterService,
    private _proposalentitymapper: ProposalEntityMapperService,
    private _proposalManagerService: ProposalManagerService,
    private _proposalService: ProposalService,
    private _formBuilder: FormBuilder,
    private storageService: ClientStoreService,
    public _financialClubMasterDataService: FinancialClubMasterDataService,
    private router: Router,
    private _assetMasterData: AssetDetailsMasterdataService,
    private _formMode: FormModeService,
    private _msgService: MessageService,
    private _propEntityFormService:ProposalEntityFormService
  ) {
    this.valueChangeSubscription();
  }

  valueChangeSubscription() {
    this.CalculateFirstPayment();
  }

  get deductedComponents() {
    // let deductedComponentArray = this._formBuilder.array(
    //   this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
    // );
    // let deductedComponent = this._formBuilder.array(
    //   deductedComponentArray.controls
    // );
    // // && p.value.RowState != DataRowState.Removed //pending , remove for testing purpose
    // if (deductedComponent?.length > 0) {
    //   deductedComponent.controls.forEach((item) => {
    //     if (
    //       item.value.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
    //       AmountComponent.GetStringValue(AmountComponent.ContractFinancedCharges)
    //     ) {
    //       item.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(
    //         'Charges Financed'
    //       );
    //     }
    //   });
    // }
    // return deductedComponent;
    let components!: FormArray<IProposalArticleComponentEntity>;;
    console.log("this._dataService.PRPLARTICLECOMPONENTENTITYCOL", this._dataService.PRPLARTICLECOMPONENTENTITYCOL);

    components = this._formBuilder.array(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.
      filter(p => p.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.value == FinancialComponentsOperations.Subtract && 
        !this.IsOldContractComonent(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE)
      ));
    components.controls.map((r) => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.value.PRPLARTEAMNTTRAN.AMTCMPTCDE))));
    // if (m_deductedcomponents != null && m_deductedcomponents.length > 0)
    // {
    components.controls.forEach(p => {
      if (p.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.value == FinancialComponentsOperations.Subtract
         && p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.Discount)) {
        p.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Discount');
        //components.push(p);
      }

      if (p.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.value == FinancialComponentsOperations.Subtract && p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.ContractFinancedCharges)) {
        p.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue("Charges Financed");
        //components.push(p);
      }

      if (p.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.value == FinancialComponentsOperations.Subtract && p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.DownpaymentDeposit)) {
        p.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue("Down Payment");
        //components.push(p);
      }

    })

    return components;
  }
  get outFlowSum()
  {
    let components!: FormArray<IProposalArticleComponentEntity>;;
    console.log("this._dataService.PRPLARTICLECOMPONENTENTITYCOL", this._dataService.PRPLARTICLECOMPONENTENTITYCOL);

    components = this._formBuilder.array(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.
      filter(p =>
        this.IsOldContractComponentOutflow(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE, p.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE)
      ));
    components.controls.map((r) => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.value.PRPLARTEAMNTTRAN.AMTCMPTCDE))));
    let totalAmount = components?.controls.reduce((sum, component) => {
      // Access the AMNT control and ensure it's a valid number
      const amntControl = component.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT;
      return sum + (amntControl ? amntControl.value : 0);
    }, 0);
    return totalAmount;

  }
  IsOldContractComponentOutflow(code: string, cmptFineTypeCode: string | null): boolean {
    if (code == AmountComponent.GetStringValue(AmountComponent.UnpaidPanelty)
      && cmptFineTypeCode == AssetComponentsFinancialConfiguration.Waived) {
      return false;
    }

    if (code == AmountComponent.GetStringValue(AmountComponent.OutStandingPrincipal) ||
      code == AmountComponent.GetStringValue(AmountComponent.TotalUnpaidInstallement) ||
      code == AmountComponent.GetStringValue(AmountComponent.OngoingInterest) ||
      code == AmountComponent.GetStringValue(AmountComponent.UnpaidPanelty) ||
      code == AmountComponent.GetStringValue(AmountComponent.AdditionalChanrges)) {
      return true;
    } else {
      return false;
    }
  }

  IsOldContractComonent(code: string): boolean {
    if (code == AmountComponent.GetStringValue(AmountComponent.OutStandingPrincipal) ||
      code == AmountComponent.GetStringValue(AmountComponent.TotalUnpaidInstallement) ||
      code == AmountComponent.GetStringValue(AmountComponent.OngoingInterest) ||
      code == AmountComponent.GetStringValue(AmountComponent.UnpaidPanelty) ||
      code == AmountComponent.GetStringValue(AmountComponent.AdditionalChanrges)) {
      return true;
    } else {
      return false;
    }
  }

  get addedComponents() {
    let addComponentsformArray = this._formBuilder.array(
      this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
    );
    let addComponents = this._formBuilder.array(
      addComponentsformArray.controls
        .filter(
          (p) =>
            p.value.PRPLARTEAMNTTRAN.INPUTAMT >= 0 &&
            p.value.PRPLARTEAMNTTRAN.OPERATORCDE ==
            FinancialComponentsOperations.Add &&
            p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE != AmountComponent.GetStringValue(AmountComponent.AssetCost) &&
            p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE !=
            AmountComponent.GetStringValue(AmountComponent.AccessoriesCost) && 
              !this.IsOldContractComonent(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE)
            )
        .map((r) => r)
    );

    addComponents.controls.map((r) => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.value.PRPLARTEAMNTTRAN.AMTCMPTCDE))));
    // && p.RowState != DataRowState.Removed ----commenting for test
    //addComponents.patchValue(addComponentsFormGroup);

    if (this._proposalManagerService.AssetCostAddedComponent() != null && this._proposalManagerService.AssetCostAddedComponent().value.PRPLARTEAMNTTRAN.INPUTAMT > 0) {
      addComponents.push(this._proposalManagerService.AssetCostAddedComponent());
    }
    var temp = this.AccesoryCostAddedComponent();
    if (temp.value.PRPLARTEAMNTTRAN.INPUTAMT > 0) {

      addComponents.push(temp);
    }
    if (addComponents != null && addComponents.length > 0) {
      //addComponents.forEach(p => p.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue((AmountComponent)Enum.Parse(typeof (AmountComponent), p.PRPLARTEAMNTTRAN.AMTCMPTCDE)));
      this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach((component) => {
        if (component.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ContractFinancedCharges)) {
          component.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Contract Financed Charges');
        }
        //region Asset COST Handeling for OL
        else if (component.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost) && component.value.RowState != DataRowState.Removed) {
          let ITCPct = 0;
          if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
            if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 && this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((x) => x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost) && x.value.RowState != DataRowState.Removed).length > 0) {
              let tempEntity = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.find((x) => x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost) && x.value.RowState != DataRowState.Removed);
              if (tempEntity != null) {
                if (tempEntity.value.PRPLARTEAMNTTRANTAX != null && tempEntity.value.PRPLARTEAMNTTRANTAX.length > 0) {
                  if (tempEntity.controls.PRPLARTEAMNTTRANTAX.controls.find((a) => a.value.ITCPERCENTAGE > 0)) {
                    ITCPct = tempEntity.value.PRPLARTEAMNTTRANTAX[0].ITCPERCENTAGE;
                  }
                }
              }
            }
          }
          if (ITCPct > 0) {
            component.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Asset Cost Less ITC Amount');
            addComponents.controls.find(c => c.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost))?.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Asset Cost Less ITC Amount');
          }
          else {
            component.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetDescriptionStringValue(AmountComponent.AssetCost);
            addComponents.controls.find(c => c.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost))?.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(AmountComponent.AssetCost));
          }
        }
        //endregion
        //region Accesory COST Handeling for OL
        else if (component.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)) {
          let ITCPct = 0;
          if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease) {
            if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 && this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter((x) => x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)).length > 0) {
              let tempEntity = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter((x) => x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost))[0];
              if (tempEntity != null) {
                if (tempEntity.PRPLARTEAMNTTRANTAX != null && tempEntity.PRPLARTEAMNTTRANTAX.length > 0) {
                  if (tempEntity.PRPLARTEAMNTTRANTAX.filter((a) => a.ITCPERCENTAGE > 0)) {
                    ITCPct = tempEntity.PRPLARTEAMNTTRANTAX[0].ITCPERCENTAGE;
                  }
                }
              }
            }
          }
          if (ITCPct > 0)
            component.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue('Accessory Cost Less ITC Amount');
          else
            component.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetStringValue(AmountComponent.AccessoriesCost));
        }
        //endregion
        //component.controls.PRPLARTEAMNTTRAN.controls.CurrencySymbol.setValue(CurrencySymbol);
      }
      );
    }
    return addComponents;
  }
  get addedComonentsOldContract()
  {
   
      let addComponentsformArray = this._formBuilder.array(
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
      );
      let addComponents = this._formBuilder.array(
        addComponentsformArray.controls
          .filter(
            (p) =>
              p.value.PRPLARTEAMNTTRAN.INPUTAMT >= 0 &&
              p.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE ==
              AssetComponentsFinancialConfiguration.Finance &&
              this.IsOldContractComonent(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE)
              )
          .map((r) => r)
      );
       addComponents.controls.map((r) => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.value.PRPLARTEAMNTTRAN.AMTCMPTCDE))));
       return addComponents;
    }
    get deductedComponentsOldContract() {
     
      let components!: FormArray<IProposalArticleComponentEntity>;;
      console.log("this._dataService.PRPLARTICLECOMPONENTENTITYCOL", this._dataService.PRPLARTICLECOMPONENTENTITYCOL);
  
      components = this._formBuilder.array(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
        .filter(
          (p) =>
            p.value.PRPLARTEAMNTTRAN.INPUTAMT >= 0 &&
            p.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE ==
            AssetComponentsFinancialConfiguration.Upfront &&
            this.IsOldContractComonent(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE)
            )
        .map((r) => r));
      components.controls.map((r) => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.value.PRPLARTEAMNTTRAN.AMTCMPTCDE))));
      return components;
    }
    get waivedComponentsOldContract() {
      let components!: FormArray<IProposalArticleComponentEntity>;;
      console.log("this._dataService.PRPLARTICLECOMPONENTENTITYCOL", this._dataService.PRPLARTICLECOMPONENTENTITYCOL);
        components = this._formBuilder.array(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
        .filter(
          (p) =>
            p.value.PRPLARTEAMNTTRAN.INPUTAMT >= 0 &&
            p.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE ==
            AssetComponentsFinancialConfiguration.Waived &&
            this.IsOldContractComonent(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE)
            )
        .map((r) => r));
      components.controls.map((r) => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.value.PRPLARTEAMNTTRAN.AMTCMPTCDE))));
     
      return components;
    }
  public AccesoryCostAddedComponent(): FormGroup<IProposalArticleComponentEntity> {
    let AccesoryCost = this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ACCESSORYAMT.value;
    if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ACCESSORYAMT.value > 0) {
      if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 && this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter((x) =>
        x.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost)).length > 0) {
        let tempEntity = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.find((x) => x.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.AccessoriesCost));
        if (tempEntity != null) {
          if (tempEntity.controls.PRPLARTEAMNTTRANTAX != null && tempEntity.controls.PRPLARTEAMNTTRANTAX.length > 0) {
            if (tempEntity.controls.PRPLARTEAMNTTRANTAX.controls.find((p) => p.controls.ITCPERCENTAGE.value > 0)) {
              //decimal vatAmount = this.PROPOSAL_ASSET.PROPOSALFINANCIALAGREEMENT.ACCYWITHOUTVAT;
              AccesoryCost = this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ACCYWITHOUTVAT.value;
            }
          }
        }
      }
    }
    let entity = this._ProposalForm.ProposalArticleComponentForm();
    // entity.controls.PRPLARTEAMNTTRAN =
    //   this._ProposalForm.ProposalArticleAmountTransferForm();
    entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue('');
    entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.setValue(AmountComponent.GetStringValue(AmountComponent.AccessoriesCost));
    entity.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(AmountComponent.AccessoriesCost));


    //entity.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.AssetCost.GetDescriptionStringValue();
    entity.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(AccesoryCost);
    this._proposalManagerService.CalculateIncExcValues(entity);
    return entity;
  }
  public removeSubsidyComponents() {
    this.RemoveArticleComponent(AmountComponent.DownpaymentSubsidy);
    this.RemoveArticleComponent(AmountComponent.InterestSubsidyFixedAmount);
    this.RemoveArticleComponent(AmountComponent.InterestSubsidyRateBased);
    this.RemoveArticleComponent(AmountComponent.InstallmentSubsidy);
  }

  public RemoveArticleComponent(component: AmountComponent) {
    if (
      this._dataService.PROPOSALARTICLE.length > 0 &&
      this._dataService.PRPLARTICLECOMPONENTENTITYCOL.length > 0 &&
      component != AmountComponent.InsuranceSubsidy
    ) {
      var entity = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(
        (p) => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(component)
      ) as Array<IProposalArticleComponentEntity>;
      if (entity.length > 0 && entity != null)
        entity.forEach((element) => {
          let index =
            this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.indexOf(
              element
            );
          if (element.RowState == DataRowState.Added)
            this._dataService.PRPLARTICLECOMPONENTENTITYCOL.removeAt(index);
          else {
            this._FormState.ResetFormState(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls[index], DataRowState.Removed);
            //this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls[index].controls.RowState.setValue(DataRowState.Removed);
          }
        });
    }
  }

  // Update Financial Agreement generic method (*)
  public UpdateFinancialAgreementDetail(
    Amount: number,
    AmountComponentCode: AmountComponent,
    inputCurrencyCode: string,
    cmptFinancedType: string | null = null,
    Introducerid: number | null = 0,
    amountSeqId: number = 1,
    classificationCode: AmountClassification | null = null,
    receivebydealer: boolean = false
  ) {
    let alreadyexists: boolean = false;
    let agreementdetail = {} as FormGroup<IProposalArticleComponentEntity>;
    let collec: FormArray<IProposalArticleComponentEntity> =
      this._formBuilder.array<IProposalArticleComponentEntity>([]);
    if (classificationCode != null) {
      agreementdetail = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(item => item.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponentCode) &&
        item.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == classificationCode && item.value.RowState != DataRowState.Removed)[0];
    }
    else
      agreementdetail = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(item => item.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponentCode) && item.controls.RowState.value != DataRowState.Removed)[0]
    // this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(
    //   (item) => {
    //     if (item.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponentCode) && item.controls.RowState.value != DataRowState.Removed) {
    //       collec.push(item);
    //     }
    //   }
    // );
    //collec = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter(p => (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponentCode)) as Array<IProposalArticleComponentEntity>;
    if (agreementdetail != null && agreementdetail != undefined) {
      //agreementdetail = collec.controls[0];
      alreadyexists = true;
      this._FormState.MarkAllDirty(agreementdetail);
    } else {
      agreementdetail = this._ProposalForm.ProposalArticleComponentForm();
      //agreementdetail.controls.PRPLARTEAMNTTRAN = this._ProposalForm.ProposalArticleAmountTransferForm();
      //agreementdetail.controls.PRPLARTEAMNTTRANTAX=this._formBuilder.array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>([this._ProposalForm.PRPLARTEAMNTTRANTAXForm()]);
    }

    if (Amount > 0) {
      if (
        agreementdetail.value.PRPLARTEAMNTTRAN.INPUTAMT != Amount || agreementdetail.value.PRPLARTEAMNTTRAN.INPUTCURRENCYCDE != inputCurrencyCode || agreementdetail.value.PRPLARTEAMNTTRAN.OUTPUTCURRENCYCDE != '00001' || agreementdetail.value.PRPLARTEAMNTTRAN.BPID != Introducerid) {
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ASSETID.setValue(
          this._dataService.PROPOSALASSET.value.ASSETID
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PROPOSALID.setValue(
          this._dataService.PROPOSAL.value.PROPOSALID
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.setValue(
          AmountComponent.GetStringValue(AmountComponentCode)
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.MODULECDE.setValue(
          '00001'
        ); // ModuleCode.Proposal;
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ORIGNALINPUTAMT.setValue(Amount
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(Amount);
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.BPID.setValue(
          Introducerid
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.YEARLYBASEIND.setValue(
          false
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMTSEQID.setValue(
          amountSeqId
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
          receivebydealer
        );
        if (classificationCode != null)
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );

        if (
          AmountComponentCode == AmountComponent.ContractFinancedCharges &&
          cmptFinancedType == AssetComponentsFinancialConfiguration.Finance
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Finance
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Add
          );
        } else if (
          AmountComponentCode == AmountComponent.AssetCost ||
          AmountComponentCode == AmountComponent.AccessoriesCost ||
          AmountComponentCode == AmountComponent.ContractFinancedCharges
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Add
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Finance
          );
        } else if (
          AmountComponentCode == AmountComponent.ETFromSOLOs &&
          this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            AmountClassification.Nettingoff
          );
        } else if (
          AmountComponentCode == AmountComponent.ETFromSOLOs &&
          this._dataService.PROPOSAL.value.FINANCETYP ==
          FinanceType.HirePurchase
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Upfront
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            AmountClassification.Nettingoff
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
        } else if (AmountComponentCode == AmountComponent.BBNCharge) {
          if (
            this._dataService.PROPOSAL.value.FINANCETYP ==
            FinanceType.OperatingLease
          ) {
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
              AssetComponentsFinancialConfiguration.Finance
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
              classificationCode
            );
          } else {
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
              AssetComponentsFinancialConfiguration.None
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
              classificationCode
            );
          }
        } else if (
          AmountComponentCode == AmountComponent.DealerInsuranceCommission
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.BPID.setValue(
            Introducerid
          );
        } else if (AmountComponentCode == AmountComponent.OnRoadCost) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Add
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Finance
          );
        } else if (AmountComponentCode == AmountComponent.Discount) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Subtract
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Finance
          );
        } else if (
          AmountComponentCode == AmountComponent.FinancedInsurancePremium
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Add
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Finance
          );
        } else if (
          AmountComponentCode == AmountComponent.FiduciaFee &&
          classificationCode == null
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );

          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
            receivebydealer
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
        } else if (
          AmountComponentCode == AmountComponent.FiduciaFee &&
          classificationCode == AmountClassification.Nettingoff
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
            receivebydealer
          );
        } else if (
          AmountComponentCode == AmountComponent.PolicyFee &&
          classificationCode == null
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
        } else if (
          AmountComponentCode == AmountComponent.PolicyFee &&
          classificationCode == AmountClassification.Nettingoff
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
        } else if (
          AmountComponentCode == AmountComponent.UpfrontProvisionFee &&
          classificationCode == AmountClassification.Receivable
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
        } else if (
          AmountComponentCode == AmountComponent.UpfrontProvisionFee &&
          classificationCode == AmountClassification.Nettingoff
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
        } else if (
          AmountComponentCode == AmountComponent.FinancedProvisionFee
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
        } else if (AmountComponentCode == AmountComponent.FirstRental) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
            receivebydealer
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
        } else if (
          AmountComponentCode == AmountComponent.UpfrontAdminFee &&
          classificationCode == AmountClassification.Receivable
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
        } else if (
          AmountComponentCode == AmountComponent.UpfrontAdminFee &&
          classificationCode == AmountClassification.Nettingoff
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
        } else if (AmountComponentCode == AmountComponent.FinancedAdminFee) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
        } else if (
          AmountComponentCode == AmountComponent.UpfrontInsurancePremium &&
          classificationCode == AmountClassification.Nettingoff
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            false
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
            false
          );
        } else if (
          AmountComponentCode == AmountComponent.UpfrontInsurancePremium &&
          classificationCode != AmountClassification.Nettingoff
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
            receivebydealer
          );
        } else if (
          AmountComponentCode == AmountComponent.InsuranceSubsidy &&
          classificationCode == AmountClassification.Nettingoff
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            false
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
            false
          );
        } else if (
          AmountComponentCode == AmountComponent.InsuranceSubsidy &&
          classificationCode != AmountClassification.Nettingoff
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
        } else if (AmountComponentCode == AmountComponent.AROInsurancePremium) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.BPID.setValue(
            Introducerid
          );
        } else if (AmountComponentCode == AmountComponent.InsurancePremium) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
        } else if (
          AmountComponentCode == AmountComponent.ApplicationUpfrontCharges
        ) {
          if (AssetComponentsFinancialConfiguration.Finance == cmptFinancedType)
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          else
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Upfront
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
        } else if (
          AmountComponentCode == AmountComponent.DownpaymentDeposit &&
          classificationCode != AmountClassification.Nettingoff
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Subtract
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Upfront
          );
          receivebydealer =
            this._dataService.PROPOSALFINANCIALAGREEMENT.value
              .DOWNPAYMENTPAIDTOINTIND;
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
            receivebydealer
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
            true
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
        } else if (
          AmountComponentCode == AmountComponent.DownpaymentDeposit &&
          classificationCode == AmountClassification.Nettingoff
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode
          );
        } else if (AmountComponentCode == AmountComponent.TradeinAmount) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Subtract
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Upfront
          );
        } else if (AmountComponentCode == AmountComponent.ITConTAX) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Subtract
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.Finance
          );
        }
        // else if (AmountComponentCode == AmountComponent.ContractFinancedCharges && cmptFinancedType == AssetComponentsFinancialConfiguration.Finance) {
        //   agreementdetail.PRPLARTEAMNTTRAN.CMPTFINETYPECDE = AssetComponentsFinancialConfiguration.Finance;
        //   agreementdetail.PRPLARTEAMNTTRAN.OPERATORCDE = FinancialComponentsOperations.Add;
        // }
        else if (
          AmountComponentCode == AmountComponent.Insurance ||
          AmountComponentCode == AmountComponent.VoluntaryInsurance ||
          AmountComponentCode == AmountComponent.CompulsoryInsurance ||
          AmountComponentCode == AmountComponent.Comprehensive ||
          AmountComponentCode == AmountComponent.TLO ||
          AmountComponentCode ==
          AmountComponent.AdditionalCoverage /*&& (cmptFinancedType == AssetComponentsFinancialConfiguration.Finance) */
        ) {
          if (
            cmptFinancedType == AssetComponentsFinancialConfiguration.Finance
          ) {
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
              AssetComponentsFinancialConfiguration.Finance
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.Add
            );
          } else if (
            cmptFinancedType ==
            AssetComponentsFinancialConfiguration.ContractInclusive
          ) {
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
              AssetComponentsFinancialConfiguration.ContractInclusive
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          } else if (
            cmptFinancedType == AssetComponentsFinancialConfiguration.Upfront
          ) {
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
              AssetComponentsFinancialConfiguration.Upfront
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          } else if (
            cmptFinancedType == AssetComponentsFinancialConfiguration.None
          ) {
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
              AssetComponentsFinancialConfiguration.None
            );
            agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
              FinancialComponentsOperations.None
            );
          }
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode != null ? classificationCode : null
          );
        } else if (AmountComponentCode == AmountComponent.DownPaymentRF) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.Subtract
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.None
          );
        } else {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            cmptFinancedType
          );
        }
        if (
          AmountComponentCode == AmountComponent.VoluntaryInsurance ||
          AmountComponentCode == AmountComponent.CompulsoryInsurance ||
          AmountComponentCode == AmountComponent.Insurance ||
          AmountComponentCode == AmountComponent.Comprehensive ||
          AmountComponentCode == AmountComponent.TLO
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(
            /*ProposalTermInYears **/ Amount
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.YEARLYBASEIND.setValue(
            true
          );
        } else
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ORIGNALINPUTAMT.setValue(
            Amount
          );

        if (AmountComponentCode == AmountComponent.InsuranceCommission) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
            FinancialComponentsOperations.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.None
          );
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
            classificationCode != null ? classificationCode : null
          );
        }

        if (AmountComponentCode == AmountComponent.AdditionalCoverage)
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ORIGNALINPUTAMT.setValue(
            Amount
          );

        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.INPUTCURRENCYCDE.setValue(
          inputCurrencyCode
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OUTPUTCURRENCYCDE.setValue(
          '00001'
        ); //ProposalCurrencyCode);
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OUTPUTAMT.setValue(
          Amount
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.RATECHRTRVSNID.setValue(
          null
        );

        if (
          AmountComponentCode == AmountComponent.VoluntaryInsurance ||
          AmountComponentCode == AmountComponent.CompulsoryInsurance ||
          AmountComponentCode == AmountComponent.Insurance
        ) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ORIGNALOUTPUTAMT.setValue(
            Amount
          ); //(decimal)result2.ResultSet.TargetCurrencyAmount);
        } else
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ORIGNALOUTPUTAMT.setValue(
            Amount
          ); // (decimal)result.ResultSet.TargetCurrencyAmount);
      } else {
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OUTPUTAMT.setValue(
          agreementdetail.value.PRPLARTEAMNTTRAN.INPUTAMT
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.RATECHRTRVSNID.setValue(
          null
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ORIGNALOUTPUTAMT.setValue(
          agreementdetail.value.PRPLARTEAMNTTRAN.ORIGNALINPUTAMT
        );
      }

      agreementdetail.controls.TAXINCULSIVEAMT.setValue(Amount);
      agreementdetail.controls.TAXEXCULSIVEAMT.setValue(Amount);

      if (!alreadyexists && Amount > 0) {
        if (agreementdetail.value.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == null) {
          agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
            AssetComponentsFinancialConfiguration.None
          );
        }
        this._dataService.PRPLARTICLECOMPONENTENTITYCOL.push(agreementdetail);
      }
    }

    this.CalculateNetFinanceAmt();
    this.UpdateCalculatedFields();
    this.CalculateFirstPayment();
  }

  public UpdateFinancialAgreementDetailforMCOM(
    Amount: number,
    AmountComponentCode: AmountComponent,
    inputCurrencyCode: string,
    cmptFinancedType: string | null = null,
    Introducerid: number | null = 0,
    amountSeqId: number = 1,
    classificationCode: AmountClassification | null = null,
    receivebydealer: boolean = false
  ) {
    let alreadyexists: boolean = false;
    let agreementdetail = {} as FormGroup<IProposalArticleComponentEntity>;
    let collec: FormArray<IProposalArticleComponentEntity> =
      this._formBuilder.array<IProposalArticleComponentEntity>([]);

    if (classificationCode != null)
      agreementdetail = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(item => item.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponentCode) &&
        item.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == classificationCode && item.controls.RowState.value != DataRowState.Removed)[0]

    else
      agreementdetail = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(item => item.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponentCode) && item.controls.RowState.value != DataRowState.Removed)[0]

    if (agreementdetail != null && agreementdetail != undefined) {
      //agreementdetail = collec.controls[0];
      alreadyexists = true;
      this._FormState.MarkAllDirty(agreementdetail);
    } else {
      agreementdetail = this._ProposalForm.ProposalArticleComponentForm();
    }

    if (
      agreementdetail.value.PRPLARTEAMNTTRAN.INPUTAMT != Amount || agreementdetail.value.PRPLARTEAMNTTRAN.INPUTCURRENCYCDE != inputCurrencyCode || agreementdetail.value.PRPLARTEAMNTTRAN.OUTPUTCURRENCYCDE != '00001' || agreementdetail.value.PRPLARTEAMNTTRAN.BPID != Introducerid) {
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ASSETID.setValue(
        this._dataService.PROPOSALASSET.value.ASSETID
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PROPOSALID.setValue(
        this._dataService.PROPOSAL.value.PROPOSALID
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.setValue(
        AmountComponent.GetStringValue(AmountComponentCode)
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.MODULECDE.setValue(
        '00001'
      ); // ModuleCode.Proposal;
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.ORIGNALINPUTAMT.setValue(Amount
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(Amount);
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.BPID.setValue(
        Introducerid
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.YEARLYBASEIND.setValue(
        false
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMTSEQID.setValue(
        amountSeqId
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(
        receivebydealer
      );
      agreementdetail.controls.PRPLARTEAMNTTRAN.controls.RATECHRTRVSNID.setValue(
        null
      );
      if (classificationCode != null)
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
          classificationCode
        );

      if (
        AmountComponentCode == AmountComponent.ETFromSOLOs &&
        this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.Refinance
      ) {
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
          FinancialComponentsOperations.None
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
          AssetComponentsFinancialConfiguration.None
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
          AmountClassification.Nettingoff
        );
      } else if (
        AmountComponentCode == AmountComponent.ETFromSOLOs &&
        this._dataService.PROPOSAL.value.FINANCETYP ==
        FinanceType.HirePurchase
      ) {
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.OPERATORCDE.setValue(
          FinancialComponentsOperations.None
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.setValue(
          AssetComponentsFinancialConfiguration.Upfront
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.setValue(
          AmountClassification.Nettingoff
        );
        agreementdetail.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(
          true
        );
      }

      agreementdetail.controls.TAXINCULSIVEAMT.setValue(Amount);
      agreementdetail.controls.TAXEXCULSIVEAMT.setValue(Amount);
     
      this._dataService.PRPLARTICLECOMPONENTENTITYCOL.push(agreementdetail);
    }
  }


  public CalculateNetFinanceAmt(): boolean {
    let _addamount = 0;
    let _subamount = 0;
    if (
      this._dataService.PROPOSALARTICLE != null &&
      this._dataService.PROPOSALARTICLE.length > 0
    ) {
      _addamount = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
        .filter(
          (p) =>
            p.controls.PRPLARTEAMNTTRAN.value.OPERATORCDE ==
            FinancialComponentsOperations.Add &&
            p.controls.RowState.value != DataRowState.Removed
        )
        .reduce(function (tot, record) {
          // let amt = this.GetTAXINCULSIVEAMT(record);
          return Number(tot) + Number(record.value.TAXINCULSIVEAMT);
        }, 0); //.Sum(p => p.TAXINCULSIVEAMT);

      _subamount = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls
        .filter(
          (p) =>
            p.controls.PRPLARTEAMNTTRAN.value.OPERATORCDE ==
            FinancialComponentsOperations.Subtract && p.controls.RowState.value != DataRowState.Removed
        )
        .reduce(function (tot, record) {
          return tot + record.value.TAXEXCULSIVEAMT;
        }, 0); //Sum(p => p.TAXEXCULSIVEAMT);

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.setValue(_addamount - _subamount - this._proposalManagerService.AssetCostVatLessITC - this._proposalManagerService.AccessoryCostVatLessITC);
      
    
      //this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INTERESTOVERRIDEIND.setValue(false);// this property resets to false on ADJUSTEDFINANCEDAMT change according to old CAP

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FINANNCEDPCT.setValue(
        this.FinanceAmtPct(
          this._dataService.PROPOSALFINANCIALAGREEMENT.value
            .ADJUSTEDFINANCEDAMT,
          this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT
        )
      );
      if (
        this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMMTHDCDE ==
        CommissionCalculationMethod.NFAPercentage
      ) {
        if (
          this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMCALCPCT > 0
        ) {
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(
            Math.round(
              (this._dataService.PROPOSALFINANCIALAGREEMENT.value
                .ADJUSTEDFINANCEDAMT *
                this._dataService.PROPOSALFINANCIALAGREEMENT.value
                  .COMMCALCPCT) /
              100
            )
          );
        }
      }
    }
    this.UpdateSecurityDepositAmt();
    return true;
  }

  public GetTAXINCULSIVEAMT(
    ArticleComponentEntity: IProposalArticleComponentEntity | any
  ): any {
    let m_taxexculsiveamt = 0;
    let m_taxinculsiveamt = 0;
    let m_netpayableamt = 0;
    let m_withvatlessitcamt = 0;
    let m_taxwithoutvatamt = 0;

    if (ArticleComponentEntity != undefined && ArticleComponentEntity != null) {
      if (
        ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].TAXAPBLTYPECDE ==
        TaxInclExcl.GetStringValue(TaxInclExcl.Exclusive)
      ) {
        m_taxexculsiveamt = ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT;
        m_taxinculsiveamt =
          ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT +
          ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].TAXAMT;
        //m_netpayableamt = m_taxinculsiveamt - ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(k => k.TAXTYPECDE == TaxType.WHT.GetStringValue()).Select(s => s.TAXAMT).FirstOrDefault();
        let total = ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
          (k: any) => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
        ).reduce(function (tot: any, record: any) {
          return tot + record.TAXAMT;
        }, 0);
        m_netpayableamt = m_taxinculsiveamt - total;

        m_withvatlessitcamt =
          ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT +
          ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].TAXAMT -
          ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].ITCAMT;

        if (
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.FiduciaFee)
        )
          m_taxwithoutvatamt =
            Number(m_taxinculsiveamt) -
            Number(ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
              (s: any) =>
                s.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
            )[0]?.TAXAMT);
        else m_taxwithoutvatamt = Number(m_taxinculsiveamt);
      } else {
        m_taxinculsiveamt = ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT;
        m_taxexculsiveamt =
          ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT -
          ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].TAXAMT;
        m_netpayableamt =
          m_taxinculsiveamt -
          ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
            (k: any) => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
          )[0]?.TAXAMT;
        m_withvatlessitcamt =
          ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT -
          ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0]?.ITCAMT;
        if (
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
          ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
          AmountComponent.GetStringValue(AmountComponent.FiduciaFee)
        )
          m_taxwithoutvatamt =
            Number(m_taxinculsiveamt) -
            Number(ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
              (s: any) =>
                s.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
            )[0].TAXAMT);
        else m_taxwithoutvatamt = Number(m_taxinculsiveamt);
      }
    } else if (ArticleComponentEntity.PRPLARTEAMNTTRANTAX.Count > 1) {
      //OTO Specific code.
      if (
        ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].TAXAPBLTYPECDE ==
        TaxInclExcl.GetStringValue(TaxInclExcl.Exclusive)
      ) {
        if (ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].ISWHTDEDUCTED) {
          m_taxexculsiveamt =
            ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].BASEAMOUNT;
          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> =
            ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
              (k: any) =>
                k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) &&
                k.TAXTYPE != 'ITC'
            );
          if (tax != null) {
            m_taxinculsiveamt = tax[0]?.BASEAMOUNT + tax[0]?.TAXAMT;
            m_netpayableamt =
              m_taxinculsiveamt -
              ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
                (k: any) => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
              ).Select((s: any) => s.TAXAMT)[0];
            m_withvatlessitcamt =
              tax[0]?.BASEAMOUNT + tax[0]?.TAXAMT - tax[0].ITCAMT;
            if (
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.FiduciaFee)
            )
              m_taxwithoutvatamt =
                Number(m_taxinculsiveamt) -
                Number(ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
                  (s: any) =>
                    s.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
                )[0].TAXAMT);
            else m_taxwithoutvatamt = Number(m_taxinculsiveamt);
          }
        } else {
          m_taxexculsiveamt = ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT;
          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> =
            ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
              (k: any) =>
                k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) &&
                k.TAXTYPE != 'ITC'
            );
          if (tax != null) {
            m_taxinculsiveamt = tax[0]?.BASEAMOUNT + tax[0].TAXAMT; //PRPLARTEAMNTTRAN.INPUTAMT + tax.Sum(p => p.TAXAMT);
            m_netpayableamt =
              m_taxinculsiveamt -
              ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
                (k: any) => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
              )[0]?.TAXAMT;
            m_withvatlessitcamt =
              tax[0]?.BASEAMOUNT + tax[0].TAXAMT - tax[0].ITCAMT;
            if (
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.FiduciaFee)
            )
              m_taxwithoutvatamt =
                Number(m_taxinculsiveamt) -
                Number(ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
                  (s: any) =>
                    s.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
                )[0].TAXAMT);
            else m_taxwithoutvatamt = Number(m_taxinculsiveamt);
          }
        }
      } else {
        if (ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].ISWHTDEDUCTED) {
          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> =
            ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
              (k: any) =>
                k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) &&
                k.TAXTYPE != 'ITC'
            );
          if (tax != null) {
            m_taxexculsiveamt = tax[0].BASEAMOUNT; // -tax.Sum(p => p.TAXAMT);
            m_taxinculsiveamt =
              ArticleComponentEntity.PRPLARTEAMNTTRANTAX.First().BASEAMOUNT +
              tax[0].TAXAMT;
            m_netpayableamt =
              m_taxinculsiveamt -
              ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
                (k: any) => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
              )[0].TAXAMT;
            m_withvatlessitcamt =
              ArticleComponentEntity.PRPLARTEAMNTTRANTAX[0].BASEAMOUNT +
              tax[0]?.TAXAMT -
              tax[0].ITCAMT;
            if (
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.FiduciaFee)
            )
              m_taxwithoutvatamt =
                Number(m_taxinculsiveamt) -
                Number(ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
                  (s: any) =>
                    s.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
                )[0].TAXAMT);
            else m_taxwithoutvatamt = Number(m_taxinculsiveamt);
          }
        } else {
          m_taxinculsiveamt = ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT;
          m_netpayableamt =
            ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT -
            ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
              (k: any) => k.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)
            )[0].TAXAMT;

          let tax: Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo> =
            ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
              (k: any) =>
                k.TAXTYPECDE != TaxType.GetStringValue(TaxType.WHT) &&
                k.TAXTYPE != 'ITC'
            );
          if (tax != null) {
            m_taxexculsiveamt = tax[0].BASEAMOUNT; //PRPLARTEAMNTTRAN.INPUTAMT - tax.Sum(p => p.TAXAMT);
            m_withvatlessitcamt =
              ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT - tax[0].ITCAMT;
            if (
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.InsuranceCommission) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.AdminFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.PolicyFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.ProvisionFee) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.BBNCharge) ||
              ArticleComponentEntity.PRPLARTEAMNTTRAN.AMTCMPTCDE ==
              AmountComponent.GetStringValue(AmountComponent.FiduciaFee)
            )
              m_taxwithoutvatamt =
                Number(m_taxinculsiveamt) -
                Number(ArticleComponentEntity.PRPLARTEAMNTTRANTAX.filter(
                  (s: any) =>
                    s.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)
                )[0].TAXAMT);
            else m_taxwithoutvatamt = Number(m_taxinculsiveamt);
          }
        }
      }
    } else if (ArticleComponentEntity.PRPLARTEAMNTTRANTAX.Count == 0) {
      m_taxinculsiveamt = Number(ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT);
      m_taxexculsiveamt = ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT;
      m_netpayableamt = ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT;
      m_withvatlessitcamt = ArticleComponentEntity.PRPLARTEAMNTTRAN.INPUTAMT;
      m_taxwithoutvatamt = Number(m_taxinculsiveamt);
    }
    return 0;
  }

  public IsProposalDataValid(isValidationForClub: boolean, rentalFlag: boolean): boolean {
    if (this._dataService.PROPOSAL.value.BPCOMPANYID <= 0) {
      this._msgService.showMesssage("FinCompanyntSel", MessageType.Warning);
      return false;
    }

    if (this._dataService.PROPOSAL.value.BPCOMPANYBRANCHID <= 0) {
      this._msgService.showMesssage("FinCompanybrnchntSel", MessageType.Warning);
      return false;
    }

    //if (proposalEntity.PROPOSAL.BPINTRODUCERID <= 0)
    //{
    //    msg = "Introducer is not selected.";
    //    return false;
    //}

    if (this._dataService.PROPOSAL.value.FPGROUPID <= 0) {
      this._msgService.showMesssage("SelectFinancialCampaignGroup", MessageType.Warning);
      return false;
    }

    if (this._dataService.PROPOSAL.value.FINANCIALPRODUCTID <= 0) {
      this._msgService.showMesssage("SelectFinancialCampaign", MessageType.Warning);
      return false;
    }

    if (isValidationForClub) {
      for (let i = 0; i < this._dataService.PROPOSALARTICLE.value.length; i++) {
        var item = this._dataService.PROPOSALARTICLE.value[i];
        if (!this.IsProposalValidToCalculate(item.ASSETENTITY, rentalFlag)) {
          return false;
        }
      }
    }
    else {
      if (!this.IsProposalValidToCalculate(this._dataService.ASSETENTITY.value, rentalFlag)) {
        return false;
      }
    }

    return true;
  }

  public IsProposalValidToCalculate(AssetEntity: ExtractGroupValue<IAssetEntity>, rentalFlag: boolean): boolean {
    let NFA = 0;
    let InterestRate = AssetEntity.PROPOSALFINANCIALAGREEMENT.APPLIEDCUSTOMERRTE;
    NFA = AssetEntity.PROPOSALFINANCIALAGREEMENT.ADJUSTEDFINANCEDAMT;
    let terms = AssetEntity.PROPOSALFINANCIALAGREEMENT.CONTRACTTRM;

    if (AssetEntity.PROPOSALFINANCIALAGREEMENT.CONTRACTSTARTDTE == null) {
      this._msgService.showMesssage("StrtDteNtSel", MessageType.Warning);
      return false;
    }
    if (AssetEntity.PROPOSALFINANCIALAGREEMENT.FREQUENCYCDE == null || AssetEntity.PROPOSALFINANCIALAGREEMENT.FREQUENCYCDE == "-1" || !AssetEntity.PROPOSALFINANCIALAGREEMENT.FREQUENCYCDE)// RentalFrequency.None.GetStringValue())
    {
      this._msgService.showMesssage("frqncyNtSel", MessageType.Warning);
      return false;
    }
    if (AssetEntity.PROPOSALFINANCIALAGREEMENT.RENTALMODETYP == null || AssetEntity.PROPOSALFINANCIALAGREEMENT.RENTALMODETYP == "") {
      this._msgService.showMesssage("RntlModNtSel", MessageType.Warning);
      return false;
    }

    //if (this.DataContext.PROPOSAL.FINANCETYP != FinanceType.PACMAS.GetStringValue()
    if (!this._dataService.PROPOSAL.value.ISPACKAGE
      && !this.ProposalTermsValid(terms)) {
      this._msgService.showMesssage("TermsNtCorct", MessageType.Warning);
      return false;
    }

    // if (this.TotalContractTerms <= 0)
    // {
    //     msg = "TermsNtCorct";
    //     return false;
    // }

    if (terms <= 0) {
      this._msgService.showMesssage("TermsNtSel", MessageType.Warning);
      return false;
    }

    if (!AssetEntity.PROPOSALASSET.ASSETTYPECDE &&
      !AssetEntity.PROPOSALASSET.ASSETSUBTYPCDE) {
      this._msgService.showMesssage("AsetNtSel", MessageType.Warning);
      return false;
    }

    if (AssetEntity.PROPOSALFINANCIALAGREEMENT.TOTALCOST <= 0) {
      this._msgService.showMesssage("totCostGretZero", MessageType.Warning);
      return false;
    }


    if (AssetEntity.PROPOSALFINANCIALAGREEMENT.ADJUSTEDFINANCEDAMT <= 0) {
      this._msgService.showMesssage("FinlAmtGretZero", MessageType.Warning);
      return false;
    }


    if (rentalFlag) {
      if (!(AssetEntity.PROPOSALRENTALDETAIL != null && AssetEntity.PROPOSALRENTALDETAIL.length > 0)) ///pending - Review (removed this check - as on rental calculation we dnt need this check)
      {
        this._msgService.showMesssage("RentalsAreNotCalculated", MessageType.Warning);
        return false;
      }
    }
    return true;
  }

  private ProposalTermsValid(terms: number) {
    //this._calculationService.GetRentalFrequency(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.value.FREQUENCYCDE);
    if (this.rentalFrequency == null) {
      return false;
    }

    // if (terms < this._proposaldataService.FINANCIALPRODUCT.MINTERMS || terms > FinancialProductDetail.FINANCIALPRODUCT.MAXTERMS)
    //     return false;
    if (this._dataService.PROPOSALFINANCIALAGREEMENT?.controls.FREQUENCYCDE != null) {
      let calculatedTerms = this.rentalFrequency.BaseTerms;// CalculationManager.NumberOfTermsInRentalFrequency(paymentFrequency, UserObject);

      if (calculatedTerms > 0 && terms % calculatedTerms > 0) {
        return false;
      }
      // if (Terms % this._calculationService.rentalFrequency.BaseTerms > 0) //pending , need to write get set of Term
      // {
      //     return false;
      // }
      return true;
    }
    else
      return false;
  }

  public FinanceAmtPct(FinancedAmt: number, TotalCost: number): number {
    if (TotalCost > 0) {
      var pct = Math.round(((FinancedAmt / TotalCost * 100) + Number.EPSILON) * 100) / 100
      return pct
    } else {
      return 0;
    }
  }

  public UpdateSecurityDepositAmt() {
    let index = this._dataService.PROPOSALARTICLE.controls.length - 1;
    if (this._dataService.PROPOSALARTICLE.controls[index] != null) {
      var agreement = this._dataService.PROPOSALARTICLE.controls[index];
      if (
        agreement.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.SECURITYDEPIND
      ) {
        if (
          agreement.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.SDCALCCDE ==
          SecurityDepositCalculationMethod.PercentageOfAssetCost
        )
          agreement.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.SECURITYDEPOSITAMT.setValue(
            (agreement.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT
              .SECURITYDEPOSITPCT /
              100) *
            agreement.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.TOTALCOST
          );
        // TotalAssetCost;
        else if (
          agreement.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.SDCALCCDE ==
          SecurityDepositCalculationMethod.PercentageOfFinancedAmount
        )
          agreement.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.SECURITYDEPOSITAMT.setValue(
            (agreement.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT
              .SECURITYDEPOSITPCT /
              100) *
            agreement.value.ASSETENTITY.PROPOSALFINANCIALAGREEMENT
              .ADJUSTEDFINANCEDAMT
          ); //agreement.FINANCEDAMT;// TotalNetFinancedAmt;
      }
      this._proposalManagerService.TotalSecurityDepositAmt = 0;
    }
  }

  public UpdateCalculatedFields() {
    let assetEntity = this._dataService.PROPOSALARTICLEFORMGROUP;
    let repaymentPlan = null;
    if (this._proposalManagerService.RepaymentPlan != null &&
      this._proposalManagerService.RepaymentPlan.length === 0) {
      return;
    }
    else {
      repaymentPlan = this._proposalManagerService.RepaymentPlan;
    }

    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALPAYABLEAMT.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.BALANCEPAYABLE.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALINTERESTAMT.setValue(0);

    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALRENTALAMT.setValue((+(Math.round(((repaymentPlan.reduce((sum, current) => sum + current.PRPLRPMTPLAN.RENTALAMT, 0))) * 100) / 100).toFixed(2)))

    if (this._dataService.PROPOSAL.value.FINANCETYP != null &&
      this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.OperatingLease
    ) {

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALINTERESTAMT.setValue((+(Math.round(((repaymentPlan.reduce((sum, current) => sum + current.PRPLRPMTPLAN.PRINCIPALAMT, 0))) * 100) / 100).toFixed(2)));

      let grossRental = repaymentPlan.reduce((sum, current) => sum + current.PRPLRPMTPLAN.GROSSRENTAL, 0);
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALPAYABLEAMT.setValue(grossRental);
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.BALANCEPAYABLE.setValue(grossRental);

      if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE) {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.BALANCEPAYABLE.setValue(
          +(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.BALANCEPAYABLE.value - repaymentPlan[0].PRPLRPMTPLAN.GROSSRENTAL).toFixed(2)
        );
      }

    } else {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALINTERESTAMT.setValue((+(Math.round(((repaymentPlan.reduce((sum, current) => sum + current.PRPLRPMTPLAN.INTERESTAMT, 0))) * 100) / 100).toFixed(2)));

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.BALANCEPAYABLE.setValue(
        +(this._dataService.PROPOSALFINANCIALAGREEMENT.value.FINANCEDAMT +
          this._dataService.PROPOSALFINANCIALAGREEMENT.value.TOTALINTERESTAMT).toFixed(2)
      );

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALPAYABLEAMT.setValue(
        +(this._dataService.PROPOSALFINANCIALAGREEMENT.value.FINANCEDAMT +
          this._dataService.PROPOSALFINANCIALAGREEMENT.value.TOTALINTERESTAMT +
          this._dataService.PROPOSALFINANCIALAGREEMENT.value.ETAMNTOTO).toFixed(2)
      );

      if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALMODETYP == RentalMode.ADVANCE)
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.BALANCEPAYABLE.setValue(
          +(this._dataService.PROPOSALFINANCIALAGREEMENT.value.BALANCEPAYABLE - repaymentPlan[0].PRPLRPMTPLAN.RENTALAMT).toFixed(2)
        );
    }

    if (assetEntity.value.ASSETENTITY.PROPOSALCHARGE != null && assetEntity.value.ASSETENTITY.PROPOSALCHARGE.length > 0) {
      let chargeAmount = assetEntity.value.ASSETENTITY.PROPOSALCHARGE.reduce((sum, current) => sum + current.TAXINCULSIVEAMT, 0);
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALPAYABLEAMT.setValue(
        +(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALPAYABLEAMT.value + chargeAmount).toFixed(2)
      )
    }
  }

  public CalculateFirstPayment() {
    this._proposalManagerService.FirstPayamentSetValues();
    if (this._dataService.PROPOSAL != null && this._dataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.Refinance) {
      if (this._dataService.PROPOSALFINANCIALAGREEMENT != null && this._dataService.PROPOSALARTICLE != null &&
        this._dataService.PROPOSALARTICLE.length > 0) {
        let _dealeramount: number = 0;
        let _fcamount: number = 0;

        _dealeramount = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value
          .filter((p) => p.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront
            && p.PRPLARTEAMNTTRAN.PAYTODEALERIND == true && p.PRPLARTEAMNTTRAN.FIRSTPAYMENTIND == true
            && p.PRPLARTEAMNTTRAN.AMTCMPTCDE != AmountComponent.GetStringValue(AmountComponent.ApplicationUpfrontCharges)
            && p.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed)
          .reduce(function (tot, record) { return tot + record.TAXINCULSIVEAMT; }, 0); //.Sum(p => p.TAXINCULSIVEAMT);

        _fcamount = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.value.filter((p) => p.PRPLARTEAMNTTRAN.CMPTFINETYPECDE == AssetComponentsFinancialConfiguration.Upfront
          && p.PRPLARTEAMNTTRAN.PAYTODEALERIND == false && p.PRPLARTEAMNTTRAN.FIRSTPAYMENTIND == true
          && p.PRPLARTEAMNTTRAN.AMTCMPTCDE != AmountComponent.GetStringValue(AmountComponent.ApplicationUpfrontCharges)
          && p.PRPLARTEAMNTTRAN.RowState != DataRowState.Removed)
          .reduce(function (tot, record) { return tot + record.TAXINCULSIVEAMT; }, 0); //..Sum(p => p.TAXINCULSIVEAMT);

        let sum = parseFloat(_dealeramount.toFixed(2)) + parseFloat(this._proposalManagerService.DealerReceiveableCharge.toFixed(2));
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALFIRSTPAYMENTDEALER.setValue(parseFloat(sum.toFixed(2)));
        let sum1 = parseFloat(_fcamount.toFixed(2)) + parseFloat(this._proposalManagerService.FCReceiveableCharge.toFixed(2));
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALFIRSTPAYMENTFC.setValue(sum1);
        let sum2 = this._dataService.PROPOSALFINANCIALAGREEMENT.value.TOTALFIRSTPAYMENTFC + this._dataService.PROPOSALFINANCIALAGREEMENT.value.TOTALFIRSTPAYMENTDEALER;
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALFIRSTPAYMENT.setValue(parseFloat(sum2.toFixed(2)));
        this._dataService.PROPOSALFINANCIALAGREEMENT.markAsDirty();

      }
    }
  }
  public FillArticleTranTax(
    AmountComponentCode: AmountComponent,
    VATAmount: number,
    WHTAmount: number
  ) {
    let coll = [] as Array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>;
    let taxVAT = {} as IPRPL_ARTE_AMNT_TRAN_TAXInfo;
    taxVAT.AMNTCMPTCDE = AmountComponent.GetStringValue(AmountComponentCode);
    taxVAT.TAXAMT = VATAmount;
    taxVAT.TAXTYPE = TaxType.GetDescriptionStringValue(TaxType.VAT_GST);
    taxVAT.TAXTYPECDE = TaxType.GetStringValue(TaxType.WHT);
    coll.push(taxVAT);
    let taxWHT = {} as IPRPL_ARTE_AMNT_TRAN_TAXInfo;
    taxWHT.AMNTCMPTCDE = AmountComponent.GetStringValue(AmountComponentCode);
    taxWHT.TAXAMT = WHTAmount;
    taxWHT.TAXTYPE = TaxType.GetDescriptionStringValue(TaxType.WHT);
    taxWHT.TAXTYPECDE = TaxType.GetStringValue(TaxType.WHT);
    coll.push(taxWHT);
    this._dataService.PROPOSALARTICLE.controls[
      this._dataService.PROPOSALARTICLE.length - 1
    ].controls.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(
      (x) => {
        if (
          x.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value ==
          AmountComponent.GetStringValue(AmountComponentCode)
        ) {
          if (x.value.RowState != DataRowState.Added)
            this._FormState.ResetFormState(x, DataRowState.Removed);
          if (x.controls.PRPLARTEAMNTTRANTAX.controls.length > 0) {
            for (let i = 0; i < coll.length; i++) {
              this._proposalentitymapper.PRPLARTEAMNTTRANTAXMapper(
                x.controls.PRPLARTEAMNTTRANTAX.controls[i],
                coll[i]
              );
            }
          }
        }
      }
    );
  }

  //Calculate Charge Tax
  public CalculateChargeTax(
    calculationInfoParam: ICalculationInfoParam,
    AssetCharge: any,
    index: any
  ) {
    let totalChargesTaxInclusive: number = 0;
    this._proposalService
      .CalculateChargesTax(calculationInfoParam)
      .subscribe((res) => {
        //this._FormState.ResetFormArrayState(AssetCharge.PRPLCHRGTAX, DataRowState.Removed);
        //AssetCharge.PRPLCHRGTAX = [] as Array<IPRPL_CHRG_TAXInfo>;
        ;

        for (let i = AssetCharge?.PRPLCHRGTAX?.length - 1; i >= 0; i--) {
          if (AssetCharge?.PRPLCHRGTAX[i]?.RowState != DataRowState.Added) {
            AssetCharge.PRPLCHRGTAX[i].RowState = DataRowState.Removed;
          }
          else {
            AssetCharge?.PRPLCHRGTAX.splice(i, 1)
          }
        }
        if (res != null && res.ResultSet != null) {

          res.ResultSet.PRPLCHRGTAX.forEach((item: IPRPL_CHRG_TAXInfo) => {
            this.totalTaxAmountArr[index] = 0;
            this.totalTaxAmountArr[index] += item.TAXAMT;
            AssetCharge?.PRPLCHRGTAX?.push(item);
          });

          if (res.ResultSet.TAXINCULSIVEAMT != 0)
            AssetCharge.TAXINCULSIVEAMT = res.ResultSet.TAXINCULSIVEAMT;
          else
            AssetCharge.TAXINCULSIVEAMT = this._dataService.PROPOSALCHARGE.controls[index].controls.TAXINCULSIVEAMT.value;

          if (res.ResultSet.TAXEXCULSIVEAMT != 0)
            AssetCharge.TAXEXCULSIVEAMT = res.ResultSet.TAXEXCULSIVEAMT;
          else
            AssetCharge.TAXEXCULSIVEAMT = this._dataService.PROPOSALCHARGE.controls[index].controls.TAXEXCULSIVEAMT.value;
        }
        let arr = this._formBuilder.array(
          AssetCharge.PRPLCHRGTAX?.map((r: any) => this._formBuilder.group(r))
        );
        this.PRPLCHRGTAXDataset[index] = arr;
        this._proposalentitymapper.ProposalChargeEntityMapper(
          this._dataService.PROPOSALARTICLE.controls[
            this._dataService.PROPOSALARTICLE.controls.length - 1
          ].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls[index],
          AssetCharge
        );
        this._dataService.PROPOSALARTICLE.controls[
          this._dataService.PROPOSALARTICLE.controls.length - 1
        ].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach((x) => {
          if (
            (x.controls.TAXINCULSIVEAMT.value > 0 ||
              x.controls.TAXINCULSIVEAMT.value != undefined) &&
            x.value.RowState !== DataRowState.Removed
          ) {
            totalChargesTaxInclusive += x.controls.TAXINCULSIVEAMT.value;
          }
        });
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.setValue(
          totalChargesTaxInclusive
        );
        this.CreateChargesAgreementDetail();
        return AssetCharge;
      });
  }
  public getProposalCharges(element: any, index: any) {
    let AssetCharge = {} as IProposalChargeEntity;
    AssetCharge.PRPLCHRG = {} as IPRPL_CHRGInfo;
    let calculationInfoParam = {} as ICalculationInfoParam;
    AssetCharge.PRPLCHRG.PROPOSALID =
      this._dataService.PROPOSAL.controls.PROPOSALID.value;
    AssetCharge.PRPLCHRG.ASSETID =
      this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.controls.length - 1
      ].controls.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETID.value;

    AssetCharge.PRPLCHRG.CHARGECDE = element.CHARGECDE;
    AssetCharge.PRPLCHRG.CHARGEDSC = element.CHARGEDSC;
    AssetCharge.PRPLCHRG.CHARGEAMT = Number(element.CHARGEAMT);
    AssetCharge.PRPLCHRG.OTOEDITABLEIND = element.OTOEDITABLEIND;
    AssetCharge.PRPLCHRG.CREATIONTYPECDE = element.CREATIONTYPECDE;
    AssetCharge.PRPLCHRG.AMORTIZEDIND = element.AMORTIZEDIND;
    AssetCharge.PRPLCHRG.ISSERVICEFEE=element.ISSERVICEFEE;
    if (this._dataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
      AssetCharge.PRPLCHRG.FINANCEDIND = 'T'
    }
    AssetCharge.TAXINCULSIVEAMT = Number(element.CHARGEAMT);
    AssetCharge.TAXEXCULSIVEAMT = Number(element.CHARGEAMT);
    AssetCharge.PRPLCHRGTAX = [] as Array<IPRPL_CHRG_TAXInfo>;
    if(!element.ISSERVICEFEE)
    {
    calculationInfoParam.ChargeAmount = Number(element.CHARGEAMT);
    calculationInfoParam.ChargeTypeCode = element.CHARGECDE;
    calculationInfoParam.proposalInfoParam = {} as IProposalInfoParm;
    calculationInfoParam.proposalInfoParam.IntroducerID =
      this._dataService.PROPOSAL.value.BPINTRODUCERID;
    calculationInfoParam.proposalInfoParam.FinanceType =
      this._dataService.PROPOSAL.value.FINANCETYP;
    this.totalTaxAmountArr[index] = 0;
    AssetCharge.TAXINCULSIVEAMT = 0;
    AssetCharge.TAXEXCULSIVEAMT = 0;
    
      this.CalculateChargeTax(calculationInfoParam, AssetCharge, index); 
    }
    return AssetCharge;
  }

  ResetProvisionFeeDetail() {
    this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.setValue(
      0
    );
    this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue(
      0
    );
    this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEPERCENTAGE.setValue(
      0
    );
    this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.setValue(
      0
    );
    this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.setValue(
      0
    );
    this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.RECEIVEDBYDEALERIND.setValue(
      false
    );
    if(this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.RowState.value!=DataRowState.Added)
      this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.RowState.setValue(DataRowState.Updated);

    this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.PROVISIONFEE.setValue(
      0
    );

    this.RemoveArticleComponent(AmountComponent.FinancedProvisionFee);
    this.RemoveArticleComponent(AmountComponent.ProvisionFee);
    this.RemoveArticleComponent(AmountComponent.UpfrontProvisionFee);
    this.RemoveArticleComponent(AmountComponent.ProvisionCommission);
    // ResetCommissionAmounts(CommissionType.ProvisionFeeCommission.GetStringValue());
    // await this.CalculateCommission(CommissionType.ProvisionFeeCommission.GetStringValue(), 0);
  }

  CalculateNFA() {
    this.CalculateNetFinanceAmt();
    this.UpdateCalculatedFields();
  }

  PrepareChargesCollection(res: any) {
    let AssetCharge!: IProposalChargeEntity;
    let assetId!: number;
    let totalChargesTaxInclusive: number = 0;
    if (res != null) {
      assetId =
        this._dataService.PROPOSALARTICLE.controls[
          this._dataService.PROPOSALARTICLE.controls.length - 1
        ].controls.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETID.value;
      if (
        this.AssetEntityCollection == undefined ||
        this.AssetEntityCollection.length == 0
      ) {
        let arrayLn = this._dataService.PROPOSALCHARGE.length;
        res.ResultSet[0].EVNTCHRG.forEach((element: any, i: any) => {
          AssetCharge = this.getProposalCharges(element, i + arrayLn);
          this.AssetEntityCollection.push(AssetCharge);
        });
      }
      if (Array.isArray(this.AssetEntityCollection))
        this.AssetEntityCollection.forEach((item, i) => {
          this._dataService.PROPOSALARTICLE.controls[
            this._dataService.PROPOSALARTICLE.controls.length - 1
          ].controls.ASSETENTITY.controls.PROPOSALCHARGE.push(
            this._proposalentitymapper.ProposalChargeEntityMapper(
              this._ProposalForm.PropsalChargeForm(),
              item
            )
          );
        });
      else if (typeof this.AssetEntityCollection === 'object') {
        this._dataService.PROPOSALARTICLE.controls[
          this._dataService.PROPOSALARTICLE.controls.length - 1
        ].controls.ASSETENTITY.controls.PROPOSALCHARGE.push(
          this._proposalentitymapper.ProposalChargeEntityMapper(
            this._ProposalForm.PropsalChargeForm(),
            this.AssetEntityCollection
          )
        );
      }
      // this._dataService.PROPOSALARTICLE.controls[this._dataService.PROPOSALARTICLE.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach(x => {
      //   if (x.controls.TAXINCULSIVEAMT.value > 0 || x.controls.TAXINCULSIVEAMT.value != undefined) {
      //     totalChargesTaxInclusive += x.controls.TAXINCULSIVEAMT.value;
      //   }
      // })
    } else {
      // TO DO by Jalal
      //this._dataService.PROPOSALARTICLE.controls[this._dataService.PROPOSALARTICLE.controls.length - 1].controls.ASSETENTITY.controls.PROPOSALCHARGE.setValue(this._entityFormService.PropsalChargeForm(this._formBuilder.group<IProposalChargeEntity>({} as IProposalChargeEntity)))
    }
    //this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.setValue(totalChargesTaxInclusive);
    //this.CreateChargesAgreementDetail();
  }

  CreateChargesAgreementDetail() {
    let TotalFinancedCharges: number = 0;
    let FinancedChargesVATAmt: number = 0;
    let NonFinancedChargesVATAmt: number = 0;
    let FinancedChargesWHTAmt: number = 0;
    let NonFinanceChargeAmt: number = 0;
    let NonFinancedChargesWHTAmt: number = 0;
    this.RemoveArticleComponent(AmountComponent.ContractFinancedCharges);
    TotalFinancedCharges = this._proposalManagerService.TotalFinancedCharges;
    this.UpdateFinancialAgreementDetail(
      TotalFinancedCharges,
      AmountComponent.ContractFinancedCharges,
      this._dataService.PROPOSAL.value.CURRENCYCDE,
      AssetComponentsFinancialConfiguration.Finance,
      null
    );
    FinancedChargesVATAmt =
      this._proposalManagerService.getFinancedChargesVATAmt();
    FinancedChargesWHTAmt =
      this._proposalManagerService.getFinancedChargesWHTAmt();
    this.FillArticleTranTax(
      AmountComponent.ContractFinancedCharges,
      FinancedChargesVATAmt,
      FinancedChargesWHTAmt
    );

    this.RemoveArticleComponent(AmountComponent.ApplicationUpfrontCharges);
    NonFinanceChargeAmt = this._proposalManagerService.NonFinanceChargeAmt;
    this.UpdateFinancialAgreementDetail(
      NonFinanceChargeAmt,
      AmountComponent.ApplicationUpfrontCharges,
      this._dataService.PROPOSAL.value.CURRENCYCDE,
      null,
      null
    );
    NonFinancedChargesVATAmt =
      this._proposalManagerService.getNonFinancedChargesVATAmt();
    NonFinancedChargesWHTAmt =
      this._proposalManagerService.getNonFinancedChargesWHTAmt();
    this.FillArticleTranTax(
      AmountComponent.ApplicationUpfrontCharges,
      NonFinancedChargesVATAmt,
      NonFinancedChargesWHTAmt
    );
    this.CalculateNFA();
  }

  public UpdateSubsidyDetail() {
    if (
      this._dataService.PROPOSALSUBSIDYDETAIL != null &&
      !this._dataService.PROPOSALSUBSIDYDETAIL.value.SUBSIDYTYPECDE &&
      this._dataService.PROPOSALFINANCIALAGREEMENT.value.DEALERSUBSIDYAMT > 0
    ) {
      //--To DO
      let financedtype = AssetComponentsFinancialConfiguration.None;
      this.RemoveArticleComponent(this.getAmountComponetBySubsidyType());
      if (this._dataService.PROPOSALSUBSIDYDETAIL.value.NETOFFIND) {
        this.UpdateFinancialAgreementDetail(
          this._dataService.PROPOSALARTICLE.controls[
            this._dataService.PROPOSALARTICLE.controls.length - 1
          ].controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .DEALERSUBSIDYAMT.value,
          this.getAmountComponetBySubsidyType(),
          this._dataService.PROPOSAL.controls.CURRENCYCDE.value,
          financedtype,
          this._dataService.PROPOSAL.controls.BPINTRODUCERID.value,
          1,
          AmountClassification.Nettingoff
        );
        this.UpdateFinancialAgreementDetail(
          this._dataService.PROPOSALARTICLE.controls[
            this._dataService.PROPOSALARTICLE.controls.length - 1
          ].controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .DEALERSUBSIDYAMT.value,
          this.getAmountComponetBySubsidyType(),
          this._dataService.PROPOSAL.controls.CURRENCYCDE.value,
          financedtype,
          this._dataService.PROPOSAL.controls.BPINTRODUCERID.value,
          1,
          AmountClassification.Receivable
        );
      } else
        this.UpdateFinancialAgreementDetail(
          this._dataService.PROPOSALARTICLE.controls[
            this._dataService.PROPOSALARTICLE.controls.length - 1
          ].controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls
            .DEALERSUBSIDYAMT.value,
          this.getAmountComponetBySubsidyType(),
          this._dataService.PROPOSAL.controls.CURRENCYCDE.value,
          financedtype,
          this._dataService.PROPOSAL.controls.BPINTRODUCERID.value,
          1,
          AmountClassification.Receivable
        );
    }
  }

  SetFinancialAgreementOnAssetSelect() {
    this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.TOTALADMINFEE.setValue(
      this._dataService.PROPOSALADMINFEEDETAIL.value.TOTALADMINFEE
    );
    this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD.setValue(
      this._dataService.PROPOSALTEMPLATERENTALINT.value.RNTLCALCLTNMTDCDE
    );
    this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.AMORTIZATIONMTD.setValue(
      AmortizationMethod.Annuity
    );
    // this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FINANCETYP.setValue(
    //   FinanceType.OperatingLease
    // );
    if (
      this._dataService.PROPOSAL.controls.FINANCETYP.value ==
      FinanceType.HirePurchase &&
      !this._dataService.PROPOSAL.controls.MCOMDEALER
    )
      this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(
        true
      );
    else
      this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(
        false
      );
  }

  SetProposalAssetInfoOnAssetSelect(obj: any) {
    if (obj) {
      if (
        this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.PROPOSALID
          .value > 0
      ) {
        obj.PROPOSALID =
          this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.PROPOSALID.value;
        obj.RowState = DataRowState.Updated;
      }
      obj.ASSETID = this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETID.value;
      obj.CONDITION = this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.CONDITION.value;
      obj.ASSETAMT = this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETAMT.value;
      this._dataService.ASSETENTITY.controls.PROPOSALASSET.patchValue(obj);
      this._dataService.PROPOSALARTICLE.controls[
        this._dataService.PROPOSALARTICLE.value.length - 1
      ].controls.PROPOSALARTICLE.controls.ASSETTYPCDE.setValue(
        ArticleType.Asset
      );
      this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETNAME.setValue(obj.MODELDSC);

      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETTYPECDE.setValue(obj.ASSETTYPECDE);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETTYPEDSC.setValue(obj.ASSETTYPDESC);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETSUBTYPCDE.setValue(obj.ASSETSUBTYPCDE);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETSUBTYPDSC.setValue(obj.ASSETSUBTYPDESC);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.MAKECDE.setValue(obj.ASSETMAKECDE);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.BRANDCDE.setValue(obj.ASSETBRANDCDE);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.BRANDDSC.setValue(obj.ASSETBRANDDESC);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.MAKEDSC.setValue(obj.ASSETMAKEDESC);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.MODELCDE.setValue(obj.ASSETMODELCDE);
      //this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.MODELDSC.setValue(obj.ASSETMODELDESC);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETNME.setValue(obj.ASSETMODELDESC);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.COUNTRYORIGIN.setValue(obj.COUNTRYORIGIN);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETMODELID.setValue(obj.ASSETMODELID);
      // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.MODELCDE.setValue(obj.ASSETMODELCDE);
    }
    // this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETSELECTIONCDE.setValue(
    //   AssetSelection.Purchase
    // );
  }

  CalculateBPKBExpectedDate(days: number) {
    var temp = new Date(
      this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value
    );

    if (days > 0) {
      this._dataService.OTOPRPLASSTBPKBDETL.controls.BPKBEXPECTEDDATE.setValue(
        moment(temp).add(days, 'days').toDate()
      );
    }
    else {
      this._dataService.OTOPRPLASSTBPKBDETL.controls.BPKBEXPECTEDDATE.setValue(temp);
    }
  }

  public GetRentalFrequency(frequency: string) {
    if (frequency) {
      let RequestParam = {} as IProposalInfoParm;
      RequestParam.FrequencyCode = frequency;
      this._proposalService
        .GetPaymentFrequency(RequestParam)
        .subscribe((res) => {
          this.rentalFrequency = {} as RentalFrequency;
          this.rentalFrequency.BaseTerms = res?.ResultSet?.BASETERMS;
          this.rentalFrequency.Frequencycde = res?.ResultSet?.FREQUENCYCDE;
          this.rentalFrequency.Frequencydsc = res?.ResultSet?.FREQUENCYDSC;
          this.rentalFrequency.YearlyTerms = res?.ResultSet?.YEARLYTERMS;
          this.rentalFrequency.FrequencyBase =
            res?.ResultSet?.FREQUENCYBASE == '00001'
              ? RentalFrequencyBasis.Days
              : res?.ResultSet?.FREQUENCYBASE == '00002'
                ? RentalFrequencyBasis.Months
                : RentalFrequencyBasis.None;
        });
    } else {
      this.rentalFrequency = {} as RentalFrequency;
    }
  }

  private getAmountComponetBySubsidyType(): AmountComponent {
    if (
      this._proposalManagerService.PROPOSAL_SUBSIDY_DETAIL?.SUBSIDYTYPECDE ==
      SubsidyType.DownPaymentSubsidy
    )
      return AmountComponent.DownpaymentSubsidy;
    else if (
      this._proposalManagerService.PROPOSAL_SUBSIDY_DETAIL?.SUBSIDYTYPECDE ==
      SubsidyType.InstallmentSubsidy
    )
      return AmountComponent.InstallmentSubsidy;
    else if (
      this._proposalManagerService.PROPOSAL_SUBSIDY_DETAIL?.SUBSIDYTYPECDE ==
      SubsidyType.InterestSubsidyFixAmount
    )
      return AmountComponent.InterestSubsidyFixedAmount;
    else if (
      this._proposalManagerService.PROPOSAL_SUBSIDY_DETAIL?.SUBSIDYTYPECDE ==
      SubsidyType.InterestSubsidyRateBased
    )
      return AmountComponent.InterestSubsidyRateBased;
    else return AmountComponent.None;
  }

  public ResetRentalDetail() {
    // if (this._proposalManagerService.isCalcButtonEnabled) {
    //   return;
    // }

    this._proposalManagerService.isCalcButtonEnabled = true;
    // if (this.CurrentAssetRentalDetail != null)
    //             this.CurrentAssetRentalDetail.RemoveAll();
    if (this._dataService.ASSETENTITY.controls.PROPOSALRENTALDETAIL.value.filter((p: any) => p.RowState != DataRowState.Removed).length > 0) {
      this._FormState.ResetFormArrayState(this._dataService.ASSETENTITY.controls.PROPOSALRENTALDETAIL, DataRowState.Removed);
    }
    this._FormState.ResetFormArrayState(this._dataService.PROPOSALREPAYMENTPLANENTITYCOL, DataRowState.Removed);
    this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.setValue(this._proposalManagerService.TotalChargesTaxInclusive);
    if (this._dataService.ASSETENTITY.controls.PROPOSALSUBSIDYDETAIL != null && this._dataService.ASSETENTITY.controls.PROPOSALSUBSIDYDETAIL.controls.SUBSIDYTYPECDE.value != SubsidyType.InterestSubsidyFixAmount)
      this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.DEALERSUBSIDYAMT.setValue(0);
    this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.MANUFACTURERSUBSIDYAMT.setValue(0);

  }

  public FillAssetRepaymentPlan(result: any) {
    //ProposalArticleEntity assetEntity = DataContext.PROPOSALARTICLE[Helper.AssetIndex];
    let assetEntity = this._dataService.ASSETENTITY;

    if (assetEntity.controls.PROPOSALFINANCIALAGREEMENT != null) {
      //region Clean Rental & RepaymentPlan Entities

      if (assetEntity.controls.PROPOSALRENTALDETAIL.controls.length == 0)
        //(assetEntity.controls.PROPOSALRENTALDETAIL.controls == null && assetEntity.controls.PROPOSALRENTALDETAIL.length==0)
        assetEntity.controls.PROPOSALRENTALDETAIL =
          this._formBuilder.array<IPRPL_RNTL_DETLInfo>([
            this._ProposalForm.PROPOSALRENTALDETAILForm(),
          ]);
      // if (assetEntity.controls.PROPOSALREPAYMENTPLANENTITYCOL != null &&
      //   assetEntity.controls.PROPOSALREPAYMENTPLANENTITYCOL.length > 0
      // )
      // this.CleanProposalRepaymentPlan(
      //   assetEntity.controls.PROPOSALREPAYMENTPLANENTITYCOL
      // );

      //endregion

      //region RentalDetail
      //For OL Case, if the Repayment Plan Contains RV Rental then remove it.
      if (this._dataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
        if (result.RentalDetail != null && result.RentalDetail.length > 0) {
          if (
            result.RentalDetail.filter(
              (p: any) => p.RentalType == RentalType.ResidualValue
            ).length > 0
          ) {
            let RVRental = result.RentalDetail.filter(
              (p: any) => p.RentalType == RentalType.ResidualValue
            )[0];
            if (RVRental != null) {
              //this._FormState.ResetFormArrayState(RVRental,DataRowState.Removed);
              //result.RentalDetail.Remove(RVRental);
            }
          }
        }
      }

      let REPAYMENTPLANID = 1;
      result.RentalDetail.forEach((rentalRow: any) => {
        let repaymentPlan = {} as IProposalRepaymentPlanEntity;
        repaymentPlan.PRPLRPMTPLAN = {} as IPRPL_RPMT_PLANInfo;
        repaymentPlan.PRPLRPMTPLAN.ASSETID =
          this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETID.value;
        repaymentPlan.PRPLRPMTPLAN.PROPOSALID =
          this._dataService.PROPOSAL.controls.PROPOSALID.value;
        repaymentPlan.PRPLRPMTPLAN.REPAYMENTPLANID = rentalRow.RentalNo;
        repaymentPlan.PRPLRPMTPLAN.PRINCIPALOUTSTANDINGAMT = Number(
          rentalRow.ClosingPrincipal
        );
        repaymentPlan.PRPLRPMTPLAN.PRINCIPALAMT = Number(
          rentalRow.RentalPrincipal
        );
        repaymentPlan.PRPLRPMTPLAN.INTERESTAMT = Number(
          rentalRow.RentalInterest
        );
        repaymentPlan.PRPLRPMTPLAN.RENTALAMT = Number(rentalRow.TotalAmount);
        repaymentPlan.PRPLRPMTPLAN.RENTALDTE = rentalRow.RentalDueDate;
        repaymentPlan.PRPLRPMTPLAN.GSTAMT = Number(rentalRow.VATAmount);
        repaymentPlan.PRPLRPMTPLAN.EXECUTIONDTE =
          this.storageService.GetUserInfo().ProcessingDate;
        repaymentPlan.PRPLRPMTPLAN.INSURANCEAMT = rentalRow.InsuranceAmount;
        repaymentPlan.PRPLRPMTPLAN.ISGPRENTAL = rentalRow.IsGPRental;
        repaymentPlan.PRPLRPMTPLAN.OSRECEIVEABLE = rentalRow.Osreceivables;
        repaymentPlan.PRPLRPMTPLAN.GROSSRENTAL =
          Number(rentalRow.TotalAmount) +
          Number(rentalRow.VATAmount) +
          rentalRow.InsuranceAmount;
        if (rentalRow.IsGPRental)
          repaymentPlan.PRPLRPMTPLAN.INSTALLMENTNUMBER = 'GP';
        else {
          repaymentPlan.PRPLRPMTPLAN.INSTALLMENTNUMBER =
            String(REPAYMENTPLANID);
          REPAYMENTPLANID++;
        }

        //this._FormState.ResetFormArrayState(repaymentPlan.PRPLRPMTPLANTAX,DataRowState.Removed);
        //repaymentPlan.controls.PRPLRPMTPLANTAX.RemoveAll();

        rentalRow.TaxResponse.forEach((taxitem: any) => {
          let rentaltax = {} as IPRPL_RPMT_PLAN_TAXInfo;
          rentaltax.AMNTCMPTCDE = taxitem.AmountComponentCode;
          rentaltax.BASEAMOUNT = taxitem.BaseAmount;
          rentaltax.RENTALBASECONFIGTYPE = taxitem.RentalBaseConfigType;

          if (taxitem.RentalBaseConfigType == AmountComponent.TotalInterest) {
            rentaltax.PERRENTALTAXAMT = taxitem.ComponentAmount;
          }

          rentaltax.TAXAMT = taxitem.TaxAmount;
          rentaltax.TAXTYPECDE = taxitem.TaxTypeCode;
          rentaltax.NETTAXAMT = taxitem.TaxAmount;
          rentaltax.TAXRATE = taxitem.TaxRate;
          if (rentaltax.TAXRATE > 0 || rentaltax.TAXAMT > 0)
            repaymentPlan.PRPLRPMTPLANTAX.push(rentaltax);
        });

        assetEntity.controls.PROPOSALREPAYMENTPLANENTITYCOL.push(
          this._proposalentitymapper.PROPOSALREPAYMENTPLANENTITYCOLMapper(
            this._ProposalForm.PropsalRepaymentPlanForm(),
            repaymentPlan
          )
        );
      });

      if (
        assetEntity.controls.PROPOSALRENTALDETAIL != null &&
        assetEntity.controls.PROPOSALRENTALDETAIL.length > 0
      )
        this.CleanRentalDetailExistingSlabs(
          assetEntity.controls.PROPOSALRENTALDETAIL
        );

      //endregion

      //region Rental Structure
      //For OL Case, if the Repayment Plan Contains RV Rental then remove it.
      if (this._dataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
        if (result.RenalStructure != null && result.RenalStructure.length > 0) {
          if (
            result.RenalStructure.filter(
              (p: any) => p.RentalType == RentalType.ResidualValue
            ).length > 0
          ) {
            let RVRental = result.RenalStructure.filter(
              (p: any) => p.RentalType == RentalType.ResidualValue
            )[0];
            if (RVRental != null) {
              result.RenalStructure.Remove(RVRental);
            }
          }
        }
      }

      let i = 1;
      result.RenalStructure.forEach((rs: any, index: any) => {
        //if (rs.RentalAmount.ToString() != double.NaN.ToString()) {
        let rentalDetail = {} as IPRPL_RNTL_DETLInfo;
        rentalDetail.STARTTRM = Number(rs.StartTerm);
        rentalDetail.ENDTRM = Number(rs.EndTerm);
        rentalDetail.RENTALAMT = Number(rs.RentalAmount);
        rentalDetail.ASSETID =
          this._dataService.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETID.value;
        rentalDetail.PROPOSALID =
          this._dataService.PROPOSAL.controls.PROPOSALID.value;
        rentalDetail.ISGPRENTAL = rs.IsGPRental;
        const max = assetEntity.controls.PROPOSALRENTALDETAIL.value.reduce(
          (op, item) => (op = op > item.RENTALID ? op : item.RENTALID),
          0
        );
        if (max == 0 && index == 0) rentalDetail.RENTALID = max;
        else rentalDetail.RENTALID = max + 1;
        rentalDetail.RENTALTYP = (rs.RentalTypValue);
        rentalDetail.EXECUTIONDTE =
          this.storageService.GetUserInfo().ProcessingDate;
        rentalDetail.PRINCIPALAMT = rs.PrincipalAmount;

        assetEntity.controls.PROPOSALRENTALDETAIL.push(
          this._proposalentitymapper.PROPOSALRENTALDETAILMapper(
            this._ProposalForm.PROPOSALRENTALDETAILForm(),
            rentalDetail
          )
        );
        i++;
        //}
      });

      //endregion

      //region ComponentTaxes Detail

      // ExtractComponentTaxes(result.TaxAmountComponentResponse, assetEntity.ASSETENTITY, true);

      //endregion
    }
  }
  private CleanProposalRepaymentPlan(
    proposalRepaymentPlans: FormArray<IProposalRepaymentPlanEntity>
  ) {
    //proposalRepaymentPlans.MarkRemoved();
    this._FormState.ResetFormArrayState(
      proposalRepaymentPlans,
      DataRowState.Removed
    );
    //
    this._dataService.ASSETENTITY.controls.PROPOSALREPAYMENTPLANENTITYCOL.patchValue(
      proposalRepaymentPlans.value
    );
  }

  private CleanRentalDetailExistingSlabs(
    proposalRentals: FormArray<IPRPL_RNTL_DETLInfo>
  ) {
    //proposalRentals.MarkRemoved();
    this._FormState.ResetFormArrayState(proposalRentals, DataRowState.Removed);
    //
    //this._proposalentitymapper.PROPOSALRENTALDETAILMapper(this._dataService.ASSETENTITY.controls.PROPOSALRENTALDETAIL,proposalRentals)
    this._dataService.ASSETENTITY.controls.PROPOSALRENTALDETAIL.patchValue(
      proposalRentals.value
    );
  }

  public UpdateBaseRateChart() {
    let RequestParam = {} as IChartInfoPOSParm;

    RequestParam.ProposalArticle = this._dataService.PROPOSALARTICLE
      .value as Array<IProposalArticleEntity>;
    RequestParam.ProposalStartDate =
      this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTSTARTDTE;
    RequestParam.IntroducerID = this._dataService.PROPOSAL.value.BPINTRODUCERID;
    RequestParam.ProposalCurrencyCode =
      this._dataService.PROPOSAL.value.CURRENCYCDE;
    RequestParam.FinancialProductID =
      this._dataService.PROPOSAL.value.FINANCIALPRODUCTID;
    RequestParam.ProposalRentalTemplate = this._dataService
      .PROPOSALTEMPLATERENTALINT.value as IPRPL_TPLE_RNTL_INTInfo;
    let baserateType = '';
    if (this._dataService.PROPOSALTEMPLATERENTALINT != null)
      baserateType = this.GetBaseRateType(
        this._dataService.PROPOSALTEMPLATERENTALINT.value.INTRTYPECDE,
        this._dataService.PROPOSALTEMPLATERENTALINT.value.RNTLCALCLTNMTDCDE
      );
    RequestParam.BaseRateTypeCode = baserateType;
    if (RequestParam.IntroducerID > 0 && RequestParam.FinancialProductID > 0) {
      this._proposalService
        .UpdateBaseRateChart(RequestParam)
        .subscribe((result) => {
          if (
            result.ResultSet != null &&
            result.ResultSet.PRPLARTICLEENTITYCOLL[0].ASSETENTITY
              .PROPOSALARTICLEBASERATE != null &&
            result.ResultSet.PRPLARTICLEENTITYCOLL[0].ASSETENTITY
              .PROPOSALARTICLEBASERATE.length > 0
          ) {
            this._FormState.ResetFormArrayState(
              this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE,
              DataRowState.Removed
            );
            this._proposalentitymapper.PROPOSALARTICLEBASERATEMapper(
              this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE,
              result.ResultSet.PRPLARTICLEENTITYCOLL[0].ASSETENTITY
                .PROPOSALARTICLEBASERATE as Array<IPRPL_ARTE_BASE_RATEInfo>
            );
          }
        });
    }
  }

  public GetBaseRateType(
    interest_rate_type: string,
    rental_calc_mtd: string
  ): BaseRateType {
    let baseRate = BaseRateType.AnnuityVariableRate;
    if (
      interest_rate_type == InterestType.Fix &&
      (rental_calc_mtd == RentalCalculationMethod.Flat ||
        rental_calc_mtd == RentalCalculationMethod.EqualPrincipalFlat)
    ) {
      baseRate = BaseRateType.FixedFlatRate;
    } else if (
      interest_rate_type == InterestType.Fix &&
      (rental_calc_mtd == RentalCalculationMethod.Annuity ||
        rental_calc_mtd == RentalCalculationMethod.EqualPrincipal)
    ) {
      baseRate = BaseRateType.AnnuityFixedRate;
    } else if (
      interest_rate_type == InterestType.Variable &&
      (rental_calc_mtd == RentalCalculationMethod.Annuity ||
        rental_calc_mtd == RentalCalculationMethod.EqualPrincipal)
    ) {
      baseRate = BaseRateType.AnnuityVariableRate;
    }

    return baseRate;
  }

  public AssetAmtValueChange() {
    this.ResetRentalDetail();
    this._dataService.PROPOSALASSET.controls.ASSETAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value);
    if (this._dataService.PROPOSALASSET.controls.RowState.value != DataRowState.Added) {
      this._dataService.PROPOSALASSET.controls.RowState.setValue(DataRowState.Updated);
    }
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.VATONASSETCOST.setValue(0);
    //Controller.ResetInsuranceAmounts();
    this.ResetProvisionFeeDetail();//Controller.ResetProvisionFeeDetail();
    if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value <= this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.value)
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.setValue(0);

    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALCOST.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value - this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TRADEINAMT.value);
    //this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.setValue(0);
    // if (Controller.PROPOSAL_ASSET.PROPOSALASSETINSURANCE != null && Controller.PROPOSAL_ASSET.PROPOSALASSETINSURANCE.Count > 0)
    // {
    //     if (Controller.DataContext.PROPOSALCHART.Where(p => p.MODELTYPE == RuleModelType.InsuranceChart.GetStringValue()).Count() > 0)
    //     {
    //         if (Controller.delstartspinner != null)
    //             Controller.delstartspinner();
    //         Controller.PROPOSAL_ASSET.PROPOSALASSETINSURANCE.FirstOrDefault().INSUREDAMT = Controller.PROPOSAL_FINANCIAL_AGRM.ASSETAMT;
    //         Controller.PROPOSAL_ASSET.PROPOSALINSURANCE = Controller.PROPOSAL_ASSET.PROPOSALASSETINSURANCE.FirstOrDefault();
    //         await Controller.SetAssetInsuranceConfigurations();
    //         if (Controller.ProposalInsurance.FirstOrDefault().PREMPRCOTO >= Controller.PROPOSAL_ASSET.PROPOSALINSURANCE.MININSRPREMPRCOTO && Controller.ProposalInsurance.FirstOrDefault().PREMPRCOTO <= Controller.PROPOSAL_ASSET.PROPOSALINSURANCE.MAXINSRPREMPRCOTO)
    //         {
    //             Controller.CalculateFinalPremiumRate(Controller.PROPOSAL_ASSET.PROPOSALASSETINSURANCE.FirstOrDefault());
    //             btnCalculate.IsEnabled = true;
    //             // btnInsuranceComTaxDetail.IsEnabled = false;
    //             //btnCommissionDetail.IsEnabled = false;
    //             //btnTotalSubsidyAmount.IsEnabled = false;
    //             ResetRentalDetail();
    //             Controller.PROPOSAL_FINANCIAL_AGRM.INSURANCEPREMIUM = 0;
    //             Controller.PROPOSAL_FINANCIAL_AGRM.INSURANCEPREMIUM = Controller.ProposalInsurance.m_current.Sum(x => x.PREMIUMAMT) + Controller.PROPOSAL_ASSET.OTOPRPLASETADDINSR.m_current.Sum(x => x.PREMIUMAMT);
    //             Controller.PROPOSAL_FINANCIAL_AGRM.INSURANCEAMT = Controller.ProposalInsurance.m_current.Sum(x => x.INSUREDAMT);
    //             Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.FindAll(p => (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.TLO.GetStringValue() || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.Comprehensive.GetStringValue() || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.AdditionalCoverage.GetStringValue())).ForEach(x => Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.Remove(x));
    //             foreach (var item in Controller.ProposalInsurance)
    //             {
    //                 if (item.INSRTYPECDE == InsuranceType.CompulsoryInsurance.GetStringValue()) // Comprehensive
    //                     Controller.UpdateFinancialAgreementDetail(item.PREMIUMAMT, AmountComponent.Comprehensive, item.CURRENCYCDE, FinancialComponentsOperations.None.GetStringValue(), item.INSURER, 0, AmountClassification.Payable);//item.PREMIUMAMT
    //                 else if (item.INSRTYPECDE == InsuranceType.VoluntaryInsurance.GetStringValue())   // TLO
    //                     Controller.UpdateFinancialAgreementDetail(item.PREMIUMAMT, AmountComponent.TLO, item.CURRENCYCDE, FinancialComponentsOperations.None.GetStringValue(), item.INSURER, 0, AmountClassification.Payable);//item.PREMIUMAMT
    //             }
    //             int insurer = Controller.ProposalInsurance != null && Controller.ProposalInsurance.Count > 0 && Controller.ProposalInsurance.First() != null ? Controller.ProposalInsurance.First().INSURER : 0;
    //             if (Controller.ProposalAdditionalInsurance.Count > 0)
    //             {
    //                 decimal sum = 0;
    //                 foreach (var item in Controller.ProposalAdditionalInsurance.m_current)
    //                     sum += (decimal)item.PREMIUMAMT;

    //                 Controller.UpdateFinancialAgreementDetail(sum, AmountComponent.AdditionalCoverage, Controller.ProposalCurrencyCode, FinancialComponentsOperations.None.GetStringValue(), Controller.DataContext.PROPOSAL.BPCOMPANYID, insurer, AmountClassification.Payable);//item.PREMIUMAMT
    //             }
    //             else
    //                 Controller.UpdateFinancialAgreementDetail(0, AmountComponent.AdditionalCoverage, Controller.ProposalCurrencyCode, FinancialComponentsOperations.None.GetStringValue(), Controller.DataContext.PROPOSAL.BPCOMPANYID, insurer, AmountClassification.Payable);//item.PREMIUMAMT
    //         }
    //         else
    //         {
    //             Controller.PROPOSAL_FINANCIAL_AGRM.INSURANCEAMT = 0;
    //             Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.FindAll(p => (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.TLO.GetStringValue() || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.Comprehensive.GetStringValue() || p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.AdditionalCoverage.GetStringValue())).ForEach(x => Controller.DataContext.PROPOSALARTICLE[Controller.Helper.AssetIndex].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.Remove(x));
    //             Controller.PROPOSAL_ASSET.PROPOSALASSETINSURANCE.RemoveAll();
    //             Controller.PROPOSAL_ASSET.OTOPRPLASETADDINSR.RemoveAll();
    //             Controller.PROPOSAL_ASSET.PROPOSALFINANCIALAGREEMENT.INSURANCEPREMIUM = 0;
    //         }
    //     }
    // }
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DISCOUNT.setValue(0);

    this.CreateFinlAgreementDetails(); //Added in OL Merging

    // this.CalculateNetFinanceAmt();
    // this.UpdateCalculatedFields();

    //reset downpayment amount on change of asset cost. No need to setDownpayment.
    //this.SetDownpayment();

    // this.RemoveArticleComponent(AmountComponent.AssetCost);

    let isdsbramtvalid = this.CalculateDisburseAmountOTO();
    this._proposalManagerService.CalculateInclExclValues();
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
  }

  public SetDownpayment() {
    if (
      this._dataService.PROPOSAL.controls.FINANCETYP.value !=
      FinanceType.Refinance
    ) {
      this.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
      if (
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls
          .DOWNPAYMENTPAIDTOINTIND.value
      ) {
        this.UpdateFinancialAgreementDetail(
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT
            .value,
          AmountComponent.DownpaymentDeposit,
          '00001',
          null,
          null,
          1,
          AmountClassification.Receivable,
          true
        );
        this.UpdateFinancialAgreementDetail(
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT
            .value,
          AmountComponent.DownpaymentDeposit,
          '00001',
          null,
          null,
          1,
          AmountClassification.Nettingoff,
          true
        );
      } else {
        this.UpdateFinancialAgreementDetail(
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT
            .value,
          AmountComponent.DownpaymentDeposit,
          '00001',
          null,
          null,
          1,
          AmountClassification.Receivable,
          false
        );
      }
    }
  }

  get TotalFinancedCharges() {
    let totalAmount: number = 0;

    this._dataService.PROPOSALARTICLE.controls[
      this._dataService.PROPOSALARTICLE.controls.length - 1
    ].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach((x) => {
      if (
        (((x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'True' ||
          x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'T') && String(x.controls.PRPLCHRG.controls.FINANCEDIND) != "") &&
          (x.controls.PRPLCHRG.controls.RowState.value !== DataRowState.Removed) &&
          x.controls.TAXINCULSIVEAMT.value > 0) &&
        x.controls.TAXINCULSIVEAMT.value != undefined
      ) {
        totalAmount += x.controls.TAXINCULSIVEAMT.value;
      }
    });

    // totalAmount += (from info in assetEntity.ASSETENTITY.PROPOSALCHARGE
    //                 where info != null && info.PRPLCHRG.FINANCEDIND == "True" || info.PRPLCHRG.FINANCEDIND == "T"
    //                 select info.TAXINCULSIVEAMT).Sum();
    return totalAmount;
  }

  get NonFinanceChargeAmt() {
    let totalAmount: number = 0;

    this._dataService.PROPOSALARTICLE.controls[
      this._dataService.PROPOSALARTICLE.controls.length - 1
    ].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach((x) => {
      if (
        (x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'False' ||
        x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'F' ||
        x.controls.PRPLCHRG.controls.FINANCEDIND.value == "") && (x.controls.PRPLCHRG.controls.RowState.value !== DataRowState.Removed)
      ) {
        totalAmount += x.controls.PRPLCHRG.value.CHARGEAMT;
      }
    });

    // nonFinancedChargeAmt = (from info in assetEntity.ASSETENTITY.PROPOSALCHARGE
    //   where info != null && (info.PRPLCHRG.FINANCEDIND == null || info.PRPLCHRG.FINANCEDIND == "False" || info.PRPLCHRG.FINANCEDIND == "F")
    //   select info.PRPLCHRG.CHARGEAMT).Sum();
    return totalAmount;
  }

  get FCReceiveableCharge() {
    let totalAmount: number = 0;

    this._dataService.PROPOSALARTICLE.controls[
      this._dataService.PROPOSALARTICLE.controls.length - 1
    ].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach((x) => {
      if (
        (x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'False' || x.controls.PRPLCHRG.controls.FINANCEDIND.value == null ||
          x.controls.PRPLCHRG.controls.FINANCEDIND.value == 'F') && (x.controls.PRPLCHRG.controls.RowState.value !== DataRowState.Removed) &&
        !x.controls.PRPLCHRG.controls.RECEIVEBYDEALERIND.value
      ) {
        totalAmount += x.controls.PRPLCHRG.value.CHARGEAMT;
      }
    });

    // nonFinancedChargeAmt = (from info in assetEntity.ASSETENTITY.PROPOSALCHARGE
    //   where info != null && (info.PRPLCHRG.FINANCEDIND == null || info.PRPLCHRG.FINANCEDIND == "False" || info.PRPLCHRG.FINANCEDIND == "F")
    //   select info.PRPLCHRG.CHARGEAMT).Sum();
    return totalAmount;
  }

  public CreateFinlAgreementDetails() {
    // UpdateAccessoriesAgreementDetail();

    // if (ProposalInsurance != null && ProposalInsurance.Count > 0){
    //     foreach (var item in ProposalInsurance)
    //     {
    //         if (item.INSRTYPECDE == ModuleComponents.CompulsoryInsurance)
    //              UpdateFinancialAgreementDetail(item.PREMIUMAMT, AmountComponent.CompulsoryInsurance, item.CURRENCYCDE, item.CMPTFINETYPECDE, null);
    //         else if (item.INSRTYPECDE == ModuleComponents.VoluntaryInsurance)
    //              UpdateFinancialAgreementDetail(item.PREMIUMAMT, AmountComponent.VoluntaryInsurance, item.CURRENCYCDE, item.CMPTFINETYPECDE, null);
    //     }
    //   }

    let currencyCode = this._dataService.PROPOSAL.value.CURRENCYCDE;
    this.RemoveArticleComponent(AmountComponent.ContractFinancedCharges);
    this.UpdateFinancialAgreementDetail(
      this.TotalFinancedCharges,
      AmountComponent.ContractFinancedCharges,
      currencyCode,
      AssetComponentsFinancialConfiguration.Finance,
      null
    );
    if (
      this._dataService.PROPOSAL.controls.FINANCETYP.value !=
      FinanceType.OperatingLease
    ) {
      this.RemoveArticleComponent(AmountComponent.ApplicationUpfrontCharges);
      this.UpdateFinancialAgreementDetail(
        this.NonFinanceChargeAmt,
        AmountComponent.ApplicationUpfrontCharges,
        currencyCode,
        null,
        null
      );
    }

    this.UpdateFinancialAgreementDetail(
      this._dataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALAMT,
      AmountComponent.ResidualValue,
      currencyCode
    );

    this.UpdateFinancialAgreementDetail(
      this._dataService.PROPOSALFINANCIALAGREEMENT.value.ONROADCOSTAMT,
      AmountComponent.OnRoadCost,
      currencyCode
    );

    this.RemoveArticleComponent(AmountComponent.AssetCost);
    this.UpdateFinancialAgreementDetail(
      this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT,
      AmountComponent.AssetCost,
      currencyCode
    );

    let insurance = this._dataService.PROPOSALINSURANCEMAIN.value.find(x => x.RowState != DataRowState.Removed) as IMainInsuranceEntity;
    if (insurance != null && insurance.PRPLINSR != null) {
      this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALFINANCEAMNT, AmountComponent.FinancedInsurancePremium, currencyCode, AssetComponentsFinancialConfiguration.Finance);

      this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALAROAMNT, AmountComponent.AROInsurancePremium, currencyCode, AssetComponentsFinancialConfiguration.None, insurance.PRPLINSR.INSURER, 1, AmountClassification.Payable);

      this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALAROAMNT, AmountComponent.AROInsurancePremium, currencyCode, AssetComponentsFinancialConfiguration.None, null, 1, AmountClassification.Receivable);
      // Subsidy
      //await UpdateFinancialAgreementDetail(this.TotalInsuranceSubsidy, AmountComponent.InsuranceSubsidy, ProposalCurrencyCode, AssetComponentsFinancialConfiguration.None.GetStringValue(), this.DataContext.PROPOSAL.BPINTRODUCERID, 1, AmountClassification.Nettingoff);

      //await UpdateFinancialAgreementDetail(this.TotalInsuranceSubsidy, AmountComponent.InsuranceSubsidy, ProposalCurrencyCode, AssetComponentsFinancialConfiguration.None.GetStringValue(), this.DataContext.PROPOSAL.BPINTRODUCERID, 1, AmountClassification.Receivable);
      //Upfront Insurance Premium

      //await UpdateFinancialAgreementDetail(this.TotalInsuranceSubsidy, AmountComponent.InsuranceSubsidy, ProposalCurrencyCode, AssetComponentsFinancialConfiguration.None.GetStringValue(), this.DataContext.PROPOSAL.BPINTRODUCERID, 1, AmountClassification.Nettingoff);

      //await UpdateFinancialAgreementDetail(this.TotalInsuranceSubsidy, AmountComponent.InsuranceSubsidy, ProposalCurrencyCode, AssetComponentsFinancialConfiguration.None.GetStringValue(), this.DataContext.PROPOSAL.BPINTRODUCERID, 1, AmountClassification.Receivable);

      this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALINSRSUBSIDYAMNT, AmountComponent.InsuranceSubsidy, currencyCode, AssetComponentsFinancialConfiguration.None, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Nettingoff);

      this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALINSRSUBSIDYAMNT, AmountComponent.InsuranceSubsidy, currencyCode, AssetComponentsFinancialConfiguration.None, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Receivable);


      if (insurance.PRPLINSR.RECEIVEBYDEALERIND) {
        this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALUPFRONTAMNT, AmountComponent.UpfrontInsurancePremium, currencyCode, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Receivable, true);

        this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALUPFRONTAMNT, AmountComponent.UpfrontInsurancePremium, currencyCode, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Nettingoff);
      }
      else {
        this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.TOTALUPFRONTAMNT, AmountComponent.UpfrontInsurancePremium, currencyCode, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Receivable, false);
      }

      // B2B Fee
      this.UpdateFinancialAgreementDetail(insurance.PRPLINSR.INSURANCEB2BAMNT, AmountComponent.B2BFee, currencyCode, AssetComponentsFinancialConfiguration.None, insurance.PRPLINSR.INSURER, 1, AmountClassification.Receivable);
      // Total Insurance Premium
      let TotalPremiumAmount = Number(insurance.PRPLINSR.TOTALFINANCEAMNT) + Number(insurance.PRPLINSR.TOTALINSRSUBSIDYAMNT) + Number(insurance.PRPLINSR.TOTALUPFRONTAMNT);
      this.UpdateFinancialAgreementDetail(TotalPremiumAmount, AmountComponent.InsurancePremium, currencyCode, AssetComponentsFinancialConfiguration.None, insurance.PRPLINSR.INSURER, 1, AmountClassification.Payable);
    }
    // this.UpdateFinancialAgreementDetail(
    //   this._dataService.PROPOSALFINANCIALAGREEMENT.value.TRADEINAMT,
    //   AmountComponent.TradeinAmount,
    //   currencyCode
    // );

    // if (
    //   this.MainInsuranceEntity != null &&
    //   this.MainInsuranceEntity.PRPLINSR != null
    // ) {
    //   this.UpdateFinancialAgreementDetail(
    //     this.TotalInsuranceFinanceAmnt,
    //     AmountComponent.FinancedInsurancePremium,
    //     currencyCode,
    //     AssetComponentsFinancialConfiguration.Finance
    //   );

    //   this.UpdateFinancialAgreementDetail(
    //     this.TotalInsuranceAROAmnt,
    //     AmountComponent.AROInsurancePremium,
    //     currencyCode,
    //     AssetComponentsFinancialConfiguration.None,
    //     this.MainInsuranceEntity.PRPLINSR.INSURER,
    //     1,
    //     AmountClassification.Payable
    //   );

    //   this.UpdateFinancialAgreementDetail(
    //     this.TotalInsuranceAROAmnt,
    //     AmountComponent.AROInsurancePremium,
    //     currencyCode,
    //     AssetComponentsFinancialConfiguration.None,
    //     null,
    //     1,
    //     AmountClassification.Receivable
    //   );
    //   this.UpdateFinancialAgreementDetail(
    //     MainInsuranceEntity.PRPLINSR.TOTALINSRSUBSIDYAMNT,
    //     AmountComponent.InsuranceSubsidy,
    //     currencyCode,
    //     AssetComponentsFinancialConfiguration.None,
    //     DataContext.PROPOSAL.BPINTRODUCERID,
    //     1,
    //     AmountClassification.Nettingoff
    //   );

    //   this.UpdateFinancialAgreementDetail(
    //     MainInsuranceEntity.PRPLINSR.TOTALINSRSUBSIDYAMNT,
    //     AmountComponent.InsuranceSubsidy,
    //     currencyCode,
    //     AssetComponentsFinancialConfiguration.None,
    //     DataContext.PROPOSAL.BPINTRODUCERID,
    //     1,
    //     AmountClassification.Receivable
    //   );

    //   if (this.MainInsuranceEntity.PRPLINSR.RECEIVEBYDEALERIND) {
    //     this.UpdateFinancialAgreementDetail(
    //       this.TotalInsuranceUpfront,
    //       AmountComponent.UpfrontInsurancePremium,
    //       currencyCode,
    //       AssetComponentsFinancialConfiguration.Upfront,
    //       this.DataContext.PROPOSAL.BPINTRODUCERID,
    //       1,
    //       AmountClassification.Receivable,
    //       true
    //     );

    //     this.UpdateFinancialAgreementDetail(
    //       this.TotalInsuranceUpfront,
    //       AmountComponent.UpfrontInsurancePremium,
    //       currencyCode,
    //       AssetComponentsFinancialConfiguration.Upfront,
    //       this.DataContext.PROPOSAL.BPINTRODUCERID,
    //       1,
    //       AmountClassification.Nettingoff
    //     );
    //   } else {
    //     this.UpdateFinancialAgreementDetail(
    //       this.TotalInsuranceUpfront,
    //       AmountComponent.UpfrontInsurancePremium,
    //       currencyCode,
    //       AssetComponentsFinancialConfiguration.Upfront,
    //       this.DataContext.PROPOSAL.BPINTRODUCERID,
    //       1,
    //       AmountClassification.Receivable,
    //       false
    //     );
    //   }

    // B2B Fee
    // this.UpdateFinancialAgreementDetail(
    //   this.MainInsuranceEntity.PRPLINSR.INSURANCEB2BAMNT,
    //   AmountComponent.B2BFee,
    //   currencyCode,
    //   AssetComponentsFinancialConfiguration.None,
    //   this.MainInsuranceEntity.PRPLINSR.INSURER,
    //   1,
    //   AmountClassification.Receivable
    // );
    // // Total Insurance Premium
    // this.UpdateFinancialAgreementDetail(
    //   this.TotalPremiumAmount,
    //   AmountComponent.InsurancePremium,
    //   currencyCode,
    //   AssetComponentsFinancialConfiguration.None,
    //   this.MainInsuranceEntity.PRPLINSR.INSURER,
    //   1,
    //   AmountClassification.Payable
    // );

    this.UpdateCalculatedFields();
    this.CalculateNetFinanceAmt();
    this.CalculateFirstPayment();
  }

  public CalculateDisburseAmountOTO(chargesamount: number = 0, insuranceamount: number = 0, isetchange: boolean = false) {
    
    let index = this._dataService.PROPOSALARTICLE.length - 1;
    let assetEntity = this._dataService.PROPOSALARTICLE.controls[index];

    if (this._dataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.Refinance) {
      let amount = 0;
      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value > 0)
        amount = this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ADJUSTEDFINANCEDAMT.value - this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value;
      if (insuranceamount > 0)
        amount -= insuranceamount;
      else
        amount -= this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.value;
      if (chargesamount > 0)
        amount -= chargesamount;
      else {
        if (assetEntity.controls.ASSETENTITY.controls.PROPOSALCHARGE != null)
          amount -= assetEntity.controls.ASSETENTITY.controls.PROPOSALCHARGE.value.reduce(function (tot, record) { return tot + record.TAXEXCULSIVEAMT; }, 0);
      }

      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALMODETYP.value == RentalMode.ADVANCE && this._proposalManagerService.RepaymentPlan.length > 0) {
        amount -= this._proposalManagerService.RepaymentPlan[0].PRPLRPMTPLAN.RENTALAMT;
      }

      if (assetEntity.controls.ASSETENTITY.controls.PROPOSALASSET.controls.BBNCHARGES.value > 0) {
        let _taxinclusiveamt = 0;
        assetEntity.controls.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach((p) => {
          if (p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.BBNCharge))
            _taxinclusiveamt = p.controls.TAXINCULSIVEAMT.value;
        }
        );
        amount -= _taxinclusiveamt;
      }
    //  amount -=this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OLDCONTRCBL.value;
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSBRAMNTOTO.setValue(Number(amount));
    if (amount <= 0 && isetchange != true) {
        //Message.InfoMessage("disbrAmtZero");
        //Utilities.ShowMessage(6, ref (this.ParentContainer as ProposalNew).validator, null, "Disburse amount cannot be less then zero !");
        return false;
      }
      //if (Controller.PROPOSAL_FINANCIAL_AGRM.ETAMNTOTO > 0) // Why this check applied here? commented by Hafiz Ammar against onsite fault (OTO-RF 7200)
      this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value, AmountComponent.ETFromSOLOs, '00001');
      return true;
      //if (Controller.RentalMode == RentalMode.ADVANCE.GetStringValue() && Controller.RepaymentPlan.Count > 0 && Controller.RepaymentPlan.FirstOrDefault().PRPLRPMTPLAN.RENTALAMT > 0)
      //    await Controller.UpdateFinancialAgreementDetail(Controller.RepaymentPlan.FirstOrDefault().PRPLRPMTPLAN.RENTALAMT, AmountComponent.Rental, Controller.ProposalCurrencyCode);
    } else if (this._dataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.HirePurchase && this._dataService.PROPOSAL.controls.ISMCOMCAMPAIGN.value) {
      let amount = 0;

      amount = this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value - this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value - this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value;

      if (insuranceamount > 0) {
        amount -= insuranceamount;
      }
      else {
        if (this._dataService.PRPLINSR != undefined) {
          amount -= this._dataService.PRPLINSR?.controls.TOTALUPFRONTAMNT.value;
        }
      }

      amount -= this.FCReceiveableCharge;

      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RENTALMODETYP.value == RentalMode.ADVANCE && this._proposalManagerService.RepaymentPlan.length > 0) {
        amount -= this._proposalManagerService.RepaymentPlan[0].PRPLRPMTPLAN.RENTALAMT;
      }

      if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value > 0)
        amount -= this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value;

      if (this._dataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.value > 0)
        amount -= this._dataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.value;

      if (this._dataService.ProposalEntity.controls.PRPLCMPTCNFG.value != null && this._dataService.ProposalEntity.controls.PRPLCMPTCNFG.value.filter((x) => x.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) && x.AMNTCMPTCNFG == '00003').length > 0) {
        assetEntity.controls.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.value.forEach(
          (p) => {
            if (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee))
              amount -= p.TAXINCULSIVEAMT;
          }
        );
      }

      if (this._dataService.ProposalEntity.controls.PRPLCMPTCNFG.value != null && this._dataService.ProposalEntity.controls.PRPLCMPTCNFG.value.filter((x) => x.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee) && x.AMNTCMPTCNFG == '00003').length > 0) {
        assetEntity.controls.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.value.forEach(
          (p) => {
            if (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))
              amount -= p.TAXINCULSIVEAMT;
          }
        );
      }

      if (amount <= 0 && isetchange != true) {
        //Message.InfoMessage("disbrAmtZero");
        //Utilities.ShowMessage(6, ref (this.ParentContainer as ProposalNew).validator, null, "Disburse amount cannot be less then zero !");
        return false;
      }

      if (this._dataService.PROPOSAL.controls.MCOMTOPUPIND.value === true) {
        let allOldComponentSum = this.outFlowSum;
        amount += this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OLDCONTRCBL.value;
        amount -= allOldComponentSum;
      }

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSBRAMNTOTO.setValue(Number(amount));
      this.RemoveArticleComponent(AmountComponent.ETFromSOLOs);
      this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ETAMNTOTO.value, AmountComponent.ETFromSOLOs, '00001', AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.controls.BPINTRODUCERID.value, 0, AmountClassification.Nettingoff);
      return true;
    }
    return true;
  }
  assetAmountonChange(eventt: Event | any) {
    //this._calculationService.ResetRentalDetail();
    let assetAmnt = this._formatter.FormatCurrencyToNumber(String(eventt));

    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.setValue(assetAmnt);
    this.AssetAmtValueChange();
    // Update downpayment on change of asset cost

    this.downPaymentChange(eventt, 'ASSETAMT');

    this.ApplyAssetConfigurations(false, this._dataService.PROPOSALARTICLE.controls[this._dataService.PROPOSALARTICLE.value.length - 1], false);

    this.RemoveArticleComponent(AmountComponent.AssetCost);
    this.UpdateFinancialAgreementDetail(
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value,
      AmountComponent.AssetCost,
      this._dataService.PROPOSAL.controls.CURRENCYCDE.value,
      AssetComponentsFinancialConfiguration.Finance,
      null
    );

    this.ResetAllAmounts();
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEAMT.setValue(0);
    this._FormState.ResetFormArrayState(this._dataService.ASSETENTITY.controls.PROPOSALASSETINSURANCE, DataRowState.Removed);
    this._FormState.ResetFormArrayState(this._dataService.ASSETENTITY.controls.OTOPRPLASETADDINSR, DataRowState.Removed);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(0);
    if (this.Configurations.value.RESIDUALAMT > 0 && this.Configurations.value.RESIDUALAMT < this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT) { this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.setValue(this.Configurations.value.RESIDUALAMT) }
    else {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.setValue(0);
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(0);
    }
    if (this.Configurations.value.RESIDUALPCT > 0)
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(this.Configurations.value.RESIDUALPCT);
    this.EnableInsuranceCalculateButton(); // Insurance calculate button enable on asset cost change
  }


  downPaymentChange(event: Event, field: string) {
    this.ResetRentalDetail();
    if (field == 'ASSETAMT') {
      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.value > 0) {
        ////////
        //this.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.setValue(this._formatter.FormatCurrencyToNumber(String(event)));
        this.CalculateDownPayment(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
        if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.value < 100) {
          // this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT = this.CashDepositAmt;
          this.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
          this.SetDownpayment();
          //this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE);
        }
        else {
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.setValue(0);
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.setValue(0);
          this.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
          this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._dataService.PROPOSAL.value.CURRENCYCDE);
        }

      }
      else if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.value > 0) {
        ////////
        //this.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(this._formatter.FormatCurrencyToNumber(String(event)));

        if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.value < 100) {
          // this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT = this.CashDepositAmt;
          this.CalculateDownPaymentRF(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
          this.CalculateNetFinanceAmt();
          //this.SetDownpayment();
          this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._dataService.PROPOSAL.value.CURRENCYCDE);
        }
        else {
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(0);
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(0);
          this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._dataService.PROPOSAL.value.CURRENCYCDE);
          if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT != 0)
            this._msgService.showMesssage("DiscAmLesAsetCost", MessageType.Warning);
        }

      }

    }
    if (field == 'CASHDEPOSITAMT') {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.setValue(this._formatter.FormatCurrencyToNumber(String(event)));
      this.CalculateDownPayment(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Fixed);
      if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value > 0) {
        this.ResetProvisionFeeDetail();
        this._msgService.showMesssage("ProvisionFeeReset", MessageType.Info);
      }
      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value < this._dataService.PROPOSALFINANCIALAGREEMENT.controls.ASSETAMT.value) {
        //this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT = this.CashDepositPct;
        this.SetDownpayment();
      }
      else {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.setValue(0);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.setValue(0);
        this.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._dataService.PROPOSAL.value.CURRENCYCDE);
        this.UpdateCalculatedFields();
      }
      ////
    }
    else if (field == 'CASHDEPOSITPCT') {
      ////////
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.setValue(this._formatter.FormatCurrencyToNumber(String(event)));
      this.CalculateDownPayment(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.value < 100) {
        // this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT = this.CashDepositAmt;
        this.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
        this.SetDownpayment();
        if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value > 0) {
          this.ResetProvisionFeeDetail();
          this._msgService.showMesssage("ProvisionFeeReset", MessageType.Info);
        }
        //this._calculationService.UpdateFinancialAgreementDetail(this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._proposaldataService.PROPOSAL.value.CURRENCYCDE);
      }
      else {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITPCT.setValue(0);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.setValue(0);
        this.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT.value, AmountComponent.DownpaymentDeposit, this._dataService.PROPOSAL.value.CURRENCYCDE);
      }

    }

    else if (field == 'DSCTAMNTOTO') {
      ////////
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.setValue(this._formatter.FormatCurrencyToNumber(String(event)));
      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value < this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT) {
        this.CalculateDownPaymentRF(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Fixed);
        // this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT = this.CashDepositAmt;
        this.RemoveArticleComponent(AmountComponent.DownPaymentRF);
        //this.SetDownpayment();
        this.CalculateNetFinanceAmt();
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._dataService.PROPOSAL.value.CURRENCYCDE);
      }
      else {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(0);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.setValue(0);
        this.RemoveArticleComponent(AmountComponent.DownPaymentRF);
        //this._calculationService.RemoveArticleComponent(AmountComponent.DownpaymentDeposit);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._dataService.PROPOSAL.value.CURRENCYCDE);
        this.UpdateCalculatedFields();
        if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT != 0)
          this._msgService.showMesssage("DiscAmLesAsetCost", MessageType.Warning);
      }

    }
    else if (field == 'DSCTAMNTPCTOTO') {
      ////////
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(this._formatter.FormatCurrencyToNumber(String(event)));

      if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.value < 100) {
        // this._proposaldataService.PROPOSALFINANCIALAGREEMENT.controls.CASHDEPOSITAMT = this.CashDepositAmt;
        this.CalculateDownPaymentRF(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
        this.RemoveArticleComponent(AmountComponent.DownPaymentRF);
        this.CalculateNetFinanceAmt();
        //this.SetDownpayment();
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._dataService.PROPOSAL.value.CURRENCYCDE);
      }
      else {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTPCTOTO.setValue(0);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.setValue(0);
        this.RemoveArticleComponent(AmountComponent.DownPaymentRF);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DSCTAMNTOTO.value, AmountComponent.DownPaymentRF, this._dataService.PROPOSAL.value.CURRENCYCDE);
        if (this._dataService.PROPOSALFINANCIALAGREEMENT.value.ASSETAMT != 0)
          this._msgService.showMesssage("DiscAmLesAsetCost", MessageType.Warning);
      }

    }

  }

  calculateCommission(){
    let request = new CommissionCalculationParam();
    request.PROPOSALARTICLE = this._dataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
    request.COMMISSIONAMNT = this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT
    request.COMMISSIONTYPE = CommissionType.GetStringValue(CommissionType.MarketingCommission);
    request.CHKEMPLOYEE = this._dataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
    request.COMMISSIONCALCIND = this._proposalManagerService.CommissionCalcInd;
    request.BPINTRODUCERID = this._dataService.PROPOSAL.value.BPINTRODUCERID;
    this.RemoveArticleComponent(AmountComponent.JP1Commission);
    this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT, AmountComponent.JP1Commission, this._dataService.PROPOSAL.value.CURRENCYCDE, null, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Payable);
    this._proposalService.CalculateCommission(request).subscribe((res:any) => {
      //this._formState.ResetFormArrayState(this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY, DataRowState.Removed);
      if (this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.value.length == 0)
        this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._ProposalForm.PropsalCommissionForm());
      //this._entityMapperService.ProposalCommissionEntityMapper(this._proposalDataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0], res?.ResultSet[0]);
      this._proposalManagerService.ProposalCommissionMapper(res?.ResultSet[0] as IProposalCommissionEntity, '00001');
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPOAMOUNT.setValue(this._proposalManagerService.DealerPOAmount());
      this.calculateNMSIR();
      this.CalculateTotalAcquisitionAmount();
    });
  }

  public SetProposalRentalTemplateConfiguration(
    entity: FormGroup<IProposalEntity>,
    fp: IFinancialProductEntity
  ) {
    this.financialProdEntity = fp;
    let info = fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLERNTLINTR;
    this.PROPOSALTEMPLATERENTALINT =
      fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLERNTLINTR;
    let tplerntlcmptcnfg = fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLERNTLCMPTCNFG;

    //entity.PROPOSALTEMPLATERENTALINT.PROPOSALID = entity.PROPOSAL != null ? entity.PROPOSAL.PROPOSALID : 0;
    //entity.PROPOSALTEMPLATERENTALINT.FIXVRBLETYPCDE = info.FIXVRBLETYPCDE; // Need to add new field in "PROPOSALTEMPLATERENTALINT" naming INTRTYPECDE
    if (info != null) {
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.FIXVRBLETYPCDE.setValue(
        info.INTRTYPECDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.setValue(
        info.ALLOWOVERRIDEIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RVSONFRQCDE.setValue(
        info.RVSONFRQCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RNTLCALCLTNMTDCDE.setValue(
        info.RNTLCALCLTNMTDCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.PRODRATECNVRSNMTDCDE.setValue(
        info.PRODRATECNVRSNMTDCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RENTALMODECDE.setValue(
        info.RENTALMODECDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.AMRTZTNMTDCDE.setValue(
        info.AMRTZTNMTDCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RVAMTTYPCDE.setValue(
        info.RVAMTTYPCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.BASERATESOURCECDE.setValue(
        info.BASERATESOURCECDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.INTERESTRENTALALLOWEDIND.setValue(
        info.INTERESTRENTALALLOWEDIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.LASTRENTALROUNDINGIND.setValue(
        info.LASTRENTALROUNDINGIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.STRUCTUREDRENTALIND.setValue(
        info.STRUCTUREDRENTALIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.OPENSTRUCTUREDIND.setValue(
        info.OPENSTRUCTUREDIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RVGSTIND.setValue(
        info.RVGSTIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RVBALNAPPCDE.setValue(
        info.RVBALNAPPCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RENTASINCOMEIND.setValue(
        info.RENTASINCOMEIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.MAXIMUMBACKDATEMM.setValue(
        info.MAXIMUMBACKDATEMM
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.CHRGAMRTZTNMTDCDE.setValue(
        info.CHRGAMRTZTNMTDCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.MINIMUMINCOMETRANSFERAMT.setValue(
        info.MINIMUMINCOMETRANSFERAMT
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.REMARKETINGBEFOREDD.setValue(
        info.REMARKETINGBEFOREDD
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.DEPERICATIONALLOWEDIND.setValue(
        info.DEPERICATIONALLOWEDIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.DEPRECIATIONMTDCDE.setValue(
        info.DEPRECIATIONMTD
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.INTRNLACCGMTDCDE.setValue(
        info.INTRNLACCGMTDCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.FINLCNFGCODE.setValue(
        info.FINLCNFGCODE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.REFERENCEID.setValue(
        info.REFERENCEID
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.FINANCETYP.setValue(
        info.FINANCETYP
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.VOLCOMMAMORTIND.setValue(
        info.VOLCOMMAMORTIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.COMMAMMORTMTDCDE.setValue(
        info.COMMAMRTMTHDCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.SBSDYAMRTZTNMTDCDE.setValue(
        info.SBSDYAMRTZTNMTDCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.SBSDYTYPCDE.setValue(
        info.SBSDYTYPCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.SUBSIDYCALCMTD.setValue(
        info.SUBSIDYCALCMTD
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.PASSSUBSIDYCUSTOMERIND.setValue(
        info.PASSSUBSIDYCUSTOMERIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.INTRTYPECDE.setValue(
        info.INTRTYPECDE
      );
      //entity.PROPOSALTEMPLATERENTALINT.TAXRVAPLCBLCDE = info.TAXRVAPLCBLCDE;
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.SDCALCCDE.setValue(
        info.SDCALCCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.SDCNFGCDE.setValue(
        info.SDCNFGCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.SDPCT.setValue(
        info.SDPCT
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RVEDITIND.setValue(
        info.RVEDITIND
      );
      //entity.PROPOSALTEMPLATERENTALINT.REGISTRATIONFINLCNFG = info.REGISTRATIONFINLCNFG;
      //entity.PROPOSALTEMPLATERENTALINT.INSURANCEFINLCNFG = info.INSURANCEFINLCNFG;
      //entity.PROPOSALTEMPLATERENTALINT.MAINTENANCEFINLCONFG = info.MAINTENANCEFINLCONFG;
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.SBSDYRECEIPTCNFGCDE.setValue(
        info.SBSDYRECEIPTCNFGCDE
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.COMMPASSTOCUSTIND.setValue(
        info.COMMPASSTOCUSTIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RNTLDUEDATECDE.setValue(
        fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.RNTLDUEDATECDE
      );
      //entity.PROPOSALTEMPLATERENTALINT.RNTLDUEDATECDE =
      //entity.PROPOSALTEMPLATERENTALINT.gr = info.GRACEPERIODALLOWED;
      // #region Admin Fee

      if (fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity != null
        && fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH != null) {
        //this.PROPOSAL_ADMIN_FEE_DETAIL.ADDITIONALADMINFEE = this.FinancialProductDetail.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.ADDITIONALADMINFEE;
        this._dataService.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBBORROWERAGE.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.BPKBBORROWERAGE);
        this._dataService.ASSETENTITY.controls.OTOPRPLASSTBPKBDETL.controls.BPKBOTHERAGE.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.BPKBOTHERAGE);
        entity.controls.PROPOSALTEMPLATERENTALINT.controls.RNTLDUEDATECDE.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.RNTLDUEDATECDE);
      }



      // if (!DataContext.PROPOSAL.FINANCETYP.Equals(FinanceType.Refinance.GetStringValue()))
      this.SetDefaultMarketCommissionSetting(fp);

      // this.UpdateAdminFeeFeilds();

      // #endregion

      // #region Provision Fee Detail

      if (fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity != null
        && fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH != null) {
        //this.PROPOSAL_PROVISION_FEE_DETAIL.MAXCOMMISSIONPERCENTAGE = this.FinancialProductDetail.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.MAXPROVISIONFEECOMMPCT;
        this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.MAXPROVISIONFEEPERCENTAGE.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.MAXPROVISIONFEEPCT);
        this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.MINPROVISIONFEEPERCENTAGE.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.MINPROVISIONFEEPCT);
      }
      this.UpdateProvisionFeeFields();
      // #endregion

      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.GPALLOWEDIND.setValue(
        info.GRACEPERIODALLOWED
      );

      if (
        entity.controls.PROPOSALTPLECOMMCONFIG.value != null &&
        entity.controls.PROPOSALTPLECOMMCONFIG.value.length > 0
      ) {
        this._FormState.ResetFormArrayState(
          entity.controls.PROPOSALTPLECOMMCONFIG,
          DataRowState.Removed
        );
        //entity.PROPOSALTPLECOMMCONFIG.RemoveAll();
      }
      if (
        entity.controls.PRPLCMPTCNFG.value != null &&
        entity.controls.PRPLCMPTCNFG.value.length > 0
      )
        this._FormState.ResetFormArrayState(
          entity.controls.PRPLCMPTCNFG,
          DataRowState.Removed
        );
      //entity.PRPLCMPTCNFG.RemoveAll();

      if (entity.controls.PRPLCMPTCNFG.value == null)
        entity.controls.PRPLCMPTCNFG =
          this._formBuilder.array<IPRPL_CMPT_CNFGInfo>([
            this._ProposalForm.PRPLCMPTCNFGForm(),
          ]); //new GenericCollection<PRPL_CMPT_CNFGInfo>();

      if (entity.controls.PROPOSALTPLECOMMCONFIG.value?.filter(p => p?.RowState != 4)?.length == 0) {
        if (entity.controls.PROPOSALTPLECOMMCONFIG?.value?.length == 0 || entity.controls.PROPOSALTPLECOMMCONFIG?.value == undefined || entity.controls.PROPOSALTPLECOMMCONFIG?.value == null)
          entity.controls.PROPOSALTPLECOMMCONFIG = this._formBuilder.array<IPRPL_TPLE_COMM_CNFGInfo>([]); //new GenericCollection<PRPL_TPLE_COMM_CNFGInfo>();
        if (
          fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLECOMMCNFG != null &&
          fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLECOMMCNFG.length > 0
        )
          fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLECOMMCNFG.forEach((item: any) => {
            let group = this._ProposalForm.PROPOSALTPLECOMMCONFIGForm();
            group.patchValue(item);
            group.controls.RowState.setValue(DataRowState.Added);
            entity.controls.PROPOSALTPLECOMMCONFIG.push(group);
          });
        // foreach (TPLE_COMM_CNFG_ATCHInfo item in RentalConfigEntity.TPLECOMMCNFG)
        //     {
        //         PRPL_TPLE_COMM_CNFGInfo prlpTplecomm = new PRPL_TPLE_COMM_CNFGInfo();
        //         prlpTplecomm.COMMAMRTMTHDCDE = item.COMMAMRTMTHDCDE;
        //         prlpTplecomm.COMMISSIONTYPECDE = item.COMMISSIONTYPECDE;
        //         prlpTplecomm.APPLIEDIND = item.APPLIEDIND;
        //         entity.PROPOSALTPLECOMMCONFIG.Add(prlpTplecomm);
        //     }
      }

      if (
        entity.controls.PROPOSALTPLEINCMCONFIG != null &&
        entity.controls.PROPOSALTPLEINCMCONFIG.length > 0
      ) {
        this._FormState.ResetFormArrayState(
          entity.controls.PROPOSALTPLEINCMCONFIG,
          DataRowState.Removed
        );
      }

      if (
        entity.controls.PROPOSALTPLEINCMCONFIG.value?.filter(p => p?.RowState != 4)?.length == 0
      ) {
        if (entity.controls.PROPOSALTPLEINCMCONFIG?.value?.length == 0 || entity.controls.PROPOSALTPLEINCMCONFIG?.value == undefined || entity.controls.PROPOSALTPLEINCMCONFIG?.value == null)
          entity.controls.PROPOSALTPLEINCMCONFIG = this._formBuilder.array<IPRPL_TPLE_INCM_CNFGInfo>([]); //new GenericCollection<PRPL_TPLE_INCM_CNFGInfo>();
        if (
          fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLEINCMCNFG != null &&
          fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLEINCMCNFG.length > 0
        )
          fp.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLEINCMCNFG.forEach((item: any) => {
            let group = this._ProposalForm.PROPOSALTPLEINCMCONFIGForm();
            group.controls.INCMAMRTMTHDCDE.setValue(item.INCMAMRTMTHDCDE);
            group.controls.INCMTYPECDE.setValue(item.INCOMETYPECDE);
            group.controls.APPLIEDIND.setValue(item.APPLIEDIND);
            //group.patchValue(item);
            entity.controls.PROPOSALTPLEINCMCONFIG.push(group);
          });
        // foreach (TPLE_INCM_CNFG_ATCHInfo item in RentalConfigEntity.TPLEINCMCNFG)
        // {
        //     PRPL_TPLE_INCM_CNFGInfo prlpTplecomm = new PRPL_TPLE_INCM_CNFGInfo();
        //     prlpTplecomm.INCMAMRTMTHDCDE = item.INCMAMRTMTHDCDE;
        //     prlpTplecomm.INCMTYPECDE = item.INCOMETYPECDE;
        //     prlpTplecomm.APPLIEDIND = item.APPLIEDIND;
        //     entity.PROPOSALTPLEINCMCONFIG.Add(prlpTplecomm);
        // }
      }
      //   if (DataContext.PROPOSAL.FINANCETYP.Equals(FinanceType.Refinance.GetStringValue()))
      //   {

      //       if (tplerntlcmptcnfg != null && tplerntlcmptcnfg.Count > 0)
      //       {
      //           if (tplerntlcmptcnfg.FindAll(p => p.AMNTCMPTCDE == AmountComponent.Maintenance.GetStringValue()).Count > 0)
      //           {
      //               SetCompnentDetail(entity, tplerntlcmptcnfg, AmountComponent.Maintenance);
      //           }
      //           if (tplerntlcmptcnfg.FindAll(p => p.AMNTCMPTCDE == AmountComponent.NextYearRegistration.GetStringValue()).Count > 0)
      //           {
      //               SetCompnentDetail(entity, tplerntlcmptcnfg, AmountComponent.NextYearRegistration);
      //           }
      //           if (tplerntlcmptcnfg.FindAll(p => p.AMNTCMPTCDE == AmountComponent.FirstYearRegistration.GetStringValue()).Count > 0)
      //           {
      //               SetCompnentDetail(entity, tplerntlcmptcnfg, AmountComponent.FirstYearRegistration);
      //           }
      //           if (tplerntlcmptcnfg.FindAll(p => p.AMNTCMPTCDE == AmountComponent.CompulsoryInsurance.GetStringValue()).Count > 0)
      //           {
      //               SetCompnentDetail(entity, tplerntlcmptcnfg, AmountComponent.CompulsoryInsurance);
      //           }
      //           if (tplerntlcmptcnfg.FindAll(p => p.AMNTCMPTCDE == AmountComponent.VoluntaryInsurance.GetStringValue()).Count > 0)
      //           {
      //               SetCompnentDetail(entity, tplerntlcmptcnfg, AmountComponent.VoluntaryInsurance);
      //           }
      //       }
      //   }
      // //else if (DataContext.PROPOSAL.FINANCETYP != FinanceType.Refinance.GetStringValue() && DataContext.PROPOSAL.FINANCETYP != FinanceType.PACMAS.GetStringValue())
      if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && !this._dataService.PROPOSAL.value.ISPACKAGE) {
        if (tplerntlcmptcnfg != null && tplerntlcmptcnfg.length > 0) {

          if (tplerntlcmptcnfg.filter(p => p.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee)).length > 0) {
            this.SetCompnentDetail(tplerntlcmptcnfg, AmountComponent.GetStringValue(AmountComponent.FiduciaFee));
          }
          //if (tplerntlcmptcnfg.FindAll(p => p.AMNTCMPTCDE == AmountComponent.ProvisionFee.GetStringValue()).Count > 0)
          //{
          //    SetCompnentDetail(entity, tplerntlcmptcnfg, AmountComponent.ProvisionFee);
          //}
          if (tplerntlcmptcnfg.filter(p => p.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee)).length > 0) {
            this.SetCompnentDetail(tplerntlcmptcnfg, AmountComponent.GetStringValue(AmountComponent.PolicyFee));
          }

        }

        this.FirstPaymentConfig();
      }

      entity.controls.PROPOSALTEMPLATERENTALINT.controls.MINMNTHBFRRSTCT.setValue(
        info.MINMNTHBFRRSTCT
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.CUSHNDAYS.setValue(
        info.CUSHNDAYS
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.RNTLFULYPAID.setValue(
        info.RNTLFULYPAID
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.ALLOWOVERRIDEIND.setValue(
        info.ALLOWOVERRIDEIND
      );
      entity.controls.PROPOSALTEMPLATERENTALINT.controls.REVISIONMONTHCDE.setValue(
        info.REVISIONMONTHCDE
      );
      //ALLOWOVERRIDEIND = true;
      //entity.PROPOSALTEMPLATERENTALINT.FRSTRNTLDEDCTNIND = info.FRSTRNTLDEDCTNIND;
      //entity.PROPOSALTEMPLATERENTALINT.NOOFRNTLDEDCTN = info.NOOFRNTLDEDCTN;
      //SecurityDepositCalcMethod = string.Empty;
      //SecurityDepositConfigMethod = string.Empty;

      // if (DataContext != null && DataContext.PROPOSALCHART != null && DataContext.PROPOSALCHART.Count() > 0)
      // {
      //     foreach (var item in DataContext.PROPOSALCHART.OriginalDataSource)
      //     {
      //         if (item.MODELTYPE != RuleModelType.CommissionChart.GetStringValue())
      //             DataContext.PROPOSALCHART.Remove(item);
      //     }
      // }

      // return entity.PROPOSALTEMPLATERENTALINT;

      this._dataService.PROPOSALCOMMISSIONENTITY.controls[this._dataService.PROPOSALCOMMISSIONENTITY.value.length - 1].controls.PRPLCOMM.controls.UNALLOCATEDEXPENSEPCT.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.OJKCOMMTODEALER);
      this._dataService.PROPOSALCOMMISSIONENTITY.controls[this._dataService.PROPOSALCOMMISSIONENTITY.value.length - 1].controls.PRPLCOMM.controls.OJKMAXCOMMISSIONPCTATFC.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.MAXCOMMPCT);
      this._dataService.ASSETENTITY.controls.PROPOSALSOFCOMMISSIONDETAIL.controls.OJKCOMMVALIDATION.setValue(fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.TPLEPERDCNFGATCH.OJKCOMMVALIDATION);
    }
  }
  public UpdateProvisionFeeFields() {
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
      let _taxinclusiveamt = 0;
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(p => {
        if (p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed)
          _taxinclusiveamt = p.value.TAXINCULSIVEAMT;
      });
      //this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE = this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT + this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED;
      //upfront Provision fee
      this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.setValue((_taxinclusiveamt > 0 ? _taxinclusiveamt : this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value) - this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.value);
      //total Provision feev at asset scree
      this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.PROVISIONFEE.setValue(this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.TOTALPROVISIONFEE.value);

      this.RemoveArticleComponent(AmountComponent.FinancedProvisionFee);
      this.UpdateFinancialAgreementDetail(this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEFINANCED.value, AmountComponent.FinancedProvisionFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Finance, null, 0, null, false);
      this.RemoveArticleComponent(AmountComponent.UpfrontProvisionFee);
      if (this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls != null && this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.RECEIVEDBYDEALERIND.value) {
        this.UpdateFinancialAgreementDetail(this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value, AmountComponent.UpfrontProvisionFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Receivable, true);

        this.UpdateFinancialAgreementDetail(this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value, AmountComponent.UpfrontProvisionFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Nettingoff, true);
      }
      else {
        this.UpdateFinancialAgreementDetail(this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEEUPFRONT.value, AmountComponent.UpfrontProvisionFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPCOMPANYID, 0, AmountClassification.Receivable, false);
      }
      //await this.ReCalculateOJKCommission(AmountComponent.ProvisionFee, CommissionType.ProvisionFeeCommission);
    }
    //this.calculateMaxSOFCommission();
    return true;
  }
  public ApplyAssetConfigurations(
    updateInterestRateandRV: boolean = true,
    p_proposalarticle: FormGroup<IProposalArticleEntity>,
    skipRV: boolean = false
  ) {
    let fpGroupId: number = this._dataService.PROPOSAL.controls.FPGROUPID.value;
    let fpID: number =
      this._dataService.PROPOSAL.controls.FINANCIALPRODUCTID.value;
    let interestChartfilled: boolean = false;
    let subsidyChartfilled: boolean = false;
    let commissionChartfilled: boolean = false;
    let residualChartfilled: boolean = false;

    try {
      let valiedAssetExists: boolean = false;
      if (
        this._dataService.PROPOSALARTICLE.controls.filter(
          (k) =>
            k.controls.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETTYPECDE
              .value != null && k.controls.ASSETENTITY.controls.PROPOSALASSET.controls.ASSETTYPECDE
                .value != ""
        ).length > 0
      )
        valiedAssetExists = true;

      if (
        this._dataService.PROPOSALARTICLE.value != null &&
        this._dataService.PROPOSALARTICLE.value.length > 0 &&
        valiedAssetExists
      ) {
        // if (delstartspinner != null)
        //     delstartspinner();

        // isChartCall = true;

        //this.ResetAssetDefaultValues(p_proposalarticle, updateInterestRateandRV,  skipRV );

        //#region Product

        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FPGROUPID.setValue(
          fpGroupId
        ); //this.DataContext.PROPOSAL.FPGROUPID;
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FINANCIALPRODUCTID.setValue(
          fpID
        ); // this.DataContext.PROPOSAL.FINANCIALPRODUCTID;
        this._dataService.PROPOSAL.controls.CNFGTPLEID.setValue(
          this.PROPOSALTEMPLATERENTALINT.TPLERNTLINTRSEQID
        ); // CONFIGURATIONTEMPLATEID;
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.STRUCTUREDRENTALIND.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.STRUCTUREDRENTALIND
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.STRUCTUREDRENTALIND;
        //p_proposalarticle.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ISSTRUCTUREDRENTAL = RentalConfiguraitonTemplate.TPLERNTLINTR.STRUCTUREDRENTALIND;
        //p_proposalarticle.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.STRUCTUREDTYP = RentalConfiguraitonTemplate.TPLERNTLINTR.STRUCTUREDRENTALIND;
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FINANCETYP.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.FINANCETYP
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.FINANCETYP;   //TODO: Need Discussion
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALTYP.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.RVBALNAPPCDE
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.RVBALNAPPCDE;
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RVAMTTYPCDE.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.RVAMTTYPCDE
        );
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.SUBSIDYTOCUSTOMERIND.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.PASSSUBSIDYCUSTOMERIND
        );
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RVEDITIND.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.RVEDITIND
        );
        //**
        //p_proposalarticle.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.SECURITYDEPOSITPCT = this.DataContext.PROPOSALTEMPLATERENTALINT.SDPCT;//RentalConfiguraitonTemplate.TPLERNTLINTR.SDPCT;
        //p_proposalarticle.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.SDCALCCDE = this.DataContext.PROPOSALTEMPLATERENTALINT.SDCALCCDE; //RentalConfiguraitonTemplate.TPLERNTLINTR.SDCALCCDE;
        //p_proposalarticle.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.SDCNFGCDE = this.DataContext.PROPOSALTEMPLATERENTALINT.SDCNFGCDE; //RentalConfiguraitonTemplate.TPLERNTLINTR.SDCNFGCDE;
        //**

        //p_asset.PROPOSALFINANCIALAGREEMENT.LASTRENTALROUNDINGIND = FPConfiguraitonTemplate.CNFGTPLE.LASTRENTALROUNDINGIND;
        //p_asset.PROPOSALFINANCIALAGREEMENT.RVGSTIND = FPConfiguraitonTemplate.CNFGTPLE.RVGSTIND;
        //= FPConfiguraitonTemplate.AttachedRentalConfigEntity.TPLERNTLINTR.INTRTYPECDE;
        //p_asset.FINANCIALAGREEMENT.RESIDUALAMT= p_asset.FINANCIALAGREEMENT.RESIDUALAMT;

        // #endregion

        // #region Amortization Methods

        // For Every Change it will be saparate
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMORTIZATIONMTD.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.CHRGAMRTZTNMTDCDE
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.CHRGAMRTZTNMTDCDE;
        //TODO Missing in CNFGTPLE: p_asset.PROPOSALFINANCIALAGREEMENT.COMMISSIONAMORTIZATIONMTD = FPConfiguraitonTemplate.CNFGTPLE.COMMISSIONAMORTIZATIONMTD;
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONAMORTIZATIONMTD.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.COMMAMMORTMTDCDE
        );
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.SUBSIDYAMORTIZATIONMTD.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.SBSDYAMRTZTNMTDCDE
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.SBSDYAMRTZTNMTDCDE;
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.AMORTIZATIONMTD.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.AMRTZTNMTDCDE
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.AMRTZTNMTDCDE;

        // #endregion

        // #region Rental Calculation

        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.RNTLCALCLTNMTDCDE
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.RNTLCALCLTNMTDCDE;
        ///boooll p_asset.PROPOSALFINANCIALAGREEMENT.STRUCTUREDTYP = FPConfiguraitonTemplate.AttachedRentalConfigEntity.TPLERNTLINTR.STRUCTUREDRENTALIND;

        // #region Interest Calculations

        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FIXVARIABLETYP.setValue(
          this._dataService.ProposalEntity.value.PROPOSALTEMPLATERENTALINT.FIXVRBLETYPCDE
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.FIXVRBLETYPCDE;
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.PERIODICINTERESTRTEBASIS.setValue(
          this._dataService.PROPOSALTEMPLATERENTALINT.value.PRODRATECNVRSNMTDCDE
        ); //RentalConfiguraitonTemplate.TPLERNTLINTR.PRODRATECNVRSNMTDCDE;

        // ChartsManager chartmanager = new ChartsManager(UserObject);
        // CalculationManager calcManager = new CalculationManager(UserObject);
        // GenericCollection<ProposalArticleEntity> ArticleColl = new GenericCollection<ProposalArticleEntity>();
        // ArticleColl.Add(this.DataContext.PROPOSALARTICLE[this.Helper.AssetIndex]);
        let ChartCode: string = '';
        if (
          !this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT
            .controls.INTERESTOVERRIDEIND.value
        ) {
          if (!interestChartfilled && updateInterestRateandRV) {

            if (this._dataService.ProposalEntity.controls.PROPOSALCHART.controls.filter(p => p.controls.MODELTYPE.value == RuleModelType.InterestRatechart).length == 0) {
              let chartInfo: any;
              if (this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity != null && this.financialProdEntity.AttachedTemplateEntity != null && this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity != null && this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLECHRT != null)
                chartInfo = this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLECHRT.filter(p => p.MODELTYPECDE == RuleModelType.InterestRatechart)[0];
              if (chartInfo != null) {
                if (this._dataService.ProposalEntity.controls.PROPOSALCHART.controls.filter(p => p.controls.MODELTYPE == chartInfo.MODELTYPECDE).length == 0) {
                  let tempChartInfo = {} as IPRPL_CHRTInfo;
                  tempChartInfo.ASSETID = p_proposalarticle.controls.PROPOSALARTICLE.value.ASSETID;
                  tempChartInfo.CHARTCDE = chartInfo.CHARTCDE;
                  tempChartInfo.MODELTYPE = chartInfo.MODELTYPECDE;
                  tempChartInfo.PROPOSALID = p_proposalarticle.controls.PROPOSALARTICLE.value.PROPOSALID;
                  tempChartInfo.CHARTNME = "";
                  let isExist = this._dataService.ProposalEntity.controls?.PROPOSALCHART.controls?.filter(x => x.controls.CHARTCDE.value == tempChartInfo.CHARTCDE);
                  if (isExist.length > 0) {
                    isExist[0].patchValue(tempChartInfo);
                  }
                  else {
                    tempChartInfo.RowState = DataRowState.Added;
                    this._dataService.ProposalEntity.controls.PROPOSALCHART.push(this._formBuilder.group<IPRPL_CHRTInfo>(tempChartInfo));
                  }
                  this._dataService.ProposalEntity.controls.PROPOSALCHART.value.push(tempChartInfo);
                }
              }
            }

            if (this._dataService.ProposalEntity.controls.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.InterestRatechart).length > 0) {
              ChartCode = this._dataService.ProposalEntity.controls.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.InterestRatechart)[0].CHARTCDE;
              let baserateType = this.GetBaseRateType(
                this.PROPOSALTEMPLATERENTALINT.INTRTYPECDE,
                this.PROPOSALTEMPLATERENTALINT.RNTLCALCLTNMTDCDE
              );
              let param = {} as IChartInfoPOSParm;
              param.ChartCode = ChartCode; //"67004";
              param.ChartType = ChartType.InterestRateChart;
              param.ProposalArticle = this._dataService.PROPOSALARTICLE
                .value as Array<IProposalArticleEntity>;
              param.FinancialProductID =
                this._dataService.PROPOSAL.value.FINANCIALPRODUCTID;
              param.BaseRateTypeCode = this.GetBaseRateType(
                this._dataService.PROPOSALTEMPLATERENTALINT.value.INTRTYPECDE,
                this._dataService.PROPOSALTEMPLATERENTALINT.value
                  .RNTLCALCLTNMTDCDE
              );
              param.ProposalCurrencyCode = '00001';
              param.IntroducerID =
                this._dataService.PROPOSAL.controls.BPINTRODUCERID.value;
              param.ProposalStartDate =
                this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value;
              param.ProposalRentalTemplate = this._dataService
                .PROPOSALTEMPLATERENTALINT.value as IPRPL_TPLE_RNTL_INTInfo;

              this._proposalService
                .UpdateChartConfiguration(param)
                .subscribe((result) => {
                  let result55 = result?.ResultSet?.ASSETENTITY; //update chart configuration result will be assing later
                  if (result55 != null) {
                    for (
                      let i = 0;
                      i < this._dataService.PROPOSALARTICLE.length;
                      i++
                    ) {
                      let chartrow =
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.controls.filter(
                          (p) =>
                            p.controls.MODELTYPECDE.value ==
                            BusinessRuleModelCode.InterestChartsModel
                        )[0] as FormGroup<IPRPL_ARTE_CHRT_DETLInfo>;
                      if (chartrow != null) {
                        let interestChart = p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.value;
                        interestChart.forEach((item, i) => {
                          if (item.MODELTYPECDE == BusinessRuleModelCode.InterestChartsModel && item.RowState != DataRowState.Removed) {
                            let index = p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.value.indexOf(item);
                            if (item.RowState == DataRowState.Added)
                              p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.removeAt(index);
                            else
                              p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.controls[index].controls.RowState.setValue(DataRowState.Removed);
                          }
                        })
                      }
                      let chartrow1 = result55.PROPOSALARTICLECHARTDETL.filter(
                        (p: any) =>
                          p.MODELTYPECDE ==
                          BusinessRuleModelCode.InterestChartsModel
                      )[0];
                      if (chartrow1 != undefined && chartrow1 != null)
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.push(this._proposalentitymapper.PROPOSALARTICLECHARTDETLMapper(this._ProposalForm.PROPOSALARTICLECHARTDETLForm(), chartrow1));
                      if (
                        result55.PROPOSALFINANCIALAGREEMENT.INTERESTCHARTNME !=
                        null
                      )
                        this._dataService.ProposalEntity.controls.PROPOSALCHART.controls
                          .filter(
                            (p) =>
                              p.controls.MODELTYPE.value ==
                              RuleModelType.InterestRatechart
                          )[0]
                          ?.controls.CHARTNME.setValue(
                            result55.PROPOSALFINANCIALAGREEMENT.INTERESTCHARTNME
                          );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.MINCUSTOMERRTE.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.MINCUSTOMERRTE
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.BASERATETYPCDE.setValue(
                        baserateType
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.MAXCUSTOMERRTE.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.MAXCUSTOMERRTE
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FINANCIERMARGINRTE.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.FINANCIERMARGINRTE
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FINANCIERMARGINPCT.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.FINANCIERMARGINPCT
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.CUSTOMERMARGINRTE.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.CUSTOMERMARGINRTE
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.MARGINTYPCDE.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.MARGINTYPCDE
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.CUSTOMERMARGINPCT.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.CUSTOMERMARGINPCT
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.BASERTE.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.BASERTE
                      );
                      p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.INTERESTRTE.setValue(
                        result55.PROPOSALFINANCIALAGREEMENT.INTERESTRTE
                      );
                      let DefaultInterestRate =
                        p_proposalarticle.controls.ASSETENTITY.controls
                          .PROPOSALFINANCIALAGREEMENT.controls.INTERESTRTE.value;
                      let isChartCall = true;
                      if (this._proposalManagerService.isCalcButtonEnabled) {
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(
                          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.INTERESTRTE.value
                        );
                      }

                      if (
                        p_proposalarticle.controls.ASSETENTITY.controls
                          .PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD
                          .value == RentalCalculationMethod.EqualPrincipalFlat ||
                        p_proposalarticle.controls.ASSETENTITY.controls
                          .PROPOSALFINANCIALAGREEMENT.controls.RENTALCALCMTD
                          .value == RentalCalculationMethod.Flat
                      ) {
                        this._proposalManagerService.isFlatAppliedCustomerSet = true;
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTECALCULATED.setValue(p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.INTERESTRTE.value);
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(0);
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FINANCERRTEFLAT.setValue(result55.PROPOSALFINANCIALAGREEMENT.FINANCERRTEEFFECTIVE.toFixed(5));
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.FINANCERRTEEFFECTIVE.setValue(0);
                        this._proposalManagerService.isFlatAppliedCustomerSet = false;
                      } else {
                        if (this._proposalManagerService.isCalcButtonEnabled) {
                          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.setValue(p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.INTERESTRTE.value);
                        }
                        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls?.FINANCERRTEEFFECTIVE?.setValue(result55.PROPOSALFINANCIALAGREEMENT.FINANCERRTEEFFECTIVE);
                      }
                    }
                    interestChartfilled = true;
                    //Update base rate chart
                    if (result55.PROPOSALARTICLEBASERATE != null && result55.PROPOSALARTICLEBASERATE.length > 0) {
                      this._FormState.ResetFormArrayState(this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE, DataRowState.Removed);
                      this._proposalentitymapper.PROPOSALARTICLEBASERATEMapper(this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE,
                        result55.PROPOSALARTICLEBASERATE as Array<IPRPL_ARTE_BASE_RATEInfo>
                      );

                      const pristineIndex = this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE?.controls?.findIndex(e => e.value.RowState === DataRowState.Pristine);
                      if (pristineIndex >= 0 && this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE?.controls[pristineIndex].value.APPLIEDCUSTOMERRTE !== this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.value)
                      {
                        this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE?.controls[pristineIndex].patchValue(
                          {
                            RowState: DataRowState.Updated,
                          }
                        );
                      }

                      this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls.forEach(p => {
                        p.controls.APPLIEDCUSTOMERRTE.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTE);
                        p.controls.INTERESTRTE.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.APPLIEDCUSTOMERRTE);
                      });
                    }
                  }
                });
            }
          }
        }

        if (
          p_proposalarticle.controls.ASSETENTITY.controls
            .PROPOSALARTICLEBASERATE.value != null &&
          p_proposalarticle.controls.ASSETENTITY.controls
            .PROPOSALARTICLEBASERATE.controls.length > 0
        ) {
          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[0]?.controls?.MARGINTYP.setValue(
            p_proposalarticle.controls.ASSETENTITY.controls
              .PROPOSALFINANCIALAGREEMENT.controls.MARGINTYPCDE.value
          );
          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[0].controls.OVERDUEINTERESTRTE.setValue(
            p_proposalarticle.controls.ASSETENTITY.controls
              .PROPOSALFINANCIALAGREEMENT.controls.OVERDUEINTERESTRTE.value
          );
          //this required for calculation on default rate
          const pristineIndex = this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE?.controls?.findIndex(e => e.value.RowState === DataRowState.Pristine);
          if (pristineIndex >= 0 && this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE?.controls[pristineIndex].value.APPLIEDCUSTOMERRTE !== this._dataService.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.value)
          {
            this._dataService.ASSETENTITY.controls.PROPOSALARTICLEBASERATE?.controls[pristineIndex].patchValue(
              {
                RowState: DataRowState.Updated,
              }
            );
          }
          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLEBASERATE.controls[0].controls.APPLIEDCUSTOMERRTE.setValue(
            p_proposalarticle.controls.ASSETENTITY.controls
              .PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.value
          );
        }

        //#region Residual Value Calculation
        if (!residualChartfilled && updateInterestRateandRV) {
          if (this._dataService.PROPOSALTEMPLATERENTALINT.controls.RVBALNAPPCDE.value != RVBalloonType.None) {

            let chartInfo: any;
            if (this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity != null && this.financialProdEntity.AttachedTemplateEntity != null && this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity != null && this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLECHRT != null)
              chartInfo = this.financialProdEntity.AttachedTemplateEntity.AttachedRentalConfigEntity.TPLECHRT.filter((p: any) => p.MODELTYPECDE == RuleModelType.ResidualChart)[0];
            if (chartInfo != null) {
              let tempChartInfo = {} as IPRPL_CHRTInfo;
              tempChartInfo.ASSETID = p_proposalarticle.controls.PROPOSALARTICLE.value.ASSETID;
              tempChartInfo.CHARTCDE = chartInfo.CHARTCDE;
              tempChartInfo.CHARTNME = "";
              tempChartInfo.MODELTYPE = RuleModelType.ResidualChart//chartInfo.MODELTYPECDE;
              tempChartInfo.PROPOSALID = p_proposalarticle.controls.PROPOSALARTICLE.value.PROPOSALID;
              //tempChartInfo.CHARTNME = "";
              this._dataService.ProposalEntity.controls.PROPOSALCHART.controls.forEach((ctrl, index) => {
                if (ctrl.controls.CHARTCDE.value == "E753D") {
                  if (ctrl.value.RowState != DataRowState.Added)
                    ctrl.controls.RowState.setValue(DataRowState.Removed)
                  else
                    this._dataService.ProposalEntity.controls.PROPOSALCHART.removeAt(index);
                }

              })
              tempChartInfo.RowState = DataRowState.Added;
              this._dataService.ProposalEntity.controls.PROPOSALCHART.push(this._formBuilder.group(tempChartInfo));
            }
            let param = {} as IChartInfoPOSParm;
            param.ChartCode = chartInfo.CHARTCDE; //"E753D";
            param.ChartType = ChartType.ResidualChart;
            param.ProposalArticle = this._dataService.PROPOSALARTICLE
              .value as Array<IProposalArticleEntity>;
            param.FinancialProductID =
              this._dataService.PROPOSAL.value.FINANCIALPRODUCTID;

            param.BaseRateTypeCode = this.GetBaseRateType(
              this._dataService.PROPOSALTEMPLATERENTALINT.value.INTRTYPECDE,
              this._dataService.PROPOSALTEMPLATERENTALINT.value
                .RNTLCALCLTNMTDCDE
            );
            param.ProposalCurrencyCode = '00001';
            param.IntroducerID =
              this._dataService.PROPOSAL.controls.BPINTRODUCERID.value;

            param.ProposalStartDate =
              this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value;
            param.ProposalRentalTemplate = this._dataService.PROPOSALTEMPLATERENTALINT.value as IPRPL_TPLE_RNTL_INTInfo;

            this._proposalService.UpdateChartConfiguration(param).subscribe(result => {
              let result23 = result?.ResultSet;
              if (result23 != null && result23 != undefined && p_proposalarticle != undefined) {
                {
                  let chartrow = p_proposalarticle?.controls?.ASSETENTITY?.controls?.PROPOSALARTICLECHARTDETL?.controls?.filter(p => p?.controls?.MODELTYPECDE.value == BusinessRuleModelCode.ResidualChartModel && p?.controls?.RowState.value != DataRowState.Removed)[0] as FormGroup<IPRPL_ARTE_CHRT_DETLInfo>;
                  if (chartrow != null) {
                    let arr = p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.value;
                    arr.forEach((item, i) => {
                      if (item.MODELTYPECDE == BusinessRuleModelCode.ResidualChartModel && item.RowState != DataRowState.Removed) {
                        let index = p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.value.indexOf(item);
                        if (item.RowState == DataRowState.Added)
                          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.removeAt(index);
                        else
                          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.controls[index].controls.RowState.setValue(DataRowState.Removed);
                      }
                    })

                  }
                  let chartrow1 = result23.ASSETENTITY.PROPOSALARTICLECHARTDETL.filter((p: any) => p.MODELTYPECDE == BusinessRuleModelCode.ResidualChartModel)[0] as IPRPL_ARTE_CHRT_DETLInfo;
                  if (chartrow1 != null) {
                    // const index: number =
                    //   p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.value.indexOf(chartrow1);

                    // if (chartrow?.controls.RowState.value == DataRowState.Added)
                    //   p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.removeAt(index);
                    // else
                    //   p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.controls[index]?.controls.RowState.setValue(DataRowState.Removed);

                    let group: FormGroup<IPRPL_ARTE_CHRT_DETLInfo> = this._ProposalForm.PROPOSALARTICLECHARTDETLForm();
                    group.patchValue(chartrow1)
                    p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.push(group);
                  }
                  if (result23?.ASSETENTITY?.PROPOSALFINANCIALAGREEMENT?.RESIDUALCHARTNME != null)
                    this._dataService.ProposalEntity.controls.PROPOSALCHART.controls.filter(p => p.controls.MODELTYPE.value == ChartType.ResidualChart)[0]?.controls.CHARTNME.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALCHARTNME);
                  this.Configurations.controls.RESIDUALAMT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALAMT);
                  this.Configurations.controls.RESIDUALPCT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALPCT);
                  this.Configurations.controls.RVINPUTCDE.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RVINPUTCDE);
                  this.Configurations.controls.MINRESIDUALPCT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.MINRESIDUALPCT);
                  this.Configurations.controls.MAXRESIDUALPCT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.MAXRESIDUALPCT);
                  p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALAMT);
                  p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RESIDUALPCT);
                  p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.RVINPUTCDE.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.RVINPUTCDE);

                  p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.MINRESIDUALPCT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.MINRESIDUALPCT);
                  p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALFINANCIALAGREEMENT.controls.MAXRESIDUALPCT.setValue(result23.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.MAXRESIDUALPCT);

                  if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALCOST.value > 0) {
                    if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.value > 0 && this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.value < this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALCOST.value) {
                      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.value);
                    }
                    else {
                      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.setValue(0);
                    }

                    if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.value > 0)
                      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.value);
                    else
                      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(0);

                    if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.value > 0)
                      this.CalculateResidualValue(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Percentage);
                    else
                      this.CalculateResidualValue(this._dataService.PROPOSALFINANCIALAGREEMENT, CalculateRVBasedOn.Fixed);
                  }
                  else {
                    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.setValue(0, { emitEvent: false, onlySelf: true });
                    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALPCT.setValue(0, { emitEvent: false, onlySelf: true });
                  }

                }
                residualChartfilled = true;
              }
            });

            //}
          }
        }
        // RVAvailable = true;
      }
    } catch (Exception) { }
    return true;
  }

  CalculateOJKTotalIncome() {
    let TotalOJKIncome = 0;
    if (this._proposalManagerService.OJKTotalIncomeComponents.controls.length > 0) {
      TotalOJKIncome = 0;
      this._proposalManagerService.OJKTotalIncomeComponents.controls.forEach(x => {
        TotalOJKIncome += x.controls.TAXEXCULSIVEAMT.value;
      })
    }
    if (this._dataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.OperatingLease) {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKTOTALCALCULATEDINCOME.setValue(Number(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALINTERESTAMT.value?.toFixed(2)));
    }
    else {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKTOTALCALCULATEDINCOME.setValue(Number(TotalOJKIncome) + Number(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALINTERESTAMT.value.toFixed(2)))
    }
  }
  public CalculateResidualValue(item: FormGroup<IPRPL_FINL_AGRMInfo>, calculationbasedon: CalculateRVBasedOn) {
    if (item.controls.RESIDUALAMT.value >= item.controls.ASSETAMT.value) {
      item.controls.RESIDUALPCT.setValue(0);
      item.controls.RESIDUALAMT.setValue(0);
      if (item.controls.ASSETAMT.value != 0) {
        this._msgService.showMesssage("ResBalValueLessAsstCst", MessageType.Info)
      }

    }
    if (calculationbasedon == CalculateRVBasedOn.Percentage) {
      if (item.controls.RESIDUALPCT.value > 100) {
        item.controls.RESIDUALPCT.setValue(0);
        item.controls.RESIDUALAMT.setValue(0);
        return;
      }
      let tot: number = item.controls.ASSETAMT.value * item.controls.RESIDUALPCT.value;
      let rvamt = tot > 0 ? tot / 100 : 0;
      item.controls.RESIDUALAMT.setValue(rvamt, { emitEvent: false, onlySelf: true });
      //Commented by Ahmad / Gulzaib against fault ID = 4192
      //if (item.RESIDUALAMT == 0)
      //    item.RESIDUALPCT = 0;
    }

    else {

      let percent: number = 0;
      if (item.controls.RESIDUALAMT.value > 0 && item.controls.ASSETAMT.value > 0)
        percent = (item.controls.RESIDUALAMT.value / item.controls.ASSETAMT.value) * 100;
      if (percent > 100) {
        item.controls.RESIDUALAMT.setValue(0);
        item.controls.RESIDUALPCT.setValue(0);
      }
      else
        item.controls.RESIDUALPCT.setValue(percent, { emitEvent: false, onlySelf: true });
    }
    // ResidualAmt = 0;
    // ResidualPerc = 0;

    this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.RESIDUALAMT.value, AmountComponent.ResidualValue, this._dataService.PROPOSAL.value.CURRENCYCDE);
  }

  public CalculateDownPayment(item: FormGroup<IPRPL_FINL_AGRMInfo>, calculationbasedon: CalculateRVBasedOn) {
    if (calculationbasedon == CalculateRVBasedOn.Percentage) {
      if (item.controls.CASHDEPOSITPCT.value > 100) {
        item.controls.CASHDEPOSITPCT.setValue(0);
        item.controls.CASHDEPOSITAMT.setValue(0);
        this._msgService.showMesssage("DnPayLesAsetCost", MessageType.Warning);
        return;
      }
      let tot: number = item.controls.ASSETAMT.value * item.controls.CASHDEPOSITPCT.value;
      let rvamt = tot > 0 ? tot / 100 : 0;
      item.controls.CASHDEPOSITAMT.setValue(+rvamt.toFixed(2));
    }

    else {
      let percent: number = 0;
      if (item.controls.CASHDEPOSITAMT.value > 0 && item.controls.ASSETAMT.value > 0)
        percent = (item.controls.CASHDEPOSITAMT.value / item.controls.ASSETAMT.value) * 100;
      if (percent > 100) {
        item.controls.CASHDEPOSITAMT.setValue(0);
        item.controls.CASHDEPOSITPCT.setValue(0);
        this._msgService.showMesssage("DnPayLesAsetCost", MessageType.Warning);
      }
      else
        item.controls.CASHDEPOSITPCT.setValue(+percent.toFixed(2));
    }
  }

  public CalculateDownPaymentRF(item: FormGroup<IPRPL_FINL_AGRMInfo>, calculationbasedon: CalculateRVBasedOn) {
    if (calculationbasedon == CalculateRVBasedOn.Percentage) {
      if (item.controls.DSCTAMNTPCTOTO.value > 100) {
        item.controls.DSCTAMNTPCTOTO.setValue(0);
        item.controls.DSCTAMNTOTO.setValue(0);
        this._msgService.showMesssage("DnPayLesAsetCost", MessageType.Warning);
        return;
      }
      let tot: number = item.controls.ASSETAMT.value * item.controls.DSCTAMNTPCTOTO.value;
      let rvamt = tot > 0 ? tot / 100 : 0;
      item.controls.DSCTAMNTOTO.setValue(+rvamt.toFixed(2));
    }

    else {
      let percent: number = 0;
      if (item.controls.DSCTAMNTOTO.value > 0 && item.controls.ASSETAMT.value > 0)
        percent = (item.controls.DSCTAMNTOTO.value / item.controls.ASSETAMT.value) * 100;
      if (percent > 100) {
        item.controls.DSCTAMNTOTO.setValue(0);
        item.controls.DSCTAMNTPCTOTO.setValue(0);
        this._msgService.showMesssage("DnPayLesAsetCost", MessageType.Warning);
      }
      else
        item.controls.DSCTAMNTPCTOTO.setValue(+percent.toFixed(2));
    }
  }

  public FillArticleTranTax2(AmountComponentCode: AmountComponent, VATAmount: any) {
    //GenericCollection<PRPL_ARTE_AMNT_TRAN_TAXInfo> coll = new GenericCollection<PRPL_ARTE_AMNT_TRAN_TAXInfo>();
    //let taxVAT = {} as IPRPL_ARTE_AMNT_TRAN_TAXInfo;
    let taxVAT = this._ProposalForm.PRPLARTEAMNTTRANTAXForm();
    taxVAT.controls.AMNTCMPTCDE.setValue(AmountComponent.GetStringValue(AmountComponentCode));
    taxVAT.controls.TAXAMT.setValue(VATAmount);
    taxVAT.controls.TAXTYPE.setValue(TaxType.GetDescriptionStringValue(TaxType.VAT_GST));
    taxVAT.controls.TAXTYPECDE.setValue(TaxType.GetStringValue(TaxType.VAT_GST));

    let tax = {} as ITAXParam;
    tax.FinCode = this._dataService.PROPOSAL.value.FINANCETYP;
    tax.AmountComponentCode = PayableTypeCode.GetStringValue(PayableTypeCode.AccessoryInvoice);
    tax.TaxTypeCode = TaxType.GetStringValue(TaxType.VAT_GST);

    if (AmountComponentCode == AmountComponent.AccessoriesCost) {
      this._proposalService.ReadTaxChargePayableITCCompAss(tax).subscribe(result => {
        if (result != null && result.ResultSet != null && result.ResultSet.length > 0) {
          if (result.ResultSet[0].ITCIND == true) {
            taxVAT.controls.ITCPERCENTAGE.setValue(100);
            taxVAT.controls.ITCAMT.setValue(VATAmount);

            this._dataService.PROPOSALARTICLE.controls[this._dataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(x => {
              if (x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponentCode)) {
                if (x.controls.PRPLARTEAMNTTRANTAX.value.length > 0)
                  this._FormState.ResetFormArrayState(x.controls.PRPLARTEAMNTTRANTAX, DataRowState.Removed); //x.PRPLARTEAMNTTRANTAX.RemoveAll();
                x.controls.PRPLARTEAMNTTRANTAX.push(taxVAT); //Add(taxVAT);
              }
            });
          }
          this.CalculateNetFinanceAmt();
        }
      });
      // Task<ResponseObject<GenericCollection<TAX_PBLE_ASSN_DETLInfo>>> task = ReadTaxChargePayableITCCompAss(UserObject, DataContext.PROPOSAL.FINANCETYP, PayableTypeCode.AccessoryInvoice.GetStringValue(), TaxType.VAT_GST.GetStringValue());
      // ResponseObject<GenericCollection<TAX_PBLE_ASSN_DETLInfo>> result = await task;
      // task.Dispose();
      // if (result != null && result.ResultSet != null && result.ResultSet.Count > 0)
      // {
      //     if (result.ResultSet[0].ITCIND == true)
      //     {
      //         taxVAT.ITCPERCENTAGE = 100;
      //         taxVAT.ITCAMT = VATAmount;

      //     }
      // }

    }

    else if (AmountComponentCode == AmountComponent.AssetCost) {
      let tax = {} as ITAXParam;
      tax.FinCode = this._dataService.PROPOSAL.value.FINANCETYP;
      tax.AmountComponentCode = PayableTypeCode.GetStringValue(PayableTypeCode.AccessoryInvoice);
      tax.TaxTypeCode = TaxType.GetStringValue(TaxType.VAT_GST);

      this._proposalService.ReadTaxChargePayableITCCompAss(tax).subscribe(result => {
        if (result != null && result.ResultSet != null && result.ResultSet.length > 0) {
          if (result.ResultSet[0].ITCIND == true) {
            taxVAT.controls.ITCPERCENTAGE.setValue(100);
            taxVAT.controls.ITCAMT.setValue(VATAmount);
            //taxVAT.RowState = DataRowState.Added;

            this._dataService.PROPOSALARTICLE.controls[this._dataService.PROPOSALARTICLE.value.length - 1].controls.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(x => {
              if (x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponentCode)) {
                if (x.controls.PRPLARTEAMNTTRANTAX.value.length > 0)
                  this._FormState.ResetFormArrayState(x.controls.PRPLARTEAMNTTRANTAX, DataRowState.Removed); //x.PRPLARTEAMNTTRANTAX.RemoveAll();
                x.controls.PRPLARTEAMNTTRANTAX.push(taxVAT); //Add(taxVAT);
              }
            });
          }
          this.CalculateNetFinanceAmt();
        }
      });

      // Task<ResponseObject<GenericCollection<TAX_PBLE_ASSN_DETLInfo>>> task = ReadTaxChargePayableITCCompAss(UserObject, DataContext.PROPOSAL.FINANCETYP, PayableTypeCode.AssetCost.GetStringValue(), TaxType.VAT_GST.GetStringValue());
      // ResponseObject<GenericCollection<TAX_PBLE_ASSN_DETLInfo>> result = await task;
      // task.Dispose();
      // if (result != null && result.ResultSet != null && result.ResultSet.Count > 0)
      // {
      //     if (result.ResultSet[0].ITCIND == true)
      //     {
      //         taxVAT.ITCPERCENTAGE = 100;
      //         taxVAT.ITCAMT = VATAmount;

      //     }
      // }

    }
    //coll.Add(taxVAT);

    return true;
  }

  ResetCampaignAndAssetData() {

    //this._dataService.ProposalEntity.controls.PROPOSALARTICLE.clear();
    this._FormState.ResetFormArrayState(this._dataService.ProposalEntity.controls.PROPOSALARTICLE, DataRowState.Removed);
    this._dataService.ProposalEntity.controls.PROPOSALARTICLE.push(this._ProposalForm.ProposalArticleForm());
    //Controller.DataContext.PROPOSALARTICLE.m_source.ForEach(p => { p.ASSETENTITY.RowState = DataRowState.Removed; });
    this._FormState.ResetFormArrayState(this._dataService.ProposalEntity.controls.PRPLCMPTCNFG, DataRowState.Removed);
    // this._FormState.ResetFormState(this._dataService.ASSETENTITY.controls.TRUCKDETAILS, DataRowState.Removed);
    let rowState = this._dataService.ProposalEntity.controls.PROPOSALTEMPLATERENTALINT.controls.RowState.value;
    this._dataService.ProposalEntity.controls.PROPOSALTEMPLATERENTALINT = this._ProposalForm.ProposalTemplateRentalInterestForm();
    this._dataService.ProposalEntity.controls.PROPOSALTEMPLATERENTALINT.controls.RowState.setValue(rowState);
    this._dataService.ProposalEntity.controls.PROPOSALTEMPLATERENTALINT.controls.PRPLRNTINTSEQID.setValue(0);

    this._dataService.ProposalEntity.controls.PROPOSAL.controls.PACKAGECDE.setValue(null);


    // this section is ignored for the time being
    // if (cmbFPGroup.SelectedItem != null)
    //     FinancialGroupChange((cmbFPGroup.SelectedItem as FINL_PROD_GRUPInfo).FPGROUPID, (cmbFPGroup.SelectedItem as FINL_PROD_GRUPInfo).FINANCETYP, (cmbFPGroup.SelectedItem as FINL_PROD_GRUPInfo).ISPACKAGE);

    // this._financialClubMasterDataService.RentalModes = [];
    // this._financialClubMasterDataService.Frequencies = [];

    // if (Controller.DataContext.PROPOSALAPPLICANT[Controller.Helper.ApplicantIndex].INDIVIDUALAPPLICANT != null)
    //     Controller.DataContext.PROPOSALAPPLICANT[Controller.Helper.ApplicantIndex].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.DBTRCTGYCODEOTO = null;

    if (this._dataService.ProposalEntity.controls.PROPOSALAPPLICANT.length > 0) {
      this._dataService.ProposalEntity.controls.PROPOSALAPPLICANT.controls.map(p => {
        if (this._dataService.ProposalEntity.controls.PROPOSAL.value.FINANCETYP == FinanceType.Refinance) {
          if (p.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.NATIONALITYCDE.value == NationalityTypes.WNA) {
            p.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DBTRCTGYCODEOTO.setValue("00107");
          }
          else {
            p.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DBTRCTGYCODEOTO.setValue("00099");
          }
        }
        else {
          p.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTINDIVIDUAL.controls.DBTRCTGYCODEOTO.setValue("");
        }
      });
    }


    //reset borrower debtor category

    //this.SetMode(this.Mode, this.ParentContainer);



  }
  public ApplyInsuranceChart(chkcomp: boolean = false): boolean {
    if (chkcomp) {
      let param = {} as IProposalInfoParm;
      param.modelType = RuleModelType.DepreciationChart;
      let businessruleModelType: any;
      this._proposalService.GetBusinessRulesModelsByClassSpec(param).subscribe(res => {
        businessruleModelType = res?.ResultSet;
        if (res?.ResultSet) {
          let gparam = {} as IGenericChartRequestParams;
          gparam.BPID = this._dataService.PRPLINSR.controls.INSURER.value;
          gparam.MODELTYPECODE = RuleModelType.DepreciationChart;
          gparam.FINANCIALPRODUCTID = this._dataService.PROPOSAL.controls.FINANCIALPRODUCTID.value;
          gparam.BUSINESSRULEMODELCODE = businessruleModelType?.RULEMODELCDE
          if (gparam.BPID > 0 && gparam.MODELTYPECODE != undefined && gparam.FINANCIALPRODUCTID != undefined) {
            this._proposalService.ReadBusinessPartnerDepChart(gparam).subscribe(result => {

              if (this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.DepreciationChart).length > 0) {
                let index = this._dataService.PROPOSALCHART.value.indexOf(this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.DepreciationChart)[0])
                if (this._dataService.PROPOSALCHART.value[index].RowState != DataRowState.Added) {
                  this._dataService.PROPOSALCHART.controls[index].controls.RowState.setValue(DataRowState.Removed);
                }
                else
                  this._dataService.PROPOSALCHART.removeAt(index);
              }

              if (result.ResultSet.BPCHRTINFOCOLL[0].CHRTCDE != null) {


                // result.ResultSet.m_current = (result.ResultSet as GenericCollection<BP_CHRTInfo>).OrderBy(p => p.BPCHRTID).ToList();
                //       result.ResultSet.Insert(0, new BP_CHRTInfo() { CHRTCDE = null, CHARTNME = "-Please Select-" });
                if (result.ResultSet.BPCHRTINFOCOLL.length > 0) {
                  this._assetMasterData.DepreciationPolicy = result.ResultSet.BPCHRTINFOCOLL.map((a: any) => { return { code: a.CHRTCDE, TextValue: a.CHARTNME } });
                }
                else {
                  this._assetMasterData.DepreciationPolicy = [];
                }
                //select depreciation chart
                //if (this._dataService.PRPLINSR.value.DEPRECIATIONPOLICYCDE != null)
                //this._dataService.PRPLINSR.controls.DEPRECIATIONPOLICYCDE= this._dataService.PRPLINSR.value.DEPRECIATIONPOLICYCDE;
              }
              else {
                this._assetMasterData.DepreciationPolicy = [];
                this._dataService.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.setValue('');
              }

              if (result.CODE == 1 && result.ResultSet.BPCHRTINFOCOLL.length > 0) {
                result.ResultSet.BPCHRTINFOCOLL.forEach((element: any) => {
                  let tempChartInfo = {} as IPRPL_CHRTInfo;
                  tempChartInfo.CHARTCDE = element.CHRTCDE;
                  tempChartInfo.ASSETID = this._dataService.PROPOSALARTICLEFORMGROUP.controls.PROPOSALARTICLE.value.ASSETID;
                  tempChartInfo.MODELTYPE = RuleModelType.DepreciationChart;
                  tempChartInfo.PROPOSALID = this._dataService.PROPOSAL.value.PROPOSALID;
                  tempChartInfo.CHARTNME = "";
                  if (this._formMode.FormMode == FormMode.NEW) {
                    tempChartInfo.RowState = DataRowState.Added;
                  }
                  else if (this._formMode.FormMode == FormMode.EDIT) {
                    tempChartInfo.RowState = DataRowState.Updated;
                  }
                  let isExist = this._dataService.ProposalEntity.controls?.PROPOSALCHART.controls?.filter(x => x.controls.CHARTCDE.value == tempChartInfo.CHARTCDE);
                  if (isExist.length > 0) {
                    isExist[0].patchValue(tempChartInfo);
                  }
                  else {
                    this._dataService.ProposalEntity.controls.PROPOSALCHART.push(this._formBuilder.group<IPRPL_CHRTInfo>(tempChartInfo));
                  }
                  //this._dataService.PROPOSALCHART.push(this._formBuilder.group<IPRPL_CHRTInfo>(tempChartInfo));
                });

              }
            });
          }
        }
      });
      //Standard Insurance Chart
      let params = {} as IProposalInfoParm;
      params.modelType = RuleModelType.StrdInsuranceChart;
      this._proposalService.GetBusinessRulesModelsByClassSpec(params).subscribe(reslt => {
        let bsnrulemodel_StrdInsrChrt: any;
        bsnrulemodel_StrdInsrChrt = reslt?.ResultSet;
        if (reslt?.ResultSet) {

          let gparam = {} as IGenericChartRequestParams;
          gparam.BPID = this._dataService.PRPLINSR.controls.INSURER.value;
          gparam.MODELTYPECODE = RuleModelType.StrdInsuranceChart;
          gparam.FINANCIALPRODUCTID = this._dataService.PROPOSAL.controls.FINANCIALPRODUCTID.value;
          gparam.BUSINESSRULEMODELCODE = bsnrulemodel_StrdInsrChrt?.RULEMODELCDE;

          if (gparam.BPID > 0 && gparam.MODELTYPECODE != undefined && gparam.FINANCIALPRODUCTID != undefined) {
            this._proposalService.ReadBusinessPartnerDepChart(gparam).subscribe(result_StrdInsrChrt => {
              let val = result_StrdInsrChrt.ResultSet.BPCHRTINFOCOLL[0]?.CHRTCDE;
              if (this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.StrdInsuranceChart).length > 0) {
                const proposalchart = this._dataService.PROPOSALCHART.value;
                for (let i = 0; i < proposalchart.length; i++) {
                  if (proposalchart[i].MODELTYPE === RuleModelType.StrdInsuranceChart)
                  {
                    if (this._dataService.PROPOSALCHART.value[i].RowState != DataRowState.Added) {
                      this._dataService.PROPOSALCHART.controls[i].controls.RowState.setValue(DataRowState.Removed);
                    }
                    else{
                      this._dataService.PROPOSALCHART.removeAt(i);
                    }
                  }
              }
            }
              if (result_StrdInsrChrt.CODE == 1 && result_StrdInsrChrt.ResultSet.BPCHRTINFOCOLL.length > 0) {
                let tempChartInfo = {} as IPRPL_CHRTInfo;
                tempChartInfo.CHARTCDE = val;
                tempChartInfo.MODELTYPE = RuleModelType.StrdInsuranceChart;
                tempChartInfo.PROPOSALID = this._dataService.PROPOSAL.value.PROPOSALID;
                tempChartInfo.CHARTNME = "";
                tempChartInfo.RowState = DataRowState.Added;
                this._dataService.ProposalEntity.controls.PROPOSALCHART.push(this._formBuilder.group<IPRPL_CHRTInfo>(tempChartInfo));
              }
            
          });
          }
        }
      });
      //Addl Insurance Chart
      let param1 = {} as IProposalInfoParm;
      param1.modelType = RuleModelType.AddlInsuranceChart;
      this._proposalService.GetBusinessRulesModelsByClassSpec(param1).subscribe(reslts => {
        if (reslts?.ResultSet) {
          let bsnrulemodel_AddlInsrChrt = reslts?.ResultSet;
          let gparam = {} as IGenericChartRequestParams;
          gparam.BPID = this._dataService.PRPLINSR.controls.INSURER.value;
          gparam.MODELTYPECODE = RuleModelType.AddlInsuranceChart;
          gparam.FINANCIALPRODUCTID = this._dataService.PROPOSAL.controls.FINANCIALPRODUCTID.value;
          gparam.BUSINESSRULEMODELCODE = bsnrulemodel_AddlInsrChrt?.RULEMODELCDE;
          if (gparam.BPID > 0 && gparam.MODELTYPECODE != undefined && gparam.FINANCIALPRODUCTID != undefined) {
            this._proposalService.ReadBusinessPartnerDepChart(gparam).subscribe(InsrChrt => {
              let val = InsrChrt.ResultSet.BPCHRTINFOCOLL[0].CHRTCDE;
              if (this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.AddlInsuranceChart).length > 0) {
                const proposalchart = this._dataService.PROPOSALCHART.value;
                for (let i = 0; i < proposalchart.length; i++) {
                  if (proposalchart[i].MODELTYPE === RuleModelType.AddlInsuranceChart) {
                    if (this._dataService.PROPOSALCHART.value[i].RowState != DataRowState.Added) {
                      this._dataService.PROPOSALCHART.controls[i].controls.RowState.setValue(DataRowState.Removed);
                    }
                    else {
                      this._dataService.PROPOSALCHART.removeAt(i);
                    }
                  }
                }
              }

              if (InsrChrt.CODE == 1 && InsrChrt.ResultSet.BPCHRTINFOCOLL.length > 0) {
                let tempChartInfo = {} as IPRPL_CHRTInfo;
                tempChartInfo.CHARTCDE = val;
                tempChartInfo.MODELTYPE = RuleModelType.AddlInsuranceChart;
                tempChartInfo.PROPOSALID = this._dataService.PROPOSAL.value.PROPOSALID;
                tempChartInfo.CHARTNME = "";
                tempChartInfo.RowState = DataRowState.Added;
                this._dataService.ProposalEntity.controls.PROPOSALCHART.push(this._formBuilder.group<IPRPL_CHRTInfo>(tempChartInfo));
              }
            });
          }
        }
      });
    }

    return true;
  }

  public ReadBPInsuranceDetailInsurance(assetUsageChange: boolean) {
    let param = {} as IProposalInfoParm;
    param.ApplicantId = this._dataService.PRPLINSR.controls.INSURER.value;
    //param.RoleCode = RoleCode.InsuranceCompany;
    param.ASSETTYPECDE = this._dataService.PROPOSALASSET.value.ASSETTYPECDE;
    param.ASSETSUBTYPECDE = this._dataService.PROPOSALASSET.value.ASSETSUBTYPCDE;


    this._proposalService.ReadBPInsuranceDetailForInsurance(param).subscribe(res => {
      if (res.CODE == 1 && res.ResultSet != null) {
        if (!assetUsageChange) {
          this._dataService.PRPLINSR.controls.POLICYNBR.setValue(res.ResultSet.POLICYNO);
          if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance) {
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.setValue(res.ResultSet.POLICYFEEAMT);
            this._dataService.PRPLINSR.controls.POLICYFEE.setValue(res.ResultSet.POLICYFEEAMT);
          }
          //this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPCT.setValue();
          // this.MAXDEALERCOMMPCT(); comment after discussion with noman this method is called on fproduct change
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMPCTOTO.setValue(res.ResultSet.MAXINSRCOMMPCT);
          this.BindDepreciationCharts();
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TAXINCEXCL.setValue(res.ResultSet.INSRCOMMCDE != null || res.ResultSet.INSRCOMMCDE != '' ? res.ResultSet.INSRCOMMCDE : '');

          if (res.ResultSet.B2BIND) {
            //this.txtCertificateNumber.IsEnabled = false;
            this._dataService.PRPLINSR.controls.INSURANCEB2BIND.setValue(res.ResultSet.B2BIND);
            this._dataService.PRPLINSR.controls.UPDATEDB2BIND.setValue(res.ResultSet.B2BIND);
            //(Total Insurance Premium amount * B2B Fee% )
            this._dataService.PRPLINSR.controls.INSURANCEB2BPCT.setValue(res.ResultSet.B2BFEEPCT);
            let num = this._proposalManagerService.TotalPremiumAmount * res.ResultSet.B2BFEEPCT / 100;
            this._dataService.PRPLINSR.controls.INSURANCEB2BAMNT.setValue((Number(num.toFixed(2))));
            //Math.round((this._proposalManagerService.TotalPremiumAmount * res.ResultSet.B2BFEEPCT) / 100, 2);

          }
          else {
            //this.txtCertificateNumber.IsEnabled = true;
            this._dataService.PRPLINSR.controls.INSURANCEB2BPCT.setValue(0);
            this._dataService.PRPLINSR.controls.INSURANCEB2BAMNT.setValue(0);
            this._dataService.PRPLINSR.controls.INSURANCEB2BIND.setValue(false);
            this._dataService.PRPLINSR.controls.UPDATEDB2BIND.setValue(false);
          }

          if (this._dataService.PROPOSALVEHICLEDETAIL.value.VEHICLEAGE > 0
            && this._dataService.PROPOSALTEMPLATERENTALINT.value.VEHICLEAGE < this._dataService.PROPOSALVEHICLEDETAIL.value.VEHICLEAGE) {
            this._dataService.PRPLINSR.controls.LOADINGRTE.setValue(res.ResultSet.LOADINGRATEPCT);
          }
          else {
            this._dataService.PRPLINSR.controls.LOADINGRTE.setValue(0);
          }
          /*--- comments
          viewModel.COMMASSETUSAGEMINRTE = result3.ResultSet.COMMMINIMUMRATEPCT;
          viewModel.COMMASSETUSAGEMAXRTE = result3.ResultSet.COMMMAXIMUMRATEPCT;
          viewModel.COMMASSETUSAGEDEFAULTRTE = result3.ResultSet.COMMDEFAULTRATEPCT;
          viewModel.NONCOMMASSETUSAGEMINRTE = result3.ResultSet.NONCOMMMINIMUMRATEPCT;
          viewModel.NONCOMMASSETUSAGEMAXRTE = result3.ResultSet.NONCOMMMAXIMUMRATEPCT;
          viewModel.NONCOMMASSETUSAGEDEFAULTRTE = result3.ResultSet.NONCOMMDEFAULTRATEPCT;*/

          if (this._dataService.PRPLINSR.controls.ASSETUSAGECDE.value != '' && this._dataService.PRPLINSR.controls.ASSETUSAGECDE.value == InsuranceAssetUsageType.Commercial) {
            this._dataService.PRPLINSR.controls.ASSETUSAGEMINRTE.setValue(res.ResultSet.COMMMINIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEMAXRTE.setValue(res.ResultSet.COMMMAXIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.setValue(res.ResultSet.COMMDEFAULTRATEPCT);
            this._proposalManagerService.ReCalculateInsurancePremiumRate();
            /*--this._dataService.STANDARDINSURANCE.controls..TOTALPREMIUMAMNT.setvalue(this._proposalManagerService.TotalPremiumAmount);*/
          }
          else if (this._dataService.PRPLINSR.controls.ASSETUSAGECDE.value != '' && this._dataService.PRPLINSR.controls.ASSETUSAGECDE.value == InsuranceAssetUsageType.NonCommercial) {
            this._dataService.PRPLINSR.controls.ASSETUSAGEMINRTE.setValue(res.ResultSet.NONCOMMMINIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEMAXRTE.setValue(res.ResultSet.NONCOMMMAXIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.setValue(res.ResultSet.NONCOMMDEFAULTRATEPCT);
            this._proposalManagerService.ReCalculateInsurancePremiumRate();
            /*--txtTotalPremiumAmount.Value = Controller.TotalPremiumAmount;*/
          }
        }
        else if (assetUsageChange) {
          if (this._dataService.PRPLINSR.controls.ASSETUSAGECDE.value == InsuranceAssetUsageType.Commercial) {
            this._dataService.PRPLINSR.controls.ASSETUSAGEMINRTE.setValue(res.ResultSet.COMMMINIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEMAXRTE.setValue(res.ResultSet.COMMMAXIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.setValue(res.ResultSet.COMMDEFAULTRATEPCT);
          }
          else if (this._dataService.PRPLINSR.controls.ASSETUSAGECDE.value == InsuranceAssetUsageType.NonCommercial) {
            this._dataService.PRPLINSR.controls.ASSETUSAGEMINRTE.setValue(res.ResultSet.NONCOMMMINIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEMAXRTE.setValue(res.ResultSet.NONCOMMMAXIMUMRATEPCT);
            this._dataService.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.setValue(res.ResultSet.NONCOMMDEFAULTRATEPCT);
          }
          else {
            this._dataService.PRPLINSR.controls.ASSETUSAGEMINRTE.setValue(0);
            this._dataService.PRPLINSR.controls.ASSETUSAGEMAXRTE.setValue(0);
            this._dataService.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.setValue(0);
          }
          this._proposalManagerService.ReCalculateInsurancePremiumRate();
            /*--txtTotalPremiumAmount.Value = Controller.TotalPremiumAmount;*/;
        }
      }
    })
  }

  public BindDepreciationCharts(): boolean {
    let param = {} as IProposalInfoParm;
    param.modelType = RuleModelType.DepreciationChart;
    let businessruleModelType: any;
    this._proposalService.GetBusinessRulesModelsByClassSpec(param).subscribe(res => {
      businessruleModelType = res?.ResultSet;
      if (res?.ResultSet) {
        let gparam = {} as IGenericChartRequestParams;
        gparam.BPID = this._dataService.PRPLINSR.controls.INSURER.value;
        gparam.MODELTYPECODE = RuleModelType.DepreciationChart;
        gparam.FINANCIALPRODUCTID = this._dataService.PROPOSAL.controls.FINANCIALPRODUCTID.value;
        gparam.BUSINESSRULEMODELCODE = businessruleModelType?.RULEMODELCDE
        if (gparam.BPID > 0 && gparam.MODELTYPECODE != undefined && gparam.FINANCIALPRODUCTID != undefined) {
          this._proposalService.ReadBusinessPartnerDepChart(gparam).subscribe(result => {

            if (this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.DepreciationChart).length > 0) {
              let index = this._dataService.PROPOSALCHART.value.indexOf(this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.DepreciationChart)[0])
              if (this._dataService.PROPOSALCHART.value[index].RowState != DataRowState.Added) {
                this._dataService.PROPOSALCHART.controls[index].controls.RowState?.setValue(DataRowState.Removed);
              }
              else
                this._dataService.PROPOSALCHART.removeAt(index);
            }
            if (result.ResultSet.BPCHRTINFOCOLL[0].CHRTCDE != null) {


              // result.ResultSet.m_current = (result.ResultSet as GenericCollection<BP_CHRTInfo>).OrderBy(p => p.BPCHRTID).ToList();
              //       result.ResultSet.Insert(0, new BP_CHRTInfo() { CHRTCDE = null, CHARTNME = "-Please Select-" });
              if (result.ResultSet.BPCHRTINFOCOLL.length > 0) {
                this._assetMasterData.DepreciationPolicy = result.ResultSet.BPCHRTINFOCOLL.map((a: any) => { return { code: a.CHRTCDE, TextValue: a.CHARTNME } });
              }
              else {
                this._assetMasterData.DepreciationPolicy = [];
              }
              //select depreciation chart
              //if (this._dataService.PRPLINSR.value.DEPRECIATIONPOLICYCDE != null)
              //this._dataService.PRPLINSR.controls.DEPRECIATIONPOLICYCDE= this._dataService.PRPLINSR.value.DEPRECIATIONPOLICYCDE;
            }
          })

        }
      }
    })
    return true;
  }

  public MAXDEALERCOMMPCT() {
    let _maxDealerCommpct = 0;
    let request = new ProposalMasterDataRequest();
    request.BusinessPartnerId = this._dataService.PROPOSAL.controls.BPINTRODUCERID.value;
    request.BPRole = RoleCode.Dealer;
    this._proposalService.ReadBPInsuranceDetail(request).subscribe(res => {
      if (res.CODE == 1 && res.ResultSet != null && this._dataService.PROPOSALFINANCIALAGREEMENT != null) {
        _maxDealerCommpct = res.ResultSet.MAXDEALERCOMMPCT;
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DEALERPCT.setValue(_maxDealerCommpct);
        this._dataService.PROPOSAL.controls.MCOMDEALER.setValue(res.ResultSet.ISMCOMDEALER);
      }
    })
    //return _maxDealerCommpct;
  }

  public EnableInsuranceCalculateButton() {
    if (this._dataService.PROPOSAL.value.FINANCETYP !== FinanceType.OperatingLease) {
      this.btnInsCalculateIsEnabled = true;
      this.ResetAllAmounts();
      this.ResetRentalDetail();
    }
  }

  public ResetAllAmounts() {

    this._dataService.PRPLINSR?.controls.TOTALUPFRONTAMNT.setValue(0);
    this._dataService.PRPLINSR?.controls.TOTALFINANCEAMNT.setValue(0);
    this._dataService.PRPLINSR?.controls.TOTALINSRSUBSIDYAMNT.setValue(0);

    this._dataService.STANDARDINSURANCE?.controls.forEach(stnd => {
      if (stnd.controls.PRPLSTNDINSR.value.COLLECTIONMETHODCDE != InsuranceCollectionTypes.LeaseClause) {
        stnd.controls.PRPLSTNDINSR.controls.TOTALPREMIUMAMNT.setValue(0);
      }
      stnd.controls.PRPLADDLINSR.controls.forEach(item => {
        item.controls.TOTALPREMIUMAMNT.setValue(0);
      })
      stnd.controls.STANDARDINSURANCEDETAIL.controls.forEach(stndDetl => {

        stndDetl.controls.PRPLSTNDINSRDETL.controls.PREMIUMAMNT.setValue(0);
        stndDetl.controls.PRPLSTNDINSRDETL.controls.DEFAULTPREMIUMRTE.setValue(0);
        stndDetl.controls.PRPLSTNDINSRDETL.controls.MININSRPREMIUMRTE.setValue(0);
        stndDetl.controls.PRPLSTNDINSRDETL.controls.MAXINSRPREMIUMRTE.setValue(0);
        stndDetl.controls.PRPLSTNDINSRDETL.controls.SUMINSUREDAMNT.setValue(0);
        stndDetl.controls.PRPLSTNDINSRDETL.controls.DEPRECIATIONRTE.setValue(0);
        stndDetl.controls.PRPLSTNDINSRDETL.controls.FINALPREMIUMRTE.setValue(this._dataService.PRPLINSR.controls.ASSETUSAGEDEFAULTRTE.value);

        stndDetl.controls.PRPLADDLINSRDETL.controls.forEach(AddlDetl => {
          AddlDetl.controls.PREMIUMAMNT.setValue(0);
          AddlDetl.controls.DEFAULTPREMIUMRTE.setValue(0);
          AddlDetl.controls.MININSRPREMIUMRTE.setValue(0);
          AddlDetl.controls.MAXINSRPREMIUMRTE.setValue(0);
          AddlDetl.controls.FINALPREMIUMRTE.setValue(0);
          AddlDetl.controls.TPLCOVERAGERTE.setValue(0);
        })
      })
    });

    this._proposalManagerService.chkReceiveByDealer = false;
    this._dataService.PRPLINSR?.controls.RECEIVEBYDEALERIND.setValue(false);
    this.RemoveArticleComponent(AmountComponent.InsuranceCommission);

    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCEPREMIUM.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSRCOMMAMTOTO.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.MAXINSURANCECOMMISSIONAMOUNT.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCECOMMISSIONAMOUNT.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.setValue(0);

    this.RemoveArticleComponent(AmountComponent.FinancedInsurancePremium);
    this.RemoveArticleComponent(AmountComponent.AROInsurancePremium);
    this.RemoveArticleComponent(AmountComponent.InsuranceSubsidy);
    this.RemoveArticleComponent(AmountComponent.UpfrontInsurancePremium);
    this.RemoveArticleComponent(AmountComponent.B2BFee);
    this.RemoveArticleComponent(AmountComponent.InsurancePremium);
    this.RemoveArticleComponent(AmountComponent.DealerInsuranceCommission);

  }

  PopulateDepreciationPolicy() {
    if (this._dataService.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value != '') {
      let param = {} as IGenericChartRequestParams;
      param.CHARTCDE = this._dataService.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.value;
      this._proposalService.ReadDepreciationChartDetail(param).subscribe(res => {
        if (res.ResultSet.CHARTDPRNCOLL.length > 0) {
          this._dataService.INSRDPRNPLCY.clear();
          res.ResultSet.CHARTDPRNCOLL.forEach((item: any) => {
            let temp = {} as IINSR_DPRN_PLCYInfo;
            temp.ASSETID = this._dataService.PRPLINSR.controls.ASSETID.value,
              temp.PROPOSALID = this._dataService.PRPLINSR.controls.PROPOSALID.value,
              temp.NOOFYEARS = item.BUSINESSRULEEXPRESSION,
              temp.ASSETTYPECDE = this.GetAssetTypeCode(item.USEREXPRESSION),
              temp.DPRCPCT = item.DPRNRTEPCT
            if (this._dataService.PROPOSALASSET.value.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Car) && temp.ASSETTYPECDE == AssetTypeCodeCF.GetDescriptionStringValue(AssetTypeCodeCF.Car)) {
              this._dataService.INSRDPRNPLCY.push(this._proposalentitymapper.INSRDPRNPLCYMapper(this._ProposalForm.InsuranceDepreciationPolicyForm(), temp));
            }
            else if (this._dataService.PROPOSALASSET.value.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike) && temp.ASSETTYPECDE == AssetTypeCodeCF.GetDescriptionStringValue(AssetTypeCodeCF.Bike)) {
              this._dataService.INSRDPRNPLCY.push(this._proposalentitymapper.INSRDPRNPLCYMapper(this._ProposalForm.InsuranceDepreciationPolicyForm(), temp));
            }

          });
          // if (this._dataService.PROPOSALASSET.value.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Car)) {
          //   this._dataService.INSRDPRNPLCY.controls = this._dataService.INSRDPRNPLCY.controls.filter(s => s.value.ASSETTYPECDE == AssetTypeCodeCF.GetDescriptionStringValue(AssetTypeCodeCF.Car));
          //  /* this._dataService.INSRDPRNPLCY.clear();
          //   res.forEach((item: any) => {
          //     this._dataService.INSRDPRNPLCY.push(item);
          //   })*/
          // }
          // else if (this._dataService.PROPOSALASSET.value.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)) {
          //   let res = this._dataService.INSRDPRNPLCY.value.filter(s => s.ASSETTYPECDE == AssetTypeCodeCF.GetDescriptionStringValue(AssetTypeCodeCF.Bike));
          //   /*this._dataService.INSRDPRNPLCY.clear();*/
          //   res.forEach((item: any) => {
          //     //this._proposalentitymapper.INSRDPRNPLCYMapper(this._ProposalForm.InsuranceDepreciationPolicyForm(), temp)

          //   })
          //   // this._dataService.INSRDPRNPLCY.m(res);
          // }
        }
        else {
          this._dataService.INSRDPRNPLCY.clear();
          this._dataService.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.setValue('');
        }
      })

    }
    else {
      this._dataService.INSRDPRNPLCY.clear();
      this._dataService.PRPLINSR.controls.DEPRECIATIONPOLICYCDE.setValue('');
    }
  }

  GetAssetTypeCode(UserExpression: string): string {
    let AssetCode = "";
    let str = UserExpression.indexOf(" \'") + 2;
    let end = UserExpression.indexOf("\' ");

    AssetCode = UserExpression.substring(str, end);
    return AssetCode;


  }
  public SetAdminFeeChartConfigurations() {
    if (this._dataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.OperatingLease) {
      let p_proposalarticle = this._dataService.PROPOSALARTICLEFORMGROUP;
      if (this._dataService.PROPOSAL.controls.ISPACKAGE.value) {
        p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.STANDARDADMINFEE.setValue(0);
      }
      this.UpdateAdminFeeFields();
      if (!this._dataService.PROPOSAL.controls.ISPACKAGE.value) {
        this.ApplyAdminFeeChartConfigurations(p_proposalarticle);
      }
      return true;
    }
    else {
      return true;
    }
  }

  public ApplyAdminFeeChartConfigurations(p_proposalarticle: FormGroup<IProposalArticleEntity>) {
    try {
      let validAssetExists;
      if (this._dataService.PROPOSALARTICLE.value.filter(k => k.ASSETENTITY.PROPOSALASSET.ASSETTYPECDE != null || k.ASSETENTITY.PROPOSALASSET.ASSETTYPECDE != "").length > 0) {
        validAssetExists = true;
      }
      else {
        validAssetExists = false;
      }
      if (this._dataService.PROPOSALARTICLE.value != null && this._dataService.PROPOSALARTICLE.value.length > 0 && validAssetExists) {
        let ChartCode = "";
        if (this._dataService.ProposalEntity.controls.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.AdminFeeChart).length > 0) {
          ChartCode = this._dataService.ProposalEntity.controls.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.AdminFeeChart)[0].CHARTCDE;
          let param = {} as IChartInfoPOSParm;
          param.ChartCode = ChartCode;
          param.ChartType = ChartType.StrdAdmnFeeChart;
          param.ProposalArticle = this._dataService.PROPOSALARTICLE.value as Array<IProposalArticleEntity>;
          param.FinancialProductID = this._dataService.PROPOSAL.value.FINANCIALPRODUCTID;
          param.BaseRateTypeCode = this.GetBaseRateType(this._dataService.PROPOSALTEMPLATERENTALINT.value.INTRTYPECDE, this._dataService.PROPOSALTEMPLATERENTALINT.value.RNTLCALCLTNMTDCDE);
          param.ProposalCurrencyCode = '00001';
          param.IntroducerID = this._dataService.PROPOSAL.controls.BPINTRODUCERID.value;
          param.ProposalStartDate = this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE.value;
          param.ProposalRentalTemplate = this._dataService.PROPOSALTEMPLATERENTALINT.value as IPRPL_TPLE_RNTL_INTInfo;
          this._proposalService.UpdateChartConfiguration(param).subscribe((result56) => {
            if (result56.CODE == ReturnCode.Success.Code && result56.ResultSet != null) {
              let chartrow = this._ProposalForm.PROPOSALARTICLECHARTDETLForm();
              chartrow = p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.controls.filter((p) => p.controls.MODELTYPECDE.value == BusinessRuleModelCode.AdminFeeChartModel && p.value.RowState != DataRowState.Removed)[0] as FormGroup<IPRPL_ARTE_CHRT_DETLInfo>;
              if (chartrow != null) {
                const index: number = p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.value.indexOf(chartrow.value);
                if (chartrow.controls.RowState.value == DataRowState.Added)
                  p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.removeAt(index);
                else
                  p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.controls[index].controls.RowState.setValue(DataRowState.Removed);
              }
              let chartgroup = result56.ResultSet.ASSETENTITY.PROPOSALARTICLECHARTDETL.filter((p: any) => p.MODELTYPECDE == BusinessRuleModelCode.AdminFeeChartModel)[0];
              if (chartgroup != undefined && chartgroup != null) {
                chartrow = this._ProposalForm.PROPOSALARTICLECHARTDETLForm();
                chartrow.patchValue(chartgroup);
                p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALARTICLECHARTDETL.push(chartrow);
              }
              if ((result56.ResultSet.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ADMINFEECHARTNME) && this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.AdminFeeChart).length > 0) {
                this._dataService.PROPOSALCHART.controls.find(p => p.value.MODELTYPE == RuleModelType.AdminFeeChart)?.controls.CHARTNME.setValue(result56.ResultSet.ASSETENTITY.PROPOSALFINANCIALAGREEMENT.ADMINFEECHARTNME);
              }
              p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.STANDARDADMINFEE.setValue(result56.ResultSet.ASSETENTITY.PROPOSALADMINFEEDETAIL.STANDARDADMINFEE);
              this.UpdateAdminFeeFields();
              this.CalculateOJKTotalIncome()
            }

          });

        }
        else {
          p_proposalarticle.controls.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.STANDARDADMINFEE.setValue(0);
          this.UpdateAdminFeeFields();
          this.CalculateOJKTotalIncome();
        }
      }
      else {
        this.UpdateAdminFeeFields();
        this.CalculateOJKTotalIncome();
      }
    }
    catch (Exception) {

    }
    return true;
  }
  public UpdateAdminFeeFields() {
    if (this._dataService.PROPOSAL.value.FINANCETYP != null
      && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance
      && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {
      //admin fee formula
      this._dataService.PROPOSALADMINFEEDETAIL.controls.TOTALADMINFEE.setValue(
        this._dataService.PROPOSALADMINFEEDETAIL.controls.ADDITIONALADMINFEE.value + this._dataService.PROPOSALADMINFEEDETAIL.controls.STANDARDADMINFEE.value
        - this._dataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEEDISCOUNT.value - this._dataService.PROPOSALADMINFEEDETAIL.controls.ADMINFEESUBSIDY.value);

      this.RemoveArticleComponent(AmountComponent.AdminFee);
      this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.controls.TOTALADMINFEE.value, AmountComponent.AdminFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, null, this._dataService.PROPOSAL.value.BPCOMPANYID, AmountClassification.Receivable, false);
      //CalculateReceiveableTax(AmountComponent.AdminFee, PROPOSAL_ADMIN_FEE_DETAIL.TOTALADMINFEE, ChargeTypes.AdminFee.GetStringValue());
      let _taxinclusiveamt = 0;
      this._dataService.PROPOSALARTICLEFORMGROUP.value.ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.forEach(p => {
        if (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee)) {
          _taxinclusiveamt = p.TAXINCULSIVEAMT;
        }
      })
      this._dataService.PROPOSALADMINFEEDETAIL.controls.UPFRONTADMINFEE.setValue(this._dataService.PROPOSALADMINFEEDETAIL.controls.TOTALADMINFEE.value > 0 ? ((_taxinclusiveamt > 0 ? _taxinclusiveamt : this._dataService.PROPOSALADMINFEEDETAIL.controls.TOTALADMINFEE.value) - this._dataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.value) : 0);
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALADMINFEE.setValue(this._dataService.PROPOSALADMINFEEDETAIL.controls.TOTALADMINFEE.value);
      this.RemoveArticleComponent(AmountComponent.FinancedAdminFee);
      this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.controls.FINANCEDADMINFEE.value, AmountComponent.FinancedAdminFee, this._dataService.PROPOSAL.controls.CURRENCYCDE.value, AssetComponentsFinancialConfiguration.Finance, null, 0, null, false);
      this.RemoveArticleComponent(AmountComponent.UpfrontAdminFee);
      this.RemoveArticleComponent(AmountComponent.AdminFeeSubsidy);

      if (this._dataService.PROPOSALADMINFEEDETAIL.value != null && this._dataService.PROPOSALADMINFEEDETAIL.value.DEALERNETOFFIND) {
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.value.ADMINFEESUBSIDY, AmountComponent.AdminFeeSubsidy, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Nettingoff, false);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.value.ADMINFEESUBSIDY, AmountComponent.AdminFeeSubsidy, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Receivable, false);
      }
      else {
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.value.ADMINFEESUBSIDY, AmountComponent.AdminFeeSubsidy, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Receivable, false);
      }

      if (this._dataService.PROPOSALADMINFEEDETAIL.value != null && this._dataService.PROPOSALADMINFEEDETAIL.value.RECEIVEDBYDEALERIND) {
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.value.UPFRONTADMINFEE, AmountComponent.UpfrontAdminFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Receivable, true);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.value.UPFRONTADMINFEE, AmountComponent.UpfrontAdminFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, this._dataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Nettingoff, true);
      }
      else {
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALADMINFEEDETAIL.value.UPFRONTADMINFEE, AmountComponent.UpfrontAdminFee, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.Upfront, null, 0, AmountClassification.Receivable, false);
      }
    }
    this._proposalManagerService.FirstPayamentSetValues();
    return true;
  }

  public GetAdminFeeAsscociation() {

    //if(this._dataService.PROPOSAL.controls.FINANCETYP.value == FinanceType.Refinance) {

    let param = {} as IProposalInfoParm;
    param.modelType = RuleModelType.AdminFeeChart;
    param.BPCOMPANYID = 5;
    let businessruleModelType: any;
    // if( this.apiBusinessData == null){

    this._proposalService.GetBusinessRulesModelsByClassSpec(param).subscribe(res => {
      // this.apiBusinessData = res;
      businessruleModelType = res.ResultSet.RULEMODELCDE;
    })
    // }
    // else{
    //   businessruleModelType = this.apiBusinessData.ResultSet.RULEMODELCDE;
    // }
    if (this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.AdminFeeChart).length > 0) {
      let index = this._dataService.PROPOSALCHART.value.indexOf(this._dataService.PROPOSALCHART.value.filter(p => p.MODELTYPE == RuleModelType.AdminFeeChart)[0])
      if (this._dataService.PROPOSALCHART.value[index].RowState != DataRowState.Added) {
        this._dataService.PROPOSALCHART.controls[index].controls.RowState.setValue(DataRowState.Removed);
      }
      else
        this._dataService.PROPOSALCHART.removeAt(index);
    }
    param.BPCOMPANYID = 5;
    // if(this.apiCacheData == null)
    // {
    this._proposalService.ReadAdminFeeChartFromFC(param).subscribe(chartInfo => {
      if (chartInfo?.CODE == ReturnCode.Success.Code && chartInfo?.ResultSet.length > 0) {
        // this.apiCacheData = chartInfo;
        let chartcode = chartInfo?.ResultSet[0]?.CHARTCDE;
        let tempChartInfo = {} as IPRPL_CHRTInfo;
        tempChartInfo.CHARTCDE = chartcode;
        tempChartInfo.ASSETID = this._dataService.PROPOSALARTICLEFORMGROUP.controls.PROPOSALARTICLE.value.ASSETID;
        tempChartInfo.MODELTYPE = RuleModelType.AdminFeeChart;
        tempChartInfo.PROPOSALID = this._dataService.PROPOSAL.value.PROPOSALID;
        tempChartInfo.CHARTNME = "";
        tempChartInfo.RowState = DataRowState.Added;
        this._dataService.ProposalEntity.controls.PROPOSALCHART.push(this._formBuilder.group<IPRPL_CHRTInfo>(tempChartInfo));
      }

    })
    //}
    // }

    // else{

    //     if (this.apiCacheData?.CODE == ReturnCode.Success.Code && this.apiCacheData?.ResultSet.length > 0) {
    //       let chartcode = this.apiCacheData?.ResultSet[0]?.CHARTCDE;
    //       let tempChartInfo = {} as IPRPL_CHRTInfo;
    //       tempChartInfo.CHARTCDE = chartcode;
    //       tempChartInfo.ASSETID = this._dataService.PROPOSALARTICLEFORMGROUP.controls.PROPOSALARTICLE.value.ASSETID;
    //       tempChartInfo.MODELTYPE = RuleModelType.AdminFeeChart;
    //       tempChartInfo.PROPOSALID = this._dataService.PROPOSAL.value.PROPOSALID;
    //       tempChartInfo.CHARTNME = "";
    //       if (this._formMode.FormMode == FormMode.NEW) {
    //         tempChartInfo.RowState = DataRowState.Added;
    //       }
    //       else if (this._formMode.FormMode == FormMode.EDIT) {
    //         tempChartInfo.RowState = DataRowState.Updated;
    //       }
    //       this._dataService.ProposalEntity.controls.PROPOSALCHART.push(this._formBuilder.group<IPRPL_CHRTInfo>(tempChartInfo));
    //     }


    // }

    return true;
  }

  public FirstPaymentConfig() {
    if (this._dataService.PROPOSAL.controls.FINANCETYP.value != FinanceType.Refinance) {

      this._dataService.PRPLCMPTCNFG.value.forEach(info => {
        // Fiducia Fee
        if (info.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee)) {
          this.RemoveArticleComponent(AmountComponent.FiduciaFee);
          if (info.AMNTCMPTCNFG == AssetComponentsFinancialConfiguration.Upfront && info.PAYTOINTRODUCERIND) {
            this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value, AmountComponent.FiduciaFee, this._dataService.PROPOSAL.value.CURRENCYCDE, info.AMNTCMPTCNFG, null, 0, null, info.PAYTOINTRODUCERIND);
            this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value, AmountComponent.FiduciaFee, this._dataService.PROPOSAL.value.CURRENCYCDE, info.AMNTCMPTCNFG, this._dataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Nettingoff, info.PAYTOINTRODUCERIND);
          }
          else
            this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value, AmountComponent.FiduciaFee, this._dataService.PROPOSAL.value.CURRENCYCDE, info.AMNTCMPTCNFG, null, 0, null, info.PAYTOINTRODUCERIND);
          // await CalculateReceiveableTax(AmountComponent.FiduciaFee, PROPOSAL_FINANCIAL_AGRM.FIDUCIAFEE, ChargeTypes.FiduciaFee);
          //this.CalculateReceiveableTax(AmountComponent.FiduciaFee, this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value, ChargeTypes.GetStringValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.FIDUCIAFEE.value));
        }
        else if (info.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee)) { // Policy Fee
          this.RemoveArticleComponent(AmountComponent.PolicyFee);
          if (info.AMNTCMPTCNFG == AssetComponentsFinancialConfiguration.Upfront && info.PAYTOINTRODUCERIND) {
            this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value, AmountComponent.PolicyFee, this._dataService.PROPOSAL.value.CURRENCYCDE, info.AMNTCMPTCNFG, null, 0, null, info.PAYTOINTRODUCERIND);
            this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value, AmountComponent.PolicyFee, this._dataService.PROPOSAL.value.CURRENCYCDE, info.AMNTCMPTCNFG, this._dataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Nettingoff, info.PAYTOINTRODUCERIND);
          }
          else
            this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value, AmountComponent.PolicyFee, this._dataService.PROPOSAL.value.CURRENCYCDE, info.AMNTCMPTCNFG, null, 0, null, info.PAYTOINTRODUCERIND);
          // await CalculateReceiveableTax(AmountComponent.PolicyFee, this._dataService.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value, ChargeTypes.PolicyFee);
          //this.CalculateReceiveableTax(AmountComponent.PolicyFee, this._dataService.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value, ChargeTypes.GetStringValue(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.POLICYFEE.value));
        }
      });
    }
  }

  public CalculateReceiveableTax(amountComponent: any, componentAmount: number, payableTypeCode: string) {
    //let param = {} as ITaxChargeComponentParam;
    let param = {} as ICalculationInfoParam;
    param.AssetEntity = this._dataService.ASSETENTITY.value as IAssetEntity;
    param.FINANCETYP = this._dataService.PROPOSAL.controls.FINANCETYP.value;
    param.BPINTRODUCERID = this._dataService.PROPOSAL.controls.BPINTRODUCERID.value
    param.ChargeAmount = componentAmount;
    param.ChargeTypeCode = payableTypeCode;
    param.AMOUNTCOMPONENT = amountComponent.toString();
    this._proposalService.CalculateReceivableTax(param).subscribe((result) => {
      if (result != null && result.ResultSet != null) {
        let index = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.findIndex(x => x.value.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(amountComponent));
        if (this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls[index].value.PRPLARTEAMNTTRANTAX.length > 0) {
          this._FormState.ResetFormArrayState(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls[index].controls.PRPLARTEAMNTTRANTAX, DataRowState.Removed);
        }
        let temp = result.ResultSet.PRPLARTICLECOMPONENTENTITYCOL.find((x: any) => x.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(amountComponent));
        //  if(this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls[index].value.PRPLARTEAMNTTRANTAX.length == 0){
        //   this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls[index].controls.PRPLARTEAMNTTRANTAX = this._formBuilder.array<IPRPL_ARTE_AMNT_TRAN_TAXInfo>([]);
        //  }
        //let tempGroup = this._formBuilder.group<IPRPL_ARTE_AMNT_TRAN_TAXInfo>(temp.PRPLARTEAMNTTRANTAX);
        temp.PRPLARTEAMNTTRANTAX.forEach((item: any) => {
          this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls[index].controls.PRPLARTEAMNTTRANTAX.push(this._proposalentitymapper.PRPLARTEAMNTTRANTAXMapper(this._ProposalForm.PRPLARTEAMNTTRANTAXForm(), item));
        });

        console.log(index);
        //   this.ExtractReceivableTaxes(result.ResultSet, this.PROPOSAL_ASSET, amountComponent.GetStringValue(), true);
      }
    });
    /*if (amountComponent == AmountComponent.ProvisionFee) {
      param.FinanceTypeCode = this._dataService.PROPOSAL.controls.FINANCETYP.value;
      param.RecipientBPId = this._dataService.PROPOSAL.controls.BPINTRODUCERID.value
      param.ChargeAmount = componentAmount;
      param.ChargeTypeCode = payableTypeCode;
      param.amountComponent = AmountComponent.ProvisionFee;
      this._proposalService.CalculateReceivableTax(param).subscribe((result) => {
        // if (result != null && result.ResultSet != null) {
        //   this.ExtractReceivableTaxes(result.ResultSet, this.PROPOSAL_ASSET, amountComponent.GetStringValue(), true);
        // }
      });
    }
    else {
      param.FinanceTypeCode = this._dataService.PROPOSAL.controls.FINANCETYP.value;
      param.RecipientBPId = this._dataService.PROPOSAL.controls.BPINTRODUCERID.value
      param.ChargeAmount = componentAmount;
      param.ChargeTypeCode = payableTypeCode;
      param.amountComponent = AmountComponent.FiduciaFee;
      this._proposalService.CalculateReceivableTax(param).subscribe((result) => {
        // if (result != null && result.ResultSet != null) {
        //   this.ExtractReceivableTaxes(result.ResultSet, this.PROPOSAL_ASSET, amountComponent.GetStringValue(), true);
        // }
      });
    }*/

  }

  public SetDefaultCommissionSetting() {

    if ((this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISMARKETINGCOMMISSIONBIKE || this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISMARKETINGCOMMISSIONCAR) &&
      this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0) {
      let info = this._dataService.PROPOSALCOMMISSIONENTITY.value[0].PRPLMKTGCOMM.find(p => p.ISDEFAULT == true) as IPRPL_MKTG_COMMInfo;

      if (info != null) {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMMTHDCDE.setValue(info.COMMISSIONMTHDCDE);
        if (info.COMMISSIONMTHDCDE == CommissionCalculationMethod.Fixed) {
          if (!this.OJKCommissionEffectiveInd) {
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(info.DEFAULTAMTPCT);
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(info.DEFAULTAMTPCT);
          }
          else
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(info.DEFAULTAMTPCT);
        }
        else if (info.COMMISSIONMTHDCDE == CommissionCalculationMethod.PercentageofIncome
          || info.COMMISSIONMTHDCDE == CommissionCalculationMethod.NFAPercentage) {
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMCALCPCT.setValue(info.DEFAULTAMTPCT);
        }
        else if (info.COMMISSIONMTHDCDE == CommissionCalculationMethod.MarketingFee) {
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMBASICCALCPCT.setValue(info.DEFAULTAMTPCT);
        }
      }
    }
    //GenericCollection < COMM_APLC_CNFG_ATCHInfo > _COMMAPLCCNFG = this.FinancialProductDetail.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.COMMAPLCCNFG;
    if (this._dataService.PROPOSAL.value.FINANCETYP == FinanceType.HirePurchase) {
      //this.SOFCommissionInd = true; // need to discuss with Ali, commented for the time beaing
    }
  }

  public ResetCommissionSetting() {
    //this.PROPOSAL_FINANCIAL_AGRM.COMMFIXAMT = 0;
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMCALCPCT.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMBASICCALCPCT.setValue(0);
  }

  get isMarketCommission() {
    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE != null) {
      if (this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)) {
        if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISMARKETINGCOMMISSIONBIKE)
          return true;
        else
          return false;
      }
      else {
        if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISMARKETINGCOMMISSIONCAR)
          return true;
        else
          return false;
      }
    }
    else {
      return false;
    }
  }

  get OJKCommissionEffectiveInd() {
    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null
      && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease && this.CommissionCalcInd) {
      if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.OJKCOMMISSIONEFFECTIVEDTE != null) {
        if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.OJKCOMMISSIONEFFECTIVEDTE > this.storageService.GetUserInfo().ProcessingDate)
          return false;
        else if (new Date(this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.OJKCOMMISSIONEFFECTIVEDTE) <= new Date(this.storageService.GetUserInfo().ProcessingDate))
          return true;
        else
          return false;
      }
      else
        return false;
    }
    else {
      return false;
    }

  }

  get CommissionCalcInd() {
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


  get SOFCommissionInd() {
    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE != null
      && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance
      && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {
      if (this.CommissionCalcInd) {
        if (this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)) {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISCOMMISSIONBIKE) {
            return true;
          }
          else {
            this._dataService.ASSETENTITY.value.PROPOSALSOFCOMMISSIONDETAIL.TOTALSOFCOMMISSION = 0;
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.SOFCommission));
            return false;
          }
        }
        else {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISCOMMISSIONCAR) {
            return true;
          }
          else {
            this._dataService.ASSETENTITY.value.PROPOSALSOFCOMMISSIONDETAIL.TOTALSOFCOMMISSION = 0;
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.SOFCommission));
            return false;
          }
        }
      }
      else {
        this._dataService.ASSETENTITY.value.PROPOSALSOFCOMMISSIONDETAIL.TOTALSOFCOMMISSION = 0;
        this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.SOFCommission));
        return false;
      }
    }
    else {
      return false;
    }

  }


  private ResetCommissionAmounts(commissiontype: string) {
    if (this.ValidateCommissionEntity()) {

      if (commissiontype == CommissionType.GetStringValue(CommissionType.AllCommissionTypes)) {
        this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.forEach(item => {
          item.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(0);
          item.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(0);
          this._FormState.ResetFormArrayState(item.controls.PRPLJP1JP2RPNTTAX, DataRowState.Removed);

        });

        this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP2RECIPIENT.controls.forEach(item => {
          item.controls.PRPLJP2RPNT.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);
          this._FormState.ResetFormArrayState(item.controls.PRPLJP2RPNTTAX, DataRowState.Removed);
        });
      }
      else {
        this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP2RECIPIENT.controls.forEach(item => {
          if (item.value.PRPLJP2RPNT.COMMISSIONTYPECDE === commissiontype) {
            item.controls.PRPLJP2RPNT.controls.JP2SCHEMECOMMISSIONAMT.setValue(0);
            this._FormState.ResetFormArrayState(item.controls.PRPLJP2RPNTTAX, DataRowState.Removed);
          }
        });

        this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.JP1JP2RECIPIENT.controls.forEach(item => {
          if (item.value.PRPLJP1JP2RPNT.COMMISSIONTYPECDE === commissiontype) {
            item.controls.PRPLJP1JP2RPNT.controls.JP1COMMISSIONAMT.setValue(0);
            item.controls.PRPLJP1JP2RPNT.controls.JP2COMMISSIONAMT.setValue(0);
            this._FormState.ResetFormArrayState(item.controls.PRPLJP1JP2RPNTTAX, DataRowState.Removed);
          }
        });
      }
    }
    return true;
  }

  private ValidateCommissionEntity() {
    if (this._dataService.ASSETENTITY.value != null && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0)
      return true;
    return false;
  }


  public ReCalculateOJKCommission(amountComponent: AmountComponent, commissionType: CommissionType) {
    if (this.OJKCommissionEffectiveInd) {
      let amt = this._dataService.ASSETENTITY.value.PRPLARTICLECOMPONENTENTITYCOL?.find(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(amountComponent))?.TAXEXCULSIVEAMT as number;
      if (commissionType == CommissionType.AdminFeeCommission && this.AdminFeeCommissionInd) {
        // this._dataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(this.CalculateOJKCommission(amt));
        // //this.CalculateCommission(CommissionType.GetStringValue(CommissionType.AdminFeeCommission), this._dataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.value);
        // let request = new CommissionCalculationParam();
        // request.PROPOSALARTICLE = this._dataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
        // request.COMMISSIONAMNT = this._dataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.value;
        // request.COMMISSIONTYPE = CommissionType.GetStringValue(CommissionType.AdminFeeCommission);
        // request.CHKEMPLOYEE = this._dataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
        // request.COMMISSIONCALCIND = this._proposalManagerService.CommissionCalcInd;
        // request.BPINTRODUCERID = this._dataService.PROPOSAL.value.BPINTRODUCERID;

        // this._proposalService.CalculateCommissionforScheme(request).subscribe(res => {
        //   console.log(res);
        //   this.RemoveArticleComponent(AmountComponent.AdminFeeCommission);
        //   this.UpdateFinancialAgreementDetail(this._dataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.value, AmountComponent.AdminFeeCommission, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Payable, false);
        // });

      }
      else if (commissionType == CommissionType.ProvisionFeeCommission && this.ProvisionFeeCommissionInd) {
        // this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.setValue(this.CalculateOJKCommission(amt));
        // //this.CalculateCommission(CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission), this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.value);
        // let request = new CommissionCalculationParam();
        // request.PROPOSALARTICLE = this._dataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
        // request.COMMISSIONAMNT = this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.value;
        // request.COMMISSIONTYPE = CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission);
        // request.CHKEMPLOYEE = this._dataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
        // request.COMMISSIONCALCIND = this._proposalManagerService.CommissionCalcInd;
        // request.BPINTRODUCERID = this._dataService.PROPOSAL.value.BPINTRODUCERID;

        // this._proposalService.CalculateCommissionforScheme(request).subscribe(res => {
        //   console.log(res);
        //   this.RemoveArticleComponent(AmountComponent.ProvisionCommission);
        //   this.UpdateFinancialAgreementDetail(this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.value, AmountComponent.ProvisionCommission, this._dataService.PROPOSAL.value.CURRENCYCDE, AssetComponentsFinancialConfiguration.None, this._dataService.PROPOSAL.value.BPINTRODUCERID, 0, AmountClassification.Payable, false);
        // });

      }
      else if (commissionType == CommissionType.MarketingCommission && this.MarketingCommissionInd) {
        let _interestrate = 0;

        if (this.isEffective())
          _interestrate = this._dataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTE.value;
        else
          _interestrate = this._dataService.PROPOSALFINANCIALAGREEMENT.controls.APPLIEDCUSTOMERRTECALCULATED.value;
        if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.COMMISSIONAMOUNTTYPECDE == "00001") {
          if (_interestrate > 0)
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(this.CalculateOJKCommission(this._dataService.PROPOSALFINANCIALAGREEMENT.value.TOTALINTERESTAMT));
          else
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(0);
        }
        else {
          // SOCD-23489
          //this.PROPOSAL_FINANCIAL_AGRM.COMMFIXAMT = this.CalculateOJKCommission(this.PROPOSAL_FINANCIAL_AGRM.OJKTOTALCALCULATEDINCOME);
          this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(this.CalculateOJKCommissionForNewCommission());
        }

        this.RemoveArticleComponent(AmountComponent.JP1Commission);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT, AmountComponent.JP1Commission, this._dataService.PROPOSAL.value.CURRENCYCDE, null, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Payable);
      }
      else if (commissionType == CommissionType.InsuranceCommission && this.InsuranceCommissionInd) {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.setValue(this.CalculateOJKCommission(amt));
        this.RemoveArticleComponent(AmountComponent.DealerInsuranceCommission);
        this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.value, AmountComponent.DealerInsuranceCommission, this._dataService.PROPOSAL.value.CURRENCYCDE, null, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Payable);
      }

    }
    else {
      if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this.InsuranceCommissionInd) {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.COMMFIXAMT);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.INSURANCECOMMISSIONAMOUNT);
        this.RemoveArticleComponent(AmountComponent.DealerInsuranceCommission);
        //await this.CalculateCommission(CommissionType.GetStringValue(CommissionType.InsuranceCommission), this._dataService.PROPOSALFINANCIALAGREEMENT.value.OJKINSURANCECOMMISSIONAMT);
        let request = new CommissionCalculationParam();
        request.PROPOSALARTICLE = this._dataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
        request.COMMISSIONAMNT = this._dataService.PROPOSALFINANCIALAGREEMENT.value.OJKINSURANCECOMMISSIONAMT;
        request.COMMISSIONTYPE = CommissionType.GetStringValue(CommissionType.InsuranceCommission);
        request.CHKEMPLOYEE = this._dataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
        request.COMMISSIONCALCIND = this._proposalManagerService.CommissionCalcInd;
        request.BPINTRODUCERID = this._dataService.PROPOSAL.value.BPINTRODUCERID;

        this._proposalService.CalculateCommissionforScheme(request).subscribe(res => {
          // console.log(res);
          this.UpdateFinancialAgreementDetail(this._dataService.PROPOSALFINANCIALAGREEMENT.value.OJKINSURANCECOMMISSIONAMT, AmountComponent.DealerInsuranceCommission, this._dataService.PROPOSAL.value.CURRENCYCDE, null, this._dataService.PROPOSAL.value.BPINTRODUCERID, 1, AmountClassification.Payable);
        });
      }
    }
    return true;
  }

  public CalculateOJKCommission(componentAmount: number) {
    let ojkCommissionAmt = 0;
    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null) {
      ojkCommissionAmt = componentAmount * this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.OJKMAXCOMMISSIONPCT / 100;
    }
    return Math.round(((ojkCommissionAmt) + Number.EPSILON) * 100) / 100;
  }

  public CalculateOJKCommissionForNewCommission() {
    let limit = 0;
    let maxCommPct = 0;
    try {
      let provisionfeeincome = 0;
      let Adminfeeincome = 0;
      let insuranceincome = 0;
      maxCommPct = this._dataService.PROPOSALCOMMISSIONENTITY.value[0].PRPLCOMM.OJKMAXCOMMISSIONPCT;
      if (this.OJKTotalIncomeComponents.filter(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee)).length > 0)
        provisionfeeincome = this.OJKTotalIncomeComponents.find(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee))?.TAXEXCULSIVEAMT as number;
      if (this.OJKTotalIncomeComponents.filter(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee)).length > 0)
        Adminfeeincome = this.OJKTotalIncomeComponents.find(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee))?.TAXEXCULSIVEAMT as number;
      if (this.OJKTotalIncomeComponents.filter(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission)).length > 0)
        insuranceincome = this.OJKTotalIncomeComponents.find(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission))?.TAXEXCULSIVEAMT as number;

      // limit = (+(Math.round(((provisionfeeincome * maxCommPct) / 100) * 100) / 100).toFixed(2))
      //   + (+(Math.round(((Adminfeeincome * maxCommPct) / 100) * 100) / 100).toFixed(2))
      //   + (+(Math.round(((insuranceincome * maxCommPct) / 100) * 100) / 100).toFixed(2))
      //   + (+(Math.round(((this._dataService.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.TOTALINTERESTAMT * maxCommPct) / 100) * 100) / 100).toFixed(2));

      limit = this._proposalManagerService.Sharpen((provisionfeeincome * maxCommPct) / 100)
        + this._proposalManagerService.Sharpen((Adminfeeincome * maxCommPct) / 100)
        + this._proposalManagerService.Sharpen((insuranceincome * maxCommPct) / 100)
        + this._proposalManagerService.Sharpen((this._dataService.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.TOTALINTERESTAMT * maxCommPct) / 100)

    }
    catch (e) {
      limit = Math.round(((((maxCommPct / 100) * this._dataService.ASSETENTITY.value.PROPOSALFINANCIALAGREEMENT.OJKTOTALCALCULATEDINCOME) + Number.EPSILON) * 100) / 100);
    }

    return this._proposalManagerService.Sharpen(limit);
  }

  public get OJKTotalIncomeComponents() {

    let OJKTotalIncomeComponents = new Array() as Array<IProposalArticleComponentEntity>
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance
      && this._dataService.PROPOSALARTICLE.value.length > 0 && this._dataService.PROPOSALARTICLE.value[this._dataService.PROPOSALARTICLE.value.length - 1].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.length > 0) {
      if (this._dataService.PROPOSALARTICLE.value.length > 0 && this._dataService.PROPOSALARTICLE.value[this._dataService.PROPOSALARTICLE.value.length - 1].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.length > 0) {
        let AdminFeeComponent = this._dataService.PROPOSALARTICLE.value[this._dataService.PROPOSALARTICLE.value.length - 1].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.find(p => p.RowState != DataRowState.Removed && p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee)) as IProposalArticleComponentEntity;
        let ProvisionFeeComponent = this._dataService.PROPOSALARTICLE.value[this._dataService.PROPOSALARTICLE.value.length - 1].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.find(p => p.RowState != DataRowState.Removed && p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee)) as IProposalArticleComponentEntity;
        let InsuranceCommissionComponent = this._dataService.PROPOSALARTICLE.value[this._dataService.PROPOSALARTICLE.value.length - 1].ASSETENTITY.PRPLARTICLECOMPONENTENTITYCOL.find(p => p.RowState != DataRowState.Removed && p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission)) as IProposalArticleComponentEntity;
        if (AdminFeeComponent)
          OJKTotalIncomeComponents.push(AdminFeeComponent)
        if (ProvisionFeeComponent)
          OJKTotalIncomeComponents.push(ProvisionFeeComponent)
        if (InsuranceCommissionComponent)
          OJKTotalIncomeComponents.push(InsuranceCommissionComponent)

        OJKTotalIncomeComponents.forEach(item => {
          if (item.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee))
            item.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetDescriptionStringValue(AmountComponent.AdminFee)
          else if (item.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee))
            item.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetDescriptionStringValue(AmountComponent.ProvisionFee)
          else if (item.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission))
            item.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetDescriptionStringValue(AmountComponent.InsuranceCommission)
        })
      }
    }
    return OJKTotalIncomeComponents;

  }

  public get AdminFeeCommissionInd() {
    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE != null) {
      if (this.CommissionCalcInd) {
        if (this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)) {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISADMINFEECOMMISSIONBIKE) {
            return true;
          }
          else {
            this._dataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(0);
            this.RemoveArticleComponent(AmountComponent.AdminFeeCommission);
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.AdminFeeCommission));
            return false;
          }
        }
        else {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISADMINFEECOMMISSIONCAR) {
            return true;
          }
          else {
            this._dataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(0);
            this.RemoveArticleComponent(AmountComponent.AdminFeeCommission);
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.AdminFeeCommission));
            return false;
          }
        }
      }
      else {
        this._dataService.ASSETENTITY.controls.PROPOSALADMINFEEDETAIL.controls.DEALERADMINFEECOMMISSION.setValue(0);
        this.RemoveArticleComponent(AmountComponent.AdminFeeCommission);
        this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.AdminFeeCommission));
        return false;
      }
    }
    else {

      //   this.PROPOSAL_ADMIN_FEE_DETAIL.DEALERADMINFEECOMMISSION = 0;
      //RemoveArticleComponent(AmountComponent.AdminFeeCommission);
      //ResetCommissionAmounts(CommissionType.AdminFeeCommission.GetStringValue());
      return false;
    }

  }

  public get ProvisionFeeCommissionInd() {
    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE != null) {
      if (this.CommissionCalcInd) {
        if (this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)) {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISPROVISIONFEECOMMISSIONBIKE) {
            return true;
          }
          else {
            this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.setValue(0);
            this.RemoveArticleComponent(AmountComponent.ProvisionCommission);
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission));
            return false;
          }
        }
        else {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISPROVISIONFEECOMMISSIONCAR) {
            return true;
          }
          else {
            this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.setValue(0);
            this.RemoveArticleComponent(AmountComponent.ProvisionCommission);
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission));
            return false;
          }
        }
      }
      else {
        this._dataService.ASSETENTITY.controls.PROPOSALPROVISIONFEEDETAIL.controls.PROVISIONFEECOMMISSION.setValue(0);
        this.RemoveArticleComponent(AmountComponent.ProvisionCommission);
        this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission));
        return false;
      }

    }
    else {

      // this.PROPOSAL_PROVISION_FEE_DETAIL.PROVISIONFEECOMMISSION = 0;
      //RemoveArticleComponent(AmountComponent.ProvisionCommission);
      //ResetCommissionAmounts(CommissionType.ProvisionFeeCommission.GetStringValue());
      return false;
    }

  }

  public get MarketingCommissionInd() {
    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE != null) {
      if (this.CommissionCalcInd) {
        if (this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)) {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISMARKETINGCOMMISSIONBIKE
            && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLMKTGCOMM.length > 0) {
            return true;
          }
          else {
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(0);
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(0);
            this.RemoveArticleComponent(AmountComponent.JP1Commission);
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.MarketingCommission));
            return false;
          }
        }
        else {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISMARKETINGCOMMISSIONCAR
            && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLMKTGCOMM.length > 0) {
            return true;
          }
          else {
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(0);
            this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(0);
            this.RemoveArticleComponent(AmountComponent.JP1Commission);
            this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.MarketingCommission));
            return false;
          }
        }
      }
      else {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKMARKETINGCOMMISSIONAMT.setValue(0);
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMFIXAMT.setValue(0);
        this.RemoveArticleComponent(AmountComponent.JP1Commission);
        this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.MarketingCommission));
        return false;
      }

    }
    else {      // this.PROPOSAL_FINANCIAL_AGRM.COMMFIXAMT = 0;
      //RemoveArticleComponent(AmountComponent.JP1Commission);
      //ResetCommissionAmounts(CommissionType.MarketingCommission.GetStringValue());
      return false;
    }
  }

  public get InsuranceCommissionInd() {

    if (this._dataService.ASSETENTITY.value != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length > 0
      && this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM != null
      && this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE != null
      && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {
      if (this.CommissionCalcInd) {
        if (this._dataService.ASSETENTITY.value.PROPOSALASSET.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)) {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISINSURANCECOMMISSIONBIKE) {
            return true;
          }
          else {
            this.ResetInsuranceCommissionValues();
            return false;
          }
        }
        else {
          if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY[0].PRPLCOMM.ISINSURANCECOMMISSIONCAR) {
            return true;
          }
          else {
            this.ResetInsuranceCommissionValues();
            return false;
          }
        }
      }
      else {
        this.ResetInsuranceCommissionValues();
        return false;
      }
    }
    else {
      //     this.PROPOSAL_FINANCIAL_AGRM.MAXINSURANCECOMMISSIONAMOUNT = 0;
      //this.PROPOSAL_FINANCIAL_AGRM.INSURANCECOMMISSIONAMOUNT = 0;
      //RemoveArticleComponent(AmountComponent.InsuranceCommission);
      //ResetCommissionAmounts(CommissionType.InsuranceCommission.GetStringValue());
      return false;
    }

  }

  public ResetInsuranceCommissionValues() {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCECOMMISSIONAMOUNT.setValue(0);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.MAXINSURANCECOMMISSIONAMOUNT.setValue(0);

    this.RemoveArticleComponent(AmountComponent.DealerInsuranceCommission);
    this.ResetCommissionAmounts(CommissionType.GetStringValue(CommissionType.InsuranceCommission));
  }

  public isEffective() {
    //if (!isRefinance() && this.PROPOSAL_FINANCIAL_AGRM != null &&
    if (this._dataService.PROPOSALFINANCIALAGREEMENT.value != null &&
      (this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALCALCMTD == RentalCalculationMethod.EqualPrincipal
        || this._dataService.PROPOSALFINANCIALAGREEMENT.value.RENTALCALCMTD == RentalCalculationMethod.Annuity))
      return true;
    else return false;
  }

  public SetDefaultMarketCommissionSetting(fp: IFinancialProductEntity) {
    // let item = new IProposalCommissionEntity();
    // this.PROPOSAL_ASSET.PROPOSALCOMMISSIONENTITY.Add(item);
    if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY.length == 0) {
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.push(this._ProposalForm.PropsalCommissionForm());
    }
    if (this._dataService.ASSETENTITY.value.PROPOSALCOMMISSIONENTITY != null) {
      let _COMMAPLCCNFG = fp.AttachedTemplateEntity.AttachedPeriodicConfigurationEntity.COMMAPLCCNFG;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.BRANCHID.setValue(this._dataService.PROPOSAL.value.BPCOMPANYBRANCHID);
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.DEALERID.setValue(this._dataService.PROPOSAL.value.BPINTRODUCERID);

      let isAdminFeeCommissionCAR = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.AdminFeeCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Car)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISADMINFEECOMMISSIONCAR.setValue(isAdminFeeCommissionCAR);

      let isInsuranceConnissionCAR = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.InsuranceCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Car)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISINSURANCECOMMISSIONCAR.setValue(isInsuranceConnissionCAR);

      let isMarketingCommissionCAR = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Car)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISMARKETINGCOMMISSIONCAR.setValue(isMarketingCommissionCAR);

      let aisProvisionFeeCommissionCAR = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Car)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISPROVISIONFEECOMMISSIONCAR.setValue(aisProvisionFeeCommissionCAR);

      let IsCommissionCAR = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.SOFCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Car)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISCOMMISSIONCAR.setValue(IsCommissionCAR);

      let IsInsuranceCommissionBike = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.InsuranceCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISINSURANCECOMMISSIONBIKE.setValue(IsInsuranceCommissionBike);

      let isMarketingCommissionBike = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISMARKETINGCOMMISSIONBIKE.setValue(isMarketingCommissionBike);

      let isProvisionFeeCommissionBike = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.ProvisionFeeCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISPROVISIONFEECOMMISSIONBIKE.setValue(isProvisionFeeCommissionBike)

      let isAdminFeeCommissionBike = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.AdminFeeCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISADMINFEECOMMISSIONBIKE.setValue(isAdminFeeCommissionBike);

      let isCommissionBike = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.SOFCommission) && p.ASSETTYPECDE == AssetTypeCodeCF.GetStringValue(AssetTypeCodeCF.Bike)).length > 0 ? true : false;
      this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.ISCOMMISSIONBIKE.setValue(isCommissionBike);

      try {
        if (_COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission)).length > 0) {
          let commissionAmountTypeCode = _COMMAPLCCNFG.filter(p => p.COMMISSIONTYPECDE == CommissionType.GetStringValue(CommissionType.MarketingCommission))[0]?.COMMISSIONAMOUNTTYPECDE;
          this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.COMMISSIONAMOUNTTYPECDE.setValue(commissionAmountTypeCode);
        }
      }
      catch (Exception) {
        this._dataService.ASSETENTITY.controls.PROPOSALCOMMISSIONENTITY.controls[0].controls.PRPLCOMM.controls.COMMISSIONAMOUNTTYPECDE.setValue("00002");
      }
    }
  }

  public CalculateAllOJKComissions() {
    //(this.ParentContainer as ProposalNew).GetVisualParent<System.Windows.Controls.BusyIndicator>().IsBusy = true;
    //(this.ParentContainer as ProposalNew).GetVisualParent<System.Windows.Controls.BusyIndicator>().BusyContent = Utilities.GetMessageDescfrmCode("Calculating OJK Commission");
    //StartBusyIndicator(Utilities.GetMessageDescfrmCode("Calculating OJK Commission"));

    //await Controller.ReCalculateOJKCommission(AmountComponent.AdminFee, CommissionType.AdminFeeCommission);
    //await Controller.ReCalculateOJKCommission(AmountComponent.ProvisionFee, CommissionType.ProvisionFeeCommission);
    //await Controller.ReCalculateOJKCommission(AmountComponent.InsuranceCommission, CommissionType.InsuranceCommission);
    this.ReCalculateOJKCommission(AmountComponent.JP1Commission, CommissionType.MarketingCommission);
    //Controller.calculateMaxSOFCommission();
    /// SOCD-17843
    //await Controller.CalculateUnAllocatedExpense();

    //EnableReCalOJKButton();

    //(this.ParentContainer as ProposalNew).GetVisualParent<System.Windows.Controls.BusyIndicator>().IsBusy = false;
    //(this.ParentContainer as ProposalNew).GetVisualParent<System.Windows.Controls.BusyIndicator>().BusyContent = Utilities.GetMessageDescfrmCode("Calculating OJK Commission");
    //StopBusyIndicator();

    return true;
  }

  public CalculateInsuranceCommissionToPIC() {
    //MAXIMUM DEALER INSURANCE COMMISION
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance
      && this._dataService.PROPOSALFINANCIALAGREEMENT.value != null && this._dataService.PROPOSALFINANCIALAGREEMENT.value.DEALERPCT > 0
      && this._dataService.ASSETENTITY.value.PROPOSALINSURANCEMAIN != null && (this._dataService.ASSETENTITY.value.PROPOSALINSURANCEMAIN.find(x => x.RowState != DataRowState.Removed) as IMainInsuranceEntity).PRPLINSR != null
      && this.InsuranceCommissionInd) {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.MAXINSURANCECOMMISSIONAMOUNT.setValue((this._dataService.PROPOSALFINANCIALAGREEMENT.value.INSURANCEPREMIUM * this._dataService.PROPOSALFINANCIALAGREEMENT.value.DEALERPCT) / 100);
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSURANCECOMMISSIONAMOUNT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.MAXINSURANCECOMMISSIONAMOUNT);
      if (!this.OJKCommissionEffectiveInd) {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.setValue(this._dataService.PROPOSALFINANCIALAGREEMENT.value.INSURANCECOMMISSIONAMOUNT);
      }
      else {
        let amt = this._dataService.ASSETENTITY.value.PRPLARTICLECOMPONENTENTITYCOL.find(p => p.PRPLARTEAMNTTRAN.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission))?.TAXEXCULSIVEAMT as number;
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.OJKINSURANCECOMMISSIONAMT.setValue(this.CalculateOJKCommission(amt))
      }
      //this.CalculateCommission(CommissionType.InsuranceCommission.GetStringValue(), this.PROPOSAL_FINANCIAL_AGRM.OJKINSURANCECOMMISSIONAMT);
    }
  }

  public DoubleCheckInsuranceforPACMAS() {
    // //Asset Usage
    // let MainInsuranceEntity = this._dataService.ASSETENTITY.controls.PROPOSALINSURANCEMAIN.controls.find(x => x.controls.RowState.value != DataRowState.Removed) as FormGroup<IMainInsuranceEntity>;
    // if (MainInsuranceEntity.controls.PRPLINSR.controls.ASSETUSAGECDE.value == null)
    //     MainInsuranceEntity.controls.PRPLINSR.controls.ASSETUSAGECDE.setValue(InsuranceAssetUsageType.NonCommercial);

    // //Policy Number
    // if (MainInsuranceEntity.value.PRPLINSR.POLICYNBR)
    // {
    //     let task3 = this.ReadBPInsuranceDetailInsurance(Convert.ToInt32(Controller.MainInsuranceEntity.PRPLINSR.INSURER), RoleCode.InsuranceCompany, this._dataService.PROPOSALASSET.value.ASSETTYPECDE, this._dataService.PROPOSALASSET.value.PROPOSALASSET.ASSETSUBTYPCDE);
    //     ResponseObject<BP_ROLE_DETLInfo> result3 = await task3;
    //     task3.Dispose();
    //     if (result3.CODE == (int)ReturnCode.Success && result3.ResultSet != null)
    //     {
    //         Controller.MainInsuranceEntity.PRPLINSR.POLICYNBR = result3.ResultSet.POLICYNO;
    //     }
    // }

    // //Insurance Company Branch Id
    // if (Controller.MainInsuranceEntity.PRPLINSR.INSURANCECOMPANYBRANCHID <= 0)
    // {
    //     BusinessPartnerInfoParm param = new BusinessPartnerInfoParm();
    //     param.RoleCode = RoleCode.InsuranceCompanyBranch.GetStringValue();
    //     param.InsuranceCompanyId = Convert.ToInt32(Controller.MainInsuranceEntity.PRPLINSR.INSURER);
    //     param.BranchId = Controller.DataContext.PROPOSAL.BPCOMPANYBRANCHID;
    //     Task<ResponseObject<GenericCollection<BP_MAINInfo>>> task0 = LookupManager.GetInsuranceCompanyBranch(SessionBean.UserSessionObject.User, param);
    //     ResponseObject<GenericCollection<BP_MAINInfo>> result0 = await task0;
    //     task0.Dispose();
    //     GenericCollection<BP_MAINInfo> insuranceCompanyBranch = result0.CODE == (int)ReturnCode.Success && result0.ResultSet != null && result0.ResultSet.m_current.Count > 0 ? result0.ResultSet : null;
    //     if (insuranceCompanyBranch != null
    //         && !insuranceCompanyBranch.Any(p => string.IsNullOrEmpty(p.CODE)))
    //         Controller.MainInsuranceEntity.PRPLINSR.INSURANCECOMPANYBRANCHID = insuranceCompanyBranch.Select(x => x).FirstOrDefault().BUSINESSPARTNERID;
    // }
    // return true;
  }


  public BPKBExpectedOverdueDays(request: any) {

    if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTSTARTDTE !== null && this._dataService.PROPOSALASSET.controls.CONDITION.value !== null) {
      this._proposalService.GetBPKBExpectedOverdueDays(request).subscribe((result: any) => {
        if (result.ResultSet != null) {
          if (result.ResultSet.BPKBOVERDUEDAYS > 0) {
            this.CalculateBPKBExpectedDate(result.ResultSet.BPKBOVERDUEDAYS);
            this.CalculateBPKBOverdueDays();
          }
        }
        else {
          this.CalculateBPKBExpectedDate(0)
          this._dataService.OTOPRPLASSTBPKBDETL.controls.BPKBOVERDUEDAYS.setValue(0);
        }
      }
      );
    }
  }
  CalculateBPKBOverdueDays() {
    if (this._dataService.OTOPRPLASSTBPKBDETL.controls.BPKBEXPECTEDDATE) {
      var processingDate = new Date(
        this.storageService.GetUserInfo().ProcessingDate
      );
      var contractStartDate = new Date(
        this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTSTARTDTE
      );
      let overDueDays = Math.floor(
        (Date.UTC(
          processingDate.getFullYear(),
          processingDate.getMonth(),
          processingDate.getDate()
        ) -
          Date.UTC(
            contractStartDate.getFullYear(),
            contractStartDate.getMonth(),
            contractStartDate.getDate()
          )) /
        (1000 * 60 * 60 * 24)
      );
      this._dataService.OTOPRPLASSTBPKBDETL.controls.BPKBOVERDUEDAYS.setValue(
        Math.ceil(overDueDays)
      );
    } else {
      this._dataService.OTOPRPLASSTBPKBDETL.controls.BPKBOVERDUEDAYS.setValue(0);
    }
  }

  public CalculateTaxByComponent(amountComponent: any, commmisionType: any) {
    let param = {} as ICalculationInfoParam;
    param.AssetEntity = this._dataService.ASSETENTITY.value as IAssetEntity;
    param.applicantAddress = this._dataService.PROPOSALAPPLICANT.value.filter(p => p.RowState != 4 && p.PROPOSALAPPLICANT.ROLECDE == "00003")[0].ADDRESS[0]?.PROPOSALAPPLICANTADDRESS as IPRPL_APLT_ADDSInfo;
    // param.TaxBPGeo = ReadTaxBPGeoInfo(this.DrAddress);
    param.EffectiveDate = this.storageService.GetUserInfo().ProcessingDate;
    param.BPINTRODUCERID = this._dataService.PROPOSAL.value.BPINTRODUCERID;
    param.AMOUNTCOMPONENT = amountComponent;
    param.COMMISSIONTYP = commmisionType;

    this._proposalService.CalculateTaxByComponent(param).subscribe((result: any) => {
      if (result != null && result.ResultSet != null) {
        let _assetEntity = result.ResultSet as IAssetEntity;
        _assetEntity.PRPLARTICLECOMPONENTENTITYCOL.forEach(p => {
          if (p.PRPLARTEAMNTTRAN.AMTCMPTCDE == amountComponent && p.RowState != DataRowState.Removed) {
            let _ArticleComponent = this._dataService.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => p.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == amountComponent);
            if (_ArticleComponent != null)
              this.RemoveArticleComponent(AmountComponent.GetEnumByCode(amountComponent));
            this._dataService.PRPLARTICLECOMPONENTENTITYCOL.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), p));
          }
        });
      }
    });
  }
  private SetCompnentDetail(tplerntlcmptcnfg: Array<ITPLE_RNTL_CMPT_ATCHInfo>, ComponentType: string) {
    let collectionRentalTemplateCnfg = new Array<ITPLE_RNTL_CMPT_ATCHInfo>();
    let component = this._ProposalForm.PRPLCMPTCNFGForm();
    collectionRentalTemplateCnfg = tplerntlcmptcnfg.filter(p => p.AMNTCMPTCDE == ComponentType);
    if (collectionRentalTemplateCnfg != null && collectionRentalTemplateCnfg.length > 0) {
      component.controls.AMNTCMPTCDE.setValue(collectionRentalTemplateCnfg[0].AMNTCMPTCDE);
      component.controls.AMNTCMPTCNFG.setValue(collectionRentalTemplateCnfg[0].AMNTCMPTCNFG);
      component.controls.HANDLEDBYCUSTOMERIND.setValue(collectionRentalTemplateCnfg[0].HANDLEDBYCUSTOMERIND);
      component.controls.PAYTOINTRODUCERIND.setValue(collectionRentalTemplateCnfg[0].PAYTOINTRODUCERIND);
    }
    this._dataService.PRPLCMPTCNFG.push(component);
  }

  setHelperValues() {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.MAXSOFCOMMISSION.setValue(this._dataService.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALSOFCOMMISSIONDETAIL.controls.MAXSOFCOMMISSION.value);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALSOFCOMMISSION.setValue(this._dataService.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALSOFCOMMISSIONDETAIL.controls.TOTALSOFCOMMISSION.value);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.SOFJP1COMMISSION.setValue(this._dataService.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALSOFCOMMISSIONDETAIL.controls.SOFJP1COMMISSION.value);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.SOFJP2COMMISSION.setValue(this._dataService.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALSOFCOMMISSIONDETAIL.controls.SOFJP2COMMISSION.value);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.SOFJP2SCHEMECOMMISSION.setValue(this._dataService.PROPOSALARTICLE.controls[0].controls.ASSETENTITY.controls.PROPOSALSOFCOMMISSIONDETAIL.controls.SOFJP2SCHEMECOMMISSION.value);
  }

  //Calculate Charge Tax
  public CalculateChargeTaxes(
    calculationInfoParam: ICalculationInfoParam,
    AssetCharge: FormGroup<IProposalChargeEntity>,
    index: any
  ) {
    let totalChargesTaxInclusive: number = 0;
    this._proposalService
      .CalculateChargesTax(calculationInfoParam)
      .subscribe((res) => {
        this._FormState.ResetFormArrayState(AssetCharge.controls.PRPLCHRGTAX, DataRowState.Removed);
        if (res != null && res.ResultSet != null) {

          res.ResultSet.PRPLCHRGTAX.forEach((item: IPRPL_CHRG_TAXInfo) => {
            this.totalTaxAmountArr[index] = 0;
            this.totalTaxAmountArr[index] += item.TAXAMT;
            AssetCharge.controls.PRPLCHRGTAX.push(this._proposalentitymapper.PRPLCHRGTAXMapper(this._ProposalForm.PRPLCHRGTAXForm(), item));
          });

          if (res.ResultSet.TAXINCULSIVEAMT != 0)
            AssetCharge.controls.TAXINCULSIVEAMT.setValue(res.ResultSet.TAXINCULSIVEAMT);
          else
            AssetCharge.controls.TAXINCULSIVEAMT.setValue(this._dataService.PROPOSALCHARGE.controls[index].controls.TAXINCULSIVEAMT.value);

          if (res.ResultSet.TAXEXCULSIVEAMT != 0)
            AssetCharge.controls.TAXEXCULSIVEAMT.setValue(res.ResultSet.TAXEXCULSIVEAMT);
          else
            AssetCharge.controls.TAXEXCULSIVEAMT.setValue(this._dataService.PROPOSALCHARGE.controls[index].controls.TAXEXCULSIVEAMT.value);
        }
        // let arr = this._formBuilder.array(
        //   AssetCharge.controls.PRPLCHRGTAX.controls.map((r: any) => this._formBuilder.group(r))
        // );
        // this.PRPLCHRGTAXDataset[index] = arr;
        // this._proposalentitymapper.ProposalChargeEntityMapper(
        //   this._dataService.PROPOSALARTICLE.controls[
        //     this._dataService.PROPOSALARTICLE.controls.length - 1
        //   ].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls[index],
        //   AssetCharge
        // );
        this._dataService.PROPOSALARTICLE.controls[
          this._dataService.PROPOSALARTICLE.controls.length - 1
        ].controls.ASSETENTITY.controls.PROPOSALCHARGE.controls.forEach((x) => {
          if (
            (x.controls.TAXINCULSIVEAMT.value > 0 ||
              x.controls.TAXINCULSIVEAMT.value != undefined) &&
            x.value.RowState !== DataRowState.Removed
          ) {
            totalChargesTaxInclusive += x.controls.TAXINCULSIVEAMT.value;
          }
        });
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.setValue(
          totalChargesTaxInclusive
        );
        this.CreateChargesAgreementDetail();
        return AssetCharge;
      });
  }

  // First Payment
  get FirstPayment() {
    let FC = this._formBuilder.array<IProposalArticleComponentEntity>([]);
    if (this._dataService.ASSETENTITY != null &&
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL != null) {
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.forEach(entity => {
        // foreach(ProposalArticleComponentEntity entity in PROPOSAL_ASSET.PRPLARTICLECOMPONENTENTITYCOL)
        // {
        if (entity.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.value == AssetComponentsFinancialConfiguration.Upfront
          && entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value != AmountComponent.GetStringValue(AmountComponent.ApplicationUpfrontCharges)) {

          if (AmountComponent.GetStringValue(AmountComponent.DownpaymentDeposit) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value
            && entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.value == AmountClassification.Receivable) {
            if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.DOWNPAYMENTPAIDTOINTIND.value)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
          }

          if (AmountComponent.GetStringValue(AmountComponent.FirstRental) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value) {
            if (this._dataService.PROPOSALFINANCIALAGREEMENT.controls.INSTALMENTPAYTOINTRODUCER.value)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
          }

          if (AmountComponent.GetStringValue(AmountComponent.PolicyFee) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value
            && entity.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.value == AssetComponentsFinancialConfiguration.Upfront
            && entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.value != AmountClassification.Nettingoff) {
            let cmpt_cnfg = this._dataService.PRPLCMPTCNFG.value.filter(p => p.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee))[0];
            if (cmpt_cnfg != null) {
              if (cmpt_cnfg.PAYTOINTRODUCERIND)
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
              else
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
              entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
              FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
            }
          }
          if (AmountComponent.GetStringValue(AmountComponent.FiduciaFee) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value
            && entity.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.value == AssetComponentsFinancialConfiguration.Upfront
            && entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.value != AmountClassification.Nettingoff) {
            let cmpt_cnfg = this._dataService.PRPLCMPTCNFG.value.filter(p => p.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee))[0];
            if (cmpt_cnfg != null) {
              if (cmpt_cnfg.PAYTOINTRODUCERIND)
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
              else
                entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
              entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
              FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
            }
          }
          if (AmountComponent.GetStringValue(AmountComponent.UpfrontInsurancePremium) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value
            && entity.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.value == AssetComponentsFinancialConfiguration.Upfront
            && entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.value != AmountClassification.Nettingoff) {
            if (this._dataService.PRPLINSR?.controls.RECEIVEBYDEALERIND.value)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontAdminFee) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value
            && entity.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.value == AssetComponentsFinancialConfiguration.Upfront
            && entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.value == AmountClassification.Receivable) {
            if (this._dataService.PROPOSALADMINFEEDETAIL.controls.RECEIVEDBYDEALERIND.value)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
          }

          if (AmountComponent.GetStringValue(AmountComponent.UpfrontProvisionFee) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value
            && entity.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.value == AssetComponentsFinancialConfiguration.Upfront
            && entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.value == AmountClassification.Receivable) {
            if (this._dataService.PROPOSALPROVISIONFEEDETAIL.controls.RECEIVEDBYDEALERIND.value)
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(true);
            else
              entity.controls.PRPLARTEAMNTTRAN.controls.PAYTODEALERIND.setValue(false);
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
          }

          if (AmountComponent.GetStringValue(AmountComponent.ETFromSOLOs) == entity.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value
            && entity.controls.PRPLARTEAMNTTRAN.controls.CMPTFINETYPECDE.value == AssetComponentsFinancialConfiguration.Upfront
            && entity.controls.PRPLARTEAMNTTRAN.controls.AMOUNTCLASSIFICATIONCDE.value == AmountClassification.Nettingoff) {
            entity.controls.PRPLARTEAMNTTRAN.controls.FIRSTPAYMENTIND.setValue(true);
            FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), entity.value as IProposalArticleComponentEntity));
          }
          FC.controls.map((r) => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.value.PRPLARTEAMNTTRAN.AMTCMPTCDE))));
          //FC.controls.forEach(p => p.value.PRPLARTEAMNTTRAN.AMTCOMPONENTDESC = AmountComponent.GetStringValueByCode(p.value.PRPLARTEAMNTTRAN.AMTCMPTCDE));

        }
      });
      let Charge = this._proposalManagerService.getChargeTransEntity(false);
      if (Charge != null && Charge.controls.PRPLARTEAMNTTRAN.value != null && Charge.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
        FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), Charge.value as IProposalArticleComponentEntity));

      let Charge2 = this._proposalManagerService.getChargeTransEntity(true);
      if (Charge2 != null && Charge2.controls.PRPLARTEAMNTTRAN.value != null && Charge2.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
        FC.push(this._proposalentitymapper.ProposalArticleComponentEntityMapper(this._ProposalForm.ProposalArticleComponentForm(), Charge2.value as IProposalArticleComponentEntity));
    }
    return FC;
  }
  get NMSIRInflowComponent() {
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease && this._dataService.ASSETENTITY != null &&
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL != null) {
      let _Inflow = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => (
        p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.DownpaymentSubsidy)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceSubsidy)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ContractUpfrontCharges)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ApplicationUpfrontCharges)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FirstRental)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InterestSubsidyRateBased)) ||
        ((p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.UpfrontProvisionFee) ||
          p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFeeSubsidy) ||
          p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.UpfrontAdminFee) ||
          p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.DownpaymentDeposit)
          || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.UpfrontInsurancePremium))
          && p.controls.PRPLARTEAMNTTRAN.value.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable)
        

        && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed
      );
      // let Charge = this._proposalManagerService.getChargeTransEntity(false);
      // if (Charge != null && Charge.controls.PRPLARTEAMNTTRAN.value != null && Charge.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      // _Inflow.push(Charge);
      // let _downpaymet = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.DownpaymentDeposit) && p.value.PRPLARTEAMNTTRAN.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed);
      // if (_downpaymet != null)
      //   _Inflow.push(_downpaymet);
      // let Charge2 = this._proposalManagerService.getChargeTransEntity(true);
      // if (Charge2 != null && Charge2.controls.PRPLARTEAMNTTRAN.value != null && Charge2.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      //   _Inflow.push(Charge2);


      _Inflow.forEach(r => {
        r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE)));
        if (r.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.ApplicationCharges)) {
          let ChargAmt = 0;
          this._dataService.PROPOSALCHARGE.controls.forEach(p => ChargAmt += p.controls.TAXEXCULSIVEAMT.value);
          r.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(ChargAmt)
        }
      });
      return _Inflow;
    }
    return null;
  }
  get NMSIROutflowComponent() {
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && 
      this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease && this._dataService.ASSETENTITY != null &&
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL != null) {
      let _OutFlow = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => (
        p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.JP1Commission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AssetCost)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFeeCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.DealerInsuranceCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsurancePremium)) 
   
      && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed
      );
      if (this._dataService.PRPLCMPTCNFG.controls.find(p => p.value.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee) && p.value.AMNTCMPTCNFG == AssetComponentsFinancialConfiguration.Finance) != null) {
        let _fiduciaFee = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState !== DataRowState.Removed);
        
        
        if (_fiduciaFee != null)
          _OutFlow.push(_fiduciaFee);
      }
      if (this._dataService.PRPLCMPTCNFG.controls.find(p => p.value.AMNTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) && p.value.AMNTCMPTCNFG == AssetComponentsFinancialConfiguration.Finance) != null) {
        let _fiduciaFee = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState !== DataRowState.Removed);
        if (_fiduciaFee != null)
          _OutFlow.push(_fiduciaFee);
      }
      _OutFlow.forEach(r => {
        r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE)));
      });
  
      
     return _OutFlow;
    }
    return null;
  }
  get AcqusitionAddedComponents() {
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease && this._dataService.ASSETENTITY != null &&
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL != null) {
      let _AcqCmpnt = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => ((p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFee)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.InsuranceCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionFee)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ContractFinancedCharges)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ApplicationUpfrontCharges)) ||
        (p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFeeSubsidy)
          && p.controls.PRPLARTEAMNTTRAN.value.AMOUNTCLASSIFICATIONCDE == AmountClassification.Receivable))
        && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed
      );
      let _PolicyFee = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed);
      if (_PolicyFee != null)
        _AcqCmpnt.push(_PolicyFee);
      let _FiduciaFee = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed);
      if (_FiduciaFee != null)
        _AcqCmpnt.push(_FiduciaFee);
      // let Charge = this._proposalManagerService.getChargeTransEntity(false);
      // if (Charge != null && Charge.controls.PRPLARTEAMNTTRAN.value != null && Charge.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      //   _AcqCmpnt.push(Charge);

      // let Charge2 = this._proposalManagerService.getChargeTransEntity(true);
      // if (Charge2 != null && Charge2.controls.PRPLARTEAMNTTRAN.value != null && Charge2.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      //   _AcqCmpnt.push(Charge2);


      _AcqCmpnt.forEach(r => {
        r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE)));
        if (r.controls.PRPLARTEAMNTTRAN.controls.AMTCMPTCDE.value == AmountComponent.GetStringValue(AmountComponent.ApplicationCharges)) {
          let ChargAmt = 0;
          this._dataService.PROPOSALCHARGE.controls.forEach(p => ChargAmt += p.controls.TAXEXCULSIVEAMT.value);
          r.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.setValue(ChargAmt)
        }
      });
      return _AcqCmpnt;
    }
    return null;
  }

  get AcqusitionDeductiveComponents() {
    if (this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.Refinance && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease && this._dataService.ASSETENTITY != null &&
      this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL != null) {
      let _AcqCmpnt = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.filter(p => (p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.JP1Commission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.AdminFeeCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.ProvisionCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.DealerInsuranceCommission)
        || p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.BBNCharge)) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed
      );
      let _PolicyFee = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.PolicyFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed);
      if (_PolicyFee != null)
        _AcqCmpnt.push(_PolicyFee);
      let _FiduciaFee = this._dataService.ASSETENTITY.controls.PRPLARTICLECOMPONENTENTITYCOL.controls.find(p => p.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE == AmountComponent.GetStringValue(AmountComponent.FiduciaFee) && p.controls.PRPLARTEAMNTTRAN.value.RowState != DataRowState.Removed);
      if (_FiduciaFee != null)
        _AcqCmpnt.push(_FiduciaFee);
      // let _Commission = this._proposalManagerService.JP1POEntity();
      // if (_Commission != null && _Commission.controls.PRPLARTEAMNTTRAN.value != null && _Commission.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value > 0)
      //   _AcqCmpnt.push(_Commission);
      _AcqCmpnt.forEach(r => r.controls.PRPLARTEAMNTTRAN.controls.AMTCOMPONENTDESC.setValue(AmountComponent.GetDescriptionStringValue(Number(r.controls.PRPLARTEAMNTTRAN.value.AMTCMPTCDE))));
      return _AcqCmpnt;
    }
    return null;
  }
  public CalculateTotalAcquisitionAmount() {
    let TotalAddedAmount = 0;
    let TotalDeductiveAmount = 0;
    if (this.AcqusitionAddedComponents != null && this.AcqusitionAddedComponents?.length > 0) {
      this.AcqusitionAddedComponents.forEach(p => TotalAddedAmount += p.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value);
    }
    if (this.AcqusitionDeductiveComponents != null && this.AcqusitionDeductiveComponents?.length > 0) {
      this.AcqusitionDeductiveComponents.forEach(p => TotalDeductiveAmount += p.controls.PRPLARTEAMNTTRAN.controls.INPUTAMT.value);
    }
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.TOTALACQUISITIONINCOME.setValue(TotalAddedAmount - TotalDeductiveAmount);
  }

  DisableForRF(isEnable: boolean) {
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPOACTIVEIND.setValue(isEnable);
    this._dataService.PROPOSALFINANCIALAGREEMENT.controls.COMMISSIONINCLUDETOPO.setValue(isEnable);
  }

  calculateNMSIR() {
    if (this._dataService.PROPOSAL.value.FINANCETYP != null && this._dataService.PROPOSAL.value.FINANCETYP != FinanceType.OperatingLease) {
      let param = new CommissionCalculationParam();
      param.PROPOSALARTICLE = this._dataService.PROPOSALARTICLE.value.find(x => x.PROPOSALARTICLE.RowState != DataRowState.Removed) as IProposalArticleEntity;
      param.CHKEMPLOYEE = this._dataService.PROPOSALAPPLICANT.value[0].INDIVIDUALAPPLICANT.PROPOSALAPPLICANTINDIVIDUAL.ISOTOEMPLOYEEIND;
      param.PRPLCMPTCNFG = this._dataService.PRPLCMPTCNFG.value as Array<IPRPL_CMPT_CNFGInfo>;
      param.PROPOSALTEMPLATERENTALINT = this._dataService.ProposalEntity.value.PROPOSALTEMPLATERENTALINT as IPRPL_TPLE_RNTL_INTInfo;
      param.rentalFrequency = this.rentalFrequency;
      this._proposalService.CalculateNMSIR(param).pipe(takeUntil(this.subscription$)).subscribe(res => {
        this._dataService.PROPOSALFINANCIALAGREEMENT.controls.NMSIR.setValue(res.ResultSet);
      })
    }
    else {
      this._dataService.PROPOSALFINANCIALAGREEMENT.controls.NMSIR.setValue(0);
    }
  }

  public CountRentalTerms() {
    let rentalStructureCountParam = {} as RentalStructureCountParam;
    rentalStructureCountParam.Terms = this._dataService.PROPOSALFINANCIALAGREEMENT.value.CONTRACTTRM;

    rentalStructureCountParam.RentalFrequency = this.rentalFrequency;
    rentalStructureCountParam.ResidualAmount = this._dataService.PROPOSALFINANCIALAGREEMENT.value.RESIDUALAMT;
    rentalStructureCountParam.RVorBaloonIncluded = (this._dataService.PROPOSALFINANCIALAGREEMENT.value.PRODUCTTYP == RVBalloonType.Balloon) ? true : false;

    this._proposalService.CalculateRentalStructureCount(rentalStructureCountParam).pipe(takeUntil(this.subscription$)).subscribe((resp: any) => {
      if (resp.CODE == 1 && resp.ResultSet != null)
        return resp.ResultSet;
    })
  }


  get contractTerms() {
    return this._dataService.PROPOSALFINANCIALAGREEMENT.controls.CONTRACTTRM.value + this._dataService.PROPOSALFINANCIALAGREEMENT.controls.GPTERMS.value;
  }
}
