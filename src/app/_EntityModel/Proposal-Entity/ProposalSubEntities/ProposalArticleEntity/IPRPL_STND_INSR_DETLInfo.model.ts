import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_STND_INSR_DETLInfo extends IBaseEntity {
    ENABLEFIXPREMIUMAMT: boolean;
    ENABLEDEFAULTPREMIUMRTE: boolean;
    //above properties are from helper class
    PROPOSALID: number;
    ASSETID: number;
    PRPLSTNDINSRID: number;
    PRPLSTNDINSRDETLID: number;
    COLLECTIONMETHODCDE: string;
    //CODE: string;
    INSRTYPECDE: string;
    TERMFROM: number;
    TERMTO: number;
    DEPRECIATIONRTE: number;
    SUMINSUREDAMNT: number;
    MININSRPREMIUMRTE: number;
    MAXINSRPREMIUMRTE: number;
    DEFAULTPREMIUMRTE: number;
    FINALPREMIUMRTE: number;
    PREMIUMAMNT: number;
    SESSIONID: number;
    SESSIONCDE: string;
    STARTDTE: Control<Date>;
    ENDDTE: Control<Date>;
    EXECUTIONDTE: Control<Date>;
    INSURANCEPREMIUMTYPECDE: string;
    LOADINGRTE: number;
    FIXPREMIUMAMT: number;
}