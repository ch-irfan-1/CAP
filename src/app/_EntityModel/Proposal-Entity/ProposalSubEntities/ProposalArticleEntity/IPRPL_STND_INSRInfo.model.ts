import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_STND_INSRInfo extends IBaseEntity {
    ENABLESTANDARDINSURANCEPREMIUMTYPE: boolean;
    // above property is from helper class
    PROPOSALID: number;
    ASSETID: number;
    PRPLSTNDINSRID: number;
    COLLECTIONMETHODCDE: string;
    //CODE: string;
    INSRTYPECDE: string;
    TERMFROM: number;
    TERMTO: number;
    TOTALPREMIUMAMNT: number;
    STARTDTE: Control<Date>;
    ENDDTE: Control<Date>;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;
    INSURANCEPREMIUMTYPECDE: string;
    INSURANCECOMPANYID: number;
    INSURANCECERTIFICATENUMBER: string
}