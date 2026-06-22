import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_SCRE_CARD_MAINInfo extends IBaseEntity{
    PROPOSALSCORECARDSEQID:number;
    PROPOSALID:number;
    SCORECARDSEQID:number;
    SCORECARDNME:string;
    APPLICABLEFOR:string;
    HIGHRISKSCORE:number;
    LOWRISKSCORE:number;
    PDDEFAULT:number;
    OBTAINEDSCORE: number;
    RISKCATEGORY:string;
    SCOREVARIABLECONSTANT:number;
    EXECUTIONDTE:Control<Date>;
    EXECUTIONOFFSET:number;
    SESSIONID:number;
    SESSIONCDE:string;
    CODE:string;
    POINTSCORECLASSIFICATION:string;
    RISKRANK:number;
    ISMCOMCAMPAIGN:boolean;
}