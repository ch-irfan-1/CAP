import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { User } from "@NFS_Entity/User-Entity/UserInfoEntity";
import { WorkflowUser } from "@NFS_Entity/User-Entity/WorkflowEntity";

export interface LoginResult extends IBaseEntity{
    //MESSAGE_CODE: string;
    //MESSAGE_DESCRIPTION: string;
    User: User;
    UserMenuSecurity?: any;
    WorkflowUser: WorkflowUser;
}