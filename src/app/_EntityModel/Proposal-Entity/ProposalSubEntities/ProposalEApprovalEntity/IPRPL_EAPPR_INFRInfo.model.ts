import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_EAPPR_INFRInfo extends IBaseEntity {
    PRPLEAPPRINFRID:number;
    PROPOSALID:number;
    USERID:number;
    USERNAME:string;
    COMMENT:string;
    COMPLTIND:boolean;
    COMPLTDTE:Date;
    EXECUTIONDTE:Control<Date>;
    EXECUTEDOFFEST:number;
    SESSIONID:number;
    SESSIONCDE:string;
	EAPPROVALREASON: string;
  OVRDRESN: string;
  OVRDIND: boolean;
  OVRDBY: string;
}