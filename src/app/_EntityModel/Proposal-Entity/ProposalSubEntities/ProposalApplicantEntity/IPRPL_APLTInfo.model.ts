import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLTInfo extends IBaseEntity {
    APPLICANTID: number;
    PROPOSALID: number;
    ROLECDE: string;
    //CODE: string
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    CUSTOMERNBR: string;
    CONTRACTSTATUS: string;
    BPCOMPANYBRANCHID: number;
    //following properties exist in helper class
    APPLICANTIDOLD: number;
    APPLICANTTYP: string;
    APPLICANTNME: string;
}