import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface USERBUSINESSRULESWAIVER extends IBaseEntity {
    USERID: number;
    BUSINESSRULECDE: string;
    EXECUTIONDTE: string;
    SESSIONID: number;
    SESSIONCDE: string;
    BUSINESSRULENME: string;
}