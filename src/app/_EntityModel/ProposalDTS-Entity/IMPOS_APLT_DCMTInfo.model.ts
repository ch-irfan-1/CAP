import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IMPOS_APLT_DCMTInfo extends IBaseEntity {

    DOCUMENTSEQID: number;
    PROPOSALID: number;
    APPLICANTID: number;
    ROLECDE: string;
    DOCUMENTCDE: string;
    CREATIONDTE: Control<Date>;
    DOCUMENTTYPE: string;
    LONGITUDE: number;
    LATITUDE: number;
    DOCUMENTNAME: string;
    IMAGETYPE: string;
    DOCUMENTPATH: string;
    ISMANDATORY: boolean;
    TIMESTAMP: Control<Date>; 
    EXECUTIONDTE: Control<Date>; 
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    ismPOS:boolean;
    CNTCT_ADDRESS:string
}