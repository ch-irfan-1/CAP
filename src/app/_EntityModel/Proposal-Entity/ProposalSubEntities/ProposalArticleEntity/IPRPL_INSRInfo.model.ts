import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_INSRInfo extends IBaseEntity {
    TOTALAROAMNT: number;
    DPRNPLCYNME: string;
    INSRCOMYBRCHNME: string;
    // above properties are from helper class
    PROPOSALID: number;
    ASSETID: number;
    PRPLINSRID: number;
    INSRTYPECDE: string;
    //CODE: string;
    INSURER: number;
    EXPIRYDTE: Control<Date>;
    STARTDTE: Control<Date>;
    POLICYNBR: string;
    REGIONCDE: string;
    LOADINGRTE: number;
    CERTIFICATENBR: string;
    ASSETCOST: number;
    ASSETUSAGECDE: string;
    ASSETUSAGEMINRTE: number;
    ASSETUSAGEMAXRTE: number;
    ASSETUSAGEDEFAULTRTE: number;
    DEPRECIATIONPOLICYCDE: string;
    TOTALFINANCEAMNT: number;
    TOTALUPFRONTAMNT: number;
    TOTALINSRSUBSIDYAMNT: number;
    SESSIONID: number;
    SESSIONCDE: string;
    INSURANCEB2BIND: boolean;
    INSURANCEB2BPCT: number;
    INSURANCEB2BAMNT: number;
    RECEIVEBYDEALERIND: boolean;
    EXECUTIONDTE: Control<Date>;
    POLICYFEE: number;
    INSURANCECOMPANYBRANCHID: number;
    UPDATEDB2BIND: boolean;
}