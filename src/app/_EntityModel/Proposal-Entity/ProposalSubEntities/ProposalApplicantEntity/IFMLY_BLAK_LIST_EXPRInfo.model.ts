import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IFMLY_BLAK_LIST_EXPRInfo extends IBaseEntity {
    FAMILYMEMBERSEQID: number;
    PROPOSALID: number;
    APPLICANTID: number;
    FAMILYMEMBERID: number;
    IDNUMBER: string;
    NAME: string;
    DATASRC: string;
    ADDRESS: string;
    CONTRACTID: string;
    REASON: string;
    BLACKLISTEDDTE: Control<Date>;
    RELEVANCE: number;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;
    BLAKLISTTYPE: string;
    TRANSACTIONTYPE: string;
    CONSUMERTYPE: string;
    CUSTNAME: string;
    EXCCTGDESC: string;
    TRANSACTIONDATE: Control<Date>;
    DATEOFBIRTH: Control<Date>;
    BLACKLISTTYPE: string;
    COMMENTS: string;
    INSERTDTE: Control<Date>;
}