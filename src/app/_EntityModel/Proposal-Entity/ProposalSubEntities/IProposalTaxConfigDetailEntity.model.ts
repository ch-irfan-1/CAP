import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import {IPRPL_TAX_CDTN_RLSPInfo, IPRPL_TAX_CMPT_CDTNInfo, IPRPL_TAX_PRTY_DETLInfo} from "./ProposalSubEntities.index";

export interface IProposalTaxConfigDetailEntity extends IBaseEntity {
    PRPLTAXCDTNRLSP: Array<IPRPL_TAX_CDTN_RLSPInfo>;
    PRPLTAXCMPTCDTN: IPRPL_TAX_CMPT_CDTNInfo;
    PRPLTAXPRTYDETL: Array<IPRPL_TAX_PRTY_DETLInfo>;

}