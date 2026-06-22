import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_ASET_INSRInfo extends IBaseEntity {
    PROPOSALID: number;
    ASSETID: number;
    INSRSEQID: number;
    INSRTYPECDE: string;
    INSURER: number;
    INSUREDPERSON: string;
    INSUREDAMT: number;
    EXPIRAYDTE: Control<Date>;
    EXECUTIONDTE: Control<Date>;
    PREMIUMAMT: number;
    FINANCEDIND: boolean;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    POLICYNBR: string;
    DURATION: number;
    CURRENCYCDE: string;
    STARTDTE: Control<Date>;
    CMPTFINETYPECDE: string;
    RGNSCDEOTO: string;
    MAXINSRPREMPRCOTO: number;
    LOADINGRATEOTO: number;
    MININSRPREMPRCOTO: number;
    FINLPREMRATEOTO: number;
    PREMPRCOTO: number;
    // following properties are from helper class
    CurrencySymbol: string;
    CMPTFINETYPEIND: boolean;
    ISVIEWMODE: boolean;
    ISENABLE: boolean;



    
}