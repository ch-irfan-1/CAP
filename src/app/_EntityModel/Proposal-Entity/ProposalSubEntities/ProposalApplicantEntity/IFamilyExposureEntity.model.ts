import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

import { IFMLY_BLAK_LIST_EXPRInfo, IFMLY_CMS_EXPRInfo,IFMLY_POS_EXPRInfo } from "./ProposalApplicantEntity.model.index";
export interface IFamilyExposureEntity extends IBaseEntity {
    FMLYBLAKLISTEXPR: Array<IFMLY_BLAK_LIST_EXPRInfo>;
    FMLYCMSEXPR: Array<IFMLY_CMS_EXPRInfo>;
    FMLYPOSEXPR: Array<IFMLY_POS_EXPRInfo>;
}