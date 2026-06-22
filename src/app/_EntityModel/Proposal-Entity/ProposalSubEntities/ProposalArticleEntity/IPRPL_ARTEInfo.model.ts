import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ARTEInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETTYPCDE: string;
    //CODE: string;
    ASSETID: number;
    REFERENCEID: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}