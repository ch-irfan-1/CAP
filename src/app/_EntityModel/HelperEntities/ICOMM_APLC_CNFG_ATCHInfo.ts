import { Control } from "src/Library";

export interface ICOMM_APLC_CNFG_ATCHInfo{
    COMMAPLCCNFGATCHID: number;
    TPLEPERDSEQID: number;
    TPLEID: number;
    ASSETTYPECDE: string
    COMMISSIONTYPECDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    TEMPLATETYPCDE: string;
    COMMISSIONAMOUNTTYPECDE: string;
}