import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CSFL_DETLInfo extends IBaseEntity {
    PRPLCSFLSEQID: number;
    APPLICANTID: number;
    SEQID: number;
    CSFLITEMCDE: string;
    CSFLITEMVALUE: number;
    CSFLITEMVALUE1: number;
    CSFLITEMVALUE2: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    RATOGRUPCODE: string;
    CSFLTYP: string;
    RECORDMNTH1: number;
    RECORDYEAR1: number;
    IDENTIFIER: string;
    RELIABLEIND: boolean;
    RECORDYEAR2: number;
    RECORDYEAR3: number;
    RECORDMNTH2: number;
    RECORDMNTH3: number;
    // following properties are from helper class
    CSFLDSC: string;
    CSFLPRIORITY: number;
    RATIOGRUPDSC: string;
    VALUE1: number;
    VALUE2: number;
    VALUE3: number;
    CurrencySymbol: string;
}