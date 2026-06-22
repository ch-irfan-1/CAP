import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_DTSInfo extends IBaseEntity {

    PROPOSALID: number;
    MODELCDE: string;
    COMPLETIONDTE: Control<Date>;    
    COMPLETIONIND: boolean;
    COMMENTS: string;
    EXECUTIONDTE: Control<Date>; 
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}