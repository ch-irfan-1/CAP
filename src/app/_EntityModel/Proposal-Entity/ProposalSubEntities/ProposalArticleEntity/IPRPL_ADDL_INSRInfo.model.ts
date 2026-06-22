import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ADDL_INSRInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    PRPLSTNDINSRID: number;
    PRPLADDLINSRID: number;
    INSRTYPECDE: string;
    TOTALPREMIUMAMNT: number;
    TPLCOVERAGEAMNT: number;
    EXTENTIONTYPECDE: string;
    ADDITIONALCOVERAGECDE: string;
    SESSIONID: string;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;

}