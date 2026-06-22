import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_SBSD_DETLInfo extends IBaseEntity {
    SUBSIDYSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    SUBSIDYTYPECDE: string;
    //CODE: string
    NOOFINSTALLMENTS: number;
    ADJUSTMENTTYPECODE: string;
    SUBSIDYAMOUNT: number;
    ADJUSTTOFINANCEAMTIND: boolean;
    NETOFFIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    SUBSIDYRATE: number;
}