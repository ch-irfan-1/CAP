import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IEGLE_SCREInfo extends IBaseEntity{
    EAGLESCOREID : number,
    REQBIRTHDTE: string;
    REQCUSTOMERTYP : string;
    REQCOMPANYNAM : string;
    REQIDNO : string;
    REQNAM : string;
    REQPRODUCTTYP : string;
    REQUSERACCESSINFO : string;
    COMPANYID : number;
    LEADNUMBER : string;
    USERID : number;
    EVALUATIONDTE : string;
    RESMSG: string;
    RESRESULTPD: number;
    RESRESULTRISKRANGE: string;
    RESRESULTSCORE: number;
    RESRESULTSCORINGTIME: string;
    SESSIONCDE?: string;
    SESSIONID: number;
    RESSUCCESS: string;
    RESCOLLECTABILITYDATE: string;
    RESCOLLECTABILITY: number;
    RESNUMBEROFREPORT: number;
    EXECUTIONDTE: Control<Date>;
    QUOTATIONID: number;
}