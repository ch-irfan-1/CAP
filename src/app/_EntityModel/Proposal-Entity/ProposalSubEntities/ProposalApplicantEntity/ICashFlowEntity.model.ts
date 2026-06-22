import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import { IPRPL_CSFL_DETLInfo, IPRPL_FINL_RATOInfo } from "./ProposalApplicantEntity.model.index";

export interface ICashFlowEntity extends IBaseEntity {
    PRPLCSFLDETL: Array<IPRPL_CSFL_DETLInfo>;
    PRPLFINLRATO: Array<IPRPL_FINL_RATOInfo>;
}