import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface LANGUAGECODE extends IBaseEntity{        
    LANGUAGECDE: string;   
    CODE: string;   
    LANGUAGEDSC: string;   
    DESCRIPTION: string;   
    DEFAULTIND: string;   
    EXECUTIONDTE: string;   
    ACTIVEIND: boolean;   
    SYSIND: boolean;   
    CULTURECDE: string;   
    SESSIONID: number;   
    SESSIONCDE: string;   
    LANGUAGESEQID: number;
}