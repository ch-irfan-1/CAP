import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ARTE_AMNT_TRANInfo extends IBaseEntity {
    PROPOSALARTEAMTTRANSID: number;
    PROPOSALID: number;
    ASSETID: number;
    AMTCMPTCDE: string;
    //CODE: string;
    MODULECDE: string;
    CMPTFINETYPECDE: string | null;
    INPUTAMT: number;
    INPUTCURRENCYCDE: string;
    OUTPUTAMT: number;
    OUTPUTCURRENCYCDE: string;
    RATECHRTRVSNID: number | null;
    EXECUTIONOFFSET: number;
    SESSIONCDE: string;
    SESSIONID: number;
    OPERATORCDE: string;
    EXECUTIONDTE: Control<Date>;
    ORIGNALINPUTAMT: number;
    ORIGNALOUTPUTAMT: number;
    YEARLYBASEIND: boolean;
    BPID: number | null;
    AMTSEQID: number;
    AMOUNTCLASSIFICATIONCDE: string | null;
    // following properties are from helper class
    AMTCOMPONENTDESC: string;
    TAXAMOUNT: number;
    CurrencySymbol: string;
    PAYTODEALERIND: boolean;
    FIRSTPAYMENTIND: boolean;
}