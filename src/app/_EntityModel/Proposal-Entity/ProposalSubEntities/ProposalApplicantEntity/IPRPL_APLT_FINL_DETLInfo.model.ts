import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_FINL_DETLInfo extends IBaseEntity {
    APPLICANTID: number;
    FINANCIALDETID: number;
    FINANCIALDETCDE: string;
    FINANCIALDETAMT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;

}