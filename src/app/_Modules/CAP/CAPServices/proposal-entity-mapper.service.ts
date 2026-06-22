import { Injectable } from '@angular/core';
import { MasterDataService } from '@NFS_Core/NFSServices/MasterData/master-data.service';
import { StateManagment } from '@NFS_Core/RowStateManagement/FormStateManagement';
import { IAssetEntity, IJP1JP2RecipientEntity, IJP2RecipientEntity, IOTO_PRPL_ASST_BPKB_DETLInfo, IProposalApplicantEntity, IProposalArticleEntity, IProposalCommissionEntity, IProposalEntity, IPRPLInfo, IPRPL_ADMN_FEE_DETLInfo, IPRPL_CHRTInfo, IPRPL_CMPT_CNFGInfo, IPRPL_COMMInfo, IPRPL_COMM_SCHMInfo, IPRPL_DELR_PIC_ASSNInfo, IPRPL_FINL_AGRMInfo, IPRPL_IOPS_USERInfo, IPRPL_JP1_JP2_ROLE_RPNTInfo, IPRPL_JP1_JP2_RPNTInfo, IPRPL_JP1_JP2_RPNT_TAXInfo, IPRPL_JP2_RPNTInfo, IPRPL_JP2_RPNT_TAXInfo, IPRPL_MKTG_COMMInfo, IPRPL_PRVN_FEE_DETLInfo, IPRPL_TPLE_COMM_CNFGInfo, IPRPL_TPLE_INCM_CNFGInfo, IPRPL_TPLE_RNTL_INTInfo } from "@NFS_Entity/Proposal-Entity/ProposalEntity.model.index";
import { IAddressEntity, IBP_CRDT_RTNG_CODEInfo, IBP_MAINInfo, ICashFlowEntity, ICompanyApplicantEntity, ICONT_EXPRInfo, IExposureEntity, IFamilyExposureEntity, IFMLY_BLAK_LIST_EXPRInfo, IFMLY_CMS_EXPRInfo, IFMLY_POS_EXPRInfo, IIndividualApplicantEntity, IMEET_TYPE_CODEInfo, IMPOS_APLT_DCMTInfo, IOTO_PRPL_APLT_FAMInfo, IProposalApplicantBusinessEntity, IPRPL_ADDS_TYP_DETLInfo, IPRPL_APLTInfo, IPRPL_APLT_ADDS_RESEInfo, IPRPL_APLT_BANKInfo, IPRPL_APLT_BUSInfo, IPRPL_APLT_BUS_SUPPInfo, IPRPL_APLT_COMYInfo, IPRPL_APLT_EMPTInfo, IPRPL_APLT_ENTRInfo, IPRPL_APLT_FINL_DETLInfo, IPRPL_APLT_ID_DETLInfo, IPRPL_APLT_INDVInfo, IPRPL_APLT_MAINInfo, IPRPL_APLT_NET_PRFTInfo, IPRPL_APLT_PHNE_FAXInfo, IPRPL_APLT_PRNL_RFRNInfo, IPRPL_APLT_ROLEInfo, IPRPL_APLT_RPRSInfo, IPRPL_APLT_SPUS_DETLInfo, IPRPL_BLAK_LISTInfo, IPRPL_CRDT_CARD_DETLInfo, IPRPL_CSFL_DETLInfo, IPRPL_EXPRInfo, IPRPL_FILD_VIST_APMTInfo, IPRPL_FINL_RATOInfo, IPRPY_LOCN_CODEInfo, ISOCL_INTR_CODEInfo } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalApplicantEntity/ProposalApplicantEntity.model.index';
import { IFINE_TYPE_INCM_CNFGInfo, IINSR_DPRN_PLCYInfo, IMainInsuranceEntity, IProposalArticleComponentEntity, IProposalChargeEntity, IProposalRepaymentPlanEntity, IProposalTruckDetailEntity, IPRPL_ACCYInfo, IPRPL_ADDL_INSRInfo, IPRPL_ADDL_INSR_DETLInfo, IPRPL_ARTEInfo, IPRPL_ARTE_AMNT_TRANInfo, IPRPL_ARTE_AMNT_TRAN_TAXInfo, IPRPL_ARTE_BASE_RATEInfo, IPRPL_ARTE_CHRT_DETLInfo, IPRPL_ASETInfo, IPRPL_BPKB_GRTR_DETLInfo, IPRPL_BPKB_RPRS_DETLInfo, IPRPL_CHRGInfo, IPRPL_CHRG_TAXInfo, IPRPL_INSRInfo, IPRPL_RNTL_DETLInfo, IPRPL_RPMT_PLANInfo, IPRPL_RPMT_PLAN_TAXInfo, IPRPL_SOF_COMM_DETLInfo, IPRPL_STND_INSRInfo, IPRPL_STND_INSR_DETLInfo, IPRPL_TOTL_TRCK_OWNDInfo, IPRPL_TRCK_OPRT_RVNUInfo, IPRPL_VHCL_DETLInfo, IStandardInsuranceDetailEntity, IStandardInsuranceEntity } from '@NFS_Entity/Proposal-Entity/ProposalSubEntities/ProposalArticleEntity/ProposalArticleEntity.model.index';
import { ApplicantType } from '@NFS_Enums/ApplicantType.enum';
import { DataRowState } from '@NFS_Enums/DataRowState.enum';
import { FormMode } from '@NFS_Enums/FormMode.enum';
import { RentalType } from '@NFS_Enums/RentalType.enum';
import { TaxType } from '@NFS_Enums/TaxType.enum';
import { ProposalDataService } from '@NFS_Modules/CAP/CAPServices/proposal-data.service';
import { FormArray, FormBuilder, FormGroup } from 'src/Library';
import { ProposalEntityFormService } from "./ProposalEntityForm.service";
import { IPRPL_DVTN_TRCK } from '@NFS_Entity/ProposalDTS-Entity/IPRPL_DVTN_TRCK.model';


@Injectable({
  providedIn: 'root'
})
export class ProposalEntityMapperService {
  constructor(private _formBuilder: FormBuilder, private _ProposalEntityFormService: ProposalEntityFormService, private _masterDataService: MasterDataService,
    private _FormState: StateManagment, public _proposaldataService: ProposalDataService,) {
  }

  public ProposalEntityMapper(Proposal: FormGroup<IProposalEntity>, data: IProposalEntity, formMode: FormMode = FormMode.EDIT, _newRowState: DataRowState = DataRowState.None) {

    this.setStateRemoved(Proposal, data);

    Proposal.controls.RowState.setValue(data.RowState);
    this.PROPOSALMapper(Proposal.controls.PROPOSAL, data.PROPOSAL);

    this.PROPOSALUSERMapper(Proposal.controls.PRPLIOPSUSER, data.PRPLIOPSUSER);
    /*Proposal Artical Entity Mapping*/
    this._FormState.ResetFormArrayState(Proposal.controls.PROPOSALARTICLE, DataRowState.Removed);
    data.PROPOSALARTICLE.forEach((item, index) => {
      Proposal.controls.PROPOSALARTICLE.push(this.ProposalArticleMapper(this._ProposalEntityFormService.ProposalArticleForm(), item));
    });

    this.PROPOSALTEMPLATERENTALINTMapper(Proposal.controls.PROPOSALTEMPLATERENTALINT, data.PROPOSALTEMPLATERENTALINT);

    data.PROPOSALTPLECOMMCONFIG.forEach((item, index) => {
      Proposal.controls.PROPOSALTPLECOMMCONFIG.push((this.PROPOSALTPLECOMMCONFIGMapper(this._ProposalEntityFormService.PROPOSALTPLECOMMCONFIGForm(), data.PROPOSALTPLECOMMCONFIG[index])));
    });

    data.PROPOSALTPLEINCMCONFIG.forEach((item, index) => {
      Proposal.controls.PROPOSALTPLEINCMCONFIG.push((this.PROPOSALTPLEINCMCONFIGMapper(this._ProposalEntityFormService.PROPOSALTPLEINCMCONFIGForm(), data.PROPOSALTPLEINCMCONFIG[index])));
    });

    data.PRPLCMPTCNFG.forEach((item, index) => {
      Proposal.controls.PRPLCMPTCNFG.push((this.PRPLCMPTCNFGMapper(this._ProposalEntityFormService.PRPLCMPTCNFGForm(), data.PRPLCMPTCNFG[index])));
    });

    data.PROPOSALAPPLICANT.forEach((item, index) => {
      Proposal.controls.PROPOSALAPPLICANT.push(this.ProposalApplicantEntityMapper(this._ProposalEntityFormService.ProposalApplicantForm(), item));
    });


    data.PROPOSALCHART.forEach((item, index) => {
      Proposal.controls.PROPOSALCHART.push(this.ProposalChartMapper(this._ProposalEntityFormService.ProposalChartInfoForm(), item));
    });

    this.ApplicantSubEntitiesIndexing(Proposal.controls.PROPOSALAPPLICANT)
    this.PROPOSALDVTNTRCKMapper(Proposal.controls.PRPLDVTNTRCK, data.PRPLDVTNTRCK);
  }

  setStateRemoved(Proposal: FormGroup<IProposalEntity>, data: IProposalEntity) {
    this.ProposalArticalSetRowState(Proposal.controls.PROPOSALARTICLE, data);
    this.PROPOSALTPLECOMMCONFIGSetRowState(Proposal.controls.PROPOSALTPLECOMMCONFIG, data);
    this.PROPOSALTPLEINCMCONFIGSetRowState(Proposal.controls.PROPOSALTPLEINCMCONFIG, data);
    this.PRPLCMPTCNFGSetRowState(Proposal.controls.PRPLCMPTCNFG, data);
    this.ProposalApplicantSetRowState(Proposal.controls.PROPOSALAPPLICANT, data);
    this.ProposalChartSetRowState(Proposal.controls.PROPOSALCHART, data);
  }

  public PROPOSALMapper(PROPOSAL: FormGroup<IPRPLInfo>, data: IPRPLInfo): FormGroup<IPRPLInfo> {
    PROPOSAL.controls.RowState.setValue(data.RowState);
    PROPOSAL.patchValue(data); // = this._formBuilder.group<IPRPL_TPLE_RNTL_INTInfo>(data);
    return PROPOSAL;
  }

  public PROPOSALUSERMapper(PROPOSALUSER: FormGroup<IPRPL_IOPS_USERInfo>, data: IPRPL_IOPS_USERInfo): FormGroup<IPRPL_IOPS_USERInfo> {
    PROPOSALUSER.controls.RowState.setValue(data.RowState);
    PROPOSALUSER.patchValue(data); // = this._formBuilder.group<IPRPL_TPLE_RNTL_INTInfo>(data);
    return PROPOSALUSER;
  }

  public ProposalArticalSetRowState(PROPOSALARTICLE: FormArray<IProposalArticleEntity>, data: IProposalEntity) {
    PROPOSALARTICLE.clear();
    // PROPOSALARTICLE.controls.forEach((item, index) => {
    //   if (item.controls.RowState.value !== DataRowState.Added) {
    //     this._FormState.ResetFormState(item, DataRowState.Removed);
    //   }
    //   else {
    //     PROPOSALARTICLE.removeAt(index);
    //   }
    // });
  }

  public PROPOSALTPLECOMMCONFIGSetRowState(PROPOSALTPLECOMMCONFIG: FormArray<IPRPL_TPLE_COMM_CNFGInfo>, data: IProposalEntity) {
    PROPOSALTPLECOMMCONFIG.clear();
    // PROPOSALTPLECOMMCONFIG.controls.forEach((item, index) => {
    //   if (item.controls.RowState.value !== DataRowState.Added) {
    //     this._FormState.ResetFormState(item, DataRowState.Removed);
    //   }
    //   else {
    //     PROPOSALTPLECOMMCONFIG.removeAt(index);
    //   }
    // });
  }

  public PROPOSALTPLEINCMCONFIGSetRowState(PROPOSALTPLEINCMCONFIG: FormArray<IPRPL_TPLE_INCM_CNFGInfo>, data: IProposalEntity) {
    PROPOSALTPLEINCMCONFIG.clear();
    // PROPOSALTPLEINCMCONFIG.controls.forEach((item, index) => {
    //   if (item.controls.RowState.value !== DataRowState.Added) {
    //     this._FormState.ResetFormState(item, DataRowState.Removed);
    //   }
    //   else {
    //     PROPOSALTPLEINCMCONFIG.removeAt(index);
    //   }
    // });
  }

  public PRPLCMPTCNFGSetRowState(PRPLCMPTCNFG: FormArray<IPRPL_CMPT_CNFGInfo>, data: IProposalEntity) {
    PRPLCMPTCNFG.clear();
    // PRPLCMPTCNFG.controls.forEach((item, index) => {
    //   if (item.controls.RowState.value !== DataRowState.Added) {
    //     this._FormState.ResetFormState(item, DataRowState.Removed);
    //   }
    //   else {
    //     PRPLCMPTCNFG.removeAt(index);
    //   }
    // });
  }

