import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_BLAK_LISTInfo extends IBaseEntity {
    PRPLID: number;
    APPLICANTID: number;
    SEQID: number;
    BLAKLISTAPLTNME: string;
    APLTNME: string;
    BLAKLISTID: string;
    APLTIDTYPENBR: string;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;
    STATUS: string;
}