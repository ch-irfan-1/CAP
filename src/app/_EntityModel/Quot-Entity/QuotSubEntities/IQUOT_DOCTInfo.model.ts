import { IBaseEntity } from "@NFS_Entity/Base-Entity/BaseEntity.model";
import { Control } from "src/Library";

export interface IQUOT_DOCTInfo  extends IBaseEntity {
  QUOTDOCTUMENTID: number;
  QUOTATIONID: number;
  DOCUMENTCDE: string;
  //CODE: string;
  CREATIONDTE: Control<Date>;
  LONGITUDE: number;
  LATITUDE: number;
  DOCUMENTNAME: string;
  IMAGETYPE: string;
  DOCUMENTPATH: string;
  TIMESTAMP: Control<Date>;
  EXECUTIONDTE: Control<Date>;
  EXECUTIONOFFSET: number;
  SESSIONID: number;
  SESSIONCDE: string;
  ARRAYOFBYTES: string;
  Leadnbr: string;
  Role: string;
  Applicantnme: string;
  DOCUMENTTYPDSC: string;
  FILESIZE: number
  }