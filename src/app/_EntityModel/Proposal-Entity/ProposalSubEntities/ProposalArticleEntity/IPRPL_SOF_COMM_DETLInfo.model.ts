import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_SOF_COMM_DETLInfo extends IBaseEntity {
    PRPLSOFCOMMDETLSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    MAXSOFCOMMISSION: number;
    TOTALSOFCOMMISSION: number;
    SOFJP1COMMISSION: number;
    SOFJP2COMMISSION: number;
    SOFJP2SCHEMECOMMISSION: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    //CODE: string;
    OJKCOMMVALIDATION: string;
}