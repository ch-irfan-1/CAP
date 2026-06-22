import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_BPKB_GRTR_DETLInfo extends IBaseEntity {    
    PRPLBPKBGRTRSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    GUARANTORKTPID: string;
    GUARANTORNME: string;
    GUARANTORADDRESS: string;    
    EXECUTIONDTE: Control<Date> | null;
    EXECUTIONOFFSET: number;
    ACTIVEIND: boolean;
    SESSIONID: number;
    SESSIONCDE: string;

}