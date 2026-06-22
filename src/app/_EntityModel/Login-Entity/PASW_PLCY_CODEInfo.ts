import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface PASSWORDPOLICY extends IBaseEntity {
    ACTIVEIND: boolean;
    CHANGEPASSWORDSTS: boolean;
    CODE: string;
    DESCRIPTION: string;
    DIGITCHARACTERS: number;
    EXECUTIONDTE: string;
    EXPIRYDD: number;
    EXPIRYPROMPTDD: number;
    LOGINATTEMPTLMT: number;
    MINIMUMPASSWORDLEN: number;
    PASSWORDHISTORYLMT: number;
    PASSWORDPOLICYDSC: string;
    PASSWORDPOLICYID: number;
    SESSIONCDE: string;
    SESSIONID: number;
    SPECIALCHARACTERS: number;
    SYSIND: boolean;
    UPPERCASECHARACTERS: number;
}