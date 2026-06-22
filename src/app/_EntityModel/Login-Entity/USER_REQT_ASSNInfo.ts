import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface USERREQUESTASSOCIATION extends IBaseEntity{        
    SEQID: number;   
    USERID: number;   
    REQUESTTYPECDE: string;   
    CODE: string;   
    EXECUTIONDTE: string;
    ACTIVEIND: boolean;   
    SESSIONID: number;   
    SESSIONCDE: string;   
    REQUESTTYPEDSC: string;
}