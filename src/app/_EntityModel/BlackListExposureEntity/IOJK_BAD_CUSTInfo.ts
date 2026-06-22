import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IOJKBADCUSTInfo extends IBaseEntity {
    OJKBADCUSTNAME:string;
    OJKALIAS:string;
    OJKIDNUMBER:string;
    OJKCUSTADDRESS:string;
    OJKEMAIL:string;
    OJKDESCRIPTION:string;
    OJKDOB:Control<Date>;
    Remarks: string;
}
