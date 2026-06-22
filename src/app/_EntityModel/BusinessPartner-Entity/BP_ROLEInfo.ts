import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface BPROLE extends IBaseEntity{
    ACTIVATIONROLEIND: boolean;
    ACTIVEIND: boolean;
    APPROVEDIND: boolean;
    BUSINESSPARTNERID: number;
    CODE: string;
    CODENBR?: any;
    CORRESPONDENCEIND: boolean;
    DATASTATUS?: any;
    EXECUTIONDTE: string;
    ISWORKQUEREQUEST: boolean;
    REQUESTBPID: number;
    ROLECDE: string;
    SEQID: number;
    SESSIONCDE: string;
    SESSIONID: number;
}