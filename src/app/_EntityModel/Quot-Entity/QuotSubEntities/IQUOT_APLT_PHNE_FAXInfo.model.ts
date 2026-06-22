import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_APLT_PHNE_FAXInfo extends IBaseEntity {
  PHONESEQID: number;
  QUOTAPPLICANTID: number;
  ADDRESSID: number;
  COUNTRYCODE: string;
  PHONETYPECDE: string;
  //CODE: string;
  AREACODE: string;
  NUMBER: string;
  DEFAULTIND: boolean;
  EXTENSIONNBR: string;
  EXECUTIONDTE: Control<Date>;
  EXECUTIONOFFSET: number;
  SESSIONID: number;
  SESSIONCDE: string;
  TYPE: string;
  }