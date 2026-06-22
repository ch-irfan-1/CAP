import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_HTRYInfo extends IBaseEntity{
    PRPLHTRYID:number;
    PROPOSALID:number;
    ACTIONBYUSERID:number;
    ASSIGNEEUSERID:number;
    TRANSDTE:Control<Date>;
    ACTION:string;
    STATUSCDE:string;
    EXECUTIONDTE:Control<Date>;
    EXECUTEDOFFEST:number;
    SESSIONID:number;
    SESSIONCDE:string;
}