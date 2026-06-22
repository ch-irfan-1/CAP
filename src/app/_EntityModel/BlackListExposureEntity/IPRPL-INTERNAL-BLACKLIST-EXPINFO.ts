import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPLINTERNALBLACKLISTEXPInfo extends IBaseEntity {
    IDNUMBER:string;
    NAME:string;
    DATASRC:string;
    ADDRESS:string;
    CONTRACTID:string;
    REASON:string;
    BLACKLISTEDDTE:Control<Date>;
    BUSINESSPARTNERID: number;
    RELEVANCE: number;
}
