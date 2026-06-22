import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CHRGInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    CHARGECDE: string;
    EXECUTIONDTE: Control<Date>;
    CHARGEAMT: number;
    FINANCEDIND : string;
    COMMENTS: string;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    CREATIONTYPECDE: string;
    OTOEDITABLEIND: boolean;
    RECEIVEBYDEALERIND: boolean;
    AMORTIZEDIND: boolean;
    ISSERVICEFEE:boolean
    // following properties are from helper class
    CURRENCY: string;
    CHARGEDSC: string;
    TAXAMOUNT: number;    
    TEMPFINANCEIND:boolean;
    ReceivedByDealerEnabled:boolean;
    FINANCEenabled:boolean;
}