import { Control } from "src/Library";

export interface ITPLE_RNTL_CMPT_ATCHInfo{
    TPLERNTLINTRSEQID: number;
    AMNTCMPTCDE: string;
    AMNTCMPTCNFG: string;
    HANDLEDBYCUSTOMERIND: boolean;
    PAYTOINTRODUCERIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    AMNTSUBCMPTCDE: string;
    RNTLCNFGATCHSEQID: number;
}