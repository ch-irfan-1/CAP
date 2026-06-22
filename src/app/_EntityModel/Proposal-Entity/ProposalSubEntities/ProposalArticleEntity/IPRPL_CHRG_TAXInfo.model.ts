import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CHRG_TAXInfo extends IBaseEntity {
    PRPLCHARGTAXID: number;
    PROPOSALID: number;
    ASSETID: number;    
    CHARGECDE: string;
    CODE: string;
    TAXTYPECDE: string;
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
    // follwowing property is from helper class
    TAXTYPE: string;
}