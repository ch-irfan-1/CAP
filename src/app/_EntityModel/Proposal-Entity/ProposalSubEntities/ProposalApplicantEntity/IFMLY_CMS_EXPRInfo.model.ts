import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IFMLY_CMS_EXPRInfo extends IBaseEntity {
    FAMILYMEMBERSEQID: number;
    PROPOSALID: number;
    APPLICANTID: number;
    FAMILYMEMBERID: number;
    EXPAPPLICANTCARDID: string;
    EXPAPPLICANTROLEDSC: string;
    DESCRIPTION: string;
    EXPAPPLICANTNME: string;
    FINANCEDAMT: number;
    STATUSDSC: string;
    NOOFTERMS: number;
    RELEVANCE: number;
    CONTRACTNBR: string;
    EXECUTIONDTE: Control<Date>;
    SESSIONID: number;
    SESSIONCDE: string;
    //following properties are from helper class
    IDTYPEDSC: string;
    NOOFREMNINGTERMS: number;
    NOOFPAIDTERMS: number;
    RNTLAMNT: number;
    ASETMAKE: string;
    ASETBRAND: string;
    ASETMODEL: string;
}