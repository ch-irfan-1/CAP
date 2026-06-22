import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_NET_PRFTInfo extends IBaseEntity {
    PRFTYEARSEQID: number;
    PROPOSALID: number;
    APPLICANTID: number;
    YEARNUMBER: string;
    PROFITAMOUNT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    PRFTYEARCDE: string;
    NEWDATAIND: boolean;
    BPNETPRFTSEQID: number;
    // following property is from helper class
    PRFTYEARDSC: string;
}