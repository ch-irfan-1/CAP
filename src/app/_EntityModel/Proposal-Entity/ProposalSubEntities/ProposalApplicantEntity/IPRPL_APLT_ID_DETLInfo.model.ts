import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_ID_DETLInfo extends IBaseEntity {
    NAME: string;
    APPLICANTTYPE: string;
    DATEOFBIRTH: Control<Date>;
    ESTABLISHEDSINCE: Control<Date>;
    CRNTDTE: Control<Date>;
    ISEXP: boolean;
    ISUREENABLE: boolean;
    CUSTOMERNBR: string;
    //above properties exist in helper class
    IDTYPECDE: string;
    //CODE: string
    IDTYPENBR: string;
    DEFAULTIND: boolean;
    EXECUTIONDTE: Control<Date>;
    APPLICANTID: number;
    EXPIRYDTE: Control<Date> |  null;
    PLACEOFISSUE: string;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    ISSUEDBY: string;
    ISSUEDTE: Control<Date>|null;
    REFERENCECDE: string;
    SEQID: number;
    BPIDSEQ: number;
    PRPLIDSEQ: number;
    TYPE:string;
    isDeleteDisabled:boolean;
}