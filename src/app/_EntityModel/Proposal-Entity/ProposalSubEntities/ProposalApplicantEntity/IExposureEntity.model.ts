import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import { IPRPL_EXPRInfo, ICONT_EXPRInfo, IPRPL_BLAK_LISTInfo } from "./ProposalApplicantEntity.model.index";

export interface IExposureEntity extends IBaseEntity {
    PROPOSALEXPOSURE: Array<IPRPL_EXPRInfo>;
    CONTRACTEXPOSURE: Array<ICONT_EXPRInfo>;
    PROPOSALBLACKLIST: Array<IPRPL_BLAK_LISTInfo>;
}