import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ADDL_INSR_DETLInfo extends IBaseEntity {
    PRPLSTNDINSRID: number;
    PRPLADDLINSRID: number;
    PRPLADDLINSRDETLID: number;
    PROPOSALID: number;
    ASSETID: number;
    PRPLSTNDINSRDETLID: number;
    INSRTYPECDE: string;
    MININSRPREMIUMRTE: number;
    MAXINSRPREMIUMRTE: number;
    DEFAULTPREMIUMRTE: number;
    FINALPREMIUMRTE: number;
    PREMIUMAMNT: number;
    TPLCOVERAGERTE: number;
    TPLCOVERAGEAMNT: number;
    EXTENSIONTYPECDE: string;
    ADDITIONALCOVERAGECDE: string;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;
    INSURANCEPREMIUMTYPECDE: string;
    FIXPREMIUMAMT: number;
    
}