import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IOTO_BPKB_SRCHInfo extends IBaseEntity {
    CUSTOMERNME: string;
    PROPOSALNO: string;
    CONTRACTNO: string;
    BLUEBOOKLIMIT: number;
    PROPOSALID: number;    
    CONTRACTID: number;    
}