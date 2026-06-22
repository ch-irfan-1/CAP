import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CHRTInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    CHARTCDE: string;
    //CODE: string;
    SEQID: number;
    LINEID: number;
    MODELTYPE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    USEREXPRESSION: string;
    CHARTID: string;
    CHARTNME: string;
    FROMDTE: Control<Date>;
    TODTE: Control<Date>;
}