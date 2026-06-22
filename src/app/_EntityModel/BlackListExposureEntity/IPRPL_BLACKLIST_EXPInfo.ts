import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPLBLACKLISTEXPInfo extends IBaseEntity {
    ACTIVEIND:string;
    STATUSIND:string;
    IDNUMBER:string;
    NAME:string;
    TELEPHONENBR:string;
    ADDRESS:string;
    DATASRC:string;
    BLACKLISTTYPE:string;
    CERTIFICATETYPE:string;
    COMMENTS:string;
    INSERTEDBY:string;
    UPDATEDBY:string;
    UPDATEDTE:Control<Date>;
    INSERTDTE:Control<Date>;
    SEARCHVALUE:string;
    BUSINESSPARTNERID: number;
    RELEVANCE: number;
    STATUS:string;
}
