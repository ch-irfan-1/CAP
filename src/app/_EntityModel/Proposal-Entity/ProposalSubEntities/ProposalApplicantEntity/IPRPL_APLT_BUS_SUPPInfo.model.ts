import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_BUS_SUPPInfo extends IBaseEntity {
    SUPPSEQID: number;
    APPLICANTID: number;
    BUSINESSID: number;
    SUPPLIERNAME: string;
    BUYINGPCT: number;
    BUYINGVOLPCT: number;
    SALESPCT: number;
    SALESCASHPCT: number;
    REMARKS: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}