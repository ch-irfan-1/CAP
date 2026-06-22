import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ISRE_MPNGInfo extends IBaseEntity {
    PROPOSALID: number;    
    ISUREAPPLICATIONNBR: string;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
}