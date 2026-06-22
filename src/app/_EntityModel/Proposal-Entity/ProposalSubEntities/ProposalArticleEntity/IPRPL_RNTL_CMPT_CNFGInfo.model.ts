import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_RNTL_CMPT_CNFGInfo extends IBaseEntity {
    PRPLCMPTCNFGSEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    AMNTCMPTCDE: string;    
    AMNTCMPTCNFG: string;
    HANDLEDBYCUSTOMERIND: boolean;
    PAYTOINTRODUCERIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    ACTIVEIND: boolean;
    SESSIONID: number;
    SESSIONCDE: string;

}