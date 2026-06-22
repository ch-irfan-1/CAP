import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface ISOCL_INTR_CODEInfo extends IBaseEntity {
    SOCLINTRSEQID: number;
    SOCLINTRCDE: string;
    SOCLINTRDSC: string;
    EXECUTIONDTE: Control<Date>;
    ACTIVEIND: boolean;
    SYSIND: boolean;
    LANGUAGECDE: string;
    EXECUTIONOFFSET: number;
    RECORDVER: number;
    SESSIONID: number;
    SESSIONCDE: string;
}