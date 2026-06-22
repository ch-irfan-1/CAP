import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_TPLE_RONDInfo extends IBaseEntity {
    PRPLTPLERONDSEQID: number;
    TPLERONDDSC: string;
    ADJUSTLASTRENTALIND: boolean;
    PROPOSALID: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONCDE: string;
    SESSIONID: number;
}