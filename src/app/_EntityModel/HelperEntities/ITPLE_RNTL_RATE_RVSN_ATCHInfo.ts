import { Control } from "src/Library";

export interface ITPLE_RNTL_RATE_RVSN_ATCHInfo{
        TPLERNTLRATERVSNATCHSEQID: number;
        TPLERNTLINTRSEQID: number;
        MONTH: string;
        DAY: number;
        MONTHENDIND: boolean;
        ACTIVEIND: boolean;
        EXECUTIONDTE: Control<Date>;
        SESSIONCDE: string;
        EXECUTIONOFFSET: number;
        SESSIONID: number;
}