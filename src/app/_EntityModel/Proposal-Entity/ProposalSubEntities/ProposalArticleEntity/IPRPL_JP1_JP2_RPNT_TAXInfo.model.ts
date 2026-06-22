import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_JP1_JP2_RPNT_TAXInfo extends IBaseEntity {
    TAXTYPEDSC: string;
    ISAMNTCMPTITC: boolean;
    // above properties are from helper class
    JP1JP2RPNTSEQID: number;
    BUSINESSPARTNERID: number;
    COMMISSIONTYPECDE: string;
    //CODE: string;
    RECIPIENTNME: string;
    DIVISIONTYPECDE: string;
    TAXTYPECDE: string;
    TAXAMT: number;
    TAXAMTPCT: number;
    INPUTCDE: string;
    ITCAMT: number;
    ITCPERCENTAGE: number;
    BASEAMOUNT: number;
    TAXOPTRCDE: string;
    TAXRATE: number;
    TAXAPBLTYPECDE: string;
    ISWHTDEDUCTED: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    PRPLJP1JP2RPNTTAXSEQID: number;
}