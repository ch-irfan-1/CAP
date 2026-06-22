import { Time } from "@angular/common";
import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";


export interface IPSTR_MODL_MAINInfo extends IBaseEntity {
    BSNSRULEMODLMAINSEQ:number;
    BASESCRE:number;
    APPROVEDSCRE:number;
    DECLINESCRE:number;
    EVALSCRE:number;
    STATUSCDE:string;
    CODE:string;
    MODULECDE:string;
    MODULEID:number;
    EXECUTIONDTE:Control<Date>;
    EXECUTIONOFFSET:number;
    SESSIONID:number;
    SESSIONCDE:string;
    PSID:number;
    PSSTATUS:string;
    POINTSCORECATEGORY:string;
    PROPOSALNBR:string;
    POINTSCORECLASSIFICATION:string;
}