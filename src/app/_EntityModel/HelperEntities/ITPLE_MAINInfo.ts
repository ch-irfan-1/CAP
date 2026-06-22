import { Control } from "src/Library";

export interface ITPLE_MAINInfo{
        TPLEID: number;
        TPLEDSC: string;
        TEMPLATETYPCDE: string;
        EXECUTIONDTE: Control<Date>;
        EXECUTIONOFFSET: number;
        SESSIONID: number;
        SESSIONCDE: string;
        FINTYPCDE: string;
        COMPANYID: number;
        CURRENCYCDE: string;
        ISOL: boolean;
        RECEIPTTYPECDE: string;
        ISPACKAGE: boolean;
}