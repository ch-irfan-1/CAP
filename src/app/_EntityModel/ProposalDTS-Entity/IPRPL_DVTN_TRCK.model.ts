import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_DVTN_TRCK extends IBaseEntity{
    PRPLDVTNTRCKID: number
    PROPOSALID: number ,
    DVTNSMRY: string,
    DVTNCMNT: string,
    SESSIONID: number,
    SESSIONCDE: string,
    EXECUTIONDTE: Control<Date>,
    EXECUTIONOFFSET:number;
}