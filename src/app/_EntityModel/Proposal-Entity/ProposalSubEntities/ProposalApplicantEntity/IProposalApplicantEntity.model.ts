import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import {
    IPRPL_APLT_MAINInfo, IPRPL_APLTInfo, IPRPL_APLT_ROLEInfo, IPRPL_APLT_ID_DETLInfo, IPRPL_APLT_PRNL_RFRNInfo,
    IPRPL_APLT_BANKInfo, IPRPL_CRDT_CARD_DETLInfo, IAddressEntity, IPRPL_APLT_FINL_DETLInfo, ICompanyApplicantEntity,
    IIndividualApplicantEntity, ICashFlowEntity, IExposureEntity, IProposalApplicantBusinessEntity, IPRPL_APLT_RPRSInfo,
    IMPOS_APLT_DCMTInfo, IPRPL_FILD_VIST_APMTInfo, IPRPL_APLT_NET_PRFTInfo
} from "./ProposalApplicantEntity.model.index";

export interface IProposalApplicantEntity extends IBaseEntity {
    PROPOSALAPPLICANTMAIN: IPRPL_APLT_MAINInfo;
    PROPOSALAPPLICANT: IPRPL_APLTInfo;
    PROPOSALAPPLICANTROLE: Array<IPRPL_APLT_ROLEInfo>;
    PROPOSALAPPLICANTIDDETAIL: Array<IPRPL_APLT_ID_DETLInfo>;
    PROPOSALAPPLICANTPERSONNALREFERENCE: Array<IPRPL_APLT_PRNL_RFRNInfo>;
    PROPOSALAPPLICANTBANK: Array<IPRPL_APLT_BANKInfo>;
    PROPAPPCREDITCARDDETAIL: Array<IPRPL_CRDT_CARD_DETLInfo>;
    ADDRESS: Array<IAddressEntity>;
    PROPOSALAPPFINANCIALDETAILS: Array<IPRPL_APLT_FINL_DETLInfo>;
    COMPANYAPPLICANT: ICompanyApplicantEntity;
    INDIVIDUALAPPLICANT: IIndividualApplicantEntity;
    PrposalcashflowDetail: ICashFlowEntity;
    ProposalExposure: IExposureEntity;
    PROPOSALAPPLICANTBUSINESS: Array<IProposalApplicantBusinessEntity>;
    PROPOSALAPPLICANTREPRESENTATIVE: Array<IPRPL_APLT_RPRSInfo>;
    MPOSDOCUMENTS: Array<IMPOS_APLT_DCMTInfo>;
    //MPOSFEILDVISIT: IPRPL_FILD_VIST_APMTInfo;
    PROPOSALAPPLICANTNETPROFIT: Array<IPRPL_APLT_NET_PRFTInfo>;
    OTOAPLTCTGYCDE: string;

}