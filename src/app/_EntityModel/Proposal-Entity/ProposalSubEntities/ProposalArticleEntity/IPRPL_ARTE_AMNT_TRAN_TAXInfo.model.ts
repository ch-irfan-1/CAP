import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ARTE_AMNT_TRAN_TAXInfo extends IBaseEntity {
    PRPLCMPTTAXID: number;
    PROPOSALARTEAMTTRANSID: number;
    TAXTYPECDE: string;
    //CODE: string;
    TAXAMT: number;
    TAXAMTPCT: number;
    INPUTCDE: string;
    ITCAMT: number;
    ITCPERCENTAGE: number;
    BASEAMOUNT: number;
    TAXOPTRCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONCDE: string;
    SESSIONID: number;
    TAXRATE: number;
    TAXAPBLTYPECDE: string;
    ISWHTDEDUCTED: boolean;
    // following properties are from helper class
    AMNTCMPTCDE: string;
    TAXTYPE: string;
    ISAMNTCMPTITC: boolean;
}