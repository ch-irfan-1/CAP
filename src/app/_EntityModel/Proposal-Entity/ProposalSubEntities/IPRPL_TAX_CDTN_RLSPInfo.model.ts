import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TAX_CDTN_RLSPInfo extends IBaseEntity {
    PROPOSALCDTNID: number;
    TAXCMPTASSNID: number;
    TAXTYPECDE: string;
    AMNTCMPTCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}