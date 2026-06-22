import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CRDT_RCMDInfo extends IBaseEntity {
    PRPLCRDTRCMDID: number;
    PROPOSALID: number;
    CRDTRCMDIND?: boolean | null;
    CRDTRCMDTYPCDE?: string;
    CRDTRCMDTYPEDSC: string;
    COMMENT: string;
    RECOMMENDEDBY: number;
    RJTNRESNCDE: string;
    RECOMMENDATIONTIME: Control<Date> | null;
    EXECUTIONDTE: Control<Date> | null;        
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    ISRCMDVALID: boolean;
    //following property is from helper class
    USERNAME: string;
    CODE : string;
    RESNDSC : string;
}