import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_IOPS_USERInfo extends IBaseEntity {
    PROPOSALIOPSUSERSEQID: number;
    PROPOSALID: number;
    LEADNUMBER: string;
    VONME: string;
    VOUSERID: number;
    LEADCREATEDBY: string;
    LEADCREATEDBYUSERID: number;
    APPLICATIONCENTERUSERNME: string;
    APPLICATIONCENTERUSERID: number;
    COMMENTS: string;
    LEADNOTES: string;
    APPLICATIONCENTERCOMMENTS:string;
    EXECUTIONDTE: Control<Date>;
    EXECUTIONOFFSET: number;
    SESSIONID: number;
    SESSIONCDE: string;
    //CODE: string;
    LEADCREATIONDTE: Control<Date>;    
    APPLICATIONSOURCE:string;
    DEALERAPPNUMBER:number;
    SPKNUMBER:string;
    OVPSTATUS:boolean;
    DEVIATIONIND: boolean;
    OLDLEADNUMBER:string;
    OLDREJECTIONREASON: string;
    RJTNRESNDSC: string;
}