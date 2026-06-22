import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TRCK_OPRT_RVNUInfo extends IBaseEntity {
    TRCKOPRTRVNUID: number;
    PROPOSALID: number;
    ASSETID: number;
    TRUCKCATEGORYCDE: string;
    REVENUEUNIT: number;
    UNITINOPERATION: number;
    SUBTOTALREVENUE: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}