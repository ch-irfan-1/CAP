import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_RNTL_DETLInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    RENTALID: number;
    RENTALAMT: number;
    EXECUTIONDTE: Control<Date>;
    STARTTRM: number;
    ENDTRM: number;
    RENTALTYP: string;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    PRINCIPALAMT: number;
    ISGPRENTAL: boolean;
}