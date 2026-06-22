import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_RPMT_PLANInfo extends IBaseEntity {
    TOTALTAXAMOUNT: number;
    INSTALLMENTSUBSIDY: number;
    GROSSRENTAL: number;
    // above properties are from helper class
    PROPOSALID: number;
    ASSETID: number;
    REPAYMENTPLANID: number;
    PRINCIPALOUTSTANDINGAMT: number;
    PRINCIPALAMT: number;
    INTERESTAMT: number;
    RENTALAMT: number;
    RENTALDTE: Control<Date>;
    EXECUTIONDTE: Control<Date>;
    GSTAMT: number;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    INSURANCEAMT: number;
    SERVICESAMT: number;
    ISGPRENTAL: boolean;
    OSRECEIVEABLE: number;
    INSTALLMENTNUMBER: string;
    VATRTE: number;
    //helping
    isBold:boolean;
}