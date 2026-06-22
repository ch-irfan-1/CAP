import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IFINE_TYPE_INCM_CNFGInfo extends IBaseEntity {
    FINETYPEINCMCNFGID: number;
    FINETYPECDE: string;
    AMNTCMPTCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    CALCULATEIRRIND: boolean;
}