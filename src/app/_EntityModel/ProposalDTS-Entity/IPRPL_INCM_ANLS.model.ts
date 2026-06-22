import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IPRPL_INCM_ANLS extends IBaseEntity {
    PRPLINCMANLSID: number
    PROPOSALID: number ,
    MNTHINCM: number,
    MNTHEXPN: number,
    MNTHRNTL: number,
    RMNGINCM: number,
    AVGSVNG: number,
    AVGRVNU : number,
    PRFTPCT: number,
    SESSIONID: number,
    SESSIONCDE: string,
    EXECUTIONDTE: Date
}

export interface FinancialRow {
  label: string;
  value: any;
  fieldKey: keyof IPRPL_INCM_ANLS;
  isPercentage: boolean;
}
