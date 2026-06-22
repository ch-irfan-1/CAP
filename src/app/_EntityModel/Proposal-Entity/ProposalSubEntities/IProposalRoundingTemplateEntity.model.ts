import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { IPRPL_TPLE_RONDInfo, IPRPL_TPLE_ROND_DETLInfo} from "./ProposalSubEntities.index";


export interface IProposalRoundingTemplateEntity extends IBaseEntity {
    // PRPLTPLEROND: IPRPL_TPLE_RONDInfo;
    PRPLTPLERONDDETL: Array<IPRPL_TPLE_ROND_DETLInfo>;
}