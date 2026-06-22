import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ADMN_FEE_DETLInfo extends IBaseEntity {
    SEQID: number;
    PROPOSALID: number;
    ASSETID: number;
    STANDARDADMINFEE: number;
    ADDITIONALADMINFEE: number;
    ADMINFEEDISCOUNT: number;
    ADMINFEESUBSIDY: number;
    UPFRONTADMINFEE: number;
    FINANCEDADMINFEE: number;
    TOTALADMINFEE: number;
    DEALERADMINFEECOMMISSION: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    ACTIVEIND: boolean;
    SESSIONID: number;
    SESSIONCDE: string;
    //CODE: string;
    DEALERNETOFFIND: boolean;
    RECEIVEDBYDEALERIND: boolean;
    ADMINFEEFINANCEIND: boolean;
    REIMBURSEMENTCOST: number;
    REIMBURSMENTCOSTFROMFC: boolean;
    // following property is from helper class
    ADMINFEETYPE: string;
}