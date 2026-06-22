import { Control } from "src/Library";

export interface ITPLE_CHRT_ATCHInfo {
    CHRTATCHSEQID: number;
    TPLEID: number;
    CHARTEFFECTIVEFROM: Control<Date>;
    MODELTYPECDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    CHARTCDE: string;
    TPLERNTLINTRSEQID: number;
}