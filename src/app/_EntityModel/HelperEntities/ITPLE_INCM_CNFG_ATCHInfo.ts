import { Control } from "src/Library";

export interface ITPLE_INCM_CNFG_ATCHInfo{
        TPLEINCMCNFGATCHSEQID: number;
        TPLEID: number;
        INCOMETYPECDE: string;
        INCMAMRTMTHDCDE: string;
        APPLIEDIND: boolean;
        EXECUTIONDTE: Control<Date>;
        EXECUTIONOFFSET: number;
        SESSIONID: number;
        SESSIONCDE: string;
        TPLERNTLINTRSEQID: number;
}