import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_FINL_RATOInfo extends IBaseEntity {    
    APPLICANTID: number;
    RATOGRUPCDE: string;
    RATOCDE: string;
    SEQID: number;
    RATOVAL: number;
    RATOVAL1: number;
    RATOVAL2: number;
    EXPRESSION: string;        
    THRESHOLD: number;
    PRIORITY: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;        
    RECORDMNTH1: number;
    RECORDYEAR1: number;
    PRPLFINLSEQID: number;
    
    // following properties are from helper class
    RATODSC: string;    
    RATOGROUPDSC: string;
    VALUE1: number;
    VALUE2: number;
    VALUE3: number;
    RECORDMNTH2: number;
    RECORDMNTH3: number;
    RECORDYEAR2: number;
    RECORDYEAR3: number;
        
}