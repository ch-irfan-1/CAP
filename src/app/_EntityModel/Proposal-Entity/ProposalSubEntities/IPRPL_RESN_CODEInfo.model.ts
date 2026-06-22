import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_RESN_CODEInfo extends IBaseEntity {
    PRPLRESNID: number;
    PROPOSALID: number;
    APPLICATIONCDE: string;
    MODULECDE: string;
    REASONCDE: string;
    WAIVEIND: boolean;
    FULFILIND: boolean;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    // following property is from helper class
    RESNDSC: string;
}