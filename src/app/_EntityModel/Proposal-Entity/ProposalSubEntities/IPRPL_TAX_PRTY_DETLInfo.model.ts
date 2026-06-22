import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TAX_PRTY_DETLInfo extends IBaseEntity {
    PROPOSALPRTYID: number;
    TAXCMPTASSNID: number;
    AMNTCMPTCDE: string;
    CALCULATEONIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;

}