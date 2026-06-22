import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ENGN_DETLInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    LINEID: number;
    SERIALNO: string;
    MODEL: string;
    STATUSDTE: Control<Date>;
    THRUST: string;
    TSN: string;
    CSN: string;
    PROPELLERMNF: string;
    PROPELLERMDL: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}