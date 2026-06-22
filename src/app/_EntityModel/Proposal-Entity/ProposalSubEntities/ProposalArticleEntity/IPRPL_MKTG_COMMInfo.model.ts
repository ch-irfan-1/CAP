import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_MKTG_COMMInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    DEALERID: number;
    COMMISSIONMTHDCDE: string;
    //CODE: string;
    ISDEFAULT: boolean;
    DEFAULTAMTPCT: number;
    MAXAMTPCT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}