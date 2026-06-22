import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TOTL_TRCK_OWNDInfo extends IBaseEntity {
    TOTLTRCKOWNDID: number;
    PROPOSALID: number;
    ASSETID: number;
    TRUCKCATEGORYCDE: string;
    NOOFUNITS: number;
    MODEL: string;
    NOOFUNITSONCREDIT: number;
    BODYTYPECDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}