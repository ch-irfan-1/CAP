import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPY_LOCN_CODEInfo extends IBaseEntity {
    PRPYLOCNSEQID: number;
    PRPYLOCNCDE: string;
    PRPYLOCNDSC: string;
    EXECUTIONDTE: Control<Date>;
    ACTIVEIND: boolean;
    SYSIND: boolean;
    LANGUAGECDE: string;
    EXECUTIONOFFSET: number;
    RECORDVER: number;
    SESSIONID: number;
}