import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IMEET_TYPE_CODEInfo extends IBaseEntity {
    MEETTYPECODESEQID: number;
    MEETTYPECDE: string;
    MEETTYPEDSC: string;
    EXECUTIONDTE: Control<Date>;
    ACTIVEIND: boolean;
    SYSIND: boolean;
    LANGUAGECDE: string;
    EXECUTIONOFFSET: string;
    RECORDVER: number;
    SESSIONID: number;
    SESSIONCDE: string;
    INTERFACECDE: string;
    
}