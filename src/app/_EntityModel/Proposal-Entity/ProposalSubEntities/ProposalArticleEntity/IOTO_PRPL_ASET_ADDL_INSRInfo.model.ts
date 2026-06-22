import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IOTO_PRPL_ASET_ADDL_INSRInfo extends IBaseEntity {
    ADDLINSRID: number;
    PROPOSALID: number;
    ASSETID: number;
    ADDLINSRTYPECDE: string;
    PREMIUMAMT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    // following properties are from helper class
    CurrencySymbol: string;
    ISVIEWMODE: boolean;

}