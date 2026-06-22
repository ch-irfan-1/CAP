import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";

export interface USERGROUPASSOCIATION extends IBaseEntity {
    ADMININD: boolean;
    CODE: string;
    EXECUTIONDTE: string;
    GROUPNME: string;
    ISMCOLLALLOW: boolean;
    SESSIONCDE: string;
    SESSIONID: number;
    USERGRUPCDE: string;
    USERID: number;
    USERNME?: any;
    UserType?: any;
    CRDTRCMDAPPRIND: boolean;
}