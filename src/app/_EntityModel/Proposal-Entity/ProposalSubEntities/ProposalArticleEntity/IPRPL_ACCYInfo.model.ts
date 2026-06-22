import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ACCYInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID : number;
    ACCESSORYCDE: string;
    FTNGTYPECDE: string;
    EXECUTIONDTE: Control<Date> | null;
    ACCESSORYAMT: number;
    UNITAMT: number;
    QUANTITY: number;
    BPSUPPLIERID: number;
    COMMENTS: string;
    AGE: number;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    CURRENCYCDE: string;
    ROLECDE: string;
    VATAMT: number;
    EXCLUSIVEAMT: number;
    BPSUPPLIERNAME: string;
    ISNEWACCESSORY: boolean;
    //following property from helper class
    CurrencySymbol: string;
}