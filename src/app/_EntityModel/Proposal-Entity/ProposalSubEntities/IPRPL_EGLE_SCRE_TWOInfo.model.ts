import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_EGLE_SCRE_TWOInfo extends IBaseEntity {
    PROPOSALEAGLESCORETWOSEQID: number;
    REQBIRTHDATE: string;
    REQCUSTOMERTYPE: string;
    REQCOMPANYNAME: string;
    REQIDNO: string;
    REQNAME: string;
    REQPRODUCTTYPE: string;
    REQUSERACCESSINFO: string;
    COMPANYID: number;
    PROPOSALID: number;
    LEADNUMBER: string;
    USERID: number;
    EVALUATIONDTE: string;
    RESMSG: string;
    RESRESULTPD: number;
    RESRESULTRISKRANGE: string;
    RESRESULTSCORE: number;
    RESRESULTSCORINGTIME: string;
    RESSUCCESS: string;
    RESCOLLECTABILITYDATE: string;
    RESCOLLECTABILITY: number;
    RESNUMBEROFREPORT: number;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    UPDATIONDATE: number;        
}