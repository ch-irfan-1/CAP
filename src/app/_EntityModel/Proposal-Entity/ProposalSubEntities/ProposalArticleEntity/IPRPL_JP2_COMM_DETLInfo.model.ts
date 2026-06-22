import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_JP2_COMM_DETLInfo extends IBaseEntity {
    SEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    DESIGNATIONCDE: string;
    COMMISIONAMOUNT: number;
    SCHEMEID: number;
    SCHEMEDETLID: number;
    BRANCHCDE: string;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONOFFSET: number;
    EXECUTIONDTE: Control<Date>;
}