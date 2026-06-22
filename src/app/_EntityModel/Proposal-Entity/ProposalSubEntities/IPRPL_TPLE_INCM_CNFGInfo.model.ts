import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TPLE_INCM_CNFGInfo extends IBaseEntity {
    PRPLTPLEINCMCNFGSEQID: number;
    PROPOSALID: number;
    INCMTYPECDE: string;
    //CODE: string;
    INCMAMRTMTHDCDE: string;
    APPLIEDIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}