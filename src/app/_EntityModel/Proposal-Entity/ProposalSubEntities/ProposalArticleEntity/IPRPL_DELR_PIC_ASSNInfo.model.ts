import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_DELR_PIC_ASSNInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    DEALERID: number;
    RECIPIENTID: number;
    RECIPIENTROLECDE: string;
   // CODE: string;
    EXECUTIONDTE:Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    PRPLDELRPICASSNSEQID: number;
    RECIPIENTDSC: string;
}