  public ProposalApplicantSetRowState(PROPOSALAPPLICANT: FormArray<IProposalApplicantEntity>, data: IProposalEntity) {
    PROPOSALAPPLICANT.clear();
    // PROPOSALAPPLICANT.controls.forEach((item, index) => {
    //   if (item.controls.RowState.value !== DataRowState.Added) {
    //     this._FormState.ResetFormState(item, DataRowState.Removed);
    //   }
    //   else {
    //     PROPOSALAPPLICANT.removeAt(index);
    //   }
    // });
  }

  public ProposalChartSetRowState(PROPOSALCHART: FormArray<IPRPL_CHRTInfo>, data: IProposalEntity) {
    PROPOSALCHART.clear();
  }

  //-- Start Salman Working -- //

  public ProposalApplicantEntityMapper(ProposalApplicant: FormGroup<IProposalApplicantEntity>, data: IProposalApplicantEntity, formMode: FormMode = FormMode.EDIT, _newRowState: DataRowState = DataRowState.None): FormGroup<IProposalApplicantEntity> {

    ProposalApplicant.controls.RowState.setValue(data.RowState);
    if (data.PROPOSALAPPLICANTMAIN)
      ProposalApplicant.controls.PROPOSALAPPLICANTMAIN.patchValue(data.PROPOSALAPPLICANTMAIN);
    if (data.PROPOSALAPPLICANT)
      ProposalApplicant.controls.PROPOSALAPPLICANT.patchValue(data.PROPOSALAPPLICANT);

    if (data.PROPOSALAPPLICANTROLE) {
      data.PROPOSALAPPLICANTROLE.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPLICANTROLE.push(this.ProposalApplicantRoleMapper(this._ProposalEntityFormService.proposalApplicantRoleInfoForm(), data.PROPOSALAPPLICANTROLE[index], formMode));
      });
    }


    if (data.PROPOSALAPPLICANTIDDETAIL) {
      ProposalApplicant.controls.PROPOSALAPPLICANTIDDETAIL.clear();
      data.PROPOSALAPPLICANTIDDETAIL.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPLICANTIDDETAIL.push(this.ProposalApplicantDetailMapper(this._ProposalEntityFormService.proposalIndvidualIdtypeForm(), data.PROPOSALAPPLICANTIDDETAIL[index], formMode));
      });
    }
    ProposalApplicant.controls.PROPOSALAPPLICANTPERSONNALREFERENCE.clear();
    if (data.PROPOSALAPPLICANTPERSONNALREFERENCE && data.PROPOSALAPPLICANTPERSONNALREFERENCE.length > 0) {

      data.PROPOSALAPPLICANTPERSONNALREFERENCE.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPLICANTPERSONNALREFERENCE.push(this.ProposalApplicantPersonalRefMapper(this._ProposalEntityFormService.proposalPersonalReferenceForm(), data.PROPOSALAPPLICANTPERSONNALREFERENCE[index], formMode));
      });
    }

    if (data.PROPAPPCREDITCARDDETAIL) {
      ProposalApplicant.controls.PROPAPPCREDITCARDDETAIL.clear();
      data.PROPAPPCREDITCARDDETAIL.forEach((item, index) => {
        ProposalApplicant.controls.PROPAPPCREDITCARDDETAIL.push(this.ProposalCreditDetailMapper(this._ProposalEntityFormService.proposalCreditCardDetailInfoForm(), data.PROPAPPCREDITCARDDETAIL[index], formMode));
      });
    }

    if (data.ADDRESS && data.ADDRESS.length > 0) {
      ProposalApplicant.controls.ADDRESS.clear();
      data.ADDRESS.forEach((item, index) => {
        ProposalApplicant.controls.ADDRESS.push(this.ProposalApplicantAddressMapper(this._ProposalEntityFormService.ProposalApplicantAddressForm(), item))
      });
    }

    ProposalApplicant.controls.PROPOSALAPPLICANTBANK.clear();
    if (data.PROPOSALAPPLICANTBANK && data.PROPOSALAPPLICANTBANK.length > 0) {
      data.PROPOSALAPPLICANTBANK.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPLICANTBANK.push(this.ProposalBankComponentMapper(this._ProposalEntityFormService.ProposalBankComponentForm(), item));
      });
    }


    if (data.PROPOSALAPPFINANCIALDETAILS)
      data.PROPOSALAPPFINANCIALDETAILS.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPFINANCIALDETAILS.push(this.ProposalFinanceDetailMapper(this._ProposalEntityFormService.proposalFinlDetailInfoForm(), data.PROPOSALAPPFINANCIALDETAILS[index], formMode));
      });

    if (data.COMPANYAPPLICANT)
      this.CompanyApplicantMapper(ProposalApplicant.controls.COMPANYAPPLICANT, data.COMPANYAPPLICANT, formMode);

    if (data.INDIVIDUALAPPLICANT)
      this.IndividualApplicantMapper(ProposalApplicant.controls.INDIVIDUALAPPLICANT, data.INDIVIDUALAPPLICANT);

    if (data.PrposalcashflowDetail)
      this.ProposalCashflowDetailMapper(ProposalApplicant.controls.PrposalcashflowDetail, data.PrposalcashflowDetail, formMode);

    if (data.ProposalExposure)
      this.ProposalExposureMapper(ProposalApplicant.controls.ProposalExposure, data.ProposalExposure, formMode);

    ProposalApplicant.controls.PROPOSALAPPLICANTBUSINESS.clear();
    if (data.PROPOSALAPPLICANTBUSINESS) {

      data.PROPOSALAPPLICANTBUSINESS.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPLICANTBUSINESS.push(this.ProposalApplicantBusiness(this._ProposalEntityFormService.ProposalApplicantBusinessForm(), data.PROPOSALAPPLICANTBUSINESS[index], formMode));
      });
    }

    if (data.PROPOSALAPPLICANTREPRESENTATIVE) {
      ProposalApplicant.controls.PROPOSALAPPLICANTREPRESENTATIVE.clear();
      data.PROPOSALAPPLICANTREPRESENTATIVE.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPLICANTREPRESENTATIVE.push(this.ProposalApplicantRepresentativeMapper(this._ProposalEntityFormService.ProposalApplicantRepresentativeForm(), data.PROPOSALAPPLICANTREPRESENTATIVE[index], formMode));
      });
    }

    if (data.MPOSDOCUMENTS) {
      ProposalApplicant.controls.MPOSDOCUMENTS.clear();
      data.MPOSDOCUMENTS.forEach((item, index) => {
        ProposalApplicant.controls.MPOSDOCUMENTS.push(this.mPOSApplicantDocumentMapper(this._ProposalEntityFormService.mPOSApplicantDocumentInfoForm(), data.MPOSDOCUMENTS[index], formMode));
      });
    }

    // // if (data.MPOSFEILDVISIT)
    // //   ProposalApplicant.controls.MPOSFEILDVISIT = this.ProposalFieldVisitAppointmentMapper(this._ProposalEntityFormService.ProposalFieldVisitAppointmentForm(), data.MPOSFEILDVISIT, formMode);

    if (data.PROPOSALAPPLICANTNETPROFIT) {
      ProposalApplicant.controls.PROPOSALAPPLICANTNETPROFIT.clear();
      data.PROPOSALAPPLICANTNETPROFIT.forEach((item, index) => {
        ProposalApplicant.controls.PROPOSALAPPLICANTNETPROFIT.push(this.ProposalApplicantNetProfMapper(this._ProposalEntityFormService.proposalApplicantNetProfInfoForm(), data.PROPOSALAPPLICANTNETPROFIT[index], formMode));
      });
    }

    if (data.OTOAPLTCTGYCDE) { }
    ProposalApplicant.controls.OTOAPLTCTGYCDE.patchValue(data.OTOAPLTCTGYCDE);

    return ProposalApplicant

  }

  public ProposalApplicantMainMapper(APPLICANTMAIN: FormGroup<IPRPL_APLT_MAINInfo>, data: IPRPL_APLT_MAINInfo, formMode: FormMode): FormGroup<IPRPL_APLT_MAINInfo> {
    APPLICANTMAIN = this._formBuilder.group<IPRPL_APLT_MAINInfo>(data)
    return APPLICANTMAIN;
  }
  public ProposalApplicantMapper(APPLICANT: FormGroup<IPRPL_APLTInfo>, data: IPRPL_APLTInfo, formMode: FormMode): FormGroup<IPRPL_APLTInfo> {
    APPLICANT = this._formBuilder.group<IPRPL_APLTInfo>(data)
    return APPLICANT;
  }
  public ProposalApplicantRoleMapper(APPLICANTROLE: FormGroup<IPRPL_APLT_ROLEInfo>, data: IPRPL_APLT_ROLEInfo, formMode: FormMode): FormGroup<IPRPL_APLT_ROLEInfo> {
    APPLICANTROLE.controls.RowState.setValue(data.RowState);
    APPLICANTROLE.patchValue(data); // = this._formBuilder.group<IPRPL_APLT_ROLEInfo>(data)
    return APPLICANTROLE;
  }
  public ProposalApplicantDetailMapper(APPLICANTDTLE: FormGroup<IPRPL_APLT_ID_DETLInfo>, data: IPRPL_APLT_ID_DETLInfo, formMode: FormMode): FormGroup<IPRPL_APLT_ID_DETLInfo> {
    APPLICANTDTLE.controls.RowState.setValue(data.RowState);
    APPLICANTDTLE.patchValue(data); // = this._formBuilder.group<IPRPL_APLT_ID_DETLInfo>(data)
    return APPLICANTDTLE;
  }
  public ProposalApplicantPersonalRefMapper(APPLICANTREF: FormGroup<IPRPL_APLT_PRNL_RFRNInfo>, data: IPRPL_APLT_PRNL_RFRNInfo, formMode: FormMode): FormGroup<IPRPL_APLT_PRNL_RFRNInfo> {
    APPLICANTREF.patchValue(data);
    return APPLICANTREF;
  }
  public ProposalBankComponentMapper(APPLICANTBANK: FormGroup<IPRPL_APLT_BANKInfo>, data: IPRPL_APLT_BANKInfo): FormGroup<IPRPL_APLT_BANKInfo> {
    APPLICANTBANK.patchValue(data)
    return APPLICANTBANK;
  }
  public ProposalCreditDetailMapper(PROPAPPCREDITCARDDETAIL: FormGroup<IPRPL_CRDT_CARD_DETLInfo>, data: IPRPL_CRDT_CARD_DETLInfo, formMode: FormMode): FormGroup<IPRPL_CRDT_CARD_DETLInfo> {
    PROPAPPCREDITCARDDETAIL.controls.RowState.setValue(data.RowState);
    PROPAPPCREDITCARDDETAIL.patchValue(data); // = this._formBuilder.group<IPRPL_CRDT_CARD_DETLInfo>(data)
    return PROPAPPCREDITCARDDETAIL;
  }

  public ProposalApplicantAddressMapper(Address: FormGroup<IAddressEntity>, data: IAddressEntity): FormGroup<IAddressEntity> {

    if (data.PROPOSALAPPLICANTADDRESS)
      Address.controls.PROPOSALAPPLICANTADDRESS.patchValue(data.PROPOSALAPPLICANTADDRESS);
    //if (data.PROPOSALAPPLICANTRESIDANCE)
    //Address.controls.PROPOSALAPPLICANTRESIDANCE.patchValue(data.PROPOSALAPPLICANTRESIDANCE);

    if (data.PROPOSALAPPLICANTPHONEFAX && data.PROPOSALAPPLICANTPHONEFAX.length > 0) {
      data.PROPOSALAPPLICANTPHONEFAX.forEach((item, index) => {
        Address.controls.PROPOSALAPPLICANTPHONEFAX.push(this.ProposalApplicantPhoneInfoMapper(this._ProposalEntityFormService.proposalApplicantPhoneInfoForm(), item))
      });
    }
    //this.PhoneFaxMapper(Address.controls.PROPOSALAPPLICANTPHONEFAX, data.PROPOSALAPPLICANTPHONEFAX);
    // if (data.PROPOSALAPPLICANTPHONEFAX){
    //   Address.controls.PROPOSALAPPLICANTPHONEFAX.clear();
    //   data.PROPOSALAPPLICANTPHONEFAX.forEach((item, index) => {
    //     Address.controls.PROPOSALAPPLICANTPHONEFAX.push(this.ProposalApplicantPhoneFaxMapper(this._ProposalEntityFormService.proposalApplicantPhoneInfoForm(), data.PROPOSALAPPLICANTPHONEFAX[index], formMode));
    //   });
    // }
    if (data.PROPOSALADDRESSTYPEDETAIL && data.PROPOSALADDRESSTYPEDETAIL.length > 0) {
      data.PROPOSALADDRESSTYPEDETAIL.forEach((item, index) => {
        Address.controls.PROPOSALADDRESSTYPEDETAIL.push(this.proposalApplicantAddressTypeInfoMapper(this._ProposalEntityFormService.proposalApplicantAddressTypeInfoForm(), item))
      });
    }
    //this.AddressTypeDetail(Address.controls.PROPOSALADDRESSTYPEDETAIL, data.PROPOSALADDRESSTYPEDETAIL);
    // if (data.PROPOSALADDRESSTYPEDETAIL){
    //   Address.controls.PROPOSALADDRESSTYPEDETAIL.clear();
    //   data.PROPOSALADDRESSTYPEDETAIL.forEach((item, index) => {
    //     Address.controls.PROPOSALADDRESSTYPEDETAIL.push(this.ProposalAddressTypeDetailMapper(this._ProposalEntityFormService.proposalApplicantAddressTypeInfoForm(), data.PROPOSALADDRESSTYPEDETAIL[index], formMode));
    //   });
    // }
    return Address;
  }

  public ProposalApplicantPhoneInfoMapper(PROPOSALAPPLICANTPHONEFAX: FormGroup<IPRPL_APLT_PHNE_FAXInfo>, data: IPRPL_APLT_PHNE_FAXInfo) {
    PROPOSALAPPLICANTPHONEFAX.patchValue(data);
    return PROPOSALAPPLICANTPHONEFAX;
  }

  proposalApplicantAddressTypeInfoMapper(PROPOSALADDRESSTYPEDETAIL: FormGroup<IPRPL_ADDS_TYP_DETLInfo>, data: IPRPL_ADDS_TYP_DETLInfo) {
    data.APPLICABLEIND = true;
    PROPOSALADDRESSTYPEDETAIL.patchValue(data);
    return PROPOSALADDRESSTYPEDETAIL;
  }

  public ProposalFinanceDetailMapper(PROPAPPFINANCIALDETAILS: FormGroup<IPRPL_APLT_FINL_DETLInfo>, data: IPRPL_APLT_FINL_DETLInfo, formMode: FormMode): FormGroup<IPRPL_APLT_FINL_DETLInfo> {
    PROPAPPFINANCIALDETAILS.controls.RowState.setValue(data.RowState);
    PROPAPPFINANCIALDETAILS.patchValue(data);// = this._formBuilder.group<IPRPL_APLT_FINL_DETLInfo>(data)
    return PROPAPPFINANCIALDETAILS;
  }
  public CompanyApplicantMapper(CompanyApplicant: FormGroup<ICompanyApplicantEntity>, data: ICompanyApplicantEntity, formMode: FormMode): FormGroup<ICompanyApplicantEntity> {
    CompanyApplicant.controls.RowState.setValue(data.RowState);
    if (data.PROPOSALAPPLICANTCOMPANY)
      CompanyApplicant.controls.PROPOSALAPPLICANTCOMPANY.patchValue(data.PROPOSALAPPLICANTCOMPANY); // = this.ProposalCompanyApplicantMapper(this._ProposalEntityFormService.ProposalApplicantCompanyInfoForm(), data.PROPOSALAPPLICANTCOMPANY, formMode);
    return CompanyApplicant;
  }
  public ProposalCompanyApplicantMapper(PROPOSALAPPLICANTCOMPANY: FormGroup<IPRPL_APLT_COMYInfo>, data: IPRPL_APLT_COMYInfo, formMode: FormMode): FormGroup<IPRPL_APLT_COMYInfo> {
    PROPOSALAPPLICANTCOMPANY = this._formBuilder.group<IPRPL_APLT_COMYInfo>(data)
    return PROPOSALAPPLICANTCOMPANY;
  }
  public IndividualApplicantMapper(IndividualApplicant: FormGroup<IIndividualApplicantEntity>, data: IIndividualApplicantEntity): FormGroup<IIndividualApplicantEntity> {
    IndividualApplicant.controls.RowState.setValue(data.RowState);
    if (data.PROPOSALAPPLICANTINDIVIDUAL)
      this.ProposalApplicantIndividualMapper(IndividualApplicant.controls.PROPOSALAPPLICANTINDIVIDUAL, data.PROPOSALAPPLICANTINDIVIDUAL);

    IndividualApplicant.controls.PROPOSALAPPLICANTEMPLOYMENT.clear();
    if (data.PROPOSALAPPLICANTEMPLOYMENT && data.PROPOSALAPPLICANTEMPLOYMENT.length > 0) {
      data.PROPOSALAPPLICANTEMPLOYMENT.forEach((item, index) => {
        IndividualApplicant.controls.PROPOSALAPPLICANTEMPLOYMENT.push(this.ProposalApplicantEmployementMapper(this._ProposalEntityFormService.ProposalEmploymentComponentForm(), data.PROPOSALAPPLICANTEMPLOYMENT[index]));
      });
    }

    IndividualApplicant.controls.PROPOSALAPPSPOUSEDETAIL.clear();
    if (data.PROPOSALAPPSPOUSEDETAIL && data.PROPOSALAPPSPOUSEDETAIL.length > 0) {
      //IndividualApplicant.controls.PROPOSALAPPSPOUSEDETAIL.clear();
      data.PROPOSALAPPSPOUSEDETAIL.forEach((item, index) => {
        IndividualApplicant.controls.PROPOSALAPPSPOUSEDETAIL.push(this.ProposalAppSpouseDetailMapper(this._ProposalEntityFormService.proposalApplicantSpouseInfoForm(), data.PROPOSALAPPSPOUSEDETAIL[index]));
      });
    }

    IndividualApplicant.controls.PROPOSALAPPFAMILY.clear();
    if (data.PROPOSALAPPFAMILY && data.PROPOSALAPPFAMILY.length > 0) {
      data.PROPOSALAPPFAMILY.forEach((item, index) => {
        IndividualApplicant.controls.PROPOSALAPPFAMILY.push(this.ProposalAppFamilyMapper(this._ProposalEntityFormService.proposalIndvidualFamilyMemberForm(), data.PROPOSALAPPFAMILY[index]));
      });
    }

    if (data.PROPOSALAPPLICANTENTERPRENUER)
      this.ProposalApplicationCenterUserMapper(IndividualApplicant.controls.PROPOSALAPPLICANTENTERPRENUER, data.PROPOSALAPPLICANTENTERPRENUER);

    if (data.FAMILYEXPOSURE) {
      IndividualApplicant.controls.FAMILYEXPOSURE.clear();
      data.FAMILYEXPOSURE.forEach((item, index) => {
        IndividualApplicant.controls.FAMILYEXPOSURE.push(this.FamilyExposureMapper(this._ProposalEntityFormService.FamilyExposureForm(), item));
      });
    }

    return IndividualApplicant;
  }
  public ProposalApplicantIndividualMapper(PROPOSALAPPLICANTINDIVIDUAL: FormGroup<IPRPL_APLT_INDVInfo>, data: IPRPL_APLT_INDVInfo) {
    PROPOSALAPPLICANTINDIVIDUAL.patchValue(data);
  }
  public ProposalApplicantEmployementMapper(PROPOSALAPPLICANTEMPLOYMENT: FormGroup<IPRPL_APLT_EMPTInfo>, data: IPRPL_APLT_EMPTInfo): FormGroup<IPRPL_APLT_EMPTInfo> {
    PROPOSALAPPLICANTEMPLOYMENT.controls.RowState.setValue(data.RowState);
    PROPOSALAPPLICANTEMPLOYMENT.patchValue(data);// = this._formBuilder.group<IPRPL_APLT_EMPTInfo>(data)
    return PROPOSALAPPLICANTEMPLOYMENT;
  }
  public ProposalAppSpouseDetailMapper(PROPOSALAPPSPOUSEDETAIL: FormGroup<IPRPL_APLT_SPUS_DETLInfo>, data: IPRPL_APLT_SPUS_DETLInfo): FormGroup<IPRPL_APLT_SPUS_DETLInfo> {
    PROPOSALAPPSPOUSEDETAIL.controls.RowState.setValue(data.RowState);
    PROPOSALAPPSPOUSEDETAIL.patchValue(data);
    return PROPOSALAPPSPOUSEDETAIL;
  }
  public ProposalAppFamilyMapper(PROPOSALAPPFAMILY: FormGroup<IOTO_PRPL_APLT_FAMInfo>, data: IOTO_PRPL_APLT_FAMInfo): FormGroup<IOTO_PRPL_APLT_FAMInfo> {
    PROPOSALAPPFAMILY.patchValue(data);
    return PROPOSALAPPFAMILY;
  }
  public ProposalApplicationCenterUserMapper(PROPOSALAPPLICANTENTERPRENUER: FormGroup<IPRPL_APLT_ENTRInfo>, data: IPRPL_APLT_ENTRInfo) {
    PROPOSALAPPLICANTENTERPRENUER.patchValue(data);
  }
  public FamilyExposureMapper(FamilyExposure: FormGroup<IFamilyExposureEntity>, data: IFamilyExposureEntity): FormGroup<IFamilyExposureEntity> {
    FamilyExposure.controls.FMLYBLAKLISTEXPR.clear();
    data.FMLYBLAKLISTEXPR.forEach((item, index) => {
      FamilyExposure.controls.FMLYBLAKLISTEXPR.push(this.FamilyblackListExposureMapper(this._ProposalEntityFormService.FamilyBlakListerForm(), item));
    });

    FamilyExposure.controls.FMLYCMSEXPR.clear();
    data.FMLYCMSEXPR.forEach((item, index) => {
      FamilyExposure.controls.FMLYCMSEXPR.push(this.FamilyCMSExposureMapper(this._ProposalEntityFormService.FMLYCMSEXPRForm(), item));
    });

    data.FMLYPOSEXPR.forEach((item, index) => {
      FamilyExposure.controls.FMLYPOSEXPR.push(this.FamilyPOSExposureMapper(this._ProposalEntityFormService.FMLYPOSEXPRForm(), item));
    });
    return FamilyExposure;
  }
  public FamilyblackListExposureMapper(FMLYBLAKLISTEXPR: FormGroup<IFMLY_BLAK_LIST_EXPRInfo>, data: IFMLY_BLAK_LIST_EXPRInfo): FormGroup<IFMLY_BLAK_LIST_EXPRInfo> {
    FMLYBLAKLISTEXPR.patchValue(data);
    return FMLYBLAKLISTEXPR;
  }
  public FamilyCMSExposureMapper(FMLYCMSEXPR: FormGroup<IFMLY_CMS_EXPRInfo>, data: IFMLY_CMS_EXPRInfo): FormGroup<IFMLY_CMS_EXPRInfo> {
    FMLYCMSEXPR.patchValue(data);
    return FMLYCMSEXPR;
  }
  public FamilyPOSExposureMapper(FMLYPOSEXPR: FormGroup<IFMLY_POS_EXPRInfo>, data: IFMLY_POS_EXPRInfo): FormGroup<IFMLY_POS_EXPRInfo> {
    FMLYPOSEXPR.patchValue(data);
    return FMLYPOSEXPR;
  }
  public ProposalCashflowDetailMapper(CashflowDetail: FormGroup<ICashFlowEntity>, data: ICashFlowEntity, formMode: FormMode): FormGroup<ICashFlowEntity> {
    CashflowDetail.controls.RowState.setValue(data.RowState);
    if (data.PRPLCSFLDETL) {
      CashflowDetail.controls.PRPLCSFLDETL.clear();
      data.PRPLCSFLDETL.forEach((item, index) => {
        CashflowDetail.controls.PRPLCSFLDETL.push(this.ProposalCSFDetailMapper(this._ProposalEntityFormService.proposalCSFDetailInfoForm(), data.PRPLCSFLDETL[index], formMode));
      });
    }

    if (data.PRPLFINLRATO) {
      CashflowDetail.controls.PRPLFINLRATO.clear();
      data.PRPLFINLRATO.forEach((item, index) => {
        CashflowDetail.controls.PRPLFINLRATO.push(this.ProposalFinlRatoMapper(this._ProposalEntityFormService.proposalFinlRatoInfoForm(), data.PRPLFINLRATO[index], formMode));
      });
    }
    return CashflowDetail;
  }
  public ProposalCSFDetailMapper(PRPLFINLRATO: FormGroup<IPRPL_CSFL_DETLInfo>, data: IPRPL_CSFL_DETLInfo, formMode: FormMode): FormGroup<IPRPL_CSFL_DETLInfo> {
    PRPLFINLRATO.controls.RowState.setValue(data.RowState);
    PRPLFINLRATO.patchValue(data); // = this._formBuilder.group<IPRPL_CSFL_DETLInfo>(data)
    return PRPLFINLRATO;
  }
  public ProposalFinlRatoMapper(PRPLFINLRATO: FormGroup<IPRPL_FINL_RATOInfo>, data: IPRPL_FINL_RATOInfo, formMode: FormMode): FormGroup<IPRPL_FINL_RATOInfo> {
    PRPLFINLRATO.controls.RowState.setValue(data.RowState);
    PRPLFINLRATO.patchValue(data); // = this._formBuilder.group<IPRPL_FINL_RATOInfo>(data)
    return PRPLFINLRATO;
  }
  public ProposalExposureMapper(ProposalExposure: FormGroup<IExposureEntity>, data: IExposureEntity, formMode: FormMode): FormGroup<IExposureEntity> {
    if (data.PROPOSALEXPOSURE) {
      ProposalExposure.controls.PROPOSALEXPOSURE.clear();
      data.PROPOSALEXPOSURE.forEach((item, index) => {
        ProposalExposure.controls.PROPOSALEXPOSURE.push(this.ExposureMapper(this._ProposalEntityFormService.proposalExposureInfoForm(), data.PROPOSALEXPOSURE[index], formMode));
      });
    }

    if (data.CONTRACTEXPOSURE) {
      ProposalExposure.controls.PROPOSALEXPOSURE.clear();
      data.CONTRACTEXPOSURE.forEach((item, index) => {
        ProposalExposure.controls.CONTRACTEXPOSURE.push(this.ConatactExposureMapper(this._ProposalEntityFormService.proposalConatactExposureInfoForm(), data.CONTRACTEXPOSURE[index], formMode));
      });
    }

    if (data.PROPOSALBLACKLIST) {
      ProposalExposure.controls.PROPOSALBLACKLIST.clear();
      data.PROPOSALBLACKLIST.forEach((item, index) => {
        ProposalExposure.controls.PROPOSALBLACKLIST.push(this.ProposalBlackListMapper(this._ProposalEntityFormService.proposalBlackListInfoForm(), data.PROPOSALBLACKLIST[index], formMode));
      });
    }
    return ProposalExposure;
  }
  public ExposureMapper(PROPOSALEXPOSURE: FormGroup<IPRPL_EXPRInfo>, data: IPRPL_EXPRInfo, formMode: FormMode): FormGroup<IPRPL_EXPRInfo> {
    PROPOSALEXPOSURE.controls.RowState.setValue(data.RowState);
    PROPOSALEXPOSURE.patchValue(data); // = this._formBuilder.group<IPRPL_EXPRInfo>(data)
    return PROPOSALEXPOSURE;
  }
  public ConatactExposureMapper(CONTRACTEXPOSURE: FormGroup<ICONT_EXPRInfo>, data: ICONT_EXPRInfo, formMode: FormMode): FormGroup<ICONT_EXPRInfo> {
    CONTRACTEXPOSURE.controls.RowState.setValue(data.RowState);
    CONTRACTEXPOSURE.patchValue(data); // = this._formBuilder.group<ICONT_EXPRInfo>(data)
    return CONTRACTEXPOSURE;
  }
  public ProposalBlackListMapper(PROPOSALBLACKLIST: FormGroup<IPRPL_BLAK_LISTInfo>, data: IPRPL_BLAK_LISTInfo, formMode: FormMode): FormGroup<IPRPL_BLAK_LISTInfo> {
    PROPOSALBLACKLIST.controls.RowState.setValue(data.RowState);
    PROPOSALBLACKLIST.patchValue(data); // = this._formBuilder.group<IPRPL_BLAK_LISTInfo>(data)
    return PROPOSALBLACKLIST;
  }
  public ProposalApplicantBusiness(ApplicantBusiness: FormGroup<IProposalApplicantBusinessEntity>, data: IProposalApplicantBusinessEntity, formMode: FormMode): FormGroup<IProposalApplicantBusinessEntity> {
    this.ProposalApplicantBusMapper(ApplicantBusiness.controls.PRPLAPLTBUS, data.PRPLAPLTBUS);
    ApplicantBusiness.controls.PRPLAPLTBUSSUPP.controls.forEach((item, index) => {
      this.ProposalApplicantBusSuppMapper(item, data.PRPLAPLTBUSSUPP[index]);
    });
    return ApplicantBusiness;
  }
  public ProposalApplicantBusMapper(PRPLAPLTBUS: FormGroup<IPRPL_APLT_BUSInfo>, data: IPRPL_APLT_BUSInfo): FormGroup<IPRPL_APLT_BUSInfo> {
    PRPLAPLTBUS.controls.RowState.setValue(data.RowState);
    PRPLAPLTBUS.patchValue(data); // = this._formBuilder.group<IPRPL_APLT_BUSInfo>(data)
    return PRPLAPLTBUS;
  }
  public ProposalApplicantBusSuppMapper(PRPLAPLTBUSSUPP: FormGroup<IPRPL_APLT_BUS_SUPPInfo>, data: IPRPL_APLT_BUS_SUPPInfo): FormGroup<IPRPL_APLT_BUS_SUPPInfo> {
    PRPLAPLTBUSSUPP.controls.RowState.setValue(data.RowState);
    PRPLAPLTBUSSUPP.patchValue(data); // = this._formBuilder.group<IPRPL_APLT_BUS_SUPPInfo>(data)
    return PRPLAPLTBUSSUPP;
  }
  public ProposalApplicantRepresentativeMapper(PROPOSALAPPLICANTREPRESENTATIVE: FormGroup<IPRPL_APLT_RPRSInfo>, data: IPRPL_APLT_RPRSInfo, formMode: FormMode): FormGroup<IPRPL_APLT_RPRSInfo> {
    PROPOSALAPPLICANTREPRESENTATIVE.controls.RowState.setValue(data.RowState);
    PROPOSALAPPLICANTREPRESENTATIVE.patchValue(data);// = this._formBuilder.group<IPRPL_APLT_RPRSInfo>(data)
    return PROPOSALAPPLICANTREPRESENTATIVE;
  }
  // public ProposalApplicantAddressMapper(PROPAPLTADDS: FormGroup<IPRPL_APLT_ADDSInfo>, data: IPRPL_APLT_ADDSInfo, formMode: FormMode): FormGroup<IPRPL_APLT_ADDSInfo> {
  //   PROPAPLTADDS = this._formBuilder.group<IPRPL_APLT_ADDSInfo>(data)
  //   return PROPAPLTADDS;
  // }
  public ProposalAddressResidanceMapper(PROPADDSRESE: FormGroup<IPRPL_APLT_ADDS_RESEInfo>, data: IPRPL_APLT_ADDS_RESEInfo, formMode: FormMode): FormGroup<IPRPL_APLT_ADDS_RESEInfo> {
    PROPADDSRESE = this._formBuilder.group<IPRPL_APLT_ADDS_RESEInfo>(data)
    return PROPADDSRESE;
  }
  public ProposalApplicantPhoneFaxMapper(PROAPLTPHONEFAX: FormGroup<IPRPL_APLT_PHNE_FAXInfo>, data: IPRPL_APLT_PHNE_FAXInfo, formMode: FormMode): FormGroup<IPRPL_APLT_PHNE_FAXInfo> {
    PROAPLTPHONEFAX = this._formBuilder.group<IPRPL_APLT_PHNE_FAXInfo>(data)
    return PROAPLTPHONEFAX;
  }
  public ProposalAddressTypeDetailMapper(ADDRESSTYPEDETAIL: FormGroup<IPRPL_ADDS_TYP_DETLInfo>, data: IPRPL_ADDS_TYP_DETLInfo, formMode: FormMode): FormGroup<IPRPL_ADDS_TYP_DETLInfo> {
    ADDRESSTYPEDETAIL = this._formBuilder.group<IPRPL_ADDS_TYP_DETLInfo>(data)
    return ADDRESSTYPEDETAIL;
  }
  public mPOSApplicantDocumentMapper(MPOSDOCUMENTS: FormGroup<IMPOS_APLT_DCMTInfo>, data: IMPOS_APLT_DCMTInfo, formMode: FormMode): FormGroup<IMPOS_APLT_DCMTInfo> {
    MPOSDOCUMENTS.controls.RowState.setValue(data.RowState);
    MPOSDOCUMENTS.patchValue(data); // = this._formBuilder.group<IMPOS_APLT_DCMTInfo>(data)
    return MPOSDOCUMENTS;
  }
  public ProposalFieldVisitAppointmentMapper(MPOSFEILDVISIT: FormGroup<IPRPL_FILD_VIST_APMTInfo>, data: IPRPL_FILD_VIST_APMTInfo, formMode: FormMode): FormGroup<IPRPL_FILD_VIST_APMTInfo> {
    MPOSFEILDVISIT.controls.APPOINTMENTID.setValue(data.APPOINTMENTID);
    MPOSFEILDVISIT.controls.PROPOSALID.setValue(data.PROPOSALID);
    MPOSFEILDVISIT.controls.APPLICANTID.setValue(data.APPLICANTID);
    MPOSFEILDVISIT.controls.HOMEVISITIND.setValue(data.HOMEVISITIND);
    MPOSFEILDVISIT.controls.OFFICEVISITIND.setValue(data.OFFICEVISITIND);
    MPOSFEILDVISIT.controls.FIREQIND.setValue(data.FIREQIND);
    MPOSFEILDVISIT.controls.FIUSERID.setValue(data.FIUSERID);
    MPOSFEILDVISIT.controls.FIPLANDTE.setValue(data.FIPLANDTE);
    MPOSFEILDVISIT.controls.FIREMINDDTE.setValue(data.FIREMINDDTE);
    MPOSFEILDVISIT.controls.FIPLACE.setValue(data.FIPLACE);
    MPOSFEILDVISIT.controls.FITIME.setValue(data.FITIME);
    MPOSFEILDVISIT.controls.COMMENTS.setValue(data.COMMENTS);
    MPOSFEILDVISIT.controls.FICOMPLETIONDTE.setValue(data.FICOMPLETIONDTE);
    MPOSFEILDVISIT.controls.FISTARTTIME.setValue(data.FISTARTTIME);
    MPOSFEILDVISIT.controls.FIENDTIME.setValue(data.FIENDTIME);
    MPOSFEILDVISIT.controls.FIHOMEVISITIND.setValue(data.FIHOMEVISITIND);
    MPOSFEILDVISIT.controls.FIOFFICEVISITIND.setValue(data.FIOFFICEVISITIND);
    MPOSFEILDVISIT.controls.FICOMMENTS.setValue(data.FICOMMENTS);
    MPOSFEILDVISIT.controls.FIRATINGCDE.setValue(data.FIRATINGCDE);
    MPOSFEILDVISIT.controls.EXECUTIONDTE.setValue(data.EXECUTIONDTE);
    MPOSFEILDVISIT.controls.EXECUTIONOFFSET.setValue(data.EXECUTIONOFFSET);
    MPOSFEILDVISIT.controls.SESSIONCDE.setValue(data.SESSIONCDE);
    MPOSFEILDVISIT.controls.SESSIONID.setValue(data.SESSIONID);
    MPOSFEILDVISIT.controls.FIELDAGENTID.setValue(data.FIELDAGENTID);
    MPOSFEILDVISIT.controls.FIELDAGENTIND.setValue(data.FIELDAGENTIND);
    MPOSFEILDVISIT.controls.FLDVISITCMPLTD.setValue(data.FLDVISITCMPLTD);
    MPOSFEILDVISIT.controls.ISSUBMITTED.setValue(data.ISSUBMITTED);
    MPOSFEILDVISIT.controls.ISSAVED.setValue(data.ISSAVED);
    MPOSFEILDVISIT.controls.PARTYBEINGSURVEYED.setValue(data.PARTYBEINGSURVEYED);
    MPOSFEILDVISIT.controls.DISTANCETOHOUSE.setValue(data.DISTANCETOHOUSE);
    MPOSFEILDVISIT.controls.ELECTRICITYVOLTAGE.setValue(data.ELECTRICITYVOLTAGE);
    MPOSFEILDVISIT.controls.HOUSELOCATIONCDE.setValue(data.HOUSELOCATIONCDE);
    MPOSFEILDVISIT.controls.OTHERVISITIND.setValue(data.OTHERVISITIND);
    MPOSFEILDVISIT.controls.OTHERVISIT.setValue(data.OTHERVISIT);
    MPOSFEILDVISIT.controls.SURVEYMEETWITH.setValue(data.SURVEYMEETWITH);
    MPOSFEILDVISIT.controls.SURVEYPARTYNME.setValue(data.SURVEYPARTYNME);
    MPOSFEILDVISIT.controls.SURVEYSOCIALINTERACTIONCDE.setValue(data.SURVEYSOCIALINTERACTIONCDE);
    MPOSFEILDVISIT.controls.SURVEYCONTACTNBR.setValue(data.SURVEYCONTACTNBR);
    MPOSFEILDVISIT.controls.ELECTRICITYSUBSCRIBERNBR.setValue(data.ELECTRICITYSUBSCRIBERNBR);
    MPOSFEILDVISIT.controls.ELECTRICITYMONTHS.setValue(data.ELECTRICITYMONTHS);
    MPOSFEILDVISIT.controls.ELECTRICITYYEARS.setValue(data.ELECTRICITYYEARS);
    MPOSFEILDVISIT.controls.ELECTRICITYAMOUNT.setValue(data.ELECTRICITYAMOUNT);
    MPOSFEILDVISIT.controls.PROPERTYTAXNBR.setValue(data.PROPERTYTAXNBR);
    MPOSFEILDVISIT.controls.PROPERTYSIZEOFLAND.setValue(data.PROPERTYSIZEOFLAND);
    MPOSFEILDVISIT.controls.PROPERTYSALEVALUE.setValue(data.PROPERTYSALEVALUE);
    MPOSFEILDVISIT.controls.OFFICELOCATIONCDE.setValue(data.OFFICELOCATIONCDE);
    MPOSFEILDVISIT.controls.ISFROMCAP.setValue(data.ISFROMCAP);
    MPOSFEILDVISIT.controls.USERID.setValue(data.USERID);
    MPOSFEILDVISIT.controls.USERNME.setValue(data.USERNME);
    MPOSFEILDVISIT.controls.APPLICANTNAME.setValue(data.APPLICANTNAME);
    MPOSFEILDVISIT.controls.APPLICANTROLE.setValue(data.APPLICANTROLE);
    MPOSFEILDVISIT.controls.APPLICANTPHNE.setValue(data.APPLICANTPHNE);
    MPOSFEILDVISIT.controls.APPLICANTEMAIL.setValue(data.APPLICANTEMAIL);
    MPOSFEILDVISIT.controls.REQUESTID.setValue(data.REQUESTID);
    MPOSFEILDVISIT.controls.PARENTREQUESTID.setValue(data.PARENTREQUESTID);
    MPOSFEILDVISIT.controls.FIELDAGENT.setValue(data.FIELDAGENT);
    MPOSFEILDVISIT.controls.STATUSCODE.setValue(data.STATUSCODE);
    MPOSFEILDVISIT.controls.ProposalNumber.setValue(data.ProposalNumber);
    MPOSFEILDVISIT.controls.MANUALIND.setValue(data.MANUALIND);
    MPOSFEILDVISIT.controls.ISDISABLED.setValue(data.ISDISABLED);
    MPOSFEILDVISIT.controls.APPLICANTTYP.setValue(data.APPLICANTTYP);
    MPOSFEILDVISIT.controls.BPCOMPANYBRANCHID.setValue(data.BPCOMPANYBRANCHID);

    //--  following infos will map if needed

    // if (data.BPCRDTRTNGCODE)
    //   data.BPCRDTRTNGCODE.forEach((item, index) => {
    //     MPOSFEILDVISIT.controls.BPCRDTRTNGCODE.push(this.BPCreditingCodeMapper(this._ProposalEntityFormService.proposalApplicantNetProfInfoForm(), data.BPCRDTRTNGCODE[index], formMode));
    //   });

    // if (data.SOCLINTRCODE)
    //   data.SOCLINTRCODE.forEach((item, index) => {
    //     MPOSFEILDVISIT.controls.SOCLINTRCODE.push(this.SOCLINTRCodeMapper(this._ProposalEntityFormService.proposalApplicantNetProfInfoForm(), data.SOCLINTRCODE[index], formMode));
    //   });

    // if (data.MEETTYPECODE)
    //   data.MEETTYPECODE.forEach((item, index) => {
    //     MPOSFEILDVISIT.controls.MEETTYPECODE.push(this.MeetTypeCodeMapper(this._ProposalEntityFormService.proposalApplicantNetProfInfoForm(), data.MEETTYPECODE[index], formMode));
    //   });

    // if (data.PRPYLOCNCODE)
    //   data.PRPYLOCNCODE.forEach((item, index) => {
    //     MPOSFEILDVISIT.controls.PRPYLOCNCODE.push(this.PRPYLocnCodeMapper(this._ProposalEntityFormService.proposalApplicantNetProfInfoForm(), data.PRPYLOCNCODE[index], formMode));
    //   });

    // if (data.BPMAIN)
    //   data.BPMAIN.forEach((item, index) => {
    //     MPOSFEILDVISIT.controls.BPMAIN.push(this.BPMainMapper(this._ProposalEntityFormService.proposalApplicantNetProfInfoForm(), data.BPMAIN[index], formMode));
    //   });

    return MPOSFEILDVISIT;
  }
  public BPCreditingCodeMapper(BPCRDTRTNGCODE: FormGroup<IBP_CRDT_RTNG_CODEInfo>, data: IBP_CRDT_RTNG_CODEInfo, formMode: FormMode): FormGroup<IBP_CRDT_RTNG_CODEInfo> {
    BPCRDTRTNGCODE = this._formBuilder.group<IBP_CRDT_RTNG_CODEInfo>(data)
    return BPCRDTRTNGCODE;
  }
  public SOCLINTRCodeMapper(SOCLINTRCODE: FormGroup<ISOCL_INTR_CODEInfo>, data: ISOCL_INTR_CODEInfo, formMode: FormMode): FormGroup<ISOCL_INTR_CODEInfo> {
    SOCLINTRCODE = this._formBuilder.group<ISOCL_INTR_CODEInfo>(data)
    return SOCLINTRCODE;
  }
  public MeetTypeCodeMapper(MEETTYPECODE: FormGroup<IMEET_TYPE_CODEInfo>, data: IMEET_TYPE_CODEInfo, formMode: FormMode): FormGroup<IMEET_TYPE_CODEInfo> {
    MEETTYPECODE = this._formBuilder.group<IMEET_TYPE_CODEInfo>(data)
    return MEETTYPECODE;
  }
  public PRPYLocnCodeMapper(PROPOSALAPPLICANTNETPROFIT: FormGroup<IPRPY_LOCN_CODEInfo>, data: IPRPY_LOCN_CODEInfo, formMode: FormMode): FormGroup<IPRPY_LOCN_CODEInfo> {
    PROPOSALAPPLICANTNETPROFIT = this._formBuilder.group<IPRPY_LOCN_CODEInfo>(data)
    return PROPOSALAPPLICANTNETPROFIT;
  }
  public BPMainMapper(PRPYLOCNCODE: FormGroup<IBP_MAINInfo>, data: IBP_MAINInfo, formMode: FormMode): FormGroup<IBP_MAINInfo> {
    //--  it will map if need
    //PRPYLOCNCODE = this._formBuilder.group<IBP_MAINInfo>(data)
    return PRPYLOCNCODE;
  }
  public ProposalApplicantNetProfMapper(PROPOSALAPPLICANTNETPROFIT: FormGroup<IPRPL_APLT_NET_PRFTInfo>, data: IPRPL_APLT_NET_PRFTInfo, formMode: FormMode): FormGroup<IPRPL_APLT_NET_PRFTInfo> {
    PROPOSALAPPLICANTNETPROFIT.controls.RowState.setValue(data.RowState);
    PROPOSALAPPLICANTNETPROFIT.patchValue(data); // = this._formBuilder.group<IPRPL_APLT_NET_PRFTInfo>(data)
    return PROPOSALAPPLICANTNETPROFIT;
  }
  //-- End Salman Working --//




  public ProposalArticleMapper(PROPOSALARTICLE: FormGroup<IProposalArticleEntity>, data: IProposalArticleEntity): FormGroup<IProposalArticleEntity> {
    PROPOSALARTICLE.controls.RowState.setValue(data.RowState);
    PROPOSALARTICLE.controls.ASSETENTITY.controls.RowState.setValue(data.RowState);
    this.AssetMapper(PROPOSALARTICLE.controls.ASSETENTITY, data.ASSETENTITY);
    this.PROPOSALARTICLEMapper(PROPOSALARTICLE.controls.PROPOSALARTICLE, data.PROPOSALARTICLE);

    return PROPOSALARTICLE;

  }
  public AssetMapper(Asset: FormGroup<IAssetEntity>, data: IAssetEntity): FormGroup<IAssetEntity> {
    let chargeAmount = 0

    this.ProposalAdminFeeMapper(Asset.controls.PROPOSALADMINFEEDETAIL, data.PROPOSALADMINFEEDETAIL);

    this.OTOPRPLASSTBPKBDETLMapper(Asset.controls.OTOPRPLASSTBPKBDETL, data.OTOPRPLASSTBPKBDETL);
    this.PROPOSALVEHICLEDETAILMapper(Asset.controls.PROPOSALVEHICLEDETAIL, data.PROPOSALVEHICLEDETAIL)
    data.PROPOSALCOMMISSIONENTITY.forEach((item, index) => {
      Asset.controls.PROPOSALCOMMISSIONENTITY.push(this.ProposalCommissionEntityMapper(this._ProposalEntityFormService.PropsalCommissionForm(), data.PROPOSALCOMMISSIONENTITY[index]));
    });

    this.PROPOSALPROVISIONFEEDETAILMapper(Asset.controls.PROPOSALPROVISIONFEEDETAIL, data.PROPOSALPROVISIONFEEDETAIL);
    this.PROPOSALASSET(Asset.controls.PROPOSALASSET, data.PROPOSALASSET);
    this.PROPOSALFINANCIALAGREEMENTMapper(Asset.controls.PROPOSALFINANCIALAGREEMENT, data.PROPOSALFINANCIALAGREEMENT);
    this.PROPOSALACCESSORYMapper(Asset.controls.PROPOSALACCESSORY, data.PROPOSALACCESSORY);
    this._FormState.ResetFormArrayState(Asset.controls.PROPOSALCHARGE, DataRowState.Removed);
    data.PROPOSALCHARGE.forEach(item => {
      Asset.controls.PROPOSALCHARGE.push(this.ProposalChargeEntityMapper(this._ProposalEntityFormService.PropsalChargeForm(), item))
      chargeAmount += item.TAXINCULSIVEAMT
    })
    Asset.controls.PROPOSALFINANCIALAGREEMENT.controls.CHARGEAMT.patchValue(chargeAmount);
    data.PRPLARTICLECOMPONENTENTITYCOL.forEach(item => {
      Asset.controls.PRPLARTICLECOMPONENTENTITYCOL.push(this.ProposalArticleComponentEntityMapper(this._ProposalEntityFormService.ProposalArticleComponentForm(), item))
    })
    data.PROPOSALRENTALDETAIL.forEach(item => {
      Asset.controls.PROPOSALRENTALDETAIL.push(this.PROPOSALRENTALDETAILMapper(this._ProposalEntityFormService.PROPOSALRENTALDETAILForm(), item))
    })
    data.PROPOSALREPAYMENTPLANENTITYCOL.forEach(item => {
      Asset.controls.PROPOSALREPAYMENTPLANENTITYCOL.push(this.PROPOSALREPAYMENTPLANENTITYCOLMapper(this._ProposalEntityFormService.PropsalRepaymentPlanForm(), item))
    })

    data.PROPOSALARTICLECHARTDETL.forEach(item => {
      Asset.controls.PROPOSALARTICLECHARTDETL.push(this.PROPOSALARTICLECHARTDETLMapper(this._ProposalEntityFormService.PROPOSALARTICLECHARTDETLForm(), item));
    });

    data.PROPOSALINSURANCEMAIN.forEach(item => {
      Asset.controls.PROPOSALINSURANCEMAIN.push(this.PropsalMainInsuranceMapper(this._ProposalEntityFormService.PropsalMainInsuranceForm(), item));

    })
    this.PROPOSALARTICLEBASERATEMapper(Asset.controls.PROPOSALARTICLEBASERATE, data.PROPOSALARTICLEBASERATE);
    this.TRUCKDETAILSMapper(Asset.controls.TRUCKDETAILS, data.TRUCKDETAILS);
    this.PROPOSALSOFCOMMISSIONDETAILMapper(Asset.controls.PROPOSALSOFCOMMISSIONDETAIL, data.PROPOSALSOFCOMMISSIONDETAIL);

    if (data.OTOPRPLASSTBPKBGRTRDETL.length != 0 && data.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY == ApplicantType.Individual) {

      this.OTOPRPLASSTBPKBGRTRDETLMapper(Asset.controls.OTOPRPLASSTBPKBGRTRDETL, data.OTOPRPLASSTBPKBGRTRDETL)
    }

    if (data.OTOPRPLASSTBPKBRPRSDETL.length != 0 && data.OTOPRPLASSTBPKBDETL.BPKBOWNERCATEGORY == ApplicantType.Company) {
      this.OTOPRPLASSTBPKBRPRSDETLMapper(Asset.controls.OTOPRPLASSTBPKBRPRSDETL, data.OTOPRPLASSTBPKBRPRSDETL)
    }

    // this.BPDESIGNATIONMapper(, data.OTOPRPLASSTBPKBRPRSDETL[0].)

    return Asset;
  }

  public TRUCKDETAILSMapper(TRUCKDETAILS: FormGroup<IProposalTruckDetailEntity>, data: IProposalTruckDetailEntity): FormGroup<IProposalTruckDetailEntity> {
    // this._FormState.ResetFormState(TRUCKDETAILS, DataRowState.Removed);
    // TRUCKDETAILS.controls.TOTALTRUCKOWNED.clear();
    // TRUCKDETAILS.controls.OPERATINGREVENUE.clear();
    TRUCKDETAILS.controls.RowState.setValue(data.RowState);
    TRUCKDETAILS.controls.PROPOSALTRUCKDETAIL.patchValue(data.PROPOSALTRUCKDETAIL);
    data.TOTALTRUCKOWNED.forEach(item => {
      TRUCKDETAILS.controls.TOTALTRUCKOWNED.push(this.TotalTruckOwnedMapper(this._ProposalEntityFormService.TotalTruckOwnedForm(), item));
    })
    data.OPERATINGREVENUE.forEach(item => {
      TRUCKDETAILS.controls.OPERATINGREVENUE.push(this.TruckOperatingRevenueFormMapper(this._ProposalEntityFormService.TruckOperatingRevenueForm(), item));
    })
    return TRUCKDETAILS;
  }
  public TotalTruckOwnedMapper(TruckOwned: FormGroup<IPRPL_TOTL_TRCK_OWNDInfo>, data: IPRPL_TOTL_TRCK_OWNDInfo): FormGroup<IPRPL_TOTL_TRCK_OWNDInfo> {
    TruckOwned.controls.RowState.setValue(data.RowState);
    TruckOwned.patchValue(data);
    return TruckOwned;
  }
  public TruckOperatingRevenueFormMapper(TruckOperatingRevenue: FormGroup<IPRPL_TRCK_OPRT_RVNUInfo>, data: IPRPL_TRCK_OPRT_RVNUInfo): FormGroup<IPRPL_TRCK_OPRT_RVNUInfo> {
    TruckOperatingRevenue.controls.RowState.setValue(data.RowState);
    TruckOperatingRevenue.patchValue(data);
    return TruckOperatingRevenue;
  }
  public PROPOSALSOFCOMMISSIONDETAILMapper(PROPOSALSOFCOMMISSIONDETAIL: FormGroup<IPRPL_SOF_COMM_DETLInfo>, data: IPRPL_SOF_COMM_DETLInfo): FormGroup<IPRPL_SOF_COMM_DETLInfo> {
    PROPOSALSOFCOMMISSIONDETAIL.patchValue(data);
    return PROPOSALSOFCOMMISSIONDETAIL;
  }
  public PROPOSALASSET(ASSET: FormGroup<IPRPL_ASETInfo>, data: IPRPL_ASETInfo): FormGroup<IPRPL_ASETInfo> {
    ASSET.controls.RowState.setValue(data.RowState);
    ASSET.patchValue(data);
    return ASSET;
  }
  public ProposalAdminFeeMapper(AdminFeeDetail: FormGroup<IPRPL_ADMN_FEE_DETLInfo>, data: IPRPL_ADMN_FEE_DETLInfo): FormGroup<IPRPL_ADMN_FEE_DETLInfo> {
    AdminFeeDetail.controls.RowState.setValue(data.RowState);
    AdminFeeDetail.patchValue(data); // = this._formBuilder.group<IPRPL_ADMN_FEE_DETLInfo>(data);
    return AdminFeeDetail;
  }
  public OTOPRPLASSTBPKBDETLMapper(OTOPRPLASSTBPKB: FormGroup<IOTO_PRPL_ASST_BPKB_DETLInfo>, data: IOTO_PRPL_ASST_BPKB_DETLInfo): FormGroup<IOTO_PRPL_ASST_BPKB_DETLInfo> {
    OTOPRPLASSTBPKB.controls.RowState.setValue(data.RowState);
    OTOPRPLASSTBPKB.patchValue(data); // = this._formBuilder.group<IOTO_PRPL_ASST_BPKB_DETLInfo>(data);
    return OTOPRPLASSTBPKB;
  }
  public PROPOSALVEHICLEDETAILMapper(PROPOSALVEHICLEDETAIL: FormGroup<IPRPL_VHCL_DETLInfo>, data: IPRPL_VHCL_DETLInfo): FormGroup<IPRPL_VHCL_DETLInfo> {
    PROPOSALVEHICLEDETAIL.controls.RowState.setValue(data.RowState);
    PROPOSALVEHICLEDETAIL.patchValue(data); // = this._formBuilder.group<IOTO_PRPL_ASST_BPKB_DETLInfo>(data);
    return PROPOSALVEHICLEDETAIL;
  }
  public ProposalCommissionEntityMapper(Commission: FormGroup<IProposalCommissionEntity>, data: IProposalCommissionEntity): FormGroup<IProposalCommissionEntity> {
    if (data) {
      Commission.controls.RowState.setValue(data.RowState);

      this.ProposalCommissionMapper(Commission.controls.PRPLCOMM, data.PRPLCOMM);

      //this._FormState.ResetFormArrayState(Commission.controls.PRPLCOMMSCHM, DataRowState.Removed);
      data.PRPLCOMMSCHM.forEach((item, index) => {
        Commission.controls.PRPLCOMMSCHM.push(this.PRPLCOMMSCHMMapper(this._ProposalEntityFormService.PRPLCOMMSCHMForm(), data.PRPLCOMMSCHM[index]));
      });

      //this._FormState.ResetFormArrayState(Commission.controls.PRPLDELRPICASSN, DataRowState.Removed);
      data.PRPLDELRPICASSN.forEach((item, index) => {
        Commission.controls.PRPLDELRPICASSN.push(this.PRPLDELRPICASSNMapper(this._ProposalEntityFormService.PRPLDELRPICASSNForm(), data.PRPLDELRPICASSN[index]));
      });
      //this._FormState.ResetFormArrayState(Commission.controls.PRPLMKTGCOMM, DataRowState.Removed);
      data.PRPLMKTGCOMM.forEach((item, index) => {
        Commission.controls.PRPLMKTGCOMM.push(this.PRPLMKTGCOMMMapper(this._ProposalEntityFormService.PRPLMKTGCOMMForm(), data.PRPLMKTGCOMM[index]));
      });

      //this._FormState.ResetFormArrayState(Commission.controls.JP2RECIPIENT, DataRowState.Removed);
      data.JP1JP2RECIPIENT.forEach((item, index) => {
        data.JP1JP2RECIPIENT[index].PRPLJP1JP2RPNT.JP1ACTIVEIND = data.JP1JP2RECIPIENT[index].PRPLJP1JP2RPNT.JP1COMMISSIONPCT ? true : false;
        data.JP1JP2RECIPIENT[index].PRPLJP1JP2RPNT.JP2ACTIVEIND = data.JP1JP2RECIPIENT[index].PRPLJP1JP2RPNT.JP2COMMISSIONPCT ? true : false;
        Commission.controls.JP1JP2RECIPIENT.push(this.JP1JP2RECIPIENTMapper(this._ProposalEntityFormService.JP1JP2RecipientForm(), data.JP1JP2RECIPIENT[index]));
      });

      //this._FormState.ResetFormArrayState(Commission.controls.JP1JP2RECIPIENT, DataRowState.Removed);
      data.JP2RECIPIENT.forEach((item, index) => {
        Commission.controls.JP2RECIPIENT.push(this.JP2RECIPIENTMapper(this._ProposalEntityFormService.JP2RecipientForm(), data.JP2RECIPIENT[index]));
      });
    }
    return Commission;

  }
  public ProposalCommissionMapper(PRPLCOMM: FormGroup<IPRPL_COMMInfo>, data: IPRPL_COMMInfo): FormGroup<IPRPL_COMMInfo> {
    PRPLCOMM.controls.RowState.setValue(data.RowState);
    PRPLCOMM.patchValue(data); // = this._formBuilder.group<IPRPL_COMMInfo>(data);
    return PRPLCOMM;
  }
  public PROPOSALPROVISIONFEEDETAILMapper(PROPOSALPROVISIONFEEDETAIL: FormGroup<IPRPL_PRVN_FEE_DETLInfo>, data: IPRPL_PRVN_FEE_DETLInfo): FormGroup<IPRPL_PRVN_FEE_DETLInfo> {
    PROPOSALPROVISIONFEEDETAIL.controls.RowState.setValue(data.RowState);
    PROPOSALPROVISIONFEEDETAIL.patchValue(data); // = this._formBuilder.group<IPRPL_PRVN_FEE_DETLInfo>(data);
    return PROPOSALPROVISIONFEEDETAIL;
  }
  public PROPOSALFINANCIALAGREEMENTMapper(PROPOSALFINANCIALAGREEMENT: FormGroup<IPRPL_FINL_AGRMInfo>, data: IPRPL_FINL_AGRMInfo): FormGroup<IPRPL_FINL_AGRMInfo> {
    PROPOSALFINANCIALAGREEMENT.controls.RowState.setValue(data.RowState);
    PROPOSALFINANCIALAGREEMENT.patchValue(data); // = this._formBuilder.group<IPRPL_FINL_AGRMInfo>(data);
    return PROPOSALFINANCIALAGREEMENT;
  }
  public PROPOSALTPLECOMMCONFIGMapper(PROPOSALTPLECOMMCONFIG: FormGroup<IPRPL_TPLE_COMM_CNFGInfo>, data: IPRPL_TPLE_COMM_CNFGInfo): FormGroup<IPRPL_TPLE_COMM_CNFGInfo> {
    PROPOSALTPLECOMMCONFIG.controls.RowState.setValue(data.RowState);
    PROPOSALTPLECOMMCONFIG.patchValue(data); // = this._formBuilder.group<IPRPL_TPLE_COMM_CNFGInfo>(data);
    return PROPOSALTPLECOMMCONFIG;
  }
  public PROPOSALTPLEINCMCONFIGMapper(PROPOSALTPLEINCMCONFIG: FormGroup<IPRPL_TPLE_INCM_CNFGInfo>, data: IPRPL_TPLE_INCM_CNFGInfo): FormGroup<IPRPL_TPLE_INCM_CNFGInfo> {
    PROPOSALTPLEINCMCONFIG.controls.RowState.setValue(data.RowState);
    PROPOSALTPLEINCMCONFIG.patchValue(data); // = this._formBuilder.group<IPRPL_TPLE_INCM_CNFGInfo>(data);
    return PROPOSALTPLEINCMCONFIG;
  }
  public PRPLCMPTCNFGMapper(PRPLCMPTCNFG: FormGroup<IPRPL_CMPT_CNFGInfo>, data: IPRPL_CMPT_CNFGInfo): FormGroup<IPRPL_CMPT_CNFGInfo> {
    PRPLCMPTCNFG.controls.RowState.setValue(data.RowState);
    PRPLCMPTCNFG.patchValue(data); // = this._formBuilder.group<IPRPL_CMPT_CNFGInfo>(data);
    return PRPLCMPTCNFG;
  }
  public PROPOSALTEMPLATERENTALINTMapper(PROPOSALTEMPLATERENTALINT: FormGroup<IPRPL_TPLE_RNTL_INTInfo>, data: IPRPL_TPLE_RNTL_INTInfo): FormGroup<IPRPL_TPLE_RNTL_INTInfo> {
    PROPOSALTEMPLATERENTALINT.controls.RowState.setValue(data.RowState);
    PROPOSALTEMPLATERENTALINT.patchValue(data); // = this._formBuilder.group<IPRPL_TPLE_RNTL_INTInfo>(data);
    return PROPOSALTEMPLATERENTALINT;
  }
  public PROPOSALDVTNTRCKMapper(PRPLDVTNTRCK: FormArray<IPRPL_DVTN_TRCK>, data: Array<IPRPL_DVTN_TRCK>): FormArray<IPRPL_DVTN_TRCK> {
    PRPLDVTNTRCK.clear();
    data?.forEach((item, index) => {
      PRPLDVTNTRCK.push(this._formBuilder.group<IPRPL_DVTN_TRCK>(item));
    });
    return PRPLDVTNTRCK;
  }

  public PRPLCOMMSCHMMapper(PRPLCOMMSCHM: FormGroup<IPRPL_COMM_SCHMInfo>, data: IPRPL_COMM_SCHMInfo): FormGroup<IPRPL_COMM_SCHMInfo> {
    PRPLCOMMSCHM.controls.RowState.setValue(data.RowState);
    PRPLCOMMSCHM.patchValue(data); // = this._formBuilder.group<IPRPL_COMM_SCHMInfo>(data);
    return PRPLCOMMSCHM;

  }
  public PRPLDELRPICASSNMapper(PRPLDELRPICASSN: FormGroup<IPRPL_DELR_PIC_ASSNInfo>, data: IPRPL_DELR_PIC_ASSNInfo): FormGroup<IPRPL_DELR_PIC_ASSNInfo> {
    PRPLDELRPICASSN.controls.RowState.setValue(data.RowState);
    PRPLDELRPICASSN.patchValue(data); // = this._formBuilder.group<IPRPL_DELR_PIC_ASSNInfo>(data);
    return PRPLDELRPICASSN;
  }
  public PRPLMKTGCOMMMapper(PRPLMKTGCOMM: FormGroup<IPRPL_MKTG_COMMInfo>, data: IPRPL_MKTG_COMMInfo): FormGroup<IPRPL_MKTG_COMMInfo> {
    PRPLMKTGCOMM.controls.RowState.setValue(data.RowState);
    PRPLMKTGCOMM.patchValue(data); // = this._formBuilder.group<IPRPL_MKTG_COMMInfo>(data);
    return PRPLMKTGCOMM;
  }
  public JP1JP2RECIPIENTMapper(JP1JP2RECIPIENT: FormGroup<IJP1JP2RecipientEntity>, data: IJP1JP2RecipientEntity): FormGroup<IJP1JP2RecipientEntity> {
    JP1JP2RECIPIENT.controls.RowState.setValue(data.RowState);
    this.PRPLJP1JP2RPNTMapper(JP1JP2RECIPIENT.controls.PRPLJP1JP2RPNT, data.PRPLJP1JP2RPNT);
    data.PRPLJP1JP2RPNTTAX.forEach((item, index) => {
      JP1JP2RECIPIENT.controls.PRPLJP1JP2RPNTTAX.push((this.PRPLJP1JP2RPNTTAXMapper(this._ProposalEntityFormService.PRPLJP1JP2RPNTTAXForm(), data.PRPLJP1JP2RPNTTAX[index])));
    });
    data.PRPLJP1JP2ROLERPNT.forEach((item, index) => {
      JP1JP2RECIPIENT.controls.PRPLJP1JP2ROLERPNT.push((this.PRPLJP1JP2ROLERPNTMapper(this._ProposalEntityFormService.PRPLJP1JP2ROLERPNTForm(), data.PRPLJP1JP2ROLERPNT[index])));
    });
    JP1JP2RECIPIENT.controls.JP1TAXINCULSIVEAMT.setValue(data.JP1TAXINCULSIVEAMT);
    JP1JP2RECIPIENT.controls.JP1TAXEXCULSIVEAMT.setValue(data.JP1TAXEXCULSIVEAMT);
    JP1JP2RECIPIENT.controls.JP2TAXINCULSIVEAMT.setValue(data.JP2TAXINCULSIVEAMT);
    JP1JP2RECIPIENT.controls.JP2TAXEXCULSIVEAMT.setValue(data.JP2TAXEXCULSIVEAMT);
    JP1JP2RECIPIENT.controls.CurrencySymbol.patchValue(data.CurrencySymbol);
    return JP1JP2RECIPIENT;
  }
  public PRPLJP1JP2RPNTMapper(PRPLJP1JP2RPNT: FormGroup<IPRPL_JP1_JP2_RPNTInfo>, data: IPRPL_JP1_JP2_RPNTInfo): FormGroup<IPRPL_JP1_JP2_RPNTInfo> {
    PRPLJP1JP2RPNT.controls.RowState.setValue(data.RowState);
    PRPLJP1JP2RPNT.patchValue(data); // = this._formBuilder.group<IPRPL_JP1_JP2_RPNTInfo>(data);
    return PRPLJP1JP2RPNT;
  }
  public PRPLJP1JP2RPNTTAXMapper(PRPLJP1JP2RPNTTAX: FormGroup<IPRPL_JP1_JP2_RPNT_TAXInfo>, data: IPRPL_JP1_JP2_RPNT_TAXInfo): FormGroup<IPRPL_JP1_JP2_RPNT_TAXInfo> {
    PRPLJP1JP2RPNTTAX.controls.RowState.setValue(data.RowState);
    PRPLJP1JP2RPNTTAX.patchValue(data); // = this._formBuilder.group<IPRPL_JP1_JP2_RPNT_TAXInfo>(data);
    return PRPLJP1JP2RPNTTAX;
  }
  public PRPLJP1JP2ROLERPNTMapper(PRPLJP1JP2ROLERPNT: FormGroup<IPRPL_JP1_JP2_ROLE_RPNTInfo>, data: IPRPL_JP1_JP2_ROLE_RPNTInfo): FormGroup<IPRPL_JP1_JP2_ROLE_RPNTInfo> {
    PRPLJP1JP2ROLERPNT.controls.RowState.setValue(data.RowState);
    PRPLJP1JP2ROLERPNT.patchValue(data); // = this._formBuilder.group<IPRPL_JP1_JP2_ROLE_RPNTInfo>(data);
    return PRPLJP1JP2ROLERPNT;
  }
  public JP2RECIPIENTMapper(JP2RECIPIENT: FormGroup<IJP2RecipientEntity>, data: IJP2RecipientEntity): FormGroup<IJP2RecipientEntity> {
    this.PRPLJP2RPNTMapper(JP2RECIPIENT.controls.PRPLJP2RPNT, data.PRPLJP2RPNT);
    data.PRPLJP2RPNTTAX.forEach((item, index) => {
      JP2RECIPIENT.controls.PRPLJP2RPNTTAX.push((this.PRPLJP2RPNTTAXMapper(this._ProposalEntityFormService.PRPLJP2RPNTTAXForm(), data.PRPLJP2RPNTTAX[index])));
    });
    JP2RECIPIENT.controls.TAXINCULSIVEAMT.setValue(data.TAXINCULSIVEAMT);
    JP2RECIPIENT.controls.TAXEXCULSIVEAMT.setValue(data.TAXEXCULSIVEAMT);
    JP2RECIPIENT.controls.CurrencySymbol.setValue(data.CurrencySymbol);
    return JP2RECIPIENT;
  }
  public PRPLJP2RPNTMapper(JP2RECIPIENT: FormGroup<IPRPL_JP2_RPNTInfo>, data: IPRPL_JP2_RPNTInfo): FormGroup<IPRPL_JP2_RPNTInfo> {
    JP2RECIPIENT.controls.RowState.setValue(data.RowState);
    JP2RECIPIENT.patchValue(data); // = this._formBuilder.group<IPRPL_JP2_RPNTInfo>(data);
    return JP2RECIPIENT;
  }
  public PRPLJP2RPNTTAXMapper(PRPLJP2RPNTTAX: FormGroup<IPRPL_JP2_RPNT_TAXInfo>, data: IPRPL_JP2_RPNT_TAXInfo): FormGroup<IPRPL_JP2_RPNT_TAXInfo> {
    PRPLJP2RPNTTAX.controls.RowState.setValue(data.RowState);
    PRPLJP2RPNTTAX.patchValue(data); // = this._formBuilder.group<IPRPL_JP2_RPNT_TAXInfo>(data);
    return PRPLJP2RPNTTAX;
  }
  public ProposalArticleComponentEntityMapper(PRPLARTICLECOMPONENTENTITYCOL: FormGroup<IProposalArticleComponentEntity>, data: IProposalArticleComponentEntity): FormGroup<IProposalArticleComponentEntity> {
    PRPLARTICLECOMPONENTENTITYCOL.controls.RowState.setValue(data.RowState);
    this.PRPLARTEAMNTTRANMapper(PRPLARTICLECOMPONENTENTITYCOL.controls.PRPLARTEAMNTTRAN, data.PRPLARTEAMNTTRAN)
    this._FormState.ResetFormArrayState(PRPLARTICLECOMPONENTENTITYCOL.controls.PRPLARTEAMNTTRANTAX, DataRowState.Removed);
    data.PRPLARTEAMNTTRANTAX.forEach((item) => {
      PRPLARTICLECOMPONENTENTITYCOL.controls.PRPLARTEAMNTTRANTAX.push(this.PRPLARTEAMNTTRANTAXMapper(this._ProposalEntityFormService.PRPLARTEAMNTTRANTAXForm(), item));
    })
    PRPLARTICLECOMPONENTENTITYCOL.controls.TAXEXCULSIVEAMT.setValue(data.TAXEXCULSIVEAMT);
    PRPLARTICLECOMPONENTENTITYCOL.controls.TAXINCULSIVEAMT.setValue(data.TAXINCULSIVEAMT);
    PRPLARTICLECOMPONENTENTITYCOL.controls.NETPAYABLEAMT.setValue(data.NETPAYABLEAMT);
    PRPLARTICLECOMPONENTENTITYCOL.controls.WITHVATLESSITCAMT.setValue(data.WITHVATLESSITCAMT);
    PRPLARTICLECOMPONENTENTITYCOL.controls.TAXWITHOUTVATAMT.setValue(data.TAXWITHOUTVATAMT);
    PRPLARTICLECOMPONENTENTITYCOL.controls.CurrencySymbol.setValue(data.CurrencySymbol);

    return PRPLARTICLECOMPONENTENTITYCOL;

  }

  public PRPLARTEAMNTTRANMapper(PRPLARTEAMNTTRAN: FormGroup<IPRPL_ARTE_AMNT_TRANInfo>, data: IPRPL_ARTE_AMNT_TRANInfo): FormGroup<IPRPL_ARTE_AMNT_TRANInfo> {
    PRPLARTEAMNTTRAN.controls.RowState.setValue(data.RowState);
    PRPLARTEAMNTTRAN.patchValue(data);
    return PRPLARTEAMNTTRAN;
  }
  public PRPLARTEAMNTTRANTAXMapper(PRPLARTEAMNTTRANTAX: FormGroup<IPRPL_ARTE_AMNT_TRAN_TAXInfo>, data: IPRPL_ARTE_AMNT_TRAN_TAXInfo): FormGroup<IPRPL_ARTE_AMNT_TRAN_TAXInfo> {
    PRPLARTEAMNTTRANTAX.controls.RowState.setValue(data.RowState);
    PRPLARTEAMNTTRANTAX.patchValue(data);
    return PRPLARTEAMNTTRANTAX;
  }


  public ProposalChargeEntityMapper(PROPOSALCHARGE: FormGroup<IProposalChargeEntity>, data: IProposalChargeEntity): FormGroup<IProposalChargeEntity> {
    if (data.RowState != undefined)
      PROPOSALCHARGE.controls.RowState.setValue(data.RowState);
    else
      PROPOSALCHARGE.controls.RowState.setValue(DataRowState.Added);
    this.PRPLCHRGMapper(PROPOSALCHARGE.controls.PRPLCHRG, data.PRPLCHRG)
    this._FormState.ResetFormArrayState(PROPOSALCHARGE.controls.PRPLCHRGTAX, DataRowState.Removed);
    data.PRPLCHRGTAX.forEach((item) => {
      PROPOSALCHARGE.controls.PRPLCHRGTAX.push(this.PRPLCHRGTAXMapper(this._ProposalEntityFormService.PRPLCHRGTAXForm(), item));

    })
    PROPOSALCHARGE.controls.TAXEXCULSIVEAMT.setValue(data.TAXEXCULSIVEAMT);
    PROPOSALCHARGE.controls.TAXINCULSIVEAMT.setValue(data.TAXINCULSIVEAMT);
    PROPOSALCHARGE.controls.ISENABLED.setValue(data.ISENABLED);
    PROPOSALCHARGE.controls.IsFinanceEnabled.setValue(data.IsFinanceEnabled);
    PROPOSALCHARGE.controls.IsRecieveByDealerEnabled.setValue(data.IsRecieveByDealerEnabled);

    return PROPOSALCHARGE;

  }

  public PRPLCHRGMapper(PRPLCHRG: FormGroup<IPRPL_CHRGInfo>, data: IPRPL_CHRGInfo): FormGroup<IPRPL_CHRGInfo> {
    if (data.RowState != undefined)
      PRPLCHRG.controls.RowState.setValue(data.RowState);
    else
      PRPLCHRG.controls.RowState.setValue(DataRowState.Added);

    PRPLCHRG.patchValue(data);

    if (data.CHARGEAMT == null)
      PRPLCHRG.controls.CHARGEAMT.setValue(0);
    return PRPLCHRG;
  }
  public PRPLCHRGTAXMapper(PRPLCHRGTAX: FormGroup<IPRPL_CHRG_TAXInfo>, data: IPRPL_CHRG_TAXInfo): FormGroup<IPRPL_CHRG_TAXInfo> {
    if (data.RowState != undefined)
      PRPLCHRGTAX.controls.RowState.setValue(data.RowState);
    else
      PRPLCHRGTAX.controls.RowState.setValue(DataRowState.Added);

    PRPLCHRGTAX.patchValue(data);
    if (data.TAXTYPECDE == TaxType.GetStringValue(TaxType.VAT_GST)) {
      PRPLCHRGTAX.controls.TAXTYPE.patchValue(TaxType.GetDescriptionStringValue(TaxType.VAT_GST))
    }
    else if (data.TAXTYPECDE == TaxType.GetStringValue(TaxType.WHT)) {
      PRPLCHRGTAX.controls.TAXTYPE.patchValue(TaxType.GetDescriptionStringValue(TaxType.WHT))
    }
    return PRPLCHRGTAX;
  }

  public PROPOSALRENTALDETAILMapper(PROPOSALRENTALDETAIL: FormGroup<IPRPL_RNTL_DETLInfo>, data: IPRPL_RNTL_DETLInfo): FormGroup<IPRPL_RNTL_DETLInfo> {

    // data.RENTALTYP = RentalType.GetStringValue(Number(data?.RENTALTYP));
    // data.RENTALTYP = RentalType.GetStringValue(Number(data?.RENTALTYP));
    if (data.RowState != undefined)
      PROPOSALRENTALDETAIL.controls.RowState.setValue(data.RowState);
    else
      PROPOSALRENTALDETAIL.controls.RowState.setValue(DataRowState.Added);

    PROPOSALRENTALDETAIL.patchValue(data);
    return PROPOSALRENTALDETAIL;
  }

  public PROPOSALREPAYMENTPLANENTITYCOLMapper(PROPOSALREPAYMENTPLANENTITYCOL: FormGroup<IProposalRepaymentPlanEntity>, data: IProposalRepaymentPlanEntity): FormGroup<IProposalRepaymentPlanEntity> {
    if (data.RowState != undefined)
      PROPOSALREPAYMENTPLANENTITYCOL.controls.RowState.setValue(data.RowState);
    else
      PROPOSALREPAYMENTPLANENTITYCOL.controls.RowState.setValue(DataRowState.Added);
    this.PRPLRPMTPLANMapper(PROPOSALREPAYMENTPLANENTITYCOL.controls.PRPLRPMTPLAN, data.PRPLRPMTPLAN)
    this._FormState.ResetFormArrayState(PROPOSALREPAYMENTPLANENTITYCOL.controls.PRPLRPMTPLANTAX, DataRowState.Removed);
    if (data.PRPLRPMTPLANTAX) {
      data.PRPLRPMTPLANTAX.forEach((item) => {
        PROPOSALREPAYMENTPLANENTITYCOL.controls.PRPLRPMTPLANTAX.push(this.PRPLRPMTPLANTAXMapper(this._ProposalEntityFormService.PRPLRPMTPLANTAXForm(), item));
      })
    }

    return PROPOSALREPAYMENTPLANENTITYCOL;

  }
  public PRPLRPMTPLANMapper(PRPLRPMTPLAN: FormGroup<IPRPL_RPMT_PLANInfo>, data: IPRPL_RPMT_PLANInfo): FormGroup<IPRPL_RPMT_PLANInfo> {
    if (data.RowState != undefined)
      PRPLRPMTPLAN.controls.RowState.setValue(data.RowState);
    else
      PRPLRPMTPLAN.controls.RowState.setValue(DataRowState.Added);

    PRPLRPMTPLAN.patchValue(data);
    return PRPLRPMTPLAN;
  }
  public PRPLRPMTPLANTAXMapper(PRPLRPMTPLANTAX: FormGroup<IPRPL_RPMT_PLAN_TAXInfo>, data: IPRPL_RPMT_PLAN_TAXInfo): FormGroup<IPRPL_RPMT_PLAN_TAXInfo> {
    if (data.RowState != undefined)
      PRPLRPMTPLANTAX.controls.RowState.setValue(data.RowState);
    else
      PRPLRPMTPLANTAX.controls.RowState.setValue(DataRowState.Added);

    PRPLRPMTPLANTAX.patchValue(data);
    return PRPLRPMTPLANTAX;
  }

  public FINEYPECNFGMapper(FINEYPECNFG: FormArray<IFINE_TYPE_INCM_CNFGInfo>, data: Array<IFINE_TYPE_INCM_CNFGInfo>): FormArray<IFINE_TYPE_INCM_CNFGInfo> {
    data.forEach((item, index) => {
      FINEYPECNFG.push(this._formBuilder.group<IFINE_TYPE_INCM_CNFGInfo>(item));
    });
    return FINEYPECNFG;
  }

  public PROPOSALARTICLEBASERATEMapper(PROPOSALARTICLEBASERATE: FormArray<IPRPL_ARTE_BASE_RATEInfo>, data: Array<IPRPL_ARTE_BASE_RATEInfo>): FormArray<IPRPL_ARTE_BASE_RATEInfo> {
    data.forEach((item, index) => {
      PROPOSALARTICLEBASERATE.push(this._formBuilder.group<IPRPL_ARTE_BASE_RATEInfo>(item));
    });
    return PROPOSALARTICLEBASERATE;
  }
  public PROPOSALACCESSORYMapper(PROPOSALACCESSORY: FormArray<IPRPL_ACCYInfo>, data: Array<IPRPL_ACCYInfo>): FormArray<IPRPL_ACCYInfo> {
    this._FormState.ResetFormArrayState(PROPOSALACCESSORY, DataRowState.Removed);
    // PROPOSALACCESSORY.clear();
    data.forEach((item, index) => {
      PROPOSALACCESSORY.push(this._formBuilder.group<IPRPL_ACCYInfo>(item));
    });
    return PROPOSALACCESSORY;
  }

  public OTOPRPLASSTBPKBRPRSDETLMapper(OTOPRPLASSTBPKBRPRS: FormArray<IPRPL_BPKB_RPRS_DETLInfo>, data: Array<IPRPL_BPKB_RPRS_DETLInfo>): FormArray<IPRPL_BPKB_RPRS_DETLInfo> {
    this._FormState.ResetFormArrayState(OTOPRPLASSTBPKBRPRS, DataRowState.Removed);
    data.forEach((item: IPRPL_BPKB_RPRS_DETLInfo, index: any) => {
      let group = this._ProposalEntityFormService.OTOPRPLASSTBPKBRPRSDETLForm();
      group.patchValue(item);
      OTOPRPLASSTBPKBRPRS.push(group);
    });
    return OTOPRPLASSTBPKBRPRS;
  }
  public OTOPRPLASSTBPKBGRTRDETLMapper(OTOPRPLASSTBPKBGRTR: FormArray<IPRPL_BPKB_GRTR_DETLInfo>, data: Array<IPRPL_BPKB_GRTR_DETLInfo>): FormArray<IPRPL_BPKB_GRTR_DETLInfo> {
    OTOPRPLASSTBPKBGRTR.clear();
    data.forEach((item, index) => {
      OTOPRPLASSTBPKBGRTR.push(this._formBuilder.group<IPRPL_BPKB_GRTR_DETLInfo>(item));
    });
    return OTOPRPLASSTBPKBGRTR;
  }

  public PROPOSALARTICLECHARTDETLMapper(PROPOSALARTICLECHARTDETL: FormGroup<IPRPL_ARTE_CHRT_DETLInfo>, data: IPRPL_ARTE_CHRT_DETLInfo): FormGroup<IPRPL_ARTE_CHRT_DETLInfo> {
    PROPOSALARTICLECHARTDETL.patchValue(data);
    return PROPOSALARTICLECHARTDETL;
  }

  public PropsalMainInsuranceMapper(PropsalMainInsurance: FormGroup<IMainInsuranceEntity>, data: IMainInsuranceEntity): FormGroup<IMainInsuranceEntity> {
    if (data.RowState != undefined)
      PropsalMainInsurance.controls.RowState.setValue(data.RowState);
    else
      PropsalMainInsurance.controls.RowState.setValue(data.RowState);
    this.PRPLINSRMapper(PropsalMainInsurance.controls.PRPLINSR, data.PRPLINSR),
      PropsalMainInsurance.controls?.INSRDPRNPLCY?.clear();
    data.INSRDPRNPLCY.forEach(item => {
      PropsalMainInsurance.controls.INSRDPRNPLCY.push(this.INSRDPRNPLCYMapper(this._ProposalEntityFormService.InsuranceDepreciationPolicyForm(), item));
    })
    PropsalMainInsurance.controls?.STANDARDINSURANCE?.clear();
    data.STANDARDINSURANCE.forEach(item => {
      PropsalMainInsurance.controls.STANDARDINSURANCE.push(this.STANDARDINSURANCEMapper(this._ProposalEntityFormService.StandardInsuranceForm(), item));
    })
    return PropsalMainInsurance
  }

  public PRPLINSRMapper(PRPLINSR: FormGroup<IPRPL_INSRInfo>, data: IPRPL_INSRInfo): FormGroup<IPRPL_INSRInfo> {
    PRPLINSR.patchValue(data);
    PRPLINSR.controls.RowState.setValue(data.RowState);
    return PRPLINSR;
  }

  public INSRDPRNPLCYMapper(INSRDPRNPLCY: FormGroup<IINSR_DPRN_PLCYInfo>, data: IINSR_DPRN_PLCYInfo): FormGroup<IINSR_DPRN_PLCYInfo> {
    INSRDPRNPLCY.patchValue(data);
    INSRDPRNPLCY.controls.RowState.setValue(data.RowState);
    return INSRDPRNPLCY;
  }

  public STANDARDINSURANCEMapper(STANDARDINSURANCE: FormGroup<IStandardInsuranceEntity>, data: IStandardInsuranceEntity): FormGroup<IStandardInsuranceEntity> {
    this.PRPLSTNDINSRMapper(STANDARDINSURANCE.controls.PRPLSTNDINSR, data.PRPLSTNDINSR);
    data.PRPLADDLINSR.forEach(item => {
      STANDARDINSURANCE.controls.PRPLADDLINSR.push(this.PRPLADDLINSRMapper(this._ProposalEntityFormService.ProposalAdditionalInsuranceInfoForm(), item));
    });
    data.STANDARDINSURANCEDETAIL.forEach(item => {
      STANDARDINSURANCE.controls.STANDARDINSURANCEDETAIL.push(this.STANDARDINSURANCEDETAILMapper(this._ProposalEntityFormService.StandardInsuranceDetailForm(), item));
    });
    STANDARDINSURANCE.controls.RowState.setValue(data.RowState);
    return STANDARDINSURANCE;
  }

  public PRPLSTNDINSRMapper(PRPLSTNDINSR: FormGroup<IPRPL_STND_INSRInfo>, data: IPRPL_STND_INSRInfo): FormGroup<IPRPL_STND_INSRInfo> {
    PRPLSTNDINSR.patchValue(data);
    PRPLSTNDINSR.controls.RowState.setValue(data.RowState);
    return PRPLSTNDINSR;
  }

  public PRPLADDLINSRMapper(PRPLADDLINSR: FormGroup<IPRPL_ADDL_INSRInfo>, data: IPRPL_ADDL_INSRInfo): FormGroup<IPRPL_ADDL_INSRInfo> {
    PRPLADDLINSR.patchValue(data);
    PRPLADDLINSR.controls.RowState.setValue(data.RowState);
    return PRPLADDLINSR;
  }

  public STANDARDINSURANCEDETAILMapper(STANDARDINSURANCEDETAIL: FormGroup<IStandardInsuranceDetailEntity>, data: IStandardInsuranceDetailEntity): FormGroup<IStandardInsuranceDetailEntity> {
    this.PRPLSTNDINSRDETLMapper(STANDARDINSURANCEDETAIL.controls.PRPLSTNDINSRDETL, data.PRPLSTNDINSRDETL);
    data.PRPLADDLINSRDETL.forEach(item => {
      STANDARDINSURANCEDETAIL.controls.PRPLADDLINSRDETL.push(this.PRPLADDLINSRDETLMapper(this._ProposalEntityFormService.ProposalAdditionalInsuranceDetailForm(), item));
    });
    return STANDARDINSURANCEDETAIL;
  }

  public PRPLSTNDINSRDETLMapper(PRPLSTNDINSRDETL: FormGroup<IPRPL_STND_INSR_DETLInfo>, data: IPRPL_STND_INSR_DETLInfo): FormGroup<IPRPL_STND_INSR_DETLInfo> {
    PRPLSTNDINSRDETL.patchValue(data);
    PRPLSTNDINSRDETL.controls.RowState.setValue(data.RowState);
    return PRPLSTNDINSRDETL;
  }

  public PRPLADDLINSRDETLMapper(PRPLADDLINSRDETL: FormGroup<IPRPL_ADDL_INSR_DETLInfo>, data: IPRPL_ADDL_INSR_DETLInfo): FormGroup<IPRPL_ADDL_INSR_DETLInfo> {
    PRPLADDLINSRDETL.patchValue(data);
    PRPLADDLINSRDETL.controls.RowState.setValue(data.RowState);
    return PRPLADDLINSRDETL;
  }

  public ProposalChartMapper(PROPOSALCHART: FormGroup<IPRPL_CHRTInfo>, data: IPRPL_CHRTInfo): FormGroup<IPRPL_CHRTInfo> {
    PROPOSALCHART.patchValue(data);
    return PROPOSALCHART;
  }

  public PROPOSALARTICLEMapper(PROPOSALARTICLE: FormGroup<IPRPL_ARTEInfo>, data: IPRPL_ARTEInfo) {
    PROPOSALARTICLE.patchValue(data);
  }

  public ApplicantSubEntitiesIndexing(ProposalApplicant: FormArray<IProposalApplicantEntity>) {
    ProposalApplicant.controls.forEach(applicant => {
      applicant.controls.PROPOSALAPPLICANTBANK.controls.forEach((bank, i) => {
        bank.controls.INDEX.setValue(i);
      });
      applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPLICANTEMPLOYMENT.controls.forEach((employment, i) => {
        employment.controls.INDEX.setValue(i);
      })
      applicant.controls.INDIVIDUALAPPLICANT.controls.PROPOSALAPPFAMILY.controls.forEach((member, i) => {
        member.controls.INDEX.setValue(i);
      })
    })
  }

}
