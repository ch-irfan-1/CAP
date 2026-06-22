import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface APPL_CNCL_DATAInfo extends IBaseEntity {
    APPLICATIONNO: string;
    SYSTEME: string;
    CATEGORY: string;
    CANCELDATE: Control<Date>;    
    CANCELLATIONREASON:string;
    CANCELLATIONCOMMENTS:string;
    ISREJECTIONREASON:string;
}