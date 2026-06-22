import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface USERTEAMHIERARCHY extends IBaseEntity{        
    SEQUENCEID: number;   
    BPUSERID: number;   
    TMUSERID: number;   
    EXECUTIONDTE: string;   
    SESSIONID: number;   
    SESSIONCDE: string;   
    MEMBERTYPE: string;   
    USERGROUPNAMETL: string;   
    USERGROUPNAMETM: string;   
    TMDESIGNATIONDSC: string;   
    TLDESIGNATIONCDE: string;   
    TMDESIGNATIONCDE: string;   
    DESIGNATIONCDE: string;
}