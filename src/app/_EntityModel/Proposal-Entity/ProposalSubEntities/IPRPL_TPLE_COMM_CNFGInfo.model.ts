import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TPLE_COMM_CNFGInfo extends IBaseEntity {
    PRPLTPLECOMMCNFGSEQID: number;
    PROPOSALID: number;
    COMMISSIONTYPECDE: string;
    //CODE: string;
    COMMAMRTMTHDCDE: string;
    APPLIEDIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}