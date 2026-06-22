import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_DTS_DOCTInfo extends IBaseEntity {

    PROPOSALID: number;
    DOCUMENTID: number;
    GROUPCDE: string;
    DOCUMENTCDE: string;
    MANDATORYIND: boolean;
    REQUIREDFORCDE: string;
    CHECKEDBYCAA: boolean;
    CHECKEDBYCA: boolean;
    VERIFIED: boolean;
    COMMENTS: string;
    INSERTEDBY: string;
    INSERTEDDTE: Control<Date>;  
    WAIVEDBY: string;
    WAIVEDDTE: Control<Date>;
    REQUIREDNBR: number;
    IDENTIFICATIONCDE: number;
    WAIVEDIND: boolean;
    VALIDATIONIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    DOCUMENTSUBDSC:string;
    SESSIONID: number;
    SESSIONCDE: string;
    //following proporties are from helper class
    GROUPDSC: string;
    DOCUMENTDSC: string;
    APPLICANTNME: string;
    APPLICANTID: number;
    // APPLICANTS: Array<number>;
    ROLECDE: string;
    GROUPNAME:string;
    REVISEDIND: boolean;
    ROLEDEC: string;
    MAXFILESIZE: string;
    ISENABLED: boolean;
    TOTALROWS: number;

}
