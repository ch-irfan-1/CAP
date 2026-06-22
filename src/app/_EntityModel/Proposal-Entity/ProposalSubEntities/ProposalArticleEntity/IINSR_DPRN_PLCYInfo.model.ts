import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IINSR_DPRN_PLCYInfo extends IBaseEntity {
    INSRDPRNPLCYSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    ASSETTYPECDE: string;
    //CODE: string;
    DPRCPCT: number;
    NOOFYEARS: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}