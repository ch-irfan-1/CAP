import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_RPMT_PLAN_TAXInfo extends IBaseEntity {
    RPMTTAXSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    REPAYMENTPLANID: number;
    AMNTCMPTCDE: string;
    TAXTYPECDE: string;
    TAXAMT: number;
    NETTAXAMT: number;
    SETTLEDAMT: number;
    ADJUSTEDAMT: number;
    TAXRECEIVABLEAMT: number;
    INPUTCDE: string;
    ITCAMT: number;
    ITCPERCENTAGE: number;
    BASEAMOUNT: number;
    TAXOPTRCDE: string;
    CURRENCYCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    TAXRATE: number;
    RENTALBASECONFIGTYPE: string;
    PERRENTALTAXAMT: number;
    // following property is from helper class
    TAXTYPE: string;
}