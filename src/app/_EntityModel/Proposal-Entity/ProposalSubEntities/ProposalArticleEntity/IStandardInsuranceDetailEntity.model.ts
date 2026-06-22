import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import {IPRPL_STND_INSR_DETLInfo, IPRPL_ADDL_INSR_DETLInfo} from './ProposalArticleEntity.model.index';

export interface IStandardInsuranceDetailEntity extends IBaseEntity {
    PRPLSTNDINSRDETL: IPRPL_STND_INSR_DETLInfo;
    PRPLADDLINSRDETL: Array<IPRPL_ADDL_INSR_DETLInfo>;
    // helper properties
    PARENTINDEX : number;
    OLDFIXPREMIUMAMT: number;
    INDEX: number;
    ISEXPANDED: boolean;
}