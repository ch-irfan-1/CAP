import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IBP_CRDT_RTNG_CODEInfo extends IBaseEntity {
    CREDITRATINGCDE: string;
    CREDITRATINGDSC: string;
    EXECUTIONDTE: Control<Date>;
    ACTIVEIND: boolean;
    SYSIND: boolean;
    LANGUAGECDE: string;
    EXECUTIONOFFSET: number;
    RECORDVER: number;
    SESSIONID: number;
    SESSIONCDE: string;
    BPCREDITRATINGSEQID: number;
    RATERISK: number;
    
}