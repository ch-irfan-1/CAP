import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_COMM_SCHMInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    COMMISSIONTYPECDE: string;
    //CODE: string;
    TOTALCOMMISSIONAMT: number;
    JP1PCT: number;
    JP1COMMISSIONAMT: number;
    JP2PCT: number;
    JP2COMMISSIONAMT: number;
    JP2SCHEMEPCT: number;
    JP2SCHEMECOMMISSIONAMT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    // following property is from helper class
    COMMISSIONTYPENME: string;
}