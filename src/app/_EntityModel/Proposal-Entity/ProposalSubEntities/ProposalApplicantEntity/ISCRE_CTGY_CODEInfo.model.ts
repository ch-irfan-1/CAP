import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface ISCRE_CTGY_CODEInfo extends IBaseEntity {
    SCRECTGYSEQID:number;
    SCRECTGYCDE:string;
    CODE:string;
    SCRECTGYDSC:string;
    DESCRIPTION:string;
    SCRECTGYOPTR:string;
    SCRECTGYSCR:number;
    EXECUTIONDTE:Control<Date>;
    ACTIVEIND:boolean;
    SYSIND:boolean;
    EXECUTIONOFFSET:number;
    LANGUAGECDE:string;
    RECORDVER:number;
    SESSIONID:number;
    SESSIONCDE:string;
}