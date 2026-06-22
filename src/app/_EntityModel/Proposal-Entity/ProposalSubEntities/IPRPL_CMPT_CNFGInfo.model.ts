import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CMPT_CNFGInfo extends IBaseEntity {
    PROPOSALID: number;
    AMNTCMPTCDE: string;
    //CODE: string;
    AMNTCMPTCNFG: string;
    HANDLEDBYCUSTOMERIND: boolean;
    PAYTOINTRODUCERIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    AMNTSUBCMPTCDE: string;
    // Helper Properties
    IsDisabled: boolean;
}