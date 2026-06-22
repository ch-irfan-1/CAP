import { Control } from "src/Library";

export interface ITPLE_COMM_CNFG_ATCHInfo{
        TPLECOMMCNFGATCHSEQID: number;
        TPLEID: number;
        COMMISSIONTYPECDE: string;
        COMMAMRTMTHDCDE: string;
        APPLIEDIND: boolean;
        EXECUTIONDTE: Control<Date>;
        EXECUTIONOFFSET: number;
        SESSIONID: number;
        SESSIONCDE: string;
        TPLERNTLINTRSEQID: number;
}