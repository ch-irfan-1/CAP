import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IFMLY_POS_EXPRInfo extends IBaseEntity {
    FAMILYMEMBERSEQID: number;
    PROPOSALID: number;
    APPLICANTID: number;
    FAMILYMEMBERID: number;
    PROPOSALNBR: string;
    IDCARDNBR: string;
    EXPROLECDE: string;
    APPLICANTNAME: string;
    FINANCEDAMT: number;
    STATUSDSC: string;
    TERMS: number;
    RELEVANCE: number;
    ROLEDSC: string;
    EXPPROPOSALID: number;
    EXECUTIONDTE: Control<Date>;
    SESSIONID: number;
    SESSIONCDE: string;
    //following properties are from helper class
    IDTYPEDSC: string;
    RNTLAMT: number;
    FAMLIYSEARCHCRITERIA: string;
    FAMILYCARDNO: string;
    DATEOFBIRTH: Control<Date>;
}