import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_APLT_ID_DETLInfo extends IBaseEntity {
  QUOTAPPLICANTID: number;
  IDTYPECDE: string;
  //CODE: string;
  IDTYPENBR: string;
  DEFAULTIND: boolean;
  ISSUEDTE: Control<Date>;
  EXPIRYDTE: Control<Date>;
  EXECUTIONDTE: Control<Date>;
  EXECUTIONOFFSET: number;
  SESSIONID: number;
  SESSIONCDE: string;
  TYPE: string;
  CODE:string;
  ISROWDISABLED: boolean;
  }