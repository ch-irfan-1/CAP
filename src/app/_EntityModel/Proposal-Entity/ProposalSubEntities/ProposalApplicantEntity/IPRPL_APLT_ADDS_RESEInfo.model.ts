import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_APLT_ADDS_RESEInfo extends IBaseEntity {
    APPLICANTID: number;
    ADDRESSID: number;
    PROPERTYTYPECDE: string;
    RENTPERMNTH: number;
    REMTRM: number;
    AREALND: string;
    APPRVAL: number;
    DURADD: number;
    ENCUSTS: boolean;
    ENCUTYP: string;
    ENCUAMT: number;
    REMAMT: number;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    
}