import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";
import { IPRPL_TRCK_DETLInfo, IPRPL_TOTL_TRCK_OWNDInfo, IPRPL_TRCK_OPRT_RVNUInfo } from './ProposalArticleEntity.model.index';

export interface IProposalTruckDetailEntity extends IBaseEntity {
     PROPOSALTRUCKDETAIL: IPRPL_TRCK_DETLInfo;
    TOTALTRUCKOWNED: Array<IPRPL_TOTL_TRCK_OWNDInfo>;
    OPERATINGREVENUE: Array<IPRPL_TRCK_OPRT_RVNUInfo>;
}