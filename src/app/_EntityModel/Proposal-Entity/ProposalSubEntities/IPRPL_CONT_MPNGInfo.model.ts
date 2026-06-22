import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_CONT_MPNGInfo extends IBaseEntity {
    CONTRACTID: number;
    PROPOSALID: number;
    ASSETID: number;
    SESSIONID: number;
    SESSIONCDE: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    MULTCONTIND: boolean;
    OPERATIONBY: number; 
    // following properties are from helper class
    CONTRACTNUMBER: string;
    MODELDSC: string;
    ISCONVERTED: boolean;    
    BRANDDSC: string;
    MAKEDSC: string;
    EXTERNALCONTRACTNBR: string;
    FINANCEDAMT: number;    
    Status: string;

}