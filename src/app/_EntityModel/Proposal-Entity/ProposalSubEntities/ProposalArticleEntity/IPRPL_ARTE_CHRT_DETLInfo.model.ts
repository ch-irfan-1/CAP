import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ARTE_CHRT_DETLInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    MODELTYPECDE: string;
    CHARTID: string;
    CHARTSEQ: number;
    USEREXPRESSION: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    
}