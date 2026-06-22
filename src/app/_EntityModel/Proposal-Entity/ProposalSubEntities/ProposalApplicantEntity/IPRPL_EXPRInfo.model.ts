import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_EXPRInfo extends IBaseEntity {
    PROPOSALID: number;
    APPLICANTID: number;
    SEQID: number;
    FACILITYTYPEIND: string;
    APPLICANTTYPEIND: string;
    APPLICANTROLECDE: string;
    SEARCHVALUE: string;
    EXPPROPOSALID: number;
    EXPAPPLICANTID: number;
    EXPAPPLICANTTYPEIND: string;
    EXPROLECDE: string;
    EXPAPPLICANTNME: string;
    ISEXPOSEDIND: string;
    SYSIDENTIFIEDIND: string;
    ISCONTINGENTIND: string;
    FINANCIALPRODUCTID: number;
    FINANCEDAMT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    EXPSTATUSCDE: string;
    CHECKED: boolean;
    // following properties are from helper class
    PROPOSALNBR: string;
    APPLICANTNAME: string;
    EXPSTATUSDSC: string;
    ROLEDSC: string;
    EXPPROPOSALNBR: string;
    RENTALAMT: number;
    IDTYPDSC:string;
    IDCARDNBR:string;
    TERMS:number;
    RELEVANCE:number;

    
    
}