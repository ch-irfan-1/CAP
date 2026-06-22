import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_ROLEInfo extends IBaseEntity {
    APPLICANTID: number;
    ROLECDE: string;
    EXECUTIONDTE: Control<Date>;
    COMMENTS: string;
    BPPRIMARYID: number;
    RELATIONSHIPCDE: string;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;

}