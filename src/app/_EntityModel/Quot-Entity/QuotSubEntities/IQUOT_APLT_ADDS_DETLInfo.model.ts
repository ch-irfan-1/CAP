import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_APLT_ADDS_DETLInfo extends IBaseEntity {
  QUOTAPPLICANTADDRESSDETAILID: number
  QUOTAPPLICANTID: number
  ADDRESSID: number
  ADDRESSTYPECDE: string
  //CODE: string
  DEFAULTIND: boolean
  EXECUTIONDTE: Control<Date>
  EXECUTIONOFFSET: number
  SESSIONCDE: string
  SESSIONID: number
  }