import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import {
    IPRPLInfo, IProposalApplicantEntity, IProposalArticleEntity, IPRPL_BSNS_RULEInfo, IPRPL_EGLE_SCRE_TWOInfo, IPRPL_RESN_CODEInfo,
    IPRPL_TPLE_RNTL_INTInfo, IPRPL_CHRTInfo, IProposalRoundingTemplateEntity, IPRPL_CMPT_CNFGInfo, IPRPL_CONT_MPNGInfo, IProposalTaxConfigEntity, IPRPL_TPLE_COMM_CNFGInfo,
    IPRPL_TPLE_INCM_CNFGInfo, IPRPL_ISRE_MPNGInfo, IPRPL_IOPS_USERInfo, IPRPL_DVTN_TRCK,
} from "./ProposalSubEntities/ProposalSubEntities.index";

export interface IProposalEntity extends IBaseEntity {
    PROPOSAL: IPRPLInfo;
    PROPOSALAPPLICANT: Array<IProposalApplicantEntity>;
    PROPOSALARTICLE: Array<IProposalArticleEntity>;
    PROPOSALBUSINESSRULES: Array<IPRPL_BSNS_RULEInfo>;
    EAGLESCORETWO: Array<IPRPL_EGLE_SCRE_TWOInfo>;
    PROPOSALREASONCODE: Array<IPRPL_RESN_CODEInfo>;
    PROPOSALTEMPLATERENTALINT: IPRPL_TPLE_RNTL_INTInfo;
    PROPOSALCHART: Array<IPRPL_CHRTInfo>;
    //PRPLCONTMPNG: Array<IPRPL_CONT_MPNGInfo>;
    PROPOSALROUNDINGTEMPLATE: IProposalRoundingTemplateEntity;
    PRPLCMPTCNFG: Array<IPRPL_CMPT_CNFGInfo>;
    PROPOSALTAXCONFIG: Array<IProposalTaxConfigEntity>;
    PROPOSALTPLECOMMCONFIG: Array<IPRPL_TPLE_COMM_CNFGInfo>;
    PROPOSALTPLEINCMCONFIG: Array<IPRPL_TPLE_INCM_CNFGInfo>;
    PROPOSALISUREMAPPING: IPRPL_ISRE_MPNGInfo;
    PRPLIOPSUSER: IPRPL_IOPS_USERInfo;
    PRPLDVTNTRCK: Array<IPRPL_DVTN_TRCK>;
}