import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TAX_CMPT_CDTNInfo extends IBaseEntity {
    PROPOSALTAXID: number;
    TAXCMPTASSNID: number;
    TAXTYPECDE: string;
    TAXAPBLTYPECDE: string;
    LEGALSTATUSCDE: string;
    AMOUNTCRITERIAIND: boolean;
    CALCULATIONAMOUNT: number;
    ASETCOSTIND: boolean;
    ACCESSORYCOSTIND: boolean;
    ASETSBTPCDE: string;
    ISBSNSPRTNERTYPEIND: boolean;
    ISASETSBTPIND: boolean;
    ISRGSTRDTYPEIND: boolean;
    ISCMPTNAMEIND: boolean;
    ISASETACCESSORYCOSTIND: boolean; 
    ITCAMOUNT: number;
    TAXAMOUNTOPERATORCDE: string;
    PRIORITY: number;
    MAINCOMPONENTIND: boolean;
    ISCALCULATIONONIND: boolean;  
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number; 
    SESSIONID: number;
    SESSIONCDE: string;
}