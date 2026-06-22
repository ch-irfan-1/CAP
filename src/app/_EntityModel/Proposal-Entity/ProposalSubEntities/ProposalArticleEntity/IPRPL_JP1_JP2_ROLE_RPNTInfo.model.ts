import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_JP1_JP2_ROLE_RPNTInfo extends IBaseEntity {
    PRPLJP1JP2ROLERPNTSEQID: number;
    PROPOSALID: number;
    ROLECDE: string;
    //CODE: string;
    RECIPIENTID: number;
    RECIPIENTDSC: string;
    DESCRIPTION: string;
    MARKETINGCOMMISSIONBANKNME: string;
    MARKETINGCOMMISSIONBANKACCOUNTNBR: string;
    INSURANCECOMMISSIONBANKNME: string;
    INSURANCECOMMISSIONBANKACCOUNTNBR: string;
    PROVISIONFEECOMMISSIONBANKNME: string;
    PROVISIONFEECOMMISSIONBANKACCOUNTNBR: string;
    ADMINFEECOMMISSIONBANKNME: string;
    ADMINFEECOMMISSIONBANKACCOUNTNBR: string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
}