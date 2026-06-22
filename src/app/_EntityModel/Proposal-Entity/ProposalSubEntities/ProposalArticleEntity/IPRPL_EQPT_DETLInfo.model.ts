import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_EQPT_DETLInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    QUANTITY: number;
    TOTALPRICE: number;
    EXPECTEDMONTHLYPROFIT: number;
    RELEASEYEAR: number;
    PRODUCTIONDATE: Control<Date>;
    SERIALNO: string;
    PARTNO: string;
    ADDRESSOFPROJECT: string;
    MODELNO: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}