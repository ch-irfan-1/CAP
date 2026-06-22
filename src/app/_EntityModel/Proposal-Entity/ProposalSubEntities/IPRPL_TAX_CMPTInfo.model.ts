import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TAX_CMPTInfo extends IBaseEntity {
    PROPOSALTAXID: number;
    AMNTCMPTCDE: string;
    PROPOSALID: number;
    REVISIONDTE: Control<Date>;
    GEOTPLECDE: string;
    GEOMAINID: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